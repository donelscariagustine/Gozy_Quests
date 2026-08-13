import React, { useState } from 'react';
import { Quest, CustomCategory, AvatarTrait } from '../types/todo';
import { getCategoryInfo, getDeadlineStatus } from '../utils/gameEngine';
import { Plus, Search, CheckCircle, Play, Trash2, Clock, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

export type QuestStatusFilter = 'to_complete' | 'completed' | 'all';

interface TaskBoardProps {
  quests: Quest[];
  activeQuestId: string | null;
  streak: number;
  traits: AvatarTrait[];
  customCategories: CustomCategory[];
  onOpenAddQuestModal: () => void;
  onStartQuest: (id: string) => void;
  onFinishQuest: (id: string) => void;
  onCancelQuest?: (id: string) => void;
  onDeleteQuest: (id: string) => void;
  onClearCompleted: () => void;
  onAddQuest?: (
    title: string,
    categoryId: string,
    estimatedMinutes: number,
    hasCustomDeadline: boolean,
    dueDateTime: string | null
  ) => void;
  onOpenAddCategoryModal?: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  quests,
  activeQuestId,
  customCategories,
  onOpenAddQuestModal,
  onStartQuest,
  onFinishQuest,
  onCancelQuest,
  onDeleteQuest,
  onClearCompleted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<QuestStatusFilter>('to_complete');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toCompleteCount = quests.filter((q) => q.status !== 'completed').length;
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  const filteredQuests = quests.filter((q) => {
    // 1. Category Filter Match
    const matchesCategory = selectedCategory === 'all' || q.categoryId === selectedCategory;

    // 2. Status Filter Match
    let matchesStatus = true;
    if (statusFilter === 'to_complete') matchesStatus = q.status !== 'completed';
    if (statusFilter === 'completed') matchesStatus = q.status === 'completed';

    // 3. Search Query Match
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-pop-in max-w-full overflow-hidden">
      {/* Top Banner Actions & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-full overflow-hidden">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-slate-800 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white font-bold text-xs shadow-chunky-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Create Quest Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenAddQuestModal();
          }}
          className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-extrabold px-5 py-2.5 text-xs flex items-center justify-center gap-2 shrink-0 shadow-chunky-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Quest
        </button>
      </div>

      {/* 3-State Quest Status Filter Bar (To Complete, Completed, All) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'to_complete', label: `⏳ To Complete (${toCompleteCount})` },
          { id: 'completed', label: `✅ Completed (${completedCount})` },
          { id: 'all', label: `📋 All Quests (${quests.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              sounds.playPop();
              setStatusFilter(tab.id as QuestStatusFilter);
            }}
            className={`rounded-2xl border-2 px-4 py-2 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === tab.id
                ? 'border-slate-800 dark:border-slate-700 bg-indigo-600 text-white shadow-[2px_2px_0px_0px_#020617]'
                : 'border-slate-800 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills Scroller */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        <button
          onClick={() => {
            sounds.playPop();
            setSelectedCategory('all');
          }}
          className={`px-3 py-1.5 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-indigo-600 shadow-chunky-sm'
              : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300'
          }`}
        >
          All Categories
        </button>

        {['coding', 'workout', 'work', 'study'].map((catKey) => {
          const categoryInfo = getCategoryInfo(catKey, customCategories);
          const isSelected = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              onClick={() => {
                sounds.playPop();
                setSelectedCategory(catKey);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? `${categoryInfo.badgeBg} ${categoryInfo.badgeText} shadow-chunky-sm`
                  : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.name}</span>
            </button>
          );
        })}

        {customCategories.map((c) => {
          const isSelected = selectedCategory === c.id;

          return (
            <button
              key={c.id}
              onClick={() => {
                sounds.playPop();
                setSelectedCategory(c.id);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-indigo-500 text-white shadow-chunky-sm'
                  : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length === 0 ? (
        <div className="card-cozy p-8 text-center bg-white dark:bg-[#0f172a] border-4 border-slate-800 dark:border-indigo-500/30 rounded-3xl">
          <div className="text-4xl mb-2">🏝️</div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">No Quests Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {searchQuery ? 'Try matching another search term' : 'Create a new focus quest to start your journey!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuests.map((quest) => {
            const isCompleted = quest.status === 'completed';
            const isActive = quest.id === activeQuestId;
            const categoryInfo = getCategoryInfo(quest.categoryId, customCategories);
            const deadlineStatus = getDeadlineStatus(quest.dueDateTime);

            return (
              <div
                key={quest.id}
                className={`w-full overflow-hidden rounded-3xl border-4 border-slate-800 bg-white dark:bg-[#0f172a] p-4 sm:p-5 shadow-chunky transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'opacity-70 bg-slate-50 dark:bg-[#0b0f19] border-slate-400 dark:border-slate-800'
                    : isActive
                    ? 'border-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-500/30'
                    : 'dark:border-indigo-500/30 hover:translate-y-[-2px]'
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

                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase bg-amber-100 dark:bg-[#1e293b] text-slate-900 dark:text-indigo-200 border border-slate-800 dark:border-slate-700">
                      ⏱️ {quest.estimatedMinutes}m Focus
                    </span>

                    {quest.hasCustomDeadline && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-slate-800">
                        📅 Target Deadline
                      </span>
                    )}
                  </div>

                  {/* Quest Title (Explicit White Text Override) */}
                  <h3
                    className={`text-base sm:text-lg font-black !text-white !text-slate-100 break-words tracking-wide my-3 leading-snug line-clamp-2 ${
                      isCompleted ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {quest.title || 'Untitled Quest'}
                  </h3>

                  {/* Deadline & Target Time Info */}
                  {quest.dueDateTime && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{deadlineStatus.formattedText}</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls & Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-slate-100 dark:border-slate-800 mt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4" /> Quest Completed
                      </span>
                    ) : isActive ? (
                      <div className="flex items-center gap-2">
                        {/* REVERSE / UNDO ACCIDENTAL TIMER BUTTON */}
                        {onCancelQuest && (
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playPop();
                              onCancelQuest(quest.id);
                            }}
                            className="rounded-xl border-2 border-slate-800 dark:border-slate-700 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-2.5 py-1.5 flex items-center gap-1 cursor-pointer"
                            title="Accidentally started? Click to reverse and reset timer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reverse
                          </button>
                        )}

                        <button
                          onClick={() => {
                            sounds.playTaskComplete();
                            onFinishQuest(quest.id);
                          }}
                          className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-extrabold text-xs px-3.5 py-1.5 flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" /> Finish Work
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          sounds.playPop();
                          onStartQuest(quest.id);
                        }}
                        className="btn-tactile bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs px-3.5 py-1.5 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Start Timer
                      </button>
                    )}
                  </div>

                  {/* High Contrast Rose Delete Button */}
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onDeleteQuest(quest.id);
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white border-2 border-slate-800 rounded-2xl w-9 h-9 flex shrink-0 items-center justify-center shadow-chunky-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    title="Delete Quest"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear Completed Action */}
      {completedCount > 0 && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              sounds.playPop();
              onClearCompleted();
            }}
            className="text-xs font-black text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Clear {completedCount} Completed Quests
          </button>
        </div>
      )}
    </div>
  );
};
