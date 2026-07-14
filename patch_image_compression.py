import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add compression function
compression_fn = """
const compressImage = (file: File, maxWidth = 1200, maxHeight = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // compress with quality 0.6
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
"""

# Insert compressImage before App component
code = code.replace("export default function App() {", compression_fn + "\nexport default function App() {")

# Patch Logo upload
logo_upload_old = """                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setAcademySettings({...academySettings, logoUrl: reader.result as string});
                                    };
                                    reader.readAsDataURL(file);
                                  }"""
logo_upload_new = """                                  if (file) {
                                    compressImage(file, 400, 400).then(compressedDataUrl => {
                                      setAcademySettings({...academySettings, logoUrl: compressedDataUrl});
                                    }).catch(err => {
                                      console.error("Image compression failed:", err);
                                      alert("Gagal memproses gambar. Coba gambar lain.");
                                    });
                                  }"""
code = code.replace(logo_upload_old, logo_upload_new)

# Patch Banner upload
banner_upload_old = """                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setAcademySettings({...academySettings, bannerUrl: reader.result as string});
                                    };
                                    reader.readAsDataURL(file);
                                  }"""
banner_upload_new = """                                  if (file) {
                                    compressImage(file, 1600, 1000).then(compressedDataUrl => {
                                      setAcademySettings({...academySettings, bannerUrl: compressedDataUrl});
                                    }).catch(err => {
                                      console.error("Image compression failed:", err);
                                      alert("Gagal memproses gambar. Coba gambar lain.");
                                    });
                                  }"""
code = code.replace(banner_upload_old, banner_upload_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Image compression patched")
