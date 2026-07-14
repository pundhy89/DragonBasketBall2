import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Current mobile header structure:
#             <div className="w-full flex items-center justify-between relative px-4 py-4 z-10">
#                 <div className="flex items-center gap-4">
#                     <div className="w-12 h-12 bg-primary/50 rounded-xl flex items-center justify-center border border-theme overflow-hidden shrink-0 shadow-lg">
#                     ...
#                     </div>
#                     <div className="flex flex-col justify-center">
#                     <h1 className="text-sm font-black uppercase tracking-tight text-primary leading-none">
#                         {academySettings.title}
#                     </h1>
#                     <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-1">
#                         {academySettings.subtitle}
#                     </h2>
#                     </div>
#                 </div>
#             </div>

new_mobile_header = """            <div className="w-full flex items-center justify-between relative px-4 py-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/50 rounded-xl flex items-center justify-center border border-theme overflow-hidden shrink-0 shadow-lg">
                    {academySettings.logoUrl ? (
                        <img src={academySettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                        <span className="text-xl">{academySettings.logoIcon}</span>
                    )}
                    </div>
                    <div className="flex flex-col justify-center">
                    <h1 className="text-sm font-black uppercase tracking-tight text-primary leading-none">
                        {academySettings.title}
                    </h1>
                    <h2 className="text-[9px] font-bold uppercase tracking-widest text-blue-500 mt-1">
                        {academySettings.subtitle}
                    </h2>
                    </div>
                </div>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary transition-all shadow-lg shrink-0"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </button>
            </div>"""

code = re.sub(r'<div className="w-full flex items-center justify-between relative px-4 py-4 z-10">[\s\S]*?</div>\s*</div>', new_mobile_header, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Mobile header patched")
