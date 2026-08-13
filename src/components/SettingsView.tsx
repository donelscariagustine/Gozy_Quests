import React from 'react';
import { UserProfile, UserSettings, CharacterClass, TodoType } from '../types/todo';
import { sounds } from '../utils/audio';

interface SettingsViewProps {
  user: UserProfile;
  settings: UserSettings;
  onToggleTheme: () => void;
  onChangeClass: (newClass: CharacterClass) => void;
  onChangeStrategy: (newStrategy: TodoType) => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  settings,
  onToggleTheme,
  onChangeClass,
  onChangeStrategy,
  onLogout,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border-4 border-slate-800 bg-white dark:bg-slate-900 dark:border-indigo-500/50 p-6 shadow-chunky-lg space-y-6">
      <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
        ⚙️ Game Settings
      </h2>

      {/* 1. Appearance & Theme */}
      <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Appearance & Theme
        </h3>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onToggleTheme();
          }}
          className="rounded-xl border-2 border-slate-800 bg-amber-300 dark:bg-indigo-600 px-4 py-2.5 text-sm font-black text-slate-900 dark:text-white shadow-chunky-sm active:translate-y-0.5 cursor-pointer"
        >
          {settings.theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
        </button>
      </div>

      {/* 2. Primary Class Focus */}
      <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Primary Class Focus
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'coding', label: 'Coder 💻' },
            { id: 'workout', label: 'Workout 🏋️‍♂️' },
            { id: 'study', label: 'Scholar 📚' },
            { id: 'work', label: 'Executive 💼' },
          ].map((cls) => (
            <button
              key={cls.id}
              type="button"
              onClick={() => {
                sounds.playPop();
                onChangeClass(cls.id as CharacterClass);
              }}
              className={`rounded-xl border-2 border-slate-800 p-3 text-xs font-black transition-all cursor-pointer ${
                user.primaryClass === cls.id
                  ? 'bg-indigo-600 text-white shadow-chunky-sm translate-y-[-1px]'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cls.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Productivity Strategy */}
      <div className="p-4 rounded-2xl border-2 border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Productivity Strategy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'strict_rpg', label: '⚡ Strict Sprints' },
            { id: 'casual_habits', label: '🌿 Casual Habits' },
            { id: 'project_bosses', label: '⚔️ Project Bosses' },
          ].map((strat) => (
            <button
              key={strat.id}
              type="button"
              onClick={() => {
                sounds.playPop();
                onChangeStrategy(strat.id as TodoType);
              }}
              className={`rounded-xl border-2 border-slate-800 p-3 text-xs font-black transition-all cursor-pointer ${
                user.todoType === strat.id
                  ? 'bg-indigo-600 text-white shadow-chunky-sm translate-y-[-1px]'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {strat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Session / Logout */}
      <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onLogout();
          }}
          className="rounded-xl border-2 border-slate-800 bg-rose-500 hover:bg-rose-600 px-5 py-2.5 text-sm font-black text-white shadow-chunky-sm active:translate-y-0.5 cursor-pointer"
        >
          🚪 Log Out & Reset Session
        </button>
      </div>
    </div>
  );
};
