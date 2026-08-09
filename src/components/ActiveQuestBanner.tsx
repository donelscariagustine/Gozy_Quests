import React from 'react';
import { Quest, AvatarTrait } from '../types/todo';
import { formatTimeMMSS, DIFFICULTY_XP, calculateFinalXP, CATEGORIES } from '../utils/gameEngine';
import { Play, Pause, CheckCircle2, Timer } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ActiveQuestBannerProps {
  quest: Quest;
  isPaused: boolean;
  streak: number;
  traits: AvatarTrait[];
  onPauseResume: () => void;
  onFinishQuest: (questId: string) => void;
}

export const ActiveQuestBanner: React.FC<ActiveQuestBannerProps> = ({
  quest,
  isPaused,
  streak,
  traits,
  onPauseResume,
  onFinishQuest,
}) => {
  const categoryInfo = CATEGORIES[quest.category];
  const targetSeconds = quest.estimatedMinutes * 60;
  const remainingSeconds = Math.max(0, targetSeconds - quest.timeSpentSeconds);

  const progressPercent = Math.min(
    100,
    Math.max(0, (quest.timeSpentSeconds / targetSeconds) * 100)
  );

  const baseXP = DIFFICULTY_XP[quest.difficulty];
  const { finalXP } = calculateFinalXP(baseXP, streak, quest.category, traits);

  return (
    <div className="sticky top-4 z-40 mb-6 animate-pop-in">
      <div className="card-cozy p-4 sm:p-5 bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 border-4 border-slate-800 shadow-chunky-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Quest Info & Live Timer */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Glowing Timer Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white border-3 border-slate-800 flex flex-col items-center justify-center shadow-chunky-sm flex-shrink-0 relative">
              <Timer className={`w-6 h-6 text-indigo-600 ${!isPaused ? 'animate-spin' : ''}`} />
              <span className="text-[9px] font-black text-slate-800 uppercase mt-0.5">
                {isPaused ? 'PAUSED' : 'FOCUS'}
              </span>
            </div>

            {/* Quest Title & Payout */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}>
                  {categoryInfo.icon} {categoryInfo.name}
                </span>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  +{finalXP} XP Payout
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {quest.title}
              </h3>
            </div>
          </div>

          {/* Center/Right: Timer Countdown & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Real-time MM:SS Counter */}
            <div className="bg-white border-3 border-slate-800 px-4 py-2 rounded-2xl shadow-chunky-sm flex flex-col items-center">
              <span className="text-xl font-black font-mono text-slate-900 leading-none">
                {formatTimeMMSS(remainingSeconds > 0 ? remainingSeconds : quest.timeSpentSeconds)}
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                {remainingSeconds > 0 ? 'Remaining' : 'Extra Focus Time'}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  onPauseResume();
                }}
                className={`btn-tactile px-3.5 py-2.5 text-xs font-bold flex items-center gap-1.5 ${
                  isPaused ? 'bg-amber-300 text-slate-900' : 'bg-white text-slate-800'
                }`}
                title={isPaused ? 'Resume Focus Timer' : 'Pause Timer'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-slate-900" /> : <Pause className="w-4 h-4 fill-slate-800" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              {/* Finish Work / Claim XP Button */}
              <button
                onClick={() => {
                  onFinishQuest(quest.id);
                }}
                className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 animate-bounce-subtle"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
                <span>Finish Work & Claim XP!</span>
              </button>
            </div>
          </div>
        </div>

        {/* Focus Timer Progress Bar */}
        <div className="mt-3 w-full h-3 bg-white/80 border-2 border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-indigo-500 rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full h-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};
