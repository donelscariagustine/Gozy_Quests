import React, { useState } from 'react';
import { X, Sparkles, Plus, Palette } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (name: string, icon: string, colorHex: string) => void;
}

const EMOJI_OPTIONS = ['🎮', '📖', '🎵', '🚴', '🌱', '🍳', '🛠️', '🎯', '🚀', '🧘'];
const COLOR_PRESETS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#3B82F6', '#84CC16'];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎮');
  const [colorHex, setColorHex] = useState('#8B5CF6');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sounds.playPop();
    onAddCategory(name.trim(), icon, colorHex);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-md overflow-hidden bg-[#FAF6EE] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-indigo-200 dark:bg-slate-800 border-b-4 border-slate-800 dark:border-indigo-500/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-300 dark:bg-indigo-600 border-2 border-slate-800 rounded-xl shadow-chunky-sm text-lg">
              ✨
            </div>
            <h2 className="text-xl font-black">Add Custom Category</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-indigo-300 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gaming, Meditation, Cooking..."
              className="w-full px-4 py-3 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40 text-sm"
              autoFocus
              maxLength={30}
              required
            />
          </div>

          {/* Emoji Icon Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">
              Choose Icon Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setIcon(e);
                  }}
                  className={`w-10 h-10 rounded-xl text-xl border-2 border-slate-800 dark:border-slate-700 flex items-center justify-center transition-all ${
                    icon === e ? 'bg-amber-300 dark:bg-indigo-600 scale-110 shadow-chunky-sm' : 'bg-white dark:bg-slate-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color Preset Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-500" /> Badge Color Theme
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setColorHex(c);
                  }}
                  className={`w-8 h-8 rounded-full border-2 border-slate-800 shadow-chunky-sm transition-transform ${
                    colorHex === c ? 'scale-125 ring-4 ring-indigo-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
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
              className="btn-tactile bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold px-7 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[3]" /> Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
