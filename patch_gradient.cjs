const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

const gradientClass = `
  .bg-soft-gradient {
    background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  }
  
  .dark .bg-soft-gradient {
    background: linear-gradient(135deg, #2D1B4E 0%, #1a365d 100%);
  }

  .split-bg {
    background: transparent;
  }
  
  .dark .split-bg {
    background: transparent;
  }
`;

css = css.replace(/\.split-bg\s*\{\s*background:.*?\s*\}/s, gradientClass.trim());
css = css.replace(/\.dark\s*\.split-bg\s*\{\s*background:.*?\s*\}/s, ''); // Already handled in the replacement above if it matches well, but let's just append it to the end instead to be safe.

// Better way: append to the end of index.css
let cleanCss = fs.readFileSync('src/index.css', 'utf-8');
cleanCss += '\n\n' + gradientClass;

fs.writeFileSync('src/index.css', cleanCss);
console.log('Gradient added');
