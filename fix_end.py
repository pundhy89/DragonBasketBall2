import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

# Replace the incorrect end
code = code.replace("    </>  );\n}", "    </div>\n  );\n}")

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Fixed end tag")
