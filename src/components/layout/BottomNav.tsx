import React from 'react';
import { Home, BookOpen, Bot, PlusCircle, ShieldCheck, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'directory' | 'guides' | 'emergency' | 'bot' | 'submit' | 'admin';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingSubmissionsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingSubmissionsCount = 0
}) => {
  interface NavItem {
    id: TabType;
    label: string;
    icon: React.ElementType;
    highlight?: boolean;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'directory', label: 'Annuaire', icon: Home },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'emergency', label: 'Urgences', icon: PhoneCall, highlight: true },
    { id: 'bot', label: 'PocketBot', icon: Bot },
    { id: 'submit', label: 'Proposer', icon: PlusCircle },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badge: pendingSubmissionsCount }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav px-2 py-1.5 sm:px-4">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as TabType)}
              className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? item.highlight
                    ? 'text-sos-400 font-bold'
                    : 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className={`absolute inset-0 rounded-xl ${
                    item.highlight ? 'bg-sos-500/10' : 'bg-amber-500/10'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-0.5 font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
