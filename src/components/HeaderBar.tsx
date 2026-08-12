import React from 'react';
import { UserProfile, AvatarState, AvatarTrait, UserSettings } from '../types/todo';
import { FullBodyAvatarRenderer } from './FullBodyAvatarRenderer';
import { getXPProgress } from '../utils/gameEngine';
import { Trophy, Settings, Flame, Sparkles, Zap, Crown } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderBarProps {
  user: UserProfile;
  settings: UserSettings;
  avatar: AvatarState;
  xp: number;
  streak: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  traits: AvatarTrait[];
  onOpenAvatarModal: () => void;
  onOpenAchievementsModal: () => void;
  onOpenSkillTreeModal: () => void;
  onOpenSettingsModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  user,
  settings,
  avatar,
  xp,
  streak,
  unlockedBadgesCount,
  totalBadgesCount,
  traits,
  onOpenAvatarModal,
  onOpenAchievementsModal,
  onOpenSkillTreeModal,
  onOpenSettingsModal,
}) => {
  const xpInfo = getXPProgress(xp);
  const streakBonusPercent = Math.round(streak * 5);
  const activeTraitsCount = traits.filter((t) => t.unlocked).length;
  const isDark = settings.theme === 'dark';

  return (
    <header
      className={`card-cozy p-4 sm:p-5 mb-6 relative overflow-hidden transition-colors ${
        isDark
          ? 'bg-slate-900 border-indigo-500/50 text-slate-100 shadow-[4px_4px_0px_0px_rgba(99,102,241,0.4)]'
          : 'bg-[#FFFDF9] border-slate-800 text-slate-900 shadow-chunky'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Avatar & Player Info */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Avatar Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenAvatarModal();
            }}
            className="group relative focus:outline-none"
            title="Click to open pirate closet studio!"
          >
            <div className="p-1.5 bg-amber-200 dark:bg-slate-800 border-3 border-slate-800 dark:border-indigo-400 rounded-2xl group-hover:bg-amber-300 transition-colors shadow-chunky-sm overflow-hidden flex items-center justify-center">
              <FullBodyAvatarRenderer avatar={avatar} size={90} animate={true} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border-2 border-slate-800 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Player Name, Title & Level Bar */}
          <div className="flex-1 min-w-[200px] sm:min-w-[260px]">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-base font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user.username}
              </span>
              <span className="bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white border-2 border-slate-800 dark:border-indigo-400 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-chunky-sm uppercase flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-800 dark:text-amber-300" />
                {avatar.equippedTitle}
              </span>
            </div>

            {/* Level Badge & XP Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white border-2 border-slate-800 dark:border-indigo-400 text-xs font-black px-2 py-0.5 rounded-xl shadow-chunky-sm">
                Lvl {xpInfo.level}
              </span>
              <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-800 dark:border-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 rounded-full transition-all duration-500 relative"
                  style={{ width: `${xpInfo.progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full h-1/2" />
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Total XP: {xp}</span>
              <span>Next Level: {xpInfo.nextXP} XP</span>
            </div>
          </div>
        </div>

        {/* Stats & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Streak Flame Counter */}
          <div
            className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/50 border-3 border-slate-800 dark:border-rose-500/40 px-3 py-1.5 rounded-2xl shadow-chunky-sm"
            title={`Active Streak! +${streakBonusPercent}% XP Payout Bonus`}
          >
            <Flame className="w-5 h-5 text-rose-500 fill-rose-400 animate-pulse-glow" />
            <div className="flex flex-col">
              <span className="text-xs font-black leading-tight">
                🔥 {streak} {streak === 1 ? 'Day' : 'Days'}
              </span>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                +{streakBonusPercent}% XP
              </span>
            </div>
          </div>

          {/* Skill Tree Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenSkillTreeModal();
            }}
            className="btn-tactile bg-indigo-300 dark:bg-indigo-700 text-slate-900 dark:text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            title="View Skill Tree & Traits"
          >
            <Zap className="w-4 h-4 text-indigo-900 dark:text-indigo-200 fill-indigo-400" />
            <span>Skills</span>
            <span className="bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-800 rounded-lg px-1.5 py-0.2 text-[10px]">
              {activeTraitsCount}/{traits.length}
            </span>
          </button>

          {/* Achievements Cabinet Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenAchievementsModal();
            }}
            className="btn-tactile bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1"
          >
            <Trophy className="w-4 h-4 text-amber-800 dark:text-amber-200" />
            <span>Badges</span>
            <span className="bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-800 rounded-lg px-1.5 py-0.2 text-[10px]">
              {unlockedBadgesCount}/{totalBadgesCount}
            </span>
          </button>

          {/* Settings Modal Launcher Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenSettingsModal();
            }}
            className="btn-tactile p-2 bg-indigo-200 dark:bg-indigo-800 text-slate-900 dark:text-white hover:bg-indigo-300"
            title="Open Settings Overlay"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
