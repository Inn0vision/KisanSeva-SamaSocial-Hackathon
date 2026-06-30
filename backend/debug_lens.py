import asyncio
import os
import sys
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # We can find chrome if available, else bundled chromium
        # Let's import the helper if possible, or just launch chromium
        print("Launching browser...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print("Going to Lens...")
        await page.goto("https://lens.google.com/", wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(2000)
        
        # Check if there is a cookie popup
        print("Checking popups...")
        for name in ["Accept all", "Reject all", "Not now"]:
            btn = page.get_by_role("button", name=name).first
            if await btn.is_visible():
                print(f"Clicking popup button: {name}")
                await btn.click()
                await page.wait_for_timeout(1000)
                
        # Take screenshot of Lens landing page
        await page.screenshot(path="lens_landing.png")
        print("Saved lens_landing.png")
        
        # Let's create a dummy green image
        img_path = "temp_leaf.png"
        import image_creation
        # We can write a simple PNG in python using standard library or PIL if available.
        # But wait, we can just use a real file if there is one.
        # Let's look for a file to upload.
        
        # We can upload the landing screenshot itself!
        print(f"Uploading image: lens_landing.png")
        # Trigger upload
        try:
            # We look for file input
            file_input = page.locator("input[type='file']").first
            await file_input.set_input_files("lens_landing.png")
            print("Uploaded!")
        except Exception as e:
            print(f"Upload failed: {e}")
            
        print("Waiting for results...")
        await page.wait_for_timeout(10000)
        
        # Let's see current URL
        print(f"Current URL: {page.url}")
        
        # Take screenshot of results
        await page.screenshot(path="lens_results.png")
        print("Saved lens_results.png")
        
        # Print page text to see if there is any AI Overview or match info
        content = await page.content()
        with open("lens_content.html", "w") as f:
            f.write(content)
        print("Saved lens_content.html")
        
        # Try to find textareas
        textareas = await page.locator("textarea").all()
        print(f"Found {len(textareas)} textareas:")
        for i, ta in enumerate(textareas):
            visible = await ta.is_visible()
            outer = await ta.evaluate("el => el.outerHTML")
            print(f"Textarea {i}: visible={visible}, html={outer}")
            
        # Try to find AI Overview selector .pWvJNd
        elements = await page.locator(".pWvJNd").all()
        print(f"Found {len(elements)} elements with class .pWvJNd")
        for i, el in enumerate(elements):
            text = await el.inner_text()
            print(f"Element {i} text: {text[:200]}")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
