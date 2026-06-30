from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from google import genai
from PIL import Image
import io
import os
import uuid
import time
import urllib.parse

router = APIRouter()

# Store session history
active_sessions = {}

class ChatRequest(BaseModel):
    session_id: str
    question: str
    language: str = "en"

class CloseRequest(BaseModel):
    session_id: str

def get_gemini_client():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_API_KEY environment variable is not set.")
    return genai.Client(api_key=api_key)

def generate_with_retry(client, contents):
    """Try multiple Gemini models with exponential backoff for 503/429 errors."""
    models = ["gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-2.5-flash", "gemini-pro-latest"]
    
    for model in models:
        for attempt in range(4):
            try:
                response = client.models.generate_content(model=model, contents=contents)
                if response and response.text:
                    return response.text
            except Exception as e:
                err_msg = str(e)
                print(f"Model {model} attempt {attempt} failed: {err_msg}")
                if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                    break # Skip to next model immediately
                time.sleep(1.5 ** attempt)
    raise Exception("All Gemini models failed to respond. Please try again later.")

@router.post("/analyze")
async def analyze_image_endpoint(file: UploadFile = File(...), language: str = Form("en")):
    try:
        session_id = str(uuid.uuid4())
        client = get_gemini_client()
        
        # Read the uploaded image
        image_data = await file.read()
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Build the prompt
        sys_prompt = (
            "You are an expert plant pathologist AI. Analyze this image of a plant/leaf. "
            "Identify the crop and diagnose any diseases, pests, or nutrient deficiencies. "
            "Format your response exactly like this, using bullet points for each section:\n"
            "• Crop: [Name of the plant]\n"
            "• Diagnosis: [Disease/Issue name]\n"
            "• Confidence: [High/Moderate/Low]\n"
            "• Symptoms: [List symptoms]\n"
            "• Treatment (Organic): [Organic solutions]\n"
            "• Treatment (Chemical): [Chemical solutions]\n"
            "• Prevention: [Prevention tips]"
        )
        if language != "en":
            sys_prompt += f"\n\nIMPORTANT: You must write the ENTIRE response in the language code: '{language}'."

        contents = [img, sys_prompt]
        
        raw_response = generate_with_retry(client, contents)
        
        # Split into list of strings (lines)
        blocks = [line.strip() for line in raw_response.split('\n') if line.strip()]
        
        # Try to extract crop and diagnosis for the URL/Title
        title = "Crop Disease Analysis"
        for b in blocks:
            if "Diagnosis:" in b or "निदान:" in b:
                title = b.replace("•", "").strip()
                break
        
        encoded_query = urllib.parse.quote(title)
        url = f"https://www.google.com/search?q={encoded_query}"
        
        # Store in history
        active_sessions[session_id] = {
            "history": [
                {"role": "user", "parts": [img, sys_prompt]},
                {"role": "model", "parts": [raw_response]}
            ]
        }
        
        return {
            "success": True,
            "session_id": session_id,
            "ai_overview": blocks,
            "url": url,
            "title": title
        }
    except Exception as e:
        print(f"Analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
def chat_endpoint(req: ChatRequest):
    if req.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    
    try:
        session = active_sessions[req.session_id]
        client = get_gemini_client()
        
        # Append user message
        prompt = req.question
        if req.language != "en":
            prompt += f"\n\n(Please reply in language code '{req.language}')"
            
        session["history"].append({"role": "user", "parts": [prompt]})
        
        raw_response = generate_with_retry(client, session["history"])
        
        session["history"].append({"role": "model", "parts": [raw_response]})
        
        blocks = [line.strip() for line in raw_response.split('\n') if line.strip()]
        
        return {
            "success": True,
            "response": blocks
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/close")
def close_endpoint(req: CloseRequest):
    if req.session_id in active_sessions:
        del active_sessions[req.session_id]
    return {"success": True, "message": f"Session {req.session_id} closed."}
