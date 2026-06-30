import os
import shutil
import tempfile
import sys
from playwright.sync_api import sync_playwright

# Add current path to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.lens_service import (
    create_session_profile, find_chrome, is_logged_in, google_login,
    upload_image, extract_results, GOOGLE_EMAIL, GOOGLE_PASSWORD, dismiss_popups
)

def main():
    temp_profile = create_session_profile()
    temp_path = "test_leaf.png"
    
    # We need a dummy image
    if os.path.exists("lens_landing.png"):
        shutil.copy("lens_landing.png", temp_path)
    else:
        # Create a tiny PNG
        try:
            from PIL import Image
            img = Image.new('RGB', (100, 100), color = 'green')
            img.save(temp_path)
        except Exception:
            with open(temp_path, "w") as f:
                f.write("dummy")
            
    print(f"Using temp profile: {temp_profile}")
    print(f"Using image: {temp_path}")
    
    pw = None
    ctx = None
    try:
        pw = sync_playwright().start()
        
        args = [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ]
        chrome_exe = find_chrome()
        print(f"Chrome path found: {chrome_exe}")
        
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
            
        print("Launching persistent context...")
        ctx = pw.chromium.launch_persistent_context(**launch_args)
        
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        
        # Take screenshot of blank page
        page.screenshot(path="pipeline_0_blank.png")
        print("Saved pipeline_0_blank.png")
        
        # 1. Accounts status
        print("Checking accounts...")
        logged_in = is_logged_in(page)
        print(f"Logged in: {logged_in}")
        page.screenshot(path="pipeline_1_auth_status.png")
        
        # 2. Try login
        if not logged_in and GOOGLE_EMAIL and GOOGLE_PASSWORD:
            print("Trying Google login...")
            try:
                google_login(page, GOOGLE_EMAIL, GOOGLE_PASSWORD)
                print("Login method completed")
            except Exception as e:
                print(f"Login method failed: {e}")
            page.screenshot(path="pipeline_2_after_login.png")
            
        # 3. Go to Lens
        print("Navigating to Lens...")
        page.goto("https://lens.google.com/", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2000)
        dismiss_popups(page)
        page.screenshot(path="pipeline_3_lens_home.png")
        
        # 4. Upload Image
        print("Uploading image...")
        upload_image(page, temp_path)
        print("Upload completed")
        page.screenshot(path="pipeline_4_after_upload.png")
        
        # 5. Wait for results
        print("Waiting for results...")
        try:
            page.wait_for_load_state("networkidle", timeout=20000)
        except Exception:
            pass
        page.wait_for_timeout(5000)
        
        # Take screenshot of results
        page.screenshot(path="pipeline_5_results.png")
        print(f"Results page URL: {page.url}")
        
        # 6. Extract results
        results = extract_results(page)
        print(f"Extracted Results: {results}")
        
    except Exception as e:
        print(f"Error during pipeline: {e}")
    finally:
        if ctx:
            try: ctx.close()
            except: pass
        if pw:
            try: pw.stop()
            except: pass
        if os.path.exists(temp_path):
            try: os.remove(temp_path)
            except: pass
            
if __name__ == "__main__":
    main()
