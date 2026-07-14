import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

new_grid = """                {/* Grid Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { id: 'generator-student', label: 'Form Siswa Baru', subtitle: 'Pendaftaran', icon: <UserPlus className="w-7 h-7 text-white" />, color: 'from-[#ff8f71] to-[#ff3e5e]' },
                    { id: 'stats', label: 'Data Siswa & Kelas', subtitle: 'ID Card Siswa', icon: <Users className="w-7 h-7 text-white" />, color: 'from-[#71a0ff] to-[#3e68ff]' },
                    { id: 'schedule', label: 'Jadwal Latihan', subtitle: 'Kalender Sesi', icon: <Calendar className="w-7 h-7 text-white" />, color: 'from-[#42e8e0] to-[#0ea5e9]' },
                    { id: 'tutorials', label: 'Materi', subtitle: 'Video & Artikel', icon: <BookOpen className="w-7 h-7 text-white" />, color: 'from-[#c084fc] to-[#9333ea]' },
                    { id: 'attendance', label: 'Penilaian & Absensi', subtitle: 'Kehadiran', icon: <FileSpreadsheet className="w-7 h-7 text-white" />, color: 'from-[#ffb071] to-[#ff713e]' },
                    { id: 'generator-athlete', label: 'Form & Kartu Atlet', subtitle: 'Manajemen Atlet', icon: <Award className="w-7 h-7 text-white" />, color: 'from-[#38bdf8] to-[#0284c7]' },
                    { id: 'report', label: 'Raport', subtitle: 'Evaluasi', icon: <Trophy className="w-7 h-7 text-white" />, color: 'from-[#fbbf24] to-[#d97706]' },
                    { id: 'generator-coach', label: 'Generator Coach', subtitle: 'ID Card Coach', icon: <Shield className="w-7 h-7 text-white" />, color: 'from-[#f43f5e] to-[#be123c]' },
                    { id: 'coaches', label: 'Daftar Coach', subtitle: 'Direktori', icon: <User className="w-7 h-7 text-white" />, color: 'from-[#818cf8] to-[#4f46e5]' },
                    { id: 'notifications', label: 'Notifikasi', subtitle: 'Pesan Baru', icon: <Bell className="w-7 h-7 text-white" />, color: 'from-[#a78bfa] to-[#7c3aed]' }
                  ].map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id as any)}
                      className="bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-white/5"
                    >
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300`}>
                        {cat.icon}
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="text-sm md:text-base font-bold text-slate-800 dark:text-white block leading-tight">{cat.label}</span>
                        <span className="text-[11px] md:text-xs text-slate-500 font-medium">{cat.subtitle}</span>
                      </div>
                    </button>
                  ))}
                </div>"""

# Replace the grid categories part
code = re.sub(
    r'\{/\* Grid Categories \*/\}[\s\S]*?(?=\s*</div>\s*</div>\s*</motion\.div>)',
    new_grid,
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Dashboard style fixed")
