import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

toggle_button = """            <div className="p-4 border-t border-theme">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center justify-between transition-all hover:bg-secondary/80 text-secondary border border-transparent neu-button"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </div>
              </button>
            </div>
          </motion.div>"""

code = code.replace(
    "            </div>\n          </motion.div>",
    "            </div>\n" + toggle_button
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Mobile drawer patched")
