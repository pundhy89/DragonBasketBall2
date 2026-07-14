with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if '<div className="p-4 border-t border-theme">' in line:
        skip = True
    
    if skip and '</div>' in line and '<div' not in line:
        # We need a robust way to remove the duplicated buttons
        pass

# Actually let's just do a string replacement.
