import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Make the main wrapper blue
code = re.sub(
    r'\{/\* Main Content wrapper \*/\}\s*<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0">',
    r'{/* Main Content wrapper */}\n      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 dark:from-blue-900/20 dark:to-blue-800/10">',
    code
)

# And make the active Tab indicator look more neumorphic
code = re.sub(
    r'bg-gradient-to-r from-blue-900/40 to-blue-900/40 text-blue-500 border border-blue-500/30 font-bold',
    r'neu-pressed text-blue-500 font-bold',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

