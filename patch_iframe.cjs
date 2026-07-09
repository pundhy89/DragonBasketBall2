const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Update activeTab state type
code = code.replace(
  "useState<'dashboard' | 'tutorials' | 'stats' | 'report' | 'attendance' | 'schedule' | 'notifications' | 'settings' | 'coaches'>",
  "useState<'dashboard' | 'tutorials' | 'stats' | 'report' | 'attendance' | 'schedule' | 'notifications' | 'settings' | 'coaches' | 'generator-coach' | 'generator-athlete'>"
);

// 2. Replace desktop nav links
const desktopLinksOld = `<a
          href="https://creative-id-hub.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer hover:bg-[#1c1c28] text-slate-400"
        >
          <ExternalLink className="w-4 h-4" />
          Generator Kartu Pelatih
        </a>
        <a
          href="https://generatoratletcard.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer hover:bg-[#1c1c28] text-slate-400"
        >
          <ExternalLink className="w-4 h-4" />
          Generator Kartu Atlet
        </a>`;

const desktopLinksNew = `<button
          id="tab-btn-gen-coach"
          onClick={() => setActiveTab('generator-coach')}
          className={\`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer \${
            activeTab === 'generator-coach' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }\`}
        >
          <User className="w-4 h-4" />
          Generator Pelatih
        </button>
        <button
          id="tab-btn-gen-athlete"
          onClick={() => setActiveTab('generator-athlete')}
          className={\`text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer \${
            activeTab === 'generator-athlete' ? 'bg-gradient-to-r from-purple-700 to-orange-500 text-white shadow-md' : 'hover:bg-[#1c1c28] text-slate-400'
          }\`}
        >
          <Users className="w-4 h-4" />
          Generator Atlet
        </button>`;

code = code.replace(desktopLinksOld, desktopLinksNew);

// 3. Replace mobile nav links
const mobileLinksOld = `<a
                href="https://creative-id-hub.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center gap-3 transition-all hover:bg-[#1c1c28] text-slate-400"
              >
                <ExternalLink className="w-4 h-4" />
                Generator Kartu Pelatih
              </a>
              <a
                href="https://generatoratletcard.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center gap-3 transition-all hover:bg-[#1c1c28] text-slate-400"
              >
                <ExternalLink className="w-4 h-4" />
                Generator Kartu Atlet
              </a>`;

const mobileLinksNew = `<button
                onClick={() => {
                  setActiveTab('generator-coach');
                  setIsMobileMenuOpen(false);
                }}
                className={\`w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center gap-3 transition-all \${
                  activeTab === 'generator-coach' ? 'bg-gradient-to-r from-purple-900/40 to-orange-900/40 text-orange-500 border border-orange-500/30 font-bold' : 'hover:bg-[#1c1c28] text-slate-400'
                }\`}
              >
                <User className="w-4 h-4" />
                Generator Kartu Pelatih
              </button>
              <button
                onClick={() => {
                  setActiveTab('generator-athlete');
                  setIsMobileMenuOpen(false);
                }}
                className={\`w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center gap-3 transition-all \${
                  activeTab === 'generator-athlete' ? 'bg-gradient-to-r from-purple-900/40 to-orange-900/40 text-orange-500 border border-orange-500/30 font-bold' : 'hover:bg-[#1c1c28] text-slate-400'
                }\`}
              >
                <Users className="w-4 h-4" />
                Generator Kartu Atlet
              </button>`;

code = code.replace(mobileLinksOld, mobileLinksNew);

// 4. Add the iframe tabs contents before {/* TAB 8: SETTINGS */}
const iframeTabs = `
          {/* TAB: GENERATOR COACH */}
          {activeTab === 'generator-coach' && (
            <motion.div
              key="generator-coach"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-160px)] min-h-[600px] w-full"
            >
              <div className="max-w-7xl mx-auto h-full space-y-6">
                <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-2 h-full shadow-lg overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-[#2a2a35] flex items-center gap-2 shrink-0">
                    <User className="w-5 h-5 text-orange-500" /> 
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Generator Kartu Pelatih</h2>
                  </div>
                  <div className="flex-1 w-full bg-white relative rounded-b-2xl overflow-hidden">
                    <iframe 
                      src="https://creative-id-hub.vercel.app/" 
                      className="absolute inset-0 w-full h-full border-0"
                      title="Generator Kartu Pelatih"
                      allow="camera; microphone; fullscreen; display-capture; picture-in-picture; clipboard-write; clipboard-read"
                    ></iframe>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GENERATOR ATHLETE */}
          {activeTab === 'generator-athlete' && (
            <motion.div
              key="generator-athlete"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-160px)] min-h-[600px] w-full"
            >
              <div className="max-w-7xl mx-auto h-full space-y-6">
                <div className="bg-[#13131a] border border-[#2a2a35] rounded-3xl p-2 h-full shadow-lg overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-[#2a2a35] flex items-center gap-2 shrink-0">
                    <Users className="w-5 h-5 text-orange-500" /> 
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Generator Kartu Atlet</h2>
                  </div>
                  <div className="flex-1 w-full bg-white relative rounded-b-2xl overflow-hidden">
                    <iframe 
                      src="https://generatoratletcard.vercel.app/" 
                      className="absolute inset-0 w-full h-full border-0"
                      title="Generator Kartu Atlet"
                      allow="camera; microphone; fullscreen; display-capture; picture-in-picture; clipboard-write; clipboard-read"
                    ></iframe>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 8: SETTINGS */}`;

code = code.replace('{/* TAB 8: SETTINGS */}', iframeTabs);

fs.writeFileSync('src/App.tsx', code);
