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
      <div className="space-y-4 max-w-full overflow-hidden">
        <div className="flex items-center justify-between gap-2 max-w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-2 bg-rose-400 dark:bg-rose-600 border-3 border-slate-800 rounded-2xl shadow-chunky-sm text-white shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">Weekly Class Bosses</h2>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">
                Weekly randomized boss battles!
              </p>
            </div>
          </div>

          <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0">
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
                className={`card-cozy p-4 flex flex-col justify-between transition-all max-w-full overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 shadow-chunky hover:translate-y-[-2px]'
                }`}
              >
                <div className="max-w-full overflow-hidden">
                  {/* Top Row Header */}
                  <div className="flex items-start justify-between gap-2 mb-3 max-w-full">
                    <div className="flex items-center gap-2.5 overflow-hidden min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-slate-800 border-3 border-slate-800 flex items-center justify-center text-xl shadow-chunky-sm shrink-0">
                        {boss.bossIcon || categoryInfo.icon}
                      </div>
                      <div className="overflow-hidden min-w-0 flex-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                        >
                          {categoryInfo.icon} {categoryInfo.name}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5 break-words line-clamp-2">
                          {boss.title}
                        </h3>
                      </div>
                    </div>

                    <span className="bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white border-2 border-slate-800 text-[11px] font-black px-2 py-0.5 rounded-xl shadow-chunky-sm shrink-0">
                      +{boss.rewardXp} XP
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3 break-words">
                    {boss.description}
                  </p>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="space-y-2 max-w-full">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Battle Progress</span>
                    <span>
                      {boss.currentCount} / {boss.targetCount}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isCompleted ? (
                    <div className="w-full py-1.5 bg-emerald-200 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-200 border-2 border-slate-800 rounded-xl text-xs font-black flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Boss Defeated! Claimed</span>
                    </div>
                  ) : boss.currentCount >= boss.targetCount ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClaimReward(boss.id);
                      }}
                      className="btn-tactile w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black py-1.5 text-xs flex items-center justify-center gap-1.5 shadow-chunky-sm"
                    >
                      <Sparkles className="w-4 h-4 text-slate-900 fill-amber-300" />
                      <span>Claim +{boss.rewardXp} XP Bounty</span>
                    </button>
                  ) : (
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center py-0.5">
                      Complete targeted class quests to deal damage!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Class Sprints Section */}
      <div className="space-y-4 max-w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-300 dark:bg-indigo-600 border-3 border-slate-800 rounded-2xl shadow-chunky-sm text-slate-900 dark:text-white shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Daily Class Sprints</h2>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Refresh weekly. Claim XP on completion!
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
                className={`card-cozy p-3.5 flex flex-col justify-between transition-all max-w-full overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-3 border-slate-800 dark:border-slate-700 shadow-chunky-sm hover:translate-y-[-2px]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                    >
                      {categoryInfo.icon} {categoryInfo.name}
                    </span>
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-emerald-300">
                      +{daily.rewardXp} XP
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-0.5 break-words line-clamp-2">
                    {daily.title}
                  </h4>
                  <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-2 break-words">
                    {daily.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Progress</span>
                    <span>
                      {daily.currentCount} / {daily.targetCount}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isCompleted ? (
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 pt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Completed
                    </div>
                  ) : daily.currentCount >= daily.targetCount ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClaimReward(daily.id);
                      }}
                      className="btn-tactile w-full bg-emerald-400 text-slate-900 font-bold py-1 text-xs"
                    >
                      Claim +{daily.rewardXp} XP
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
