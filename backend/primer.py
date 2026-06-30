from services.lens_service import create_session_profile, find_chrome, is_logged_in, google_login, GOOGLE_EMAIL, GOOGLE_PASSWORD
from playwright.sync_api import sync_playwright
import os

print("Starting primer...")
temp_profile = os.path.expanduser("~/.config/chrome-lens-bot")
os.makedirs(temp_profile, exist_ok=True)

with sync_playwright() as pw:
    chrome_exe = find_chrome()
    args = [
        "--disable-blink-features=AutomationControlled",
        "--no-first-run",
        "--no-default-browser-check",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
    ]
    ctx = pw.chromium.launch_persistent_context(
        user_data_dir=temp_profile,
        executable_path=chrome_exe,
        headless=True,
        viewport={"width": 1280, "height": 800},
        no_viewport=False,
        args=args,
        ignore_default_args=["--enable-automation"],
    )
    
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    if not is_logged_in(page):
        success = google_login(page, GOOGLE_EMAIL, GOOGLE_PASSWORD, no_input=True)
        if success:
            print("Primer completed successfully headlessly!")
        else:
            print("Login failed headlessly. Might need headed mode.")
    else:
        print("Already logged in!")
    ctx.close()
