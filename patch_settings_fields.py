import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

header_settings = """
                        <div className="pt-4 border-t border-theme">
                          <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Pengaturan Header Top</label>
                          <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <div className="relative">
                                <input 
                                  type="checkbox" 
                                  className="sr-only" 
                                  checked={academySettings.headerAutoScroll || false}
                                  onChange={(e) => setAcademySettings({...academySettings, headerAutoScroll: e.target.checked})}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${academySettings.headerAutoScroll ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${academySettings.headerAutoScroll ? 'translate-x-4' : 'translate-x-0'}`}></div>
                              </div>
                              <span className="text-xs font-bold text-primary">Auto Scroll Header (Scroll dengan konten)</span>
                            </label>
                            
                            <div>
                              <label className="text-[10px] font-bold text-secondary block mb-1.5 uppercase tracking-widest">Ukuran Header</label>
                              <div className="flex gap-3">
                                {['sm', 'md', 'lg'].map(size => (
                                  <button
                                    key={size}
                                    onClick={() => setAcademySettings({...academySettings, headerSize: size})}
                                    className={`flex-1 p-2 rounded-xl text-xs font-bold transition-colors ${academySettings.headerSize === size ? 'bg-blue-500 text-white' : 'neu-pressed text-secondary'}`}
                                  >
                                    {size === 'sm' ? 'Kecil' : size === 'md' ? 'Sedang' : 'Besar'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
"""

# Insert it after the upload background header block
code = re.sub(
    r'(<label className="text-\[10px\] font-bold text-secondary block mb-1\.5 uppercase tracking-widest">Upload Background Header</label>[\s\S]*?</button>\n                            \)}\n                          </div>\n                        </div>)',
    r'\1' + header_settings,
    code
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Settings fields added")
