import React from 'react';
import { UserProfile, AvatarState, AvatarTrait, UserSettings } from '../types/todo';
import { FullBodyAvatarRenderer } from './FullBodyAvatarRenderer';
import { getXPProgress } from '../utils/gameEngine';
import { sounds } from '../utils/audio';

export type ActiveTab = 'quests' | 'projects' | 'avatar' | 'challenges' | 'badges';
export type MainNavTab = ActiveTab;

interface HeaderBarProps {
  user: UserProfile;
  settings: UserSettings;
  avatar: AvatarState;
  xp: number;
  streak: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  traits: AvatarTrait[];
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenSettingsModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  user,
  avatar,
  xp,
  streak,
  activeTab,
  onSelectTab,
  onOpenSettingsModal,
}) => {
  const xpInfo = getXPProgress(xp);

  return (
    <header className="relative z-30 w-full border-b-4 border-slate-800 bg-[#0f172a] shadow-xl transition-colors duration-200 mb-6 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* 1. Upscaled Avatar Emblem & User Profile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sounds.playPop();
              onSelectTab('avatar');
            }}
            className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl border-4 border-slate-700 bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 p-1.5 shadow-[4px_4px_0px_0px_#020617] hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer z-10"
            title="Open Avatar Studio"
          >
            <FullBodyAvatarRenderer avatar={avatar} size={75} animate={true} />
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-800 bg-indigo-600 text-xs font-black text-white shadow-sm">
              ✨
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                {user.username || 'Hero Alex'}
              </h2>
              <span className="rounded-xl border border-slate-700 bg-indigo-600 px-2.5 py-0.5 text-xs font-black text-white uppercase shadow-sm">
                LVL {xpInfo.level}
              </span>
            </div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-400 mt-0.5">
              {user.primaryClass} Class
            </p>
          </div>
        </div>

        {/* 2. Compact XP Level Bar */}
        <div className="w-full sm:w-64 max-w-xs">
          <div className="flex justify-between text-xs font-black text-slate-300 mb-1">
            <span>XP PROGRESS</span>
            <span>{xpInfo.currentLevelXP} / {xpInfo.neededLevelXP} XP</span>
          </div>
          <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-slate-700 bg-[#1e293b] p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, xpInfo.progressPercent))}%` }}
            />
          </div>
        </div>

        {/* 3. Streak Badge & Settings Trigger */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] px-3 py-2 text-xs font-black text-amber-400 shadow-[2px_2px_0px_0px_#020617]">
            <span className="text-sm">🔥</span>
            <span>{streak} Days</span>
          </div>

          {/* Settings Trigger Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sounds.playPop();
              onOpenSettingsModal();
            }}
            className="flex items-center justify-center h-10 w-10 shrink-0 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-slate-100 shadow-[2px_2px_0px_0px_#020617] hover:bg-slate-700 active:translate-y-0.5 transition-all cursor-pointer z-20"
            title="Open Settings Modal"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* 4. Midnight Navigation Tab Bar */}
      <div className="w-full border-t-2 border-slate-800 bg-[#0b0f19] px-4 py-2 mt-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'quests', label: '📋 Quests' },
            { id: 'projects', label: '📁 Project Folders' },
            { id: 'avatar', label: '🥋 Avatar Studio' },
            { id: 'challenges', label: '⚔️ Bosses & Challenges' },
            { id: 'badges', label: '🏆 Badges' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sounds.playPop();
                onSelectTab(tab.id as ActiveTab);
              }}
              className={`rounded-xl border-2 border-slate-700 px-4 py-2 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_#020617]'
                  : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
