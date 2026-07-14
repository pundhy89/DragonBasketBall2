import re
with open('src/components/FirebaseProvider.tsx', 'r') as f:
    code = f.read()

new_effect = """  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);"""

code = re.sub(r'useEffect\(\(\) => \{\n\s*const unsubscribe = auth\.onAuthStateChanged[\s\S]*?\}, \[\]\);', new_effect, code)
code = code.replace(', signInAnonymously', '')

with open('src/components/FirebaseProvider.tsx', 'w') as f:
    f.write(code)

print("Provider patched")
