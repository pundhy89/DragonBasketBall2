import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace("const img = new Image();", "const img = new window.Image();")

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Fixed Image constructor")
