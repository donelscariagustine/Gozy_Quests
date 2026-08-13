import React, { useState } from 'react';
import { CustomCategory } from '../types/todo';
import { BUILTIN_CATEGORIES } from '../utils/gameEngine';
import { X, Sparkles, Plus, Clock, Target, Layers, Calendar } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddQuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  customCategories: CustomCategory[];
  onOpenAddCategoryModal: () => void;
  onAddQuest: (
    title: string,
    categoryId: string,
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
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(25);

  // Trigger 1: Custom Focus Mins
  const [showCustomMins, setShowCustomMins] = useState<boolean>(false);
  // Trigger 2: Target Date & Time Deadline
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const [dueDateTime, setDueDateTime] = useState<string>('');

  if (!isOpen) return null;

  // Compute dynamic estimated minutes when Target Date & Time changes
  const handleDateTimeChange = (val: string) => {
    setDueDateTime(val);
    if (val) {
      const dueMs = new Date(val).getTime();
      const nowMs = Date.now();
      const diffMins = Math.floor((dueMs - nowMs) / 60000);
      const calculatedMins = Math.max(15, diffMins);
      setEstimatedMinutes(calculatedMins);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playPop();
    const hasCustom = showCustomMins || showDateTimePicker;
    onAddQuest(
      title.trim(),
      categoryId,
      estimatedMinutes,
      hasCustom,
      showDateTimePicker && dueDateTime ? dueDateTime : null
    );

    setTitle('');
    setDueDateTime('');
    setShowCustomMins(false);
    setShowDateTimePicker(false);
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

          {/* Focus Duration & Trigger 1: Custom Focus Mins */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" /> Focus Duration
              </label>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {estimatedMinutes} mins
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_TIMERS.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setEstimatedMinutes(mins);
                    setShowCustomMins(false);
                  }}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold border-2 border-slate-800 dark:border-slate-700 transition-all ${
                    estimatedMinutes === mins && !showCustomMins
                      ? 'bg-indigo-600 text-white shadow-chunky-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}

              {/* BUTTON 1: Custom Focus Mins */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setShowCustomMins(!showCustomMins);
                }}
                className={`rounded-xl border-2 border-slate-800 px-3.5 py-2 text-xs font-bold transition-all shadow-chunky-sm ${
                  showCustomMins
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                ⏱️ {showCustomMins ? 'Hide Custom Mins' : 'Custom Mins'}
              </button>
            </div>

            {showCustomMins && (
              <input
                type="number"
                min="1"
                max="480"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value) || 25)}
                placeholder="Enter minutes (e.g. 90)"
                className="mt-2 w-full rounded-xl border-2 border-slate-800 p-2.5 text-sm font-bold bg-white dark:bg-slate-900 dark:text-white"
              />
            )}
          </div>

          {/* BUTTON 2: Custom Date & Time Deadline with Dynamic Focus Calculation */}
          <div className="space-y-2 pt-2 border-t-2 border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowDateTimePicker(!showDateTimePicker);
              }}
              className={`w-full rounded-xl border-2 border-slate-800 py-2.5 px-3 text-xs font-extrabold transition-all shadow-chunky-sm flex items-center justify-between ${
                showDateTimePicker
                  ? 'bg-emerald-400 text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{showDateTimePicker ? '📅 Dynamic Target Deadline Active' : '📅 Set Target Date & Time'}</span>
              </span>
              <span className="text-[10px] uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                {showDateTimePicker ? 'Clear' : 'Set Date'}
              </span>
            </button>

            {showDateTimePicker && (
              <div className="space-y-1 mt-2">
                <input
                  type="datetime-local"
                  value={dueDateTime}
                  onChange={(e) => handleDateTimeChange(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-800 p-2.5 text-sm font-bold bg-white dark:bg-slate-900 dark:text-white"
                />
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  ⚡ Focus time calculates automatically based on time remaining ({estimatedMinutes} mins).
                </p>
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
