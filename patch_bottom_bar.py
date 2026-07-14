import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    'bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl flex justify-around items-center py-2 px-2 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]',
    'neu-flat flex justify-around items-center py-2 px-2 z-50 border border-theme'
)
code = code.replace(
    'border-slate-50 dark:border-[#0B0A10]',
    'border-secondary'
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Bottom bar patched")
