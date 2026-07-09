const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'ExternalLink\n} from \'lucide-react\';',
  'ExternalLink,\n  Download,\n  Trash2,\n  Edit3\n} from \'lucide-react\';'
);

const oldCoachesSection = `                  <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2"><User className="w-6 h-6 text-orange-500" /> Daftar Pelatih</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coaches.map(coach => (
                      <div key={coach.id} className="bg-[#1c1c28] border border-[#2a2a35] rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full border border-orange-500/30 overflow-hidden shrink-0 bg-[#13131a]">
                          {coach.avatar?.startsWith('http') || coach.avatar?.startsWith('data:') ? (
                            <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">{coach.avatar || '👤'}</div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{coach.name}</h3>
                          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{coach.role}</p>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{coach.specialty}</p>
                        </div>
                      </div>
                    ))}
                  </div>`;

const newCoachesSection = `                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2"><User className="w-6 h-6 text-orange-500" /> Daftar Pelatih</h2>
                    <a href="https://creative-id-hub.vercel.app/list" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:opacity-90 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-opacity text-xs uppercase tracking-widest shadow-lg">
                      <Download className="w-4 h-4" /> Import Kartu
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {coaches.map(coach => (
                      <div key={coach.id} className="relative group rounded-3xl overflow-hidden border border-[#2a2a35] bg-[#1c1c28] aspect-[900/550] shadow-xl">
                        {coach.avatar?.startsWith('http') || coach.avatar?.startsWith('data:') ? (
                          <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1c1c28] to-[#13131a]">
                            <div className="text-5xl mb-4">{coach.avatar || '👤'}</div>
                            <h3 className="text-white font-bold text-xl">{coach.name}</h3>
                            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mt-2">{coach.role}</p>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm z-10">
                          <a href={\`https://creative-id-hub.vercel.app/?id=\${coach.id}\`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white p-3.5 rounded-2xl transition-colors shadow-lg" title="Edit Kartu">
                            <Edit3 className="w-6 h-6" />
                          </a>
                          <button onClick={() => {
                            if (confirm(\`Hapus kartu pelatih \${coach.name}?\`)) {
                              deleteCoachFromFirebase(coach.id);
                            }
                          }} className="bg-red-500 hover:bg-red-600 text-white p-3.5 rounded-2xl transition-colors shadow-lg" title="Hapus Kartu">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>`;

code = code.replace(oldCoachesSection, newCoachesSection);
fs.writeFileSync('src/App.tsx', code);
