import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import groq

router = APIRouter()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL_NAME = "llama-3.3-70b-versatile"

# Initialize Clients
gemini_client = None
if GOOGLE_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")

groq_client = None
if GROQ_API_KEY:
    try:
        groq_client = groq.Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")

class SoilAttributes(BaseModel):
    ph: float
    nitrogen: str
    phosphorus: str
    potassium: str
    soil_type: str
    crop: str
    language: str = "en"

class LandAnalysisResponse(BaseModel):
    score: int
    report: str

@router.post("/analyze", response_model=LandAnalysisResponse)
async def analyze_land(attrs: SoilAttributes):
    if not groq_client and not gemini_client:
        raise HTTPException(status_code=500, detail="No AI API Keys configured (Groq or Google required)")
        
    try:
        prompt = (
            f"As an expert agricultural scientist, analyze the following soil profile for growing {attrs.crop}:\n"
            f"- Soil Type: {attrs.soil_type}\n"
            f"- pH Level: {attrs.ph}\n"
            f"- Nitrogen (N): {attrs.nitrogen}\n"
            f"- Phosphorus (P): {attrs.phosphorus}\n"
            f"- Potassium (K): {attrs.potassium}\n\n"
            "Provide a comprehensive, beautifully formatted Markdown short report (not so big repot)containing:\n"
            "1. An overarching summary of the soil health.\n"
            "2. Specific vulnerabilities/weaknesses based on these metrics.\n"
            "3. Actionable organic and chemical recommendations to improve this soil for the target crop.\n"
            f"IMPORTANT: You MUST respond entirely in the language corresponding to this code and replye shold be short not big long : {attrs.language} (e.g., 'hi' for Hindi, 'mr' for Marathi, 'en' for English).\n"
            "End your response with a single line containing exactly the text 'FINAL_SCORE: X', where X is an integer out of 100 representing the overall soil health score."
        )
        
        text = None
        
        # 1. Primary: Try Groq API
        if groq_client:
            try:
                response = groq_client.chat.completions.create(
                    model=GROQ_MODEL_NAME,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3
                )
                text = response.choices[0].message.content
                print(f"Land Analysis: Using {GROQ_MODEL_NAME} (Groq)")
            except Exception as e:
                print(f"Groq API failed: {e}. Falling back to Gemini...")
        
        # 2. Fallback: Gemini
        if not text and gemini_client:
            try:
                response = gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.3
                    )
                )
                text = response.text
                print(f"Land Analysis: Using gemini-2.5-flash (Google Fallback)")
            except Exception as e:
                print(f"Gemini API failed: {e}")

        if not text:
            raise HTTPException(status_code=500, detail="All AI models failed to analyze the soil.")
        
        # Parse score
        score = 75 # default
        lines = text.strip().split('\n')
        final_report = text
        for i, line in enumerate(reversed(lines)):
            if 'FINAL_SCORE:' in line:
                try:
                    score = int(line.split('FINAL_SCORE:')[-1].strip())
                    # Remove that line from report
                    lines_to_keep = lines[:len(lines)-i-1]
                    final_report = '\n'.join(lines_to_keep)
                except:
                    pass
                break
                
        return LandAnalysisResponse(score=score, report=final_report)
        
    except Exception as e:
        print(f"Error analyzing land: {e}")
        raise HTTPException(status_code=500, detail=str(e))
