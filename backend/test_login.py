from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
import os, shutil

profile_dir = "/tmp/test-profile"
if os.path.exists(profile_dir): shutil.rmtree(profile_dir)

def test():
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=profile_dir,
            headless=False,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"],
            ignore_default_args=["--enable-automation"]
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        Stealth().apply_stealth_sync(page)
        
        print("Navigating...")
        page.goto("https://accounts.google.com/ServiceLogin", wait_until="networkidle")
        page.wait_for_timeout(2000)
        
        email = os.environ.get("GOOGLE_EMAIL")
        pwd = os.environ.get("GOOGLE_PASSWORD")
        
        try:
            print(f"Filling email: {email}")
            page.locator("input#identifierId").fill(email)
            page.keyboard.press("Enter")
            page.wait_for_timeout(3000)
        except Exception as e:
            print("Failed to find email input:")
            page.screenshot(path="test_login_email_error.png")
            raise e
        
        try:
            pwd_input = page.locator("input[name='Passwd']").first
            pwd_input.wait_for(state="visible", timeout=5000)
            print("Password input found!")
            pwd_input.fill(pwd)
            page.keyboard.press("Enter")
            page.wait_for_timeout(5000)
            print("Login success! Snapshotting...")
            page.screenshot(path="test_login_success.png")
        except Exception as e:
            print("Failed:")
            page.screenshot(path="test_login_error.png")
            
test()
