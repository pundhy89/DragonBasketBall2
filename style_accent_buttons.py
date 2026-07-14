import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # replace 'bg-blue-500 hover:bg-blue-600 text-white' or similar with 'neu-button-accent text-white'
    content = re.sub(
        r'bg-blue-500(?:\s*hover:bg-blue-600)?(?:\s*text-white)?(?:\s*text-primary)?(?:\s*shadow-[^" ]*)?',
        'neu-button-accent',
        content
    )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Styled accent buttons in {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Accent buttons styled")
