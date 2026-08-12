import React, { useState } from 'react';
import { Quest, CustomCategory, AvatarTrait } from '../types/todo';
import {
  getCategoryInfo,
  DIFFICULTY_XP,
  getDeadlineStatus,
  calculateFinalXP,
} from '../utils/gameEngine';
import { Plus, Search, CheckCircle, Play, Trash2, Clock, Calendar, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TaskBoardProps {
  quests: Quest[];
  activeQuestId: string | null;
  streak: number;
  traits: AvatarTrait[];
  customCategories: CustomCategory[];
  onOpenAddQuestModal: () => void;
  onStartQuest: (id: string) => void;
  onFinishQuest: (id: string) => void;
  onDeleteQuest: (id: string) => void;
  onClearCompleted: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  quests,
  activeQuestId,
  streak,
  traits,
  customCategories,
  onOpenAddQuestModal,
  onStartQuest,
  onFinishQuest,
  onDeleteQuest,
  onClearCompleted,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredQuests = quests.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || q.categoryId === selectedCategoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && q.status !== 'completed') ||
      (statusFilter === 'completed' && q.status === 'completed');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completedCount = quests.filter((q) => q.status === 'completed').length;

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pirate quests..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40"
          />
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onOpenAddQuestModal();
          }}
          className="btn-tactile bg-amber-400 hover:bg-amber-500 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-900 dark:text-white font-black px-5 py-2.5 text-xs flex items-center justify-center gap-2 shadow-chunky-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Quest
        </button>
      </div>

      {/* Horizontal Scrollbar-Free Category Pill Filter Bar */}
      <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 scroll-smooth">
        <button
          onClick={() => {
            sounds.playPop();
            setSelectedCategoryFilter('all');
          }}
          className={`shrink-0 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-slate-800 transition-all ${
            selectedCategoryFilter === 'all'
              ? 'bg-slate-800 text-white dark:bg-indigo-500 shadow-chunky-sm translate-y-[-1px]'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
          }`}
        >
          All Categories ({quests.length})
        </button>

        {Object.keys(customCategories.length ? customCategories : []).map(() => null)}
        {['coding', 'workout', 'work', 'study', 'chores', 'creative', 'other'].map((catId) => {
          const info = getCategoryInfo(catId, customCategories);
          const isSelected = selectedCategoryFilter === catId;

          return (
            <button
              key={catId}
              onClick={() => {
                sounds.playPop();
                setSelectedCategoryFilter(catId);
              }}
              className={`shrink-0 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-slate-800 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? `${info.badgeBg} ${info.badgeText} shadow-chunky-sm translate-y-[-1px]`
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.name}</span>
            </button>
          );
        })}

        {customCategories.map((c) => {
          const isSelected = selectedCategoryFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                sounds.playPop();
                setSelectedCategoryFilter(c.id);
              }}
              className={`shrink-0 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-slate-800 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-300 text-slate-900 shadow-chunky-sm translate-y-[-1px]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Status Filter & Clear Actions */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded-lg ${statusFilter === 'active' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-lg ${statusFilter === 'completed' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black' : ''}`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-rose-500 hover:text-rose-600 font-bold transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length === 0 ? (
        <div className="card-cozy p-8 text-center bg-white dark:bg-slate-900 space-y-3">
          <div className="text-4xl">📜</div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No Quests Found</h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You have no active quests matching this filter. Click "Add New Quest" to set sail!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => {
            const isCompleted = quest.status === 'completed';
            const isActive = quest.id === activeQuestId;
            const categoryInfo = getCategoryInfo(quest.categoryId, customCategories);
            const baseXP = DIFFICULTY_XP[quest.difficulty];
            const { finalXP } = calculateFinalXP(baseXP, streak, quest.categoryId, traits);
            const deadlineStatus = getDeadlineStatus(quest.dueDateTime);

            return (
              <div
                key={quest.id}
                className={`w-full overflow-hidden rounded-3xl border-4 border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-chunky transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'opacity-70 bg-slate-50 dark:bg-slate-950 border-slate-400 dark:border-slate-800'
                    : isActive
                    ? 'border-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-500/30'
                    : 'dark:border-indigo-500/40 hover:translate-y-[-2px]'
                }`}
              >
                <div>
                  {/* Category Pills & Badges Header */}
                  <div className="no-scrollbar flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                    >
                      {categoryInfo.icon} {categoryInfo.name}
                    </span>

                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase bg-amber-100 dark:bg-indigo-950 text-slate-900 dark:text-indigo-200 border border-slate-800">
                      {quest.difficulty.toUpperCase()} +{finalXP} XP
                    </span>

                    {quest.hasCustomDeadline && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-slate-800">
                        ⚙️ Custom Timer
                      </span>
                    )}

                    {quest.dueDateTime && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black border border-slate-800 flex items-center gap-1 ${
                          deadlineStatus.isOverdue
                            ? 'bg-rose-500 text-white'
                            : deadlineStatus.isUrgent
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {deadlineStatus.formattedText}
                      </span>
                    )}
                  </div>

                  {/* Quest Title Header with break-words & line-clamp-2 */}
                  <h3
                    className={`mb-4 text-base font-extrabold leading-tight text-slate-900 dark:text-slate-100 break-words line-clamp-2 ${
                      isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {quest.title}
                  </h3>
                </div>

                {/* Bottom Action Row with High Contrast Delete Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{quest.estimatedMinutes}m est</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 rounded-xl text-xs font-black flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Done
                      </div>
                    ) : isActive ? (
                      <button
                        onClick={() => onFinishQuest(quest.id)}
                        className="btn-tactile px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black text-xs flex items-center gap-1 shadow-chunky-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-amber-300" /> Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartQuest(quest.id)}
                        className="btn-tactile px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1 shadow-chunky-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Start Timer
                      </button>
                    )}

                    {/* High-Contrast Rose Delete Button */}
                    <button
                      onClick={() => onDeleteQuest(quest.id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-800 bg-rose-500 text-white shadow-chunky-sm hover:bg-rose-600 active:translate-y-0.5 active:shadow-none transition-all"
                      title="Delete Quest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
