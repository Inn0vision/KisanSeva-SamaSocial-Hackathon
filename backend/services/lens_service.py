import os
import subprocess
import shutil
import tempfile
import uuid
import time
from playwright.sync_api import sync_playwright, Page
from dotenv import load_dotenv

load_dotenv()

GOOGLE_EMAIL    = os.environ.get("GOOGLE_EMAIL", "")
GOOGLE_PASSWORD = os.environ.get("GOOGLE_PASSWORD", "")
AUTOMATION_PROFILE = os.path.expanduser("~/.config/chrome-lens-bot")
CHROME_EXECUTABLE = None

# ── Helpers ──────────────────────────────────────────────────────────────────

def find_chrome() -> str | None:
    candidates = [
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/opt/google/chrome/google-chrome",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium",
        "/snap/bin/chromium",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    for cmd in ("google-chrome", "google-chrome-stable", "chromium-browser", "chromium"):
        try:
            r = subprocess.run(["which", cmd], capture_output=True, text=True)
            if r.returncode == 0:
                return r.stdout.strip()
        except Exception:
            pass
    return None

def create_session_profile() -> str:
    """Create a temporary copy of the main automation profile for concurrent sessions."""
    temp_dir = tempfile.mkdtemp(prefix="lens-session-")
    if os.path.exists(AUTOMATION_PROFILE):
        try:
            shutil.copytree(AUTOMATION_PROFILE, temp_dir, dirs_exist_ok=True)
        except Exception as e:
            print(f"⚠️   Warning copying profile: {e}")
    return temp_dir

def dismiss_popups(page: Page) -> None:
    """Dismiss Google search overlays or popups."""
    try:
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)
        for name in ["Not now", "Accept all", "Reject all"]:
            btn = page.get_by_role("button", name=name).first
            if btn.is_visible():
                btn.click()
                page.wait_for_timeout(500)
    except Exception:
        pass

def wait_for_chat_response(page: Page, previous_container_count: int, timeout_ms: int = 15000) -> bool:
    """Wait for a new chat response container to render on the page."""
    start_time = time.time()
    while time.time() - start_time < (timeout_ms / 1000.0):
        containers = page.locator(".pWvJNd").all()
        if len(containers) > previous_container_count:
            latest = containers[-1]
            text = latest.inner_text().strip()
            if text and not text.startswith("You said:"):
                return True
        page.wait_for_timeout(500)
    return False

def extract_chat_blocks(page: Page) -> list[str]:
    """Cleanly parse paragraphs and bullet points from the latest chat response."""
    blocks = page.evaluate("""() => {
        const containers = Array.from(document.querySelectorAll(".pWvJNd"));
        if (containers.length === 0) return [];
        const leftContainer = containers[containers.length - 1];
        
        const items = Array.from(leftContainer.querySelectorAll(".n6owBd, .T286Pc, li.Z1qcYe"));
        const results = [];
        for (const item of items) {
            const txt = item.innerText ? item.innerText.trim() : "";
            if (!txt) continue;
            
            const isBullet = item.classList.contains("T286Pc") || item.tagName === "LI" || item.classList.contains("Z1qcYe");
            
            let isNested = false;
            for (const existing of items) {
                if (existing !== item && existing.contains(item)) {
                    if (existing.classList.contains("n6owBd")) {
                        isNested = true;
                        break;
                    }
                    if (existing.tagName === "LI" && item.classList.contains("T286Pc")) {
                        isNested = true;
                        break;
                    }
                }
            }
            if (isNested) continue;
            
            if (isBullet) {
                results.push({ type: "bullet", text: txt });
            } else {
                results.push({ type: "paragraph", text: txt });
            }
        }
        return results;
    }""")
    
    formatted = []
    seen = set()
    for b in blocks:
        text = b['text']
        if text in ("AI Overview", "मराठी", "Show all", "Show more", "Feedback") or "sites" in text or "http" in text or ".com" in text or ".net" in text or ".org" in text:
            continue
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        if not lines:
            continue
        clean_text = lines[0].lstrip("•-* \t")
        if not clean_text or clean_text in (",", ", ", " ,"):
            continue
        if clean_text in seen:
            continue
        seen.add(clean_text)
        
        if b['type'] == 'bullet':
            formatted.append(f" • {clean_text}")
        else:
            formatted.append(clean_text)
            
    return formatted

def is_logged_in(page: Page) -> bool:
    page.goto("https://accounts.google.com/", wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_timeout(2500)
    return "myaccount.google.com" in page.url

def google_login(page: Page, email: str, password: str, no_input: bool = False) -> bool:
    print("🔐  Signing in to Google …")
    try:
        page.goto("https://accounts.google.com/signin/v2/identifier", wait_until="domcontentloaded", timeout=30_000)
        page.wait_for_timeout(1500)

        email_box = page.locator("input[name='identifier'], input[type='email'], input#identifierId").first
        email_box.wait_for(state="visible", timeout=10_000)
        email_box.fill(email)
        page.keyboard.press("Enter")
        page.wait_for_timeout(2500)

        pwd_box = page.locator("input[name='Passwd']").first
        pwd_box.wait_for(state="visible", timeout=10_000)
        pwd_box.fill(password)
        page.keyboard.press("Enter")
        page.wait_for_timeout(4000)

        url = page.url
        if "myaccount.google.com" in url or ("google.com" in url and "signin" not in url and "challenge" not in url):
            print("✅  Login successful — session saved.")
            return True
    except Exception as e:
        print(f"⚠️ Google Login Error: {e}")
        return False

    return False

def upload_image(page: Page, image_path: str) -> None:
    # If Lens modal is not visible, click the camera icon to open it
    is_modal_visible = False
    try:
        is_modal_visible = page.get_by_text("Drag an image here").first.is_visible() or page.get_by_text("upload a file").first.is_visible()
    except Exception:
        pass
        
    if not is_modal_visible:
        print("Camera upload modal not visible. Trying to open it...")
        camera_btn = None
        for sel in ['div[aria-label="Search by image"]', 'button[aria-label="Search by image"]', '[aria-label="Search by image"]', '.nlaoCc']:
            try:
                page.wait_for_selector(sel, state="visible", timeout=2000)
                camera_btn = page.locator(sel).first
                break
            except Exception:
                continue
                
        if camera_btn:
            camera_btn.click()
            print("Clicked camera button to open modal.")
            page.wait_for_timeout(2000)
            dismiss_popups(page)
        else:
            print("Could not find visible camera button. Trying direct click anyway...")
            try:
                page.locator('[aria-label="Search by image"]').first.click(force=True)
                page.wait_for_timeout(2000)
            except Exception as e:
                print(f"Direct click failed: {e}")

    try:
        page.wait_for_selector('text="upload a file"', state="visible", timeout=5000)
        print("Upload modal is now visible.")
    except Exception:
        print("Warning: Upload modal not confirmed visible.")

    strategies = [
        ("upload_a_file_text", lambda: page.get_by_text("upload a file").first.click(timeout=3000)),
        ("file_input_click", lambda: page.locator("input[type='file']").first.click(force=True, timeout=3000)),
        ("jsname_click", lambda: page.locator("[jsname='R5mgy']").first.click(timeout=3000)),
        ("touch_wrapper_click", lambda: page.locator("[data-is-touch-wrapper='true']").first.click(timeout=3000)),
    ]
    with page.expect_file_chooser(timeout=15_000) as fc:
        for name, strategy in strategies:
            try:
                print(f"Trying upload strategy: {name}")
                strategy()
                break
            except Exception as e:
                print(f"Strategy {name} failed: {e}")
                continue
    fc.value.set_files(image_path)
    print("Files set successfully.")

def extract_results(page: Page) -> dict:
    page.wait_for_timeout(2500)
    data = {"url": page.url, "title": page.title(), "ai_overview": []}
    try:
        data["ai_overview"] = extract_chat_blocks(page)
    except Exception as e:
        print(f"⚠️   Error extracting AI Overview: {e}")
    return data
