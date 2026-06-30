import os
import json
import re

FRONTEND_DIR = "frontend/src"
EN_JSON_PATH = os.path.join(FRONTEND_DIR, "locales", "en.json")

def extract_from_file(filepath, keys_to_extract):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    found_strings = []
    for key in keys_to_extract:
        # Regex to find `key: "value"` or `key: 'value'`
        pattern = re.compile(rf'{key}:\s*["\'](.*?)["\']')
        matches = pattern.findall(content)
        found_strings.extend(matches)
        
    return found_strings

def main():
    with open(EN_JSON_PATH, "r", encoding="utf-8") as f:
        en_data = json.load(f)
        
    waste_strings = extract_from_file(os.path.join(FRONTEND_DIR, "pages", "Waste.tsx"), ["title", "description"])
    stories_strings = extract_from_file(os.path.join(FRONTEND_DIR, "pages", "Stories.tsx"), ["title", "location", "technology", "story", "impact"])
    
    all_strings = waste_strings + stories_strings
    
    new_keys_added = False
    for s in all_strings:
        if s not in en_data:
            en_data[s] = s
            new_keys_added = True
            
    if new_keys_added:
        with open(EN_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(en_data, f, indent=2, ensure_ascii=False)
        print(f"Added {len(all_strings)} strings to en.json")
    else:
        print("No new strings added.")

if __name__ == "__main__":
    main()
