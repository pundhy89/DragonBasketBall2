const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove all injected buttons
const buttonRegex = /\s*<div className="p-4 border-t border-theme">[\s\S]*?<\/div>\s*<\/button>\s*<\/div>/g;
code = code.replace(buttonRegex, '');

// Re-insert correctly before </aside>
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

code = code.replace(/(<\/\s*aside>)/g, `${toggleButton}\n      $1`);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed');
