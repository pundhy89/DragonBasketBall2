with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if i == 502:  # Start skipping at line 503 (0-indexed 502)
        skip = True
    if i == 517:  # Stop skipping at line 518
        skip = False
    if not skip:
        new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
print("Lines 503-516 removed")
