const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

// Update split-bg to be responsive: on mobile 35% left, on desktop maybe not needed because sidebar takes space, but we can just apply it to the main content wrapper.
const splitBg = `
  .split-bg {
    background: linear-gradient(to right, var(--bg-primary) 35%, var(--bg-accent) 35%);
  }
  
  .dark .split-bg {
    background: linear-gradient(to right, var(--bg-primary) 35%, var(--bg-accent) 35%);
  }
`;

css = css.replace(/\.split-bg\s*\{\s*background:.*?\s*\}/s, splitBg.trim());

fs.writeFileSync('src/index.css', css);
console.log('split-bg updated');
