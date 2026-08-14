import React, { useState } from 'react';
import { CharacterClass } from '../types/todo';
import { X, FolderPlus, Calendar, Tag, FileText } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (
    name: string,
    category: CharacterClass,
    colorTag: string,
    overview: string,
    targetDeadline: string
  ) => void;
}

const PRESET_COLORS = [
  '#6C5CE7', // Indigo / Purple
  '#00CEC9', // Teal / Cyan
  '#FF7675', // Rose / Red
  '#FDCB6E', // Amber / Gold
  '#a855f7', // Vivid Violet
  '#10B981', // Emerald Green
  '#3B82F6', // Royal Blue
  '#F97316', // Orange
];

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CharacterClass>('coding');
  const [colorTag, setColorTag] = useState('#6C5CE7');
  const [overview, setOverview] = useState('');
  const [targetDeadline, setTargetDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sounds.playLevelUp();
    onAddProject(
      name.trim(),
      category,
      colorTag,
      overview.trim() || 'No overview provided.',
      targetDeadline || new Date().toISOString().split('T')[0]
    );

    setName('');
    setOverview('');
    setTargetDeadline('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-pop-in">
      <div className="card-cozy w-full max-w-lg p-6 bg-[#0f172a] text-slate-100 border-4 border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 border-2 border-slate-700 text-white">
              <FolderPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white">+ New Project Folder</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Name */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
              📁 Project Folder Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gozy Quests Engine v2.0"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-bold text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
              🏷️ Category Focus
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: 'coding', label: '💻 Coding' },
                { id: 'workout', label: '🏋️‍♂️ Workout' },
                { id: 'study', label: '📚 Study' },
                { id: 'work', label: '💼 Work' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setCategory(cat.id as CharacterClass);
                  }}
                  className={`rounded-xl border-2 p-2.5 text-xs font-black transition-all cursor-pointer ${
                    category === cat.id
                      ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm scale-105'
                      : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Tag Swatch Picker */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Folder Color Tag
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setColorTag(color);
                  }}
                  className={`w-8 h-8 rounded-full border-2 border-slate-800 transition-transform cursor-pointer ${
                    colorTag === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Target Deadline Date Picker */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Target Deadline (📅 YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={targetDeadline}
              onChange={(e) => setTargetDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-bold text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>

          {/* Overview Details */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Overview & Project Goals
            </label>
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Describe main goals, deliverables, and tech stack details..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-medium text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-800 bg-[#1e293b] text-slate-300 font-extrabold text-xs hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-tactile bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-2.5 flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_#020617]"
            >
              + Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
