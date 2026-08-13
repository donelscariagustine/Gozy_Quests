import React from 'react';
import { UserSettings, CharacterClass } from '../types/todo';
import { X, Sun, Moon, Volume2, VolumeX, LogOut, Compass } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  primaryClass: CharacterClass;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onChangeClass: (cls: CharacterClass) => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  primaryClass,
  onUpdateSettings,
  onChangeClass,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-pop-in">
      <div className="card-cozy w-full max-w-lg p-6 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-4 border-slate-800 dark:border-indigo-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 dark:border-slate-700 pb-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Game Settings
          </h2>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="h-9 w-9 rounded-xl border-2 border-slate-800 dark:border-slate-700 bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* 1. Theme Switcher */}
        <div className="space-y-2 rounded-2xl border-2 border-slate-800 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white">Appearance Theme</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Toggle between Light Cream & Deep Midnight Navy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onUpdateSettings({ theme: 'light' });
              }}
              className={`p-3 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                settings.theme === 'light'
                  ? 'bg-amber-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                  : 'bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-600" />
              <span>☀️ Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onUpdateSettings({ theme: 'dark' });
              }}
              className={`p-3 rounded-xl border-2 border-slate-800 dark:border-slate-700 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                settings.theme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-chunky-sm translate-y-[-2px]'
                  : 'bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-300" />
              <span>🌙 Dark Mode</span>
            </button>
          </div>
        </div>

        {/* 2. Primary Class Switcher */}
        <div className="space-y-3 rounded-2xl border-2 border-slate-800 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] p-4">
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-500" /> Primary Quest Category Focus
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Updates default quest bank and weekly boss challenges
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { id: 'coding', label: '💻 Coding / Dev' },
              { id: 'workout', label: '🏋️‍♂️ Workout / Gym' },
              { id: 'study', label: '📚 Study / Learn' },
              { id: 'work', label: '💼 Work / Office' },
            ].map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onChangeClass(cls.id as CharacterClass);
                }}
                className={`rounded-xl border-2 p-2.5 text-xs font-black transition-all cursor-pointer ${
                  primaryClass === cls.id
                    ? 'border-slate-800 dark:border-slate-700 bg-indigo-600 text-white shadow-[2px_2px_0px_0px_#020617] translate-y-[-1px]'
                    : 'border-slate-800 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cls.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Audio Control Slider */}
        <div className="space-y-3 rounded-2xl border-2 border-slate-800 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
              <span>🔊 Chime Volume</span>
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{settings.volume}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => onUpdateSettings({ volume: Number(e.target.value), soundEnabled: Number(e.target.value) > 0 })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* 4. Session Reset & Logout */}
        <div className="pt-2 border-t-2 border-slate-800 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onLogout();
            }}
            className="w-full rounded-2xl border-2 border-slate-800 dark:border-slate-700 bg-rose-600 hover:bg-rose-500 py-3 text-xs font-black text-white shadow-[2px_2px_0px_0px_#020617] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" /> 🚪 Log Out & Reset Session
          </button>
        </div>
      </div>
    </div>
  );
};
