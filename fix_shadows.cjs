const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

// Use rgba for shadows so it blends perfectly
const newShadowsLight = `
    --neu-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8);
    --neu-shadow-sm: 4px 4px 8px rgba(163, 177, 198, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.7);
    --neu-inner: inset 4px 4px 8px rgba(163, 177, 198, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.7);
    --neu-shadow-active: inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.8);
`;

const newShadowsDark = `
    --neu-shadow: 8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05);
    --neu-shadow-sm: 4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05);
    --neu-inner: inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(255, 255, 255, 0.05);
    --neu-shadow-active: inset 6px 6px 12px rgba(0, 0, 0, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 0.05);
`;

css = css.replace(/--neu-shadow: 8px 8px 16px #d1d9e6[^;]+;[\s\S]*?--neu-shadow-active:[^;]+;/, newShadowsLight.trim());
css = css.replace(/--neu-shadow: 8px 8px 16px #16171b[^;]+;[\s\S]*?--neu-shadow-active:[^;]+;/, newShadowsDark.trim());

fs.writeFileSync('src/index.css', css);
console.log('Shadows fixed');
