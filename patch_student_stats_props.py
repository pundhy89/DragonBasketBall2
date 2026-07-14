import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

bad_props = r'<StudentStats\s+students=\{students\}\s+setStudents=\{setStudents\}\s+coaches=\{coaches\}\s+savedCards=\{savedCards\}\s+onSaveCard=\{\(card\) => setSavedCards\(\[\.\.\.savedCards, card\]\)\}\s+onImportCard=\{\(card\) => \{[\s\S]*?\}\}\s+/>'

good_props = """<StudentStats 
                students={students}
                selectedStudentId={selectedStudentId}
                onSelectStudent={setSelectedStudentId}
                coaches={coaches}
                onAddStudent={(newStudent) => {
                  const student = { ...newStudent, id: Date.now().toString(), attendanceHistory: {} } as Student;
                  setStudents([...students, student]);
                  if (user) syncStudentToFirebase(student);
                }}
                onUpdateStudent={(id, data) => {
                  setStudents(students.map(s => s.id === id ? { ...s, ...data } : s));
                  const updatedStudent = { ...students.find(s => s.id === id), ...data } as Student;
                  if (updatedStudent && user) syncStudentToFirebase(updatedStudent);
                }}
                onDeleteStudent={(id) => {
                  setStudents(students.filter(s => s.id !== id));
                  if (user) deleteStudentFromFirebase(id);
                }}
                onUpdateSkills={(id, skills, notes, evaluatedBy) => {
                  setStudents(students.map(s => s.id === id ? { ...s, skills, notes, evaluatedBy } : s));
                  const updatedStudent = { ...students.find(s => s.id === id), skills, notes, evaluatedBy } as Student;
                  if (updatedStudent && user) syncStudentToFirebase(updatedStudent);
                }}
              />"""

code = re.sub(bad_props, good_props, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Props fixed")
