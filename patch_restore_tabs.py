import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# The broken part is:
#         </header>
#
#           ;
#                   alert(`Kartu "${card.name}" berhasil diimport!`);
#                 }
#               }}
#               />
#             </motion.div>
#           )}
#
#           {/* TAB 4: STUDENT REPORT CARDS */}

broken_pattern = r'</header>\s*;\s*alert\(`Kartu "\$\{card\.name\}" berhasil diimport!`\);\s*\}\s*\}\}\s*/>\s*</motion\.div>\s*\)\}'

restored_tabs = """        </header>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{students.length}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Atlet</p>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{schedule.length}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sesi Latihan</p>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{notifications.length}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notifikasi</p>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl flex flex-col items-start gap-4 group hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{coaches.length}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pelatih Aktif</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: TUTORIALS & VIDEO LIBRARY */}
          {activeTab === 'tutorials' && (
            <motion.div
              key="tutorials"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <TutorialViewer />
            </motion.div>
          )}

          {/* TAB 3: STUDENT SKILLS RATINGS */}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <StudentStats 
                students={students}
                setStudents={setStudents}
                coaches={coaches}
                savedCards={savedCards}
                onSaveCard={(card) => setSavedCards([...savedCards, card])}
                onImportCard={(card) => {
                  if (!students.find(s => s.id === card.studentId)) {
                    const newStudent = {
                      id: card.studentId,
                      name: card.name,
                      position: card.position,
                      height: card.height,
                      weight: card.weight,
                      age: card.age,
                      avatar: card.avatar,
                      fullBodyPhoto: card.fullBodyPhoto,
                      parentName: card.parentName,
                      parentPhone: card.parentPhone,
                      parentEmail: '',
                      notes: '',
                      classLevel: 'SMP',
                      attendanceHistory: {},
                      skills: { dribbling: 50, shooting: 50, passing: 50, defense: 50, physical: 50, teamwork: 50 }
                    };
                    setStudents([...students, newStudent]);
                    if (user) syncStudentToFirebase(newStudent);
                    alert(`Kartu "${card.name}" berhasil diimport!`);
                  }
                }}
              />
            </motion.div>
          )}"""

code = re.sub(broken_pattern, restored_tabs, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Tabs restored")
