import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  BarChart3, 
  Sparkles, 
  Palette, 
  Camera, 
  Lightbulb, 
  Settings,
  Package,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Main' },
  { id: 'inventory', label: 'Stok & Produk', icon: Package, category: 'Business' },
  { id: 'customers', label: 'Pelanggan', icon: Users, category: 'Business' },
  { id: 'finance', label: 'Keuangan', icon: Wallet, category: 'Finance' },
  { id: 'analytics', label: 'Analitik', icon: BarChart3, category: 'Finance' },
  { id: 'ai-tools', label: 'AI Content', icon: Sparkles, category: 'Marketing' },
  { id: 'marketing', label: 'Marketing', icon: MessageSquare, category: 'Marketing' },
  { id: 'branding', label: 'Branding', icon: Palette, category: 'Branding' },
  { id: 'creative', label: 'Creative', icon: Camera, category: 'Branding' },
  { id: 'strategy', label: 'Strategi Digital', icon: Lightbulb, category: 'Strategy' },
  { id: 'growth', label: 'Growth & Learning', icon: Trophy, category: 'Strategy' },
  { id: 'automation', label: 'Otomasi & Task', icon: Zap, category: 'System' },
  { id: 'business-profile', label: 'Profil Bisnis', icon: Users, category: 'System' },
  { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, category: 'System' },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200 sticky top-0 z-20"
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-50">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 font-bold text-xl text-slate-800 tracking-tight"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white">U</span>
            </div>
            <span>UMKM Sistem Pintar</span>
          </motion.div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-200 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide py-6">
        {['Main', 'Business', 'Finance', 'Marketing', 'Branding', 'Strategy', 'System'].map((cat) => {
          const itemsInCat = navItems.filter(i => i.category === cat);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {cat}
                </h3>
              )}
              {itemsInCat.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                        : 'hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <Icon size={18} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    {!collapsed && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        {!collapsed ? (
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Plan Saat Ini</p>
            <p className="font-semibold text-sm">Smart Tier</p>
            <button className="mt-3 w-full bg-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors">
              Upgrade Pro
            </button>
          </div>
        ) : (
          <button className="w-full h-10 flex items-center justify-center rounded-lg bg-slate-900 text-white">
            <Settings size={18} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
