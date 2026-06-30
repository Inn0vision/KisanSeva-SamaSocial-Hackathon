import os
import json
import re
from glob import glob
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))

FRONTEND_DIR = "../frontend/src"
EN_JSON_PATH = os.path.join(FRONTEND_DIR, "locales", "en.json")
HI_JSON_PATH = os.path.join(FRONTEND_DIR, "locales", "hi.json")
MR_JSON_PATH = os.path.join(FRONTEND_DIR, "locales", "mr.json")

def extract_keys():
    with open(EN_JSON_PATH, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    # Regex to find all t('...') or t("...") 
    pattern = re.compile(r"""t\(\s*['"](.*?)['"]\s*[,)]""")
    
    files = glob(os.path.join(FRONTEND_DIR, "pages", "*.tsx")) + glob(os.path.join(FRONTEND_DIR, "components", "**", "*.tsx"), recursive=True)
    
    new_keys_added = False
    for file in files:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
            matches = pattern.findall(content)
            for match in matches:
                # If it's a direct string (not containing dot notation like 'nav.Dashboard' which is nested)
                if '.' not in match and match not in en_data:
                    en_data[match] = match
                    new_keys_added = True

    if new_keys_added:
        with open(EN_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(en_data, f, indent=2, ensure_ascii=False)
            
    return en_data

def translate_dict(data, target_lang):
    print(f"Translating to {target_lang}...")
    prompt = f"Translate the following JSON object's VALUES into {target_lang}. Keep the exact same JSON structure and keys. Only translate the values. Ensure high quality, natural agricultural context translation. Translate EVERYTHING accurately.\n\n{json.dumps(data, indent=2)}\n\nRespond ONLY with valid JSON."
    
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
        
    return json.loads(text.strip())

def main():
    en_data = extract_keys()
    
    hi_data = translate_dict(en_data, "Hindi")
    with open(HI_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(hi_data, f, ensure_ascii=False, indent=2)
        
    mr_data = translate_dict(en_data, "Marathi")
    with open(MR_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(mr_data, f, ensure_ascii=False, indent=2)
        
    print("Done translating!")

if __name__ == "__main__":
    main()
