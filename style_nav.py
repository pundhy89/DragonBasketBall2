import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Update bottom nav
code = re.sub(
    r'<div className="lg:hidden fixed bottom-4 left-4 right-4 bg-secondary/95 backdrop-blur-md border border-theme rounded-2xl flex justify-around items-center py-2 px-2 z-50 shadow-2xl">',
    r'<div className="lg:hidden fixed bottom-4 left-4 right-4 neu-flat flex justify-around items-center py-2 px-2 z-50 shadow-2xl">',
    code
)

# Active icon in bottom nav (bg-blue-500/20 text-blue-500 -> neu-pressed text-blue-500)
code = re.sub(
    r'bg-blue-500\/20 text-blue-500',
    r'neu-pressed text-blue-500',
    code
)

# And for regular icon in bottom nav (hover:bg-[#1c1c28] -> hover:neu-flat-sm)
# Wait, it might be text-slate-400 hover:bg-secondary
code = re.sub(
    r'hover:bg-secondary border-t border-l border-white\/5 dark:border-white\/5 shadow-\[var\(--neu-inner\)\]',
    r'hover:neu-flat-sm',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

