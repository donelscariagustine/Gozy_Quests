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

  return (
    <div className="space-y-8 animate-pop-in">
      {/* Category Boss Battles Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-400 dark:bg-rose-600 border-3 border-slate-800 rounded-2xl shadow-chunky-sm text-white">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Class Boss Battles</h2>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Defeat epic bosses tuned to your starting Hero Class for massive XP bounties & titles!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bossChallenges.map((boss) => {
            const isCompleted = boss.completed;
            const progressPercent = Math.min(100, Math.max(0, (boss.currentCount / boss.targetCount) * 100));
            const categoryInfo = getCategoryInfo(boss.categoryId, customCategories);

            return (
              <div
                key={boss.id}
                className={`card-cozy p-5 flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 shadow-chunky hover:translate-y-[-2px]'
                }`}
              >
                <div>
                  {/* Top Row Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-slate-800 border-3 border-slate-800 flex items-center justify-center text-2xl shadow-chunky-sm">
                        {boss.bossIcon || categoryInfo.icon}
                      </div>
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                        >
                          {categoryInfo.icon} {categoryInfo.name}
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5 break-words line-clamp-2">
                          {boss.title}
                        </h3>
                      </div>
                    </div>

                    <span className="bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white border-2 border-slate-800 text-xs font-black px-2.5 py-1 rounded-xl shadow-chunky-sm flex-shrink-0">
                      +{boss.rewardXp} XP
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-4 break-words">
                    {boss.description}
                  </p>
                </div>

                {/* Progress Bar & Claim Button */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Battle Progress</span>
                    <span>
                      {boss.currentCount} / {boss.targetCount}
                    </span>
                  </div>

                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isCompleted ? (
                    <div className="w-full py-2 bg-emerald-200 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-200 border-2 border-slate-800 rounded-xl text-xs font-black flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Boss Defeated! Reward Claimed</span>
                    </div>
                  ) : boss.currentCount >= boss.targetCount ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClaimReward(boss.id);
                      }}
                      className="btn-tactile w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black py-2 text-xs flex items-center justify-center gap-1.5 shadow-chunky-sm"
                    >
                      <Sparkles className="w-4 h-4 text-slate-900 fill-amber-300" />
                      <span>Claim +{boss.rewardXp} XP Bounty</span>
                    </button>
                  ) : (
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center py-1">
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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-300 dark:bg-indigo-600 border-3 border-slate-800 rounded-2xl shadow-chunky-sm text-slate-900 dark:text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Daily Focus Sprints</h2>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Refresh every 24 hours. Keep up your daily class momentum!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyChallenges.map((daily) => {
            const isCompleted = daily.completed;
            const progressPercent = Math.min(100, Math.max(0, (daily.currentCount / daily.targetCount) * 100));
            const categoryInfo = getCategoryInfo(daily.categoryId, customCategories);

            return (
              <div
                key={daily.id}
                className={`card-cozy p-4 flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-3 border-slate-800 dark:border-slate-700 shadow-chunky-sm hover:translate-y-[-2px]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                    >
                      {categoryInfo.icon} {categoryInfo.name}
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-emerald-300">
                      +{daily.rewardXp} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1 break-words line-clamp-2">
                    {daily.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-3 break-words">
                    {daily.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Progress</span>
                    <span>
                      {daily.currentCount} / {daily.targetCount}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 border border-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isCompleted ? (
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 pt-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Completed
                    </div>
                  ) : daily.currentCount >= daily.targetCount ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onClaimReward(daily.id);
                      }}
                      className="btn-tactile w-full bg-emerald-400 text-slate-900 font-bold py-1.5 text-xs"
                    >
                      Claim Reward
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
