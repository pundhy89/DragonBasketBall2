import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    'bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/5',
    'neu-flat p-5 md:p-6 flex flex-col items-start gap-4 group transition-all duration-300 border border-theme'
)
code = code.replace(
    'text-slate-800 dark:text-white',
    'text-primary'
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Dashboard bg patched")
