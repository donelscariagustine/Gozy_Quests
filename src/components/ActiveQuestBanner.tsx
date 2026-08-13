import React from 'react';
import { Quest, AvatarTrait } from '../types/todo';
import { formatTimeMMSS, getCategoryInfo } from '../utils/gameEngine';
import { sounds } from '../utils/audio';

interface ActiveQuestBannerProps {
  quest: Quest;
  isPaused: boolean;
  streak: number;
  traits: AvatarTrait[];
  onPauseResume: () => void;
  onFinishQuest: (id: string) => void;
}

export const ActiveQuestBanner: React.FC<ActiveQuestBannerProps> = ({
  quest,
  onFinishQuest,
}) => {
  const categoryInfo = getCategoryInfo(quest.categoryId, []);

  const targetSeconds = quest.estimatedMinutes * 60;
  const remainingSeconds = Math.max(0, targetSeconds - quest.timeSpentSeconds);
  const isOverTime = quest.timeSpentSeconds > targetSeconds;

  return (
    <div className="w-full max-w-full overflow-hidden rounded-3xl border-4 border-slate-800 bg-amber-300 dark:bg-amber-500/20 p-4 md:p-5 shadow-chunky-lg mb-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-3 w-full">
        {/* Quest Header */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-800 bg-white dark:bg-slate-900 text-xl shadow-chunky-sm">
            ⏱️
          </div>
          <div className="min-w-0 flex-1">
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase text-white inline-block">
              {categoryInfo.name}
            </span>
            <h3 className="truncate text-sm md:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              {quest.title}
            </h3>
          </div>
        </div>

        {/* Timer & Action Row */}
        <div className="flex items-center justify-between gap-3 w-full pt-2 border-t-2 border-slate-800/20 dark:border-slate-700/50">
          {/* RESTORED: COUNTDOWN TIMER BOX */}
          <div className="rounded-xl border-2 border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-center min-w-[95px] shadow-chunky-sm shrink-0">
            <div className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">
              {formatTimeMMSS(isOverTime ? quest.timeSpentSeconds : remainingSeconds)}
            </div>
            <div className="text-[8px] font-black uppercase text-slate-500 dark:text-slate-400">
              {isOverTime ? 'Overtime' : 'Remaining'}
            </div>
          </div>

          {/* FINISH WORK BUTTON */}
          <button
            type="button"
            onClick={() => {
              sounds.playTaskComplete();
              onFinishQuest(quest.id);
            }}
            className="flex-1 rounded-xl border-2 border-slate-800 bg-emerald-500 hover:bg-emerald-600 py-2.5 px-4 text-xs md:text-sm font-black text-white shadow-chunky-sm active:translate-y-1 active:shadow-none transition-all text-center cursor-pointer"
          >
            Finish Work
          </button>
        </div>
      </div>
    </div>
  );
};
