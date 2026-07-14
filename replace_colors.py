import os
import re

replacements = [
    (r'bg-\[\#0B0A10\]', 'bg-primary'),
    (r'bg-\[\#13131a\]', 'bg-secondary'),
    (r'bg-\[\#1c1c28\]', 'bg-secondary border-t border-l border-white/5 dark:border-white/5 shadow-[var(--neu-inner)]'),
    (r'bg-\[\#2a2a35\]', 'bg-secondary border-theme'),
    (r'border-\[\#2a2a35\]', 'border-theme'),
    (r'border-\[\#1c1c28\]', 'border-theme'),
    (r'text-\[\#e2e8f0\]', 'text-primary'),
    (r'text-white', 'text-primary'),
    (r'text-slate-400', 'text-secondary'),
    (r'text-slate-500', 'text-secondary'),
    (r'text-orange-500', 'text-blue-500'),
    (r'text-orange-400', 'text-blue-400'),
    (r'bg-orange-500', 'bg-blue-500'),
    (r'bg-orange-600', 'bg-blue-600'),
    (r'border-orange-500', 'border-blue-500'),
    (r'border-orange-400', 'border-blue-400'),
    (r'shadow-orange-500', 'shadow-blue-500'),
    (r'shadow-\[0_0_15px_rgba\(249,115,22,0.4\)\]', 'shadow-[0_0_15px_rgba(59,130,246,0.4)]'),
    (r'shadow-\[0_0_30px_rgba\(249,115,22,0.2\)\]', 'shadow-[0_0_30px_rgba(59,130,246,0.2)]'),
    (r'shadow-\[0_0_20px_rgba\(249,115,22,0.3\)\]', 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'),
    (r'from-orange-500', 'from-blue-500'),
    (r'from-orange-900\/40', 'from-blue-900/40'),
    (r'to-orange-500', 'to-blue-500'),
    (r'to-orange-900\/40', 'to-blue-900/40'),
    (r'via-orange-500', 'via-blue-500'),
    (r'hover:text-white', 'hover:text-primary'),
]

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        content = re.sub(old, new, content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Color replacement complete.")
