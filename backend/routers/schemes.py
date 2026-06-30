from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import json
from google import genai

router = APIRouter()

class SchemeRequest(BaseModel):
    state: str
    city: str
    language: str = "en"

@router.post("/search")
def search_schemes(req: SchemeRequest):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Google API Key missing")
        
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert on Indian Agricultural Government Schemes and Subsidies.
    A farmer is located in City: {req.city}, State: {req.state}, India.
    
    Provide a list of EXACTLY 4 highly relevant agricultural government schemes available to farmers in this specific region. Include both state-level and national-level schemes.
    
    The response MUST be in this exact JSON array format:
    [
      {{
        "id": "unique-id",
        "title": "Scheme Title",
        "description": "2-3 sentences explaining the scheme and who is eligible.",
        "subsidy": "Details of the financial benefit or subsidy",
        "link": "Official URL or 'Visit local agriculture office'"
      }}
    ]
    
    IMPORTANT: You MUST translate the 'title', 'description', and 'subsidy' fields into the language corresponding to this language code: '{req.language}' (e.g. 'hi' for Hindi, 'mr' for Marathi, 'en' for English).
    Return ONLY valid JSON array. Do not include markdown fences like ```json.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        schemes = json.loads(text.strip())
        return {"success": True, "schemes": schemes}
    except Exception as e:
        print(f"Error fetching schemes: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch local schemes.")
