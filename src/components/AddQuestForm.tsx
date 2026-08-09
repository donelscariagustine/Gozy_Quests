import React, { useState } from 'react';
import { QuestCategory } from '../types/todo';
import { CATEGORIES, DIFFICULTY_XP } from '../utils/gameEngine';
import { X, Sparkles, Plus, Clock, Target, Layers } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddQuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuest: (
    title: string,
    category: QuestCategory,
    difficulty: 'easy' | 'medium' | 'hard',
    estimatedMinutes: number
  ) => void;
}

const TIME_OPTIONS = [15, 25, 45, 60];

export const AddQuestForm: React.FC<AddQuestFormProps> = ({
  isOpen,
  onClose,
  onAddQuest,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<QuestCategory>('coding');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(25);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playPop();
    onAddQuest(title.trim(), category, difficulty, estimatedMinutes);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-lg overflow-hidden bg-[#FAF6EE] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-200 border-b-4 border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-300 border-2 border-slate-800 rounded-xl shadow-chunky-sm">
              <Sparkles className="w-5 h-5 text-amber-900 fill-amber-400" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Create New Quest</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-amber-300 text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-500" /> Quest Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build TypeScript state engine..."
              className="w-full px-4 py-3 rounded-2xl border-3 border-slate-800 bg-white text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all text-sm"
              autoFocus
              maxLength={80}
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" /> Quest Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORIES) as QuestCategory[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = category === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCategory(catKey);
                    }}
                    className={`p-2.5 rounded-xl border-2 border-slate-800 text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? `${cat.badgeBg} ${cat.badgeText} shadow-chunky-sm translate-y-[-2px]`
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Difficulty & Base Reward
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setDifficulty(diff);
                  }}
                  className={`p-2.5 rounded-2xl border-3 border-slate-800 text-xs font-black capitalize transition-all flex flex-col items-center gap-1 ${
                    difficulty === diff
                      ? diff === 'easy'
                        ? 'bg-emerald-300 shadow-chunky-sm translate-y-[-2px]'
                        : diff === 'medium'
                        ? 'bg-amber-300 shadow-chunky-sm translate-y-[-2px]'
                        : 'bg-rose-300 shadow-chunky-sm translate-y-[-2px]'
                      : 'bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{diff}</span>
                  <span className="text-[11px] font-extrabold text-slate-900 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-800">
                    +{DIFFICULTY_XP[diff]} XP
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Focus Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" /> Target Focus Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_OPTIONS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setEstimatedMinutes(mins);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black border-2 border-slate-800 transition-all ${
                    estimatedMinutes === mins
                      ? 'bg-indigo-400 text-white shadow-chunky-sm translate-y-[-2px]'
                      : 'bg-white hover:bg-indigo-50 text-slate-700'
                  }`}
                >
                  ⏱️ {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="btn-tactile bg-white hover:bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-tactile bg-emerald-400 hover:bg-emerald-500 px-7 py-2.5 text-sm font-bold text-slate-900 flex items-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[3]" /> Add Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
