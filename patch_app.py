import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Import the new function
code = code.replace("syncCoachToFirebase, deleteCoachFromFirebase }", "syncCoachToFirebase, deleteCoachFromFirebase, syncSettingsToFirebase }")

# Update useFirebaseSync call
code = code.replace("useFirebaseSync(setStudents, setSchedule, setNotifications, setCoaches);", "useFirebaseSync(setStudents, setSchedule, setNotifications, setCoaches, setAcademySettings);")

# Update settings save to call syncSettingsToFirebase
# The current settings save might be in a useEffect
new_settings_effect = """  // Sync settings to LocalStorage and Firebase
  useEffect(() => {
    localStorage.setItem('hoop_portal_settings', JSON.stringify(academySettings));
    if (user) syncSettingsToFirebase(academySettings);
  }, [academySettings, user]);"""

code = re.sub(r'useEffect\(\(\) => \{\s*localStorage\.setItem\(\'hoop_portal_settings\', JSON\.stringify\(academySettings\)\);\s*\}, \[academySettings\]\);', new_settings_effect, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("App.tsx patched")
