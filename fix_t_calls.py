import os
import re

directories = ["frontend/src/pages"]
files_to_fix = ["Water.tsx", "Waste.tsx", "Stories.tsx"]

# Regex to find t('some.key', { defaultValue: 'Some Text' })
# We want to replace it with t('Some Text')
pattern1 = re.compile(r"""t\(\s*['"][^'"]+['"]\s*,\s*\{\s*defaultValue\s*:\s*(['"])(.*?)\1\s*\}\s*\)""")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = pattern1.sub(r"t('\2')", content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root_dir in directories:
    for filename in files_to_fix:
        filepath = os.path.join(root_dir, filename)
        if os.path.exists(filepath):
            process_file(filepath)
            
# Also Waste.tsx has an array `waterConcepts = [{title: "...", description: "..."}, ...]`
# Which is mapped to `t(concept.title, { defaultValue: concept.title })`. We should change `waterConcepts` to directly use `t('...')` if possible, but they are defined outside the component.
# Actually, if we just add the strings to en.json, we don't need to change the array mapping.
# Let's write a small script to extract the concepts and add them to en.json directly.
