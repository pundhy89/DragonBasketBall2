import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

state_vars = """  const [importedCoachIds, setImportedCoachIds] = useState<string[]>([]);
  const [showImportedCoaches, setShowImportedCoaches] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);"""

code = code.replace("const [savedCards, setSavedCards] = useState<SavedCard[]>([]);", 
                    "const [savedCards, setSavedCards] = useState<SavedCard[]>([]);\n" + state_vars)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("State restored")
