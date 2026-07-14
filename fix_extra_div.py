with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if i == 616: # Line 617 is index 616
        continue # skip the extra </div>
    new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
print("Extra div removed")
