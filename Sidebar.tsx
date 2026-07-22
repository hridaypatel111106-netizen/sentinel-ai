"use client";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Risk Intelligence", icon: "⚡" },
    { name: "Digital Twin", icon: "🌐" },
    { name: "AI Copilot", icon: "🤖" },
  ];

  return (
    <aside className="w-64 bg-[#080d18] border-r border-gray-800 p-6 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <h2 className="text-xl font-bold text-blue-400 mb-8">Sentinel AI</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab && setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === item.name
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}