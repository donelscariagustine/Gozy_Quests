import React, { useState } from 'react';
import { Quest, QuestCategory, AvatarTrait } from '../types/todo';
import { DIFFICULTY_XP, calculateFinalXP, formatTimeHuman, CATEGORIES } from '../utils/gameEngine';
import { Plus, Play, Check, Trash2, Clock, Sparkles, CheckCircle2, Timer } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TaskBoardProps {
  quests: Quest[];
  activeQuestId: string | null;
  streak: number;
  traits: AvatarTrait[];
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
  onOpenAddQuestModal,
  onStartQuest,
  onFinishQuest,
  onDeleteQuest,
  onClearCompleted,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuests = quests.filter((q) => {
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? q.status !== 'completed'
        : q.status === 'completed';

    const matchesCategory = selectedCategory === 'all' ? true : q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const activeCount = quests.filter((q) => q.status !== 'completed').length;
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  return (
    <section className="space-y-6">
      {/* Top Banner with Action Button & Search */}
      <div className="card-cozy p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quests by title..."
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl border-3 border-slate-800 bg-[#FAF6EE] text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all text-sm"
          />
          <Sparkles className="w-4 h-4 text-amber-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>

        {/* Create Quest Modal Launcher Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenAddQuestModal();
          }}
          className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black px-6 py-2.5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Add New Quest</span>
        </button>
      </div>

      {/* Category Tabs & Status Filters */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => {
              sounds.playPop();
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-slate-800 flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                : 'bg-white text-slate-600 hover:bg-amber-50'
            }`}
          >
            🌟 All Categories
          </button>
          {(Object.keys(CATEGORIES) as QuestCategory[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(catKey);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-slate-800 flex-shrink-0 flex items-center gap-1 ${
                  isSelected
                    ? `${cat.badgeBg} ${cat.badgeText} shadow-chunky-sm translate-y-[-2px]`
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white border-3 border-slate-800 p-1.5 rounded-2xl shadow-chunky-sm w-full sm:w-auto">
            {(['all', 'active', 'completed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  sounds.playPop();
                  setFilterStatus(t);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border-2 border-transparent ${
                  filterStatus === t
                    ? 'bg-indigo-400 text-white shadow-chunky-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t === 'all' && `All (${quests.length})`}
                {t === 'active' && `Active (${activeCount})`}
                {t === 'completed' && `Done (${completedCount})`}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              onClick={() => {
                sounds.playPop();
                onClearCompleted();
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border-2 border-rose-200 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5 self-end sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Quest Cards List */}
      {filteredQuests.length === 0 ? (
        <div className="card-cozy p-10 text-center bg-white flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-3 border-slate-800 flex items-center justify-center text-3xl">
            {filterStatus === 'completed' ? '📜' : activeCount === 0 ? '✨' : '🔍'}
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {filterStatus === 'completed'
              ? 'No completed quests yet!'
              : activeCount === 0
              ? 'All quests complete! Time to celebrate! 🎉'
              : 'No quests match your filter criteria.'}
          </h3>
          <button
            onClick={() => {
              sounds.playPop();
              onOpenAddQuestModal();
            }}
            className="btn-tactile bg-amber-300 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-slate-900 mt-2"
          >
            + Create a New Quest
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredQuests.map((quest) => {
            const isCurrentActive = activeQuestId === quest.id;
            const isCompleted = quest.status === 'completed';
            const isInProgress = quest.status === 'in_progress';

            const categoryInfo = CATEGORIES[quest.category];
            const baseXP = DIFFICULTY_XP[quest.difficulty];
            const { finalXP } = calculateFinalXP(baseXP, streak, quest.category, traits);

            return (
              <div
                key={quest.id}
                className={`card-cozy p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                  isCompleted
                    ? 'bg-slate-50 opacity-80 border-slate-400 shadow-chunky-sm'
                    : isCurrentActive
                    ? 'bg-amber-50/90 border-indigo-500 shadow-chunky-lg ring-4 ring-indigo-200'
                    : 'bg-white hover:translate-y-[-2px] hover:shadow-chunky-lg'
                }`}
              >
                {/* Left: Category Icon, Title & Meta Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Status / Category Icon */}
                  <div
                    className={`w-10 h-10 rounded-2xl border-3 border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xl ${
                      isCompleted
                        ? 'bg-emerald-400 text-slate-900 shadow-chunky-sm'
                        : isCurrentActive
                        ? 'bg-indigo-500 text-white animate-pulse'
                        : 'bg-amber-100 text-slate-800'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : isCurrentActive ? (
                      <Timer className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      categoryInfo.icon
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Category Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-slate-800 ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
                      >
                        {categoryInfo.icon} {categoryInfo.name}
                      </span>

                      {/* Difficulty Pill */}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-slate-800 ${
                          quest.difficulty === 'easy'
                            ? 'bg-emerald-200 text-emerald-950'
                            : quest.difficulty === 'medium'
                            ? 'bg-amber-200 text-amber-950'
                            : 'bg-rose-200 text-rose-950'
                        }`}
                      >
                        {quest.difficulty} • +{finalXP} XP
                      </span>

                      {/* Estimated Target Time */}
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300">
                        ⏱️ {quest.estimatedMinutes}m target
                      </span>

                      {/* Time Spent */}
                      {quest.timeSpentSeconds > 0 && (
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                          Focus: {formatTimeHuman(quest.timeSpentSeconds)}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-base font-bold block truncate ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {quest.title}
                    </h4>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
                  {!isCompleted && (
                    <>
                      {isInProgress || isCurrentActive ? (
                        <button
                          onClick={() => {
                            onFinishQuest(quest.id);
                          }}
                          className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold px-4 py-2 text-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-900" />
                          <span>Finish Work & Claim XP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sounds.playPop();
                            onStartQuest(quest.id);
                          }}
                          className="btn-tactile bg-indigo-400 hover:bg-indigo-500 text-white font-bold px-4 py-2 text-xs flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Start Quest Timer</span>
                        </button>
                      )}
                    </>
                  )}

                  {isCompleted && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                      <Check className="w-4 h-4 stroke-[3]" /> Completed
                    </span>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onDeleteQuest(quest.id);
                    }}
                    className="p-2 rounded-xl border-2 border-transparent hover:border-slate-800 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all"
                    title="Delete quest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
