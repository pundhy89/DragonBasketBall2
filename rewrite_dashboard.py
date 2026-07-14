import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add missing icons to import
icons_to_add = ['UserPlus', 'BookOpen', 'Shield', 'Award']
for icon in icons_to_add:
    if icon not in code:
        code = re.sub(r'import\s*\{([^}]+)\}\s*from\s*\'lucide-react\';', r'import {\1, ' + icon + '} from \'lucide-react\';', code, count=1)

dashboard_html = """{/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-lg mx-auto md:max-w-none pb-20"
              id="dashboard-container"
            >
              <div className="relative z-10 space-y-8">
                {/* Header Greeting */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight font-display tracking-tight">
                      Hi, <span className="text-blue-500">Coach Andi!</span>
                    </h2>
                    <p className="text-sm text-secondary font-medium mt-1">
                      Let's learn something new today!
                    </p>
                  </div>
                  
                  {/* Search Bar - Aesthetic only to match reference */}
                  <div className="w-full md:w-auto relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Compass className="w-4 h-4 text-secondary group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search for tools..." 
                      className="w-full md:w-64 pl-11 pr-4 py-3 rounded-full bg-secondary border-none shadow-[var(--neu-inner)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium text-primary placeholder-secondary transition-all"
                    />
                  </div>
                </div>

                {/* Categories Title */}
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-primary tracking-wide">Categories</h3>
                  <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">View All</button>
                </div>

                {/* Grid Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { id: 'generator-student', label: 'Form Siswa Baru', icon: <UserPlus className="w-8 h-8 text-white" />, color: 'from-pink-400 to-rose-500' },
                    { id: 'stats', label: 'Data Siswa & Kelas', icon: <Users className="w-8 h-8 text-white" />, color: 'from-blue-400 to-indigo-500' },
                    { id: 'schedule', label: 'Jadwal Latihan', icon: <Calendar className="w-8 h-8 text-white" />, color: 'from-emerald-400 to-teal-500' },
                    { id: 'tutorials', label: 'Materi', icon: <BookOpen className="w-8 h-8 text-white" />, color: 'from-purple-400 to-fuchsia-500' },
                    { id: 'attendance', label: 'Penilaian & Absensi', icon: <FileSpreadsheet className="w-8 h-8 text-white" />, color: 'from-orange-400 to-amber-500' },
                    { id: 'generator-athlete', label: 'Form & Kartu Atlet', icon: <Award className="w-8 h-8 text-white" />, color: 'from-cyan-400 to-blue-500' },
                    { id: 'report', label: 'Raport', icon: <Trophy className="w-8 h-8 text-white" />, color: 'from-yellow-400 to-orange-500' },
                    { id: 'generator-coach', label: 'Generator Coach', icon: <Shield className="w-8 h-8 text-white" />, color: 'from-red-400 to-rose-600' },
                    { id: 'coaches', label: 'Daftar Coach', icon: <User className="w-8 h-8 text-white" />, color: 'from-indigo-400 to-blue-600' },
                    { id: 'notifications', label: 'Notifikasi', icon: <Bell className="w-8 h-8 text-white" />, color: 'from-violet-400 to-purple-600' }
                  ].map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id as any)}
                      className="neu-flat p-4 md:p-6 rounded-3xl flex flex-col items-center justify-center gap-4 text-center group hover:neu-pressed transition-all duration-300"
                    >
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                        {cat.icon}
                      </div>
                      <span className="text-xs md:text-sm font-bold text-primary max-w-[120px]">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}"""

code = re.sub(
    r'\{/\* TAB 1: DASHBOARD OVERVIEW \*/\}[\s\S]*?(?=\{/\* TAB 2: TUTORIALS & VIDEO LIBRARY \*/\})',
    dashboard_html + '\n\n          ',
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Dashboard rewritten")
