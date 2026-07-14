import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Make main content solid blue for the split effect
code = re.sub(
    r'<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0[^"]*">',
    r'<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0 bg-blue-500 dark:bg-[#1a5ce5] text-white">',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Main bg fixed")
