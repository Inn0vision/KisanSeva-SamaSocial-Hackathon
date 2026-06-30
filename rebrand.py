import os
import re

directories = ["frontend/src", "backend"]

replacements = [
    (r'AgroSetu(?i)', 'KisanSeva'),
    (r'Agrysetu(?i)', 'KisanSeva'),
    (r'Gemini AI', 'KisanSeva AI'),
    (r'Gemini', 'KisanSeva AI'), # Might be risky if it replaces gemini-2.5-flash. We need to be careful!
]

def process_file(filepath):
    if not filepath.endswith((".tsx", ".ts", ".py", ".json", ".html")): return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = content
    # Replace AgroSetu
    new_content = re.sub(r'AgroSetu', 'KisanSeva', new_content, flags=re.IGNORECASE)
    new_content = re.sub(r'Agrysetu', 'KisanSeva', new_content, flags=re.IGNORECASE)
    
    # Replace Gemini only if it's not part of a model string like 'gemini-2.5-flash' or 'google-genai'
    # Or we can just replace 'Gemini AI' with 'KisanSeva AI'
    new_content = re.sub(r'Gemini AI', 'KisanSeva AI', new_content)
    
    # Replace standalone Gemini with KisanSeva AI, but ONLY on frontend
    if "frontend" in filepath:
        new_content = re.sub(r'\bGemini\b', 'KisanSeva AI', new_content)
    
    # Also fix any "KisanSeva AI AI"
    new_content = re.sub(r'KisanSeva AI AI', 'KisanSeva AI', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root_dir in directories:
    for dirpath, _, filenames in os.walk(root_dir):
        if "node_modules" in dirpath or "venv" in dirpath or "__pycache__" in dirpath:
            continue
        for filename in filenames:
            process_file(os.path.join(dirpath, filename))
