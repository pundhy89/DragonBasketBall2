const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const toggleButton = `
        <div className="p-4 border-t border-theme mt-auto">
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

code = code.replace(/(<\/\s*motion.div>\s*)\{\/\* Mobile Bottom Nav \*\/\}/g, `${toggleButton}\n          $1{/* Mobile Bottom Nav */}`);
fs.writeFileSync('src/App.tsx', code);
console.log('Mobile toggle added');
