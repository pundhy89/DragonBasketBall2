const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.neu-flat\s*\{/, '.neu-flat {\n    color: var(--text-primary);');
css = css.replace(/\.neu-flat-sm\s*\{/, '.neu-flat-sm {\n    color: var(--text-primary);');
css = css.replace(/\.neu-pressed\s*\{/, '.neu-pressed {\n    color: var(--text-primary);');

fs.writeFileSync('src/index.css', css);
console.log('Text color added to neu classes');
