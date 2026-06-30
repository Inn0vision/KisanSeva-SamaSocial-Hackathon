import os
import re

directories = ["frontend/src"]

def process_file(filepath):
    if not filepath.endswith((".tsx", ".ts")): return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = re.sub(r'http://localhost:8000/api', '/api', content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated URL in {filepath}")

for root_dir in directories:
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            process_file(os.path.join(dirpath, filename))
