import re
with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
"""                </button>
            </div>
            </div>
        </header>""",
"""                </button>
            </div>
        </header>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Fixed extra div")
