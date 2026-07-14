import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Update initial academySettings
old_settings = """    return saved ? JSON.parse(saved) : {
        logoIcon: '🏀',
        logoUrl: '',
        title: 'Hoop Portal',
        subtitle: 'Basketball Academy',
        location: 'Jakarta Selatan',
        bannerUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop'
    }"""

new_settings = """    return saved ? JSON.parse(saved) : {
        logoIcon: '🏀',
        logoUrl: '',
        title: 'Hoop Portal',
        subtitle: 'Basketball Academy',
        location: 'Jakarta Selatan',
        bannerUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop',
        headerBgUrl: '',
        headerAutoScroll: false,
        headerSize: 'md'
    }"""

code = code.replace(old_settings, new_settings)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Settings state patched")
