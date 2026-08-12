import React from 'react';
import { ListTodo, User, Swords, Trophy, Settings } from 'lucide-react';
import { sounds } from '../utils/audio';

export type NavigationTab = 'quests' | 'avatar' | 'challenges' | 'badges' | 'settings';

interface ResponsiveNavBarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
}

export const ResponsiveNavBar: React.FC<ResponsiveNavBarProps> = ({
  activeTab,
  onSelectTab,
  unlockedBadgesCount,
  totalBadgesCount,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode; badgeCount?: string }[] = [
    { id: 'quests', label: 'Quests', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'avatar', label: 'Avatar', icon: <User className="w-5 h-5" /> },
    { id: 'challenges', label: 'Bosses', icon: <Swords className="w-5 h-5" /> },
    {
      id: 'badges',
      label: 'Badges',
      icon: <Trophy className="w-5 h-5" />,
      badgeCount: `${unlockedBadgesCount}/${totalBadgesCount}`,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* DESKTOP TOP NAVBAR (hidden on mobile <768px) */}
      <div className="hidden md:flex items-center gap-2 mb-6 border-b-4 border-slate-800 dark:border-indigo-500/40 pb-3">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playPop();
                onSelectTab(tab.id);
              }}
              className={`btn-tactile px-5 py-2.5 text-sm font-black flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white shadow-chunky-sm translate-y-[-2px]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-amber-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badgeCount && (
                <span className="bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-800 px-1.5 py-0.2 rounded-lg text-[10px]">
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (hidden on desktop ≥768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-4 border-slate-800 dark:border-indigo-500/50 shadow-chunky-lg px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playPop();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center min-h-[48px] px-3 py-1 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white font-black shadow-chunky-sm translate-y-[-2px]'
                  : 'text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
