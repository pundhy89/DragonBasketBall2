import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Remove the old dashboard banner logic
code = re.sub(
    r'\{academySettings\.bannerUrl && activeTab === \'dashboard\' && \([\s\S]*?\n\s*\}\)',
    '',
    code
)

top_header_ui = """
        {/* Main Header (Right Pane) */}
        <header className={`hidden lg:flex w-full relative z-40 border-b border-theme shrink-0 transition-all duration-300 ${academySettings.headerAutoScroll ? 'absolute top-0' : 'sticky top-0'} ${academySettings.headerSize === 'sm' ? 'h-20' : academySettings.headerSize === 'lg' ? 'h-48' : 'h-32'}`}>
            {academySettings.bannerUrl && (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img src={academySettings.bannerUrl} alt="Header Background" className="w-full h-full object-cover opacity-60 blur-md scale-105" />
                <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/90"></div>
              </div>
            )}
            <div className="w-full h-full flex items-center justify-between relative px-8 py-4 z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden shrink-0 shadow-2xl">
                    {academySettings.logoUrl ? (
                        <img src={academySettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                        <span className="text-3xl">{academySettings.logoIcon}</span>
                    )}
                    </div>
                    <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-md leading-none">
                        {academySettings.title}
                    </h1>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mt-2 drop-shadow-md">
                        {academySettings.subtitle}
                    </h2>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-lg"
                    title="Toggle Theme"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  {user && (
                    <button 
                      onClick={logout}
                      className="w-10 h-10 rounded-xl bg-red-500/80 hover:bg-red-500 backdrop-blur-md border border-red-500/50 flex items-center justify-center text-white transition-all shadow-lg"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
                </div>
            </div>
        </header>
"""

# Insert top header right before the main scrolling area or inside it.
# Actually, if auto-scroll is ON, it should be INSIDE the scrolling area.
# If auto-scroll is OFF, it should be OUTSIDE (sticky or fixed).
# Let's put it inside the flex column that holds the main content.

# Search for the Main Scrolling Area
# <div className="flex-1 w-full overflow-y-auto custom-scrollbar relative">
# The parent is:
# {/* Main Content wrapper */}
# <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pb-20 lg:pb-0 split-bg">

# We can put the header inside the scrolling area if we use relative/absolute, 
# or outside if we want it completely fixed.
# Let's put it INSIDE the scrolling area, and use sticky/relative class.

code = code.replace(
    '<div className="flex-1 w-full overflow-y-auto custom-scrollbar relative">',
    '<div className="flex-1 w-full overflow-y-auto custom-scrollbar relative">' + top_header_ui
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Top Header added")
