const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add Sun/Moon icon imports if missing
if (!code.includes('Sun,')) {
    code = code.replace(/import\s*{\s*([^}]+)\s*}\s*from\s*'lucide-react';/, (match, group1) => {
        return `import { Sun, Moon, ${group1} } from 'lucide-react';`;
    });
}

// Sidebar toggle button
const toggleButton = `
        <div className="p-4 border-t border-theme">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center justify-between transition-all hover:bg-secondary/80 text-secondary border border-transparent neu-button"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </div>
          </button>
        </div>
`;

// Insert at end of desktop sidebar
code = code.replace(/(\{\/\* Mobile Header \*\/\})/g, `${toggleButton}\n      </aside>\n\n      $1`);
// Actually, it's safer to find the end of the aside tag.
// We can just add it before `</aside>`
code = code.replace(/(<\/\s*aside>)/g, `${toggleButton}\n      $1`);

fs.writeFileSync('src/App.tsx', code);
console.log('Toggle button added');
