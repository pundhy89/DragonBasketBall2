const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const themeState = `
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hoop_portal_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('hoop_portal_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
`;

code = code.replace(
  'const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);',
  'const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n' + themeState
);

fs.writeFileSync('src/App.tsx', code);
console.log('Theme state added');
