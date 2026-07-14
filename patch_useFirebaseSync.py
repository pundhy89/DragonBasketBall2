import re
with open('src/hooks/useFirebaseSync.ts', 'r') as f:
    code = f.read()

new_sync = """export const syncSettingsToFirebase = async (settings: any) => {
  try {
    const jsonString = JSON.stringify(settings);
    if (jsonString.length > 900000) {
      console.warn("Settings document is too large to sync to Firebase (exceeds 1MB). Syncing safe version.");
      const safeSettings = { ...settings };
      if (safeSettings.bannerUrl && safeSettings.bannerUrl.length > 300000) safeSettings.bannerUrl = '';
      if (safeSettings.logoUrl && safeSettings.logoUrl.length > 300000) safeSettings.logoUrl = '';
      await setDoc(doc(db, 'settings', 'global'), safeSettings, { merge: true });
      return;
    }
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/global`);
  }
};"""

code = re.sub(r'export const syncSettingsToFirebase = async \(settings: any\) => \{[\s\S]*?\};', new_sync, code)

with open('src/hooks/useFirebaseSync.ts', 'w') as f:
    f.write(code)

print("syncSettingsToFirebase patched")
