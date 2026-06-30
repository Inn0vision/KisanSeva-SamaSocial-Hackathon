import os
import re

FRONTEND_DIR = "frontend/src/pages"
files_to_check = ["Dashboard.tsx", "Disease.tsx", "Land.tsx", "Pesticide.tsx", "Schemes.tsx", "Weather.tsx", "Chat.tsx", "Stories.tsx", "Waste.tsx", "Water.tsx"]

# Regex to find text between HTML tags that contains at least one letter and no curly braces
# e.g. >Some text here< -> >{t('Some text here')}<
# We need to be careful with newlines and extra spaces.
pattern = re.compile(r'>\s*([A-Za-z][^<>{]*?[A-Za-z0-9\.?!])\s*<')

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We also need to make sure useTranslation is imported and `const { t } = useTranslation()` is defined.
    # But most of these files already have it.
    
    # We will only replace if it's safe.
    def replacer(match):
        text = match.group(1).strip()
        # skip if it looks like code or already has t(
        if 't(' in text or '`' in text or '$' in text or '=>' in text or text == 't':
            return match.group(0)
            
        # Escape single quotes in text
        escaped_text = text.replace("'", "\\'")
        
        # reconstruct with original whitespace around the text
        original = match.group(0)
        prefix = original[:original.find(match.group(1))]
        suffix = original[original.find(match.group(1)) + len(match.group(1)):]
        
        return f"{prefix}{{t('{escaped_text}')}}{suffix}"
        
    new_content = pattern.sub(replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for filename in files_to_check:
    filepath = os.path.join(FRONTEND_DIR, filename)
    if os.path.exists(filepath):
        process_file(filepath)
