import React from 'react';
import { CategoryChallenge, CustomCategory } from '../types/todo';
import { getCategoryInfo } from '../utils/gameEngine';
import { Swords, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BossAndDailySectionProps {
  challenges: CategoryChallenge[];
  customCategories: CustomCategory[];
  onClaimReward: (id: string) => void;
}

export const BossAndDailySection: React.FC<BossAndDailySectionProps> = ({
  challenges,
  customCategories,
  onClaimReward,
}) => {
  const dailyChallenges = challenges.filter((c) => c.type === 'daily');
  const bossChallenges = challenges.filter((c) => c.type === 'boss');
  const activeWeekSeed = challenges.length > 0 ? challenges[0].assignedWeekSeed : 0;

  return (
    <div className="space-y-6 animate-pop-in max-w-full overflow-hidden">
      {/* Category Boss Battles Section */}
      <div className="w-full rounded-3xl border-4 border-indigo-500/50 bg-[#0f172a] p-5 shadow-[0_0_20px_rgba(99,102,241,0.2)] text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 border-2 border-slate-700 rounded-2xl text-white shrink-0 shadow-sm">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Weekly Class Bosses</h2>
              <p className="text-xs text-slate-400 font-bold">
                Defeat bosses to earn massive XP rewards!
              </p>
            </div>
          </div>

          <span className="rounded-xl border border-indigo-500/40 bg-[#1e293b] px-3 py-1 text-xs font-black text-indigo-300 shrink-0">
            Week #{activeWeekSeed}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-full overflow-hidden">
          {bossChallenges.map((boss) => {
            const isCompleted = boss.completed;
            const progressPercent = Math.min(100, Math.max(0, (boss.currentCount / boss.targetCount) * 100));
            const categoryInfo = getCategoryInfo(boss.categoryId, customCategories);

            return (
              <div
                key={boss.id}
                className={`rounded-2xl border-2 p-4 transition-all max-w-full overflow-hidden ${
                  isCompleted
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200'
                    : 'border-slate-700 bg-[#1e293b] hover:border-indigo-500/50'
                }`}
              >
                <div className="max-w-full overflow-hidden">
                  {/* Top Row Header */}
                  <div className="flex items-start justify-between gap-2 mb-3 max-w-full">
                    <div className="flex items-center gap-2.5 overflow-hidden min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-[#0f172a] border-2 border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {boss.bossIcon || categoryInfo.icon}
                      </div>
                      <div className="overflow-hidden min-w-0 flex-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                        >
                          {categoryInfo.icon} {categoryInfo.name}
                        </span>
                        <h3 className="text-sm font-black text-amber-400 leading-tight mt-0.5 break-words line-clamp-2">
                          {boss.title}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-xl border border-amber-500/50 bg-amber-500/20 px-2.5 py-1 text-xs font-black text-amber-300 shadow-sm shrink-0">
                      +{boss.rewardXp} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-semibold mb-3 break-words">
                    {boss.description}
                  </p>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="space-y-2 max-w-full">
                  <div className="flex items-center justify-between text-xs font-black text-slate-200">
                    <span>BATTLE PROGRESS</span>
                    <span className="text-emerald-400">
                      {boss.currentCount} / {boss.targetCount} mins
                    </span>
                  </div>

                  <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-slate-800 bg-[#050811] p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isCompleted ? (
                    <div className="w-full py-2 bg-emerald-950/80 text-emerald-300 border-2 border-emerald-500/50 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 mt-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Boss Defeated! Reward Claimed</span>
                    </div>
                  ) : boss.currentCount >= boss.targetCount ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClaimReward(boss.id);
                      }}
                      className="btn-tactile w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-2 text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#020617] cursor-pointer mt-2"
                    >
                      <Sparkles className="w-4 h-4 text-slate-900 fill-amber-300" />
                      <span>Claim +{boss.rewardXp} XP Bounty</span>
                    </button>
                  ) : (
                    <div className="text-[10px] font-bold text-slate-400 text-center py-1">
                      Complete targeted class quests to deal battle damage!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Class Sprints Section */}
      <div className="w-full rounded-3xl border-4 border-slate-800 bg-[#0f172a] p-5 shadow-lg text-slate-100 space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-slate-800 pb-3 mb-4">
          <div className="p-2 bg-indigo-600 border-2 border-slate-700 rounded-2xl text-white shrink-0 shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Daily Class Sprints</h2>
            <p className="text-xs text-slate-400 font-bold">
              Complete daily objectives for quick XP gains!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 max-w-full">
          {dailyChallenges.map((daily) => {
            const isCompleted = daily.completed;
            const progressPercent = Math.min(100, Math.max(0, (daily.currentCount / daily.targetCount) * 100));
            const categoryInfo = getCategoryInfo(daily.categoryId, customCategories);

            return (
              <div
                key={daily.id}
                className={`flex flex-col justify-between rounded-2xl border-2 p-3.5 transition-all max-w-full overflow-hidden ${
                  isCompleted
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200'
                    : 'border-slate-700 bg-[#1e293b] hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                    >
                      {categoryInfo.icon} {categoryInfo.name}
                    </span>
                    <span className="rounded-xl border border-indigo-500/40 bg-indigo-600/30 px-2.5 py-1 text-xs font-black text-indigo-300">
                      +{daily.rewardXp} XP
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-100 mb-0.5 break-words line-clamp-2">
                    {daily.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 mb-2 break-words">
                    {daily.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-300">
                    <span>PROGRESS</span>
                    <span className="text-indigo-400">
                      {daily.currentCount} / {daily.targetCount}
                    </span>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full border-2 border-slate-800 bg-[#050811] p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isCompleted ? (
                    <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1 pt-1">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </div>
                  ) : daily.currentCount >= daily.targetCount ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClaimReward(daily.id);
                      }}
                      className="btn-tactile w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-1.5 text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#020617] cursor-pointer mt-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Claim +{daily.rewardXp} XP</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
