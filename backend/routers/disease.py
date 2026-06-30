from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import tempfile
import uuid
import os
from pydantic import BaseModel
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from google import genai
from services.lens_service import (
    create_session_profile, find_chrome, is_logged_in, google_login,
    upload_image, extract_results, GOOGLE_EMAIL, GOOGLE_PASSWORD,
    wait_for_chat_response, dismiss_popups, extract_chat_blocks
)

router = APIRouter()

active_sessions = {}

class ChatRequest(BaseModel):
    session_id: str
    question: str
    language: str = "en"

class CloseRequest(BaseModel):
    session_id: str

def translate_text(text: str, target_lang_code: str) -> str:
    if target_lang_code == "en" or not text: return text
    try:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key: return text
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Translate the following text into the language with code '{target_lang_code}' (e.g. 'hi' for Hindi). Preserve all markdown formatting, bullet points, and exact structure. Only return the translated text.\n\n{text}"
        )
        return response.text
    except Exception as e:
        print(f"Translation failed: {e}")
        return text

def translate_blocks(blocks: list, target_lang_code: str) -> list:
    if target_lang_code == "en" or not blocks: return blocks
    try:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key: return blocks
        client = genai.Client(api_key=api_key)
        joined_blocks = "\n---BLOCK_SEP---\n".join(blocks)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Translate the following text into the language with code '{target_lang_code}' (e.g. 'hi' for Hindi). Preserve all formatting and the exact separator '---BLOCK_SEP---'. Only return the translated text.\n\n{joined_blocks}"
        )
        return [b.strip() for b in response.text.split("---BLOCK_SEP---")]
    except Exception as e:
        print(f"Translation failed: {e}")
        return blocks

@router.post("/analyze")
def analyze_image_endpoint(file: UploadFile = File(...), language: str = Form("en")):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    pw = None
    ctx = None
    temp_profile = None
    try:
        session_id = str(uuid.uuid4())
        temp_profile = create_session_profile()
        
        from playwright.sync_api import sync_playwright
        pw = sync_playwright().start()
        
        args = [
            "--disable-blink-features=AutomationControlled",
            "--no-first-run",
            "--no-default-browser-check",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ]
        
        chrome_exe = find_chrome()

        launch_args = {
            "user_data_dir": temp_profile,
            "headless": True,
            "viewport": {"width": 1280, "height": 800},
            "no_viewport": False,
            "args": args,
            "ignore_default_args": ["--enable-automation"],
        }
        
        if chrome_exe:
            launch_args["executable_path"] = chrome_exe

        ctx = pw.chromium.launch_persistent_context(**launch_args)
        
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        if not is_logged_in(page):
            if not google_login(page, GOOGLE_EMAIL, GOOGLE_PASSWORD, no_input=True):
                raise HTTPException(status_code=401, detail="Google authentication failed. Please run in headed mode first to authenticate.")
        
        page.goto("https://lens.google.com/", wait_until="domcontentloaded", timeout=60_000)
        page.wait_for_timeout(3000)
        upload_image(page, temp_path)
        
        try:
            page.wait_for_load_state("networkidle", timeout=20_000)
        except Exception:
            pass
        page.wait_for_timeout(5000)
        
        results = extract_results(page)
        
        active_sessions[session_id] = {
            "pw": pw,
            "ctx": ctx,
            "page": page,
            "temp_profile": temp_profile
        }
        
        
        ai_overview_text = results["ai_overview"]
        if language != "en" and ai_overview_text:
            ai_overview_text = [translate_text(text, language) for text in ai_overview_text]
        
        return {
            "success": True,
            "session_id": session_id,
            "ai_overview": ai_overview_text,
            "url": results.get("url"),
            "title": results.get("title")
        }
    except Exception as e:
        if ctx:
            try: ctx.close()
            except: pass
        if pw:
            try: pw.stop()
            except: pass
        if temp_profile and os.path.exists(temp_profile):
            try: shutil.rmtree(temp_profile)
            except: pass
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/chat")
def chat_endpoint(req: ChatRequest):
    session_id = req.session_id
    question = req.question
    lang = req.language
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    
    session = active_sessions[session_id]
    page = session["page"]
    
    try:
        show_more = page.locator("text='Show more'").first
        if show_more.is_visible():
            show_more.click()
            page.wait_for_timeout(2000)
        
        textarea = page.locator('textarea[placeholder*="Ask"], textarea[placeholder*="search"], textarea.gLFyf').first
        if not textarea.is_visible():
            page.keyboard.press("Escape")
            page.wait_for_timeout(1000)
        
        if not textarea.is_visible():
            raise HTTPException(status_code=500, detail="Chat input not found or not visible.")
        
        prev_count = page.locator(".pWvJNd").count()
        textarea.fill(question)
        page.keyboard.press("Enter")
        
        success = wait_for_chat_response(page, prev_count)
        dismiss_popups(page)
        ans_blocks = extract_chat_blocks(page)
        
        if lang != "en" and ans_blocks:
            ans_blocks = translate_blocks(ans_blocks, lang)
        
        return {
            "success": True,
            "response": ans_blocks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/close")
def close_endpoint(req: CloseRequest):
    session_id = req.session_id
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    
    session = active_sessions[session_id]
    try: session["ctx"].close()
    except: pass
    try: session["pw"].stop()
    except: pass
    
    temp_profile = session.get("temp_profile")
    if temp_profile and os.path.exists(temp_profile):
        try: shutil.rmtree(temp_profile)
        except: pass
            
    del active_sessions[session_id]
    return {"success": True, "message": f"Session {session_id} closed."}
