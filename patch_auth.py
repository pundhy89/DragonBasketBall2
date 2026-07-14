import re
with open('src/components/FirebaseProvider.tsx', 'r') as f:
    code = f.read()

if 'signInAnonymously' not in code:
    code = code.replace("import { User, signInWithPopup, GoogleAuthProvider, signOut }", "import { User, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously }")

new_effect = """  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setLoading(false);
      } else {
        signInAnonymously(auth).catch(err => {
          console.error('Error anonymous auth', err);
          setLoading(false);
        });
      }
    });
    return unsubscribe;
  }, []);"""

code = re.sub(r'useEffect\(\(\) => \{\s*const unsubscribe = auth\.onAuthStateChanged[\s\S]*?\}, \[\]\);', new_effect, code)

with open('src/components/FirebaseProvider.tsx', 'w') as f:
    f.write(code)

print("Auth patched")
