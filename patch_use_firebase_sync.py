import re
with open('src/hooks/useFirebaseSync.ts', 'r') as f:
    code = f.read()

code = re.sub(r'const { user } = useAuth\(\);\n\s*useEffect\(\(\) => \{\n\s*if \(!user\) return;', r'''useEffect(() => {''', code)
code = re.sub(r'import \{ useAuth \} from \'../components/FirebaseProvider\';\n', '', code)
code = re.sub(r'\[user, setStudents, setSchedule, setNotifications, setCoaches, setSettings\]', r'[setStudents, setSchedule, setNotifications, setCoaches, setSettings]', code)

with open('src/hooks/useFirebaseSync.ts', 'w') as f:
    f.write(code)

print("useFirebaseSync.ts patched")
