import React, { useState } from 'react';
import { Achievement, QuestCategory } from '../types/todo';
import { CATEGORIES } from '../utils/gameEngine';
import { Trophy, X, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AchievementCabinetProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementCabinet: React.FC<AchievementCabinetProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<QuestCategory | 'all'>('all');

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((a) => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] bg-[#FAF6EE]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-200 border-b-4 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-300 border-2 border-slate-800 rounded-xl shadow-chunky-sm">
              <Trophy className="w-6 h-6 text-amber-900 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">20-Badge Trophy Cabinet</h2>
              <p className="text-xs font-bold text-slate-700">
                Unlocked {unlockedCount} of {totalCount} Badges ({percentage}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-amber-300 text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Global Trophy Progress Bar */}
        <div className="px-6 pt-4 pb-2 bg-amber-100/60 border-b-2 border-slate-800 space-y-3">
          <div className="w-full h-3.5 bg-white border-2 border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => {
                sounds.playPop();
                setCategoryFilter('all');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all border-2 border-slate-800 flex-shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-amber-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                  : 'bg-white text-slate-600 hover:bg-amber-50'
              }`}
            >
              🌟 All Badges ({totalCount})
            </button>
            {(Object.keys(CATEGORIES) as QuestCategory[]).map((catKey) => {
              const cat = CATEGORIES[catKey];
              const isSelected = categoryFilter === catKey;
              const catCount = achievements.filter((a) => a.category === catKey).length;
              if (catCount === 0) return null;

              return (
                <button
                  key={catKey}
                  onClick={() => {
                    sounds.playPop();
                    setCategoryFilter(catKey);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all border-2 border-slate-800 flex-shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? `${cat.badgeBg} ${cat.badgeText} shadow-chunky-sm translate-y-[-2px]`
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Grid Container */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAchievements.map((ach) => {
              const isUnlocked = ach.unlocked;
              const progressPercent = Math.min(100, Math.max(0, (ach.progress / ach.maxProgress) * 100));

              return (
                <div
                  key={ach.id}
                  className={`card-cozy p-4 flex flex-col justify-between transition-all relative ${
                    isUnlocked
                      ? 'bg-amber-50 border-amber-500 shadow-chunky hover:scale-[1.02]'
                      : 'bg-white border-slate-700 opacity-90'
                  }`}
                >
                  {/* Top Badge Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className={`w-11 h-11 rounded-2xl border-3 border-slate-800 flex items-center justify-center text-xl shadow-chunky-sm ${
                        isUnlocked
                          ? 'bg-amber-300 animate-bounce-subtle'
                          : 'bg-slate-100 filter grayscale opacity-70'
                      }`}
                    >
                      {ach.badgeIcon}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black border-2 border-slate-800 ${
                        isUnlocked
                          ? 'bg-emerald-300 text-emerald-950'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      +{ach.xpReward} XP
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{ach.title}</h4>
                      {isUnlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">{ach.description}</p>
                  </div>

                  {/* Progress or Completion Footer */}
                  <div className="mt-auto">
                    {isUnlocked ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-1 rounded-xl border border-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-600 fill-amber-400" />
                        <span>Unlocked!</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" /> Locked
                          </span>
                          <span>
                            {ach.progress} / {ach.maxProgress}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 border border-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-100 border-t-4 border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="btn-tactile bg-white hover:bg-slate-100 px-6 py-2 text-sm font-bold text-slate-800"
          >
            Close Cabinet
          </button>
        </div>
      </div>
    </div>
  );
};
