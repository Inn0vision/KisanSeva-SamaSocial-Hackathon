import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types

router = APIRouter()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

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
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Google API Key not configured")
        
    try:
        client = genai.Client(api_key=GOOGLE_API_KEY)
        
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
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3
            )
        )
        
        text = response.text
        
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
