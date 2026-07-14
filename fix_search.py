import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add Search to imports if missing
if 'Search' not in code:
    code = re.sub(r'import\s*\{([^}]+)\}\s*from\s*\'lucide-react\';', r'import {\1, Search} from \'lucide-react\';', code, count=1)

# Fix search bar styling
search_code = """                  {/* Search Bar */}
                  <div className="w-full md:w-auto relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search for tools..." 
                      className="w-full md:w-72 pl-11 pr-4 py-3.5 rounded-full bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 transition-all"
                    />
                  </div>"""

code = re.sub(
    r'\{/\* Search Bar - Aesthetic only to match reference \*/\}[\s\S]*?</div>\s*</div>',
    search_code + '\n                </div>',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Search bar fixed")
