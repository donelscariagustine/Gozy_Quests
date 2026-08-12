import React from 'react';
import { Quest, AvatarTrait } from '../types/todo';
import { formatTimeMMSS, DIFFICULTY_XP, calculateFinalXP, getCategoryInfo } from '../utils/gameEngine';
import { Play, Pause, CheckCircle2, Timer } from 'lucide-react';
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
  isPaused,
  streak,
  traits,
  onPauseResume,
  onFinishQuest,
}) => {
  const categoryInfo = getCategoryInfo(quest.categoryId, []);
  const baseXP = DIFFICULTY_XP[quest.difficulty];
  const { finalXP } = calculateFinalXP(baseXP, streak, quest.categoryId, traits);

  const targetSeconds = quest.estimatedMinutes * 60;
  const remainingSeconds = Math.max(0, targetSeconds - quest.timeSpentSeconds);
  const isOverTime = quest.timeSpentSeconds > targetSeconds;

  return (
    <div className="card-cozy p-4 sm:p-5 mb-6 bg-gradient-to-r from-amber-300 via-amber-200 to-indigo-300 dark:from-indigo-950 dark:via-slate-900 dark:to-indigo-900 border-4 border-slate-800 dark:border-indigo-400 shadow-chunky-lg animate-pop-in text-slate-900 dark:text-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left Details */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 dark:bg-indigo-600 border-3 border-slate-800 flex items-center justify-center text-2xl shadow-chunky-sm flex-shrink-0">
          <Timer className="w-6 h-6 animate-spin text-slate-900 dark:text-white" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 dark:bg-indigo-900 text-slate-900 dark:text-indigo-200 border border-slate-800 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
              {categoryInfo.icon} {categoryInfo.name}
            </span>
            <span className="bg-emerald-300 text-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
              +{finalXP} XP
            </span>
          </div>

          <h3 className="text-base font-black leading-tight max-w-sm truncate">
            {quest.title}
          </h3>
        </div>
      </div>

      {/* Right Timer Display & Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="bg-white dark:bg-slate-900 border-3 border-slate-800 px-4 py-2 rounded-2xl shadow-chunky-sm text-center">
          <div className="text-2xl font-black font-mono tracking-wider">
            {formatTimeMMSS(isOverTime ? quest.timeSpentSeconds : remainingSeconds)}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase">
            {isOverTime ? 'Overtime Focus' : 'Time Remaining'}
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onPauseResume();
          }}
          className={`btn-tactile p-3 font-bold ${
            isPaused ? 'bg-emerald-400 text-slate-900' : 'bg-amber-300 dark:bg-slate-800 text-slate-900 dark:text-white'
          }`}
          title={isPaused ? 'Resume Timer' : 'Pause Timer'}
        >
          {isPaused ? <Play className="w-5 h-5 fill-slate-900" /> : <Pause className="w-5 h-5" />}
        </button>

        <button
          onClick={() => {
            onFinishQuest(quest.id);
          }}
          className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black px-5 py-3 text-xs sm:text-sm flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>Finish Work & Claim XP</span>
        </button>
      </div>
    </div>
  );
};
