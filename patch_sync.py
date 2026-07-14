import re
with open('src/hooks/useFirebaseSync.ts', 'r') as f:
    code = f.read()

# Add setSettings to useFirebaseSync
code = code.replace(
    "setCoaches: React.Dispatch<React.SetStateAction<Coach[]>>",
    "setCoaches: React.Dispatch<React.SetStateAction<Coach[]>>,\n  setSettings: React.Dispatch<React.SetStateAction<any>>"
)

# Add onSnapshot for settings
settings_snapshot = """    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));"""

code = code.replace("    const unsubCoaches = ", settings_snapshot + "\n    const unsubCoaches = ")
code = code.replace("unsubCoaches();", "unsubCoaches();\n      unsubSettings();")
code = code.replace("setCoaches]);", "setCoaches, setSettings]);")

# Add syncSettingsToFirebase
sync_settings = """
export const syncSettingsToFirebase = async (settings: any) => {
  try {
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/global`);
  }
};
"""
code += sync_settings

with open('src/hooks/useFirebaseSync.ts', 'w') as f:
    f.write(code)

print("useFirebaseSync patched")
