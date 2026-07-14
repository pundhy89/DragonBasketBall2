import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Fix main content wrapper background to match reference soft gradient style
code = re.sub(
    r'<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0 neu-button-accent dark:bg-\[\#1a5ce5\] text-white">',
    r'<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0 split-bg">',
    code
)

# Fix outer wrapper just in case
code = re.sub(
    r'<div className="min-h-screen font-sans flex antialiased bg-primary text-primary relative overflow-hidden">',
    r'<div className="min-h-screen font-sans flex antialiased bg-soft-gradient text-primary relative overflow-hidden">',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Wrappers fixed")
