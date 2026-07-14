import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # 1. replace bg-secondary border border-theme rounded-3xl ... shadow-lg -> neu-flat ...
    content = re.sub(
        r'bg-secondary(?:\s*border\s*border-theme)?\s*rounded-(?:2xl|3xl)(?:\s*shadow-lg)?',
        'neu-flat',
        content
    )

    # 2. replace bg-secondary border border-theme rounded-xl ... -> neu-flat-sm ...
    content = re.sub(
        r'bg-secondary(?:\s*border\s*border-theme)?\s*rounded-xl(?:\s*shadow-md)?',
        'neu-flat-sm',
        content
    )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Styled {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Cards styled")
