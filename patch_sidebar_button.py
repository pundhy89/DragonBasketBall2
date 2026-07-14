import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "onClick={() => setActiveTab(id)}",
    "onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}"
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("SidebarButton patched")
