const fs = require('fs');

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@500;700;900&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  --font-display: "Outfit", sans-serif;
}

@layer base {
  :root {
    --bg-primary: #F0F3F8;
    --bg-secondary: #E4EBF5;
    --bg-accent: #3b82f6;
    
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    
    --border-color: #d1d5db;
    
    --neu-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
    --neu-shadow-sm: 4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff;
    --neu-inner: inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff;
    
    --neu-shadow-active: inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff;
  }

  .dark {
    --bg-primary: #1E1E24;
    --bg-secondary: #25262C;
    --bg-accent: #3b82f6;
    
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    
    --border-color: #334155;
    
    --neu-shadow: 8px 8px 16px #16171b, -8px -8px 16px #26262d;
    --neu-shadow-sm: 4px 4px 8px #16171b, -4px -4px 8px #26262d;
    --neu-inner: inset 4px 4px 8px #16171b, inset -4px -4px 8px #26262d;
    
    --neu-shadow-active: inset 6px 6px 12px #16171b, inset -6px -6px 12px #26262d;
  }
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Custom classes for Neumorphism */
@layer utilities {
  .neu-flat {
    background-color: var(--bg-secondary);
    box-shadow: var(--neu-shadow);
    border-radius: 1.5rem;
  }
  .neu-flat-sm {
    background-color: var(--bg-secondary);
    box-shadow: var(--neu-shadow-sm);
    border-radius: 1rem;
  }
  .neu-pressed {
    background-color: var(--bg-secondary);
    box-shadow: var(--neu-shadow-active);
    border-radius: 1rem;
  }
  .neu-button {
    background-color: var(--bg-secondary);
    box-shadow: var(--neu-shadow-sm);
    border-radius: 1rem;
    transition: all 0.2s ease;
  }
  .neu-button:hover {
    box-shadow: var(--neu-shadow);
  }
  .neu-button:active {
    box-shadow: var(--neu-shadow-active);
  }
  
  .neu-button-accent {
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    box-shadow: 4px 4px 10px rgba(59, 130, 246, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 1rem;
    transition: all 0.2s ease;
  }
  .neu-button-accent:hover {
    box-shadow: 6px 6px 14px rgba(59, 130, 246, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.1);
  }
  .neu-button-accent:active {
    box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.2);
  }

  .split-bg {
    background: linear-gradient(to right, var(--bg-primary) 50%, var(--bg-accent) 50%);
  }

  .text-primary {
    color: var(--text-primary);
  }
  .text-secondary {
    color: var(--text-secondary);
  }
  .bg-primary {
    background-color: var(--bg-primary);
  }
  .bg-secondary {
    background-color: var(--bg-secondary);
  }
  .border-theme {
    border-color: var(--border-color);
  }
}

/* Custom scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 9999px;
  opacity: 0.5;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--bg-accent);
}
`;

fs.writeFileSync('src/index.css', css);
console.log('Styles updated');
