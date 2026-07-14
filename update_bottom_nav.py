import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

bottom_nav_new = """      {/* Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl flex justify-around items-center py-2 px-2 z-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
        {[
          { id: 'dashboard', icon: Home, label: 'Beranda' },
          { id: 'stats', icon: Users, label: 'Atlet' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
            className={`relative flex flex-col items-center justify-center w-16 h-12 gap-1 z-10 transition-colors ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="bottom-active-tab"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold">{item.label}</span>
          </button>
        ))}

        {/* Menu Toggle Button in Center */}
        <div className="relative -top-6 flex flex-col items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors border-4 border-slate-50 dark:border-[#0B0A10]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {[
          { id: 'report', icon: Trophy, label: 'Rapor' },
          { id: 'attendance', icon: FileSpreadsheet, label: 'Absensi' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
            className={`relative flex flex-col items-center justify-center w-16 h-12 gap-1 z-10 transition-colors ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="bottom-active-tab"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>"""

# Find the bottom navigation block
code = re.sub(
    r'\{/\* Bottom Navigation \(Mobile Only\) \*/\}[\s\S]*?(?=    </>|  \);)',
    bottom_nav_new + '\n    </>',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Bottom navigation updated")
