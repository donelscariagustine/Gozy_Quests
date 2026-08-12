import React, { useState } from 'react';
import { CustomCategory } from '../types/todo';
import { BUILTIN_CATEGORIES, DIFFICULTY_XP } from '../utils/gameEngine';
import { X, Sparkles, Plus, Clock, Target, Layers, Calendar, Settings } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddQuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CustomCategory[];
  onOpenAddCategoryModal: () => void;
  onAddQuest: (
    title: string,
    categoryId: string,
    difficulty: 'easy' | 'medium' | 'hard',
    estimatedMinutes: number,
    hasCustomDeadline: boolean,
    dueDateTime: string | null
  ) => void;
}

const PRESET_TIMERS = [15, 25, 45, 60];

export const AddQuestForm: React.FC<AddQuestFormProps> = ({
  isOpen,
  onClose,
  customCategories,
  onOpenAddCategoryModal,
  onAddQuest,
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('coding');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(25);

  // Gated Custom Deadline & Time state
  const [showCustomControls, setShowCustomControls] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [dueDateTime, setDueDateTime] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playPop();
    const finalMinutes = showCustomControls ? customMinutes : estimatedMinutes;
    onAddQuest(
      title.trim(),
      categoryId,
      difficulty,
      finalMinutes,
      showCustomControls,
      showCustomControls && dueDateTime ? dueDateTime : null
    );

    setTitle('');
    setDueDateTime('');
    setShowCustomControls(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-lg overflow-hidden bg-[#FAF6EE] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-200 dark:bg-slate-800 border-b-4 border-slate-800 dark:border-indigo-500/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-300 dark:bg-indigo-600 border-2 border-slate-800 rounded-xl shadow-chunky-sm">
              <Sparkles className="w-5 h-5 text-amber-900 dark:text-white fill-amber-400" />
            </div>
            <h2 className="text-xl font-black">Create New Quest</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-amber-300 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-500" /> Quest Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build TypeScript state engine..."
              className="w-full px-4 py-3 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40 transition-all text-sm"
              autoFocus
              maxLength={80}
              required
            />
          </div>

          {/* Category Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-500" /> Quest Category
              </label>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onOpenAddCategoryModal();
                }}
                className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Custom
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Built-in Categories */}
              {Object.keys(BUILTIN_CATEGORIES).map((catKey) => {
                const cat = BUILTIN_CATEGORIES[catKey];
                const isSelected = categoryId === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCategoryId(catKey);
                    }}
                    className={`px-3 py-1.5 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? `${cat.badgeBg} ${cat.badgeText} shadow-chunky-sm translate-y-[-2px]`
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}

              {/* Custom Categories */}
              {customCategories.map((c) => {
                const isSelected = categoryId === c.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCategoryId(c.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-chunky-sm translate-y-[-2px]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">
              Difficulty & Reward
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setDifficulty(diff);
                  }}
                  className={`p-2.5 rounded-2xl border-3 border-slate-800 dark:border-slate-700 text-xs font-black capitalize transition-all flex flex-col items-center gap-1 ${
                    difficulty === diff
                      ? diff === 'easy'
                        ? 'bg-emerald-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                        : diff === 'medium'
                        ? 'bg-amber-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                        : 'bg-rose-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{diff}</span>
                  <span className="text-[10px] font-extrabold text-slate-900 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-800">
                    +{DIFFICULTY_XP[diff]} XP
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Focus Timer Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" /> Focus Time Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_TIMERS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setEstimatedMinutes(mins);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-black border-2 border-slate-800 dark:border-slate-700 transition-all ${
                    !showCustomControls && estimatedMinutes === mins
                      ? 'bg-indigo-500 text-white shadow-chunky-sm translate-y-[-2px]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ⏱️ {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Gated Custom Deadline & Timer Button */}
          <div className="pt-1 border-t-2 border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowCustomControls(!showCustomControls);
              }}
              className={`w-full py-2.5 px-4 rounded-2xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black flex items-center justify-between transition-colors ${
                showCustomControls
                  ? 'bg-indigo-100 dark:bg-slate-800 text-indigo-900 dark:text-indigo-200'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>⚙️ Customize Deadline & Time</span>
              </span>
              <span className="text-[10px] font-bold uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-400">
                {showCustomControls ? 'Hide Options' : 'Expand'}
              </span>
            </button>

            {/* Gated Custom Inputs */}
            {showCustomControls && (
              <div className="mt-3 p-4 bg-amber-50/60 dark:bg-slate-800/60 border-2 border-slate-800 dark:border-indigo-500/40 rounded-2xl space-y-4 animate-pop-in">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Custom Focus Minutes
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" /> Target Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dueDateTime}
                    onChange={(e) => setDueDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="btn-tactile bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold px-7 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[3]" /> Add Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
