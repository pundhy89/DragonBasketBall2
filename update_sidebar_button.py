import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

sidebar_button_new = """  const SidebarButton = ({ id, icon, label, badge }: { id: any, icon: any, label: string, badge?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center justify-between transition-colors ${
        activeTab === id ? 'text-blue-500 font-bold' : 'hover:bg-white/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
      }`}
    >
      {activeTab === id && (
        <motion.div
          layoutId="sidebar-active-tab"
          className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className="flex items-center gap-3 relative z-10">
        {icon}
        {label}
      </div>
      {!!badge && badge > 0 && (
        <span className="relative z-10 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );"""

code = re.sub(r'const SidebarButton = \(\{ id, icon, label, badge \}: \{ id: any, icon: any, label: string, badge\?: number \}\) => \([\s\S]*?\</button>\n  \);', sidebar_button_new, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("SidebarButton updated")
