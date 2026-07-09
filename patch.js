const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Update activeTab state type
code = code.replace(
  "useState<'dashboard' | 'tutorials' | 'stats' | 'report' | 'attendance' | 'schedule' | 'notifications' | 'settings'>",
  "useState<'dashboard' | 'tutorials' | 'stats' | 'report' | 'attendance' | 'schedule' | 'notifications' | 'settings' | 'coaches'>"
);

// 2. Add Settings to the top left for desktop
code = code.replace(
  '          {/* Logo Brand Info */}\n          <div className="flex items-center gap-4 cursor-pointer relative z-10 group" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} title="Buka Menu">',
  `          {/* Logo Brand Info */}\n          <div className="flex items-center gap-6">\n            <div className="flex items-center gap-4 cursor-pointer relative z-10 group" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} title="Buka Menu">`
);

code = code.replace(
  '                {academySettings.location}\n              </p>\n            </div>\n          </div>',
  `                {academySettings.location}\n              </p>\n            </div>\n          </div>\n          <button onClick={() => setActiveTab('settings')} className="hidden lg:flex items-center justify-center w-12 h-12 bg-[#13131a]/80 backdrop-blur-md rounded-2xl border border-[#2a2a35] hover:border-orange-500/50 hover:text-orange-500 transition-colors text-slate-400 shadow-lg cursor-pointer z-50">\n            <Settings className="w-5 h-5" />\n          </button>\n          </div>`
);

// 3. Desktop bottom navbar: Change Settings to Coaches
code = code.replace(
  `<button\n          id="tab-btn-settings"\n          onClick={() => setActiveTab('settings')}\n          className={\`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer \${\n            activeTab === 'settings' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'\n          }\`}\n        >\n          <Settings className="w-4 h-4" />\n          Pengaturan\n        </button>`,
  `<button\n          id="tab-btn-coaches"\n          onClick={() => setActiveTab('coaches')}\n          className={\`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer \${\n            activeTab === 'coaches' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'\n          }\`}\n        >\n          <User className="w-4 h-4" />\n          Pelatih\n        </button>`
);

// 4. Mobile drawer: Add Settings
code = code.replace(
  `                { id: 'schedule', label: 'Jadwal Latihan Rutin', icon: Calendar },\n                { id: 'notifications', label: 'Notifikasi Orang Tua', icon: MessageSquare }`,
  `                { id: 'schedule', label: 'Jadwal Latihan Rutin', icon: Calendar },\n                { id: 'notifications', label: 'Notifikasi Orang Tua', icon: MessageSquare },\n                { id: 'settings', label: 'Pengaturan Akademi', icon: Settings }`
);

// 5. Mobile bottom navbar: Change Settings to Coaches
code = code.replace(
  `        <button\n          onClick={() => setActiveTab('settings')}\n          className={\`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 \${activeTab === 'settings' ? 'text-orange-500' : 'text-slate-500'}\`}\n        >\n          <Settings className="w-5 h-5" />\n          <span className="text-[9px] font-bold">Pengaturan</span>\n        </button>`,
  `        <button\n          onClick={() => setActiveTab('coaches')}\n          className={\`flex flex-col items-center justify-center w-16 pb-2 pt-1 gap-1 \${activeTab === 'coaches' ? 'text-orange-500' : 'text-slate-500'}\`}\n        >\n          <User className="w-5 h-5" />\n          <span className="text-[9px] font-bold">Pelatih</span>\n        </button>`
);

// 6. Add Coaches tab content placeholder (since we don't have CoachesManager yet, just a simple view)
code = code.replace(
  `          {/* TAB 8: SETTINGS */}`,
  `          {/* TAB: COACHES */}\n          {activeTab === 'coaches' && (\n            <motion.div\n              key="coaches"\n              initial={{ opacity: 0, y: 15 }}\n              animate={{ opacity: 1, y: 0 }}\n              exit={{ opacity: 0, y: -15 }}\n              transition={{ duration: 0.3 }}\n            >\n              <div className="max-w-7xl mx-auto space-y-6">\n                <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-6 md:p-8 shadow-lg">\n                  <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2"><User className="w-6 h-6 text-orange-500" /> Daftar Pelatih</h2>\n                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n                    {coaches.map(coach => (\n                      <div key={coach.id} className="bg-[#1c1c28] border border-[#2a2a35] rounded-2xl p-6 flex items-start gap-4">\n                        <div className="w-16 h-16 rounded-full border border-orange-500/30 overflow-hidden shrink-0 bg-[#13131a]">\n                          {coach.avatar?.startsWith('http') || coach.avatar?.startsWith('data:') ? (\n                            <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />\n                          ) : (\n                            <div className="w-full h-full flex items-center justify-center text-2xl">{coach.avatar || '👤'}</div>\n                          )}\n                        </div>\n                        <div>\n                          <h3 className="text-white font-bold text-lg">{coach.name}</h3>\n                          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{coach.role}</p>\n                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{coach.specialty}</p>\n                        </div>\n                      </div>\n                    ))}\n                  </div>\n                </div>\n              </div>\n            </motion.div>\n          )}\n\n          {/* TAB 8: SETTINGS */}`
);

fs.writeFileSync('src/App.tsx', code);
