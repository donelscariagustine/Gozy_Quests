import React from 'react';
import { Challenge } from '../types/todo';
import { Swords, Flame, Sparkles, Check, Clock, ShieldAlert } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ChallengesContainerProps {
  challenges: Challenge[];
  onClaimReward: (challengeId: string) => void;
}

export const ChallengesContainer: React.FC<ChallengesContainerProps> = ({
  challenges,
  onClaimReward,
}) => {
  const dailyChallenges = challenges.filter((c) => c.type === 'daily');
  const bossChallenges = challenges.filter((c) => c.type === 'boss');

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="card-cozy p-5 bg-gradient-to-r from-rose-100 via-amber-100 to-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-300 border-3 border-slate-800 rounded-2xl shadow-chunky-sm text-2xl">
            ⚔️
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Boss Battles & Dailies</h2>
            <p className="text-xs font-bold text-slate-600">
              Slay bosses and complete daily focus habits to earn massive XP rewards!
            </p>
          </div>
        </div>
      </div>

      {/* Boss Battles Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Swords className="w-4 h-4 text-rose-500" /> Active Boss Battles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bossChallenges.map((boss) => {
            const isCompleted = boss.completed;
            const canClaim = boss.currentCount >= boss.targetCount && !isCompleted;
            const progressPercent = Math.min(
              100,
              Math.max(0, (boss.currentCount / boss.targetCount) * 100)
            );

            return (
              <div
                key={boss.id}
                className={`card-cozy p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-400 opacity-80'
                    : 'bg-white hover:shadow-chunky-lg'
                }`}
              >
                {/* Boss Top Info */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-200 border-3 border-slate-800 flex items-center justify-center text-3xl shadow-chunky-sm flex-shrink-0">
                    {boss.bossIcon || '🐲'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-slate-800">
                        Boss Battle
                      </span>
                      <span className="text-xs font-bold text-amber-600 font-mono">
                        +{boss.rewardXp} XP
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 mt-1 truncate">
                      {boss.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-tight mt-0.5">
                      {boss.description}
                    </p>
                  </div>
                </div>

                {/* Boss Health Bar / Progress */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700">
                    <span>Boss HP Remaining</span>
                    <span>
                      {boss.currentCount} / {boss.targetCount}
                    </span>
                  </div>

                  {/* Health Bar */}
                  <div className="w-full h-4 bg-slate-100 border-2 border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Claim Button */}
                  {canClaim ? (
                    <button
                      onClick={() => {
                        sounds.playAchievementUnlocked();
                        onClaimReward(boss.id);
                      }}
                      className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black w-full py-2 text-xs flex items-center justify-center gap-1.5 animate-bounce-subtle mt-2"
                    >
                      <Sparkles className="w-4 h-4 fill-amber-300" /> Slay Boss & Claim +{boss.rewardXp} XP!
                    </button>
                  ) : isCompleted ? (
                    <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-400 rounded-xl py-1.5 text-center text-xs font-extrabold flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 stroke-[3]" /> Boss Defeated!
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Quests Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500" /> Daily Habits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyChallenges.map((daily) => {
            const isCompleted = daily.completed;
            const canClaim = daily.currentCount >= daily.targetCount && !isCompleted;
            const progressPercent = Math.min(
              100,
              Math.max(0, (daily.currentCount / daily.targetCount) * 100)
            );

            return (
              <div
                key={daily.id}
                className={`card-cozy p-4 flex flex-col justify-between transition-all ${
                  isCompleted ? 'bg-slate-50 opacity-80' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{daily.bossIcon || '⚡'}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{daily.title}</h4>
                      <p className="text-xs text-slate-500">{daily.description}</p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black px-2 py-0.5 rounded-lg">
                    +{daily.rewardXp} XP
                  </span>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>Daily Progress</span>
                    <span>
                      {daily.currentCount} / {daily.targetCount}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 border-2 border-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {canClaim && (
                    <button
                      onClick={() => {
                        sounds.playAchievementUnlocked();
                        onClaimReward(daily.id);
                      }}
                      className="btn-tactile bg-amber-300 hover:bg-amber-400 text-slate-900 font-bold w-full py-1.5 text-xs flex items-center justify-center gap-1 mt-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Claim +{daily.rewardXp} XP Reward
                    </button>
                  )}

                  {isCompleted && (
                    <div className="text-center text-xs font-bold text-emerald-600 mt-1">
                      ✓ Completed for Today
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
