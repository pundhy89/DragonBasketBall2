import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Replace inline animations with a modern variant
modern_anim = """              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}"""

code = re.sub(
    r'initial=\{\{ opacity: 0, y: 15 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}\s*exit=\{\{ opacity: 0, y: -15 \}\}\s*transition=\{\{ duration: 0\.3 \}\}',
    modern_anim,
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Animations updated")
