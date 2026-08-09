import React from 'react';
import { Sparkles, Trophy, Star } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LevelUpModalProps {
  level: number | null;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  if (level === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-sm p-6 bg-[#FAF6EE] text-center flex flex-col items-center gap-4 relative overflow-hidden border-4 border-slate-800 shadow-chunky-lg">
        <div className="w-20 h-20 rounded-full bg-amber-300 border-4 border-slate-800 flex items-center justify-center text-4xl shadow-chunky animate-bounce-subtle">
          🌟
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-amber-300" />
            Level Up!
            <Sparkles className="w-4 h-4 fill-amber-300" />
          </div>
          <h2 className="text-3xl font-black text-slate-800">Level {level}!</h2>
          <p className="text-xs text-slate-600 font-medium">
            You've reached Level {level}! Keep completing quests to unlock new rewards and achievements.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold px-8 py-2.5 text-sm w-full mt-2"
        >
          Awesome! 🚀
        </button>
      </div>
    </div>
  );
};
