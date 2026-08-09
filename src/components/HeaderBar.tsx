import React from 'react';
import { AvatarState, AvatarTrait } from '../types/todo';
import { AvatarRenderer } from './AvatarRenderer';
import { getXPProgress } from '../utils/gameEngine';
import { Trophy, Volume2, VolumeX, Flame, Sparkles, Zap, Crown } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderBarProps {
  avatar: AvatarState;
  xp: number;
  streak: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  traits: AvatarTrait[];
  onOpenAvatarModal: () => void;
  onOpenAchievementsModal: () => void;
  onOpenSkillTreeModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  avatar,
  xp,
  streak,
  unlockedBadgesCount,
  totalBadgesCount,
  traits,
  onOpenAvatarModal,
  onOpenAchievementsModal,
  onOpenSkillTreeModal,
  isMuted,
  onToggleMute,
}) => {
  const xpInfo = getXPProgress(xp);
  const streakBonusPercent = Math.round(streak * 5);
  const activeTraitsCount = traits.filter((t) => t.unlocked).length;

  return (
    <header className="card-cozy p-4 sm:p-5 mb-6 bg-[#FFFDF9] relative overflow-hidden">
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
            title="Click to customize avatar & title!"
          >
            <div className="p-1 bg-amber-200 border-3 border-slate-800 rounded-2xl group-hover:bg-amber-300 transition-colors shadow-chunky-sm">
              <AvatarRenderer avatar={avatar} size={82} animate={true} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1 border-2 border-slate-800 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Player Name, Title & Level Bar */}
          <div className="flex-1 min-w-[200px] sm:min-w-[260px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 leading-tight">
                  {avatar.userName}
                </span>
                <span className="bg-amber-300 text-slate-900 border-2 border-slate-800 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-chunky-sm uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-800" />
                  {avatar.equippedTitle}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 font-mono">
                {Math.round(xpInfo.currentLevelXP)} / {Math.round(xpInfo.neededLevelXP)} XP
              </span>
            </div>

            {/* Level Badge & XP Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white border-2 border-slate-800 text-xs font-black px-2 py-0.5 rounded-xl shadow-chunky-sm">
                Lvl {xpInfo.level}
              </span>
              <div className="flex-1 h-4 bg-slate-100 border-2 border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 rounded-full transition-all duration-500 relative"
                  style={{ width: `${xpInfo.progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full h-1/2" />
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Total XP: {xp}</span>
              <span>Next Level: {xpInfo.nextXP} XP</span>
            </div>
          </div>
        </div>

        {/* Stats & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Streak Flame Counter */}
          <div
            className="flex items-center gap-2 bg-rose-50 border-3 border-slate-800 px-3.5 py-1.5 rounded-2xl shadow-chunky-sm"
            title={`Active Streak! +${streakBonusPercent}% XP Payout Bonus`}
          >
            <Flame className="w-5 h-5 text-rose-500 fill-rose-400 animate-pulse-glow" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 leading-tight">
                🔥 {streak} {streak === 1 ? 'Day' : 'Days'}
              </span>
              <span className="text-[10px] font-bold text-rose-600">
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
            className="btn-tactile bg-indigo-300 hover:bg-indigo-400 px-3.5 py-2 text-xs font-bold text-slate-900 flex items-center gap-1.5"
            title="View Skill Tree & Traits"
          >
            <Zap className="w-4 h-4 text-indigo-900 fill-indigo-400" />
            <span>Skills</span>
            <span className="bg-white/80 text-slate-900 border border-slate-800 rounded-lg px-1.5 py-0.2 text-[10px]">
              {activeTraitsCount}/{traits.length}
            </span>
          </button>

          {/* Achievements Cabinet Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenAchievementsModal();
            }}
            className="btn-tactile bg-amber-300 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-900 flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-800" />
            <span>Badges</span>
            <span className="bg-white/80 text-slate-900 border border-slate-800 rounded-lg px-1.5 py-0.2 text-[10px]">
              {unlockedBadgesCount}/{totalBadgesCount}
            </span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className={`btn-tactile p-2 text-slate-800 ${
              isMuted ? 'bg-slate-200' : 'bg-amber-200 hover:bg-amber-300'
            }`}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
