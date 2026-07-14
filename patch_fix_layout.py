import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "        </header>\n\n          {/* TAB 1: DASHBOARD OVERVIEW */}",
    "        </header>\n          <main className=\"w-full max-w-7xl mx-auto px-4 md:px-8 py-8 relative min-h-full\">\n        <AnimatePresence mode=\"wait\">\n\n          {/* TAB 1: DASHBOARD OVERVIEW */}"
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Layout fixed")
