import React from 'react';
import { UserSettings } from '../types/todo';
import { X, Settings, Moon, Sun, Volume2, VolumeX, LogOut, Sliders, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onUpdateSettings({ volume: val });
    sounds.volume = val;
    sounds.playPop();
  };

  const handleToggleMute = () => {
    const nextMuted = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: nextMuted });
    sounds.isMuted = !nextMuted;
    if (nextMuted) sounds.playPop();
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    sounds.playPop();
    onUpdateSettings({ theme: nextTheme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-md overflow-hidden bg-[#FAF6EE] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-indigo-200 dark:bg-slate-800 border-b-4 border-slate-800 dark:border-indigo-500/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-300 dark:bg-indigo-600 border-2 border-slate-800 rounded-xl shadow-chunky-sm">
              <Settings className="w-5 h-5 text-indigo-950 dark:text-white" />
            </div>
            <h2 className="text-xl font-black">Pirate Guild Settings</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-indigo-300 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Theme Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Color Theme Mode
            </label>
            <button
              type="button"
              onClick={handleToggleTheme}
              className={`w-full p-3.5 rounded-2xl border-3 border-slate-800 dark:border-slate-700 text-sm font-black flex items-center justify-between transition-all ${
                isDark
                  ? 'bg-indigo-950 text-indigo-200 shadow-chunky-sm'
                  : 'bg-white text-slate-900 shadow-chunky-sm'
              }`}
            >
              <span className="flex items-center gap-2">
                {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <span>{isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
              </span>
              <span className="bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white text-xs px-3 py-1 rounded-xl border border-slate-800">
                Switch Theme
              </span>
            </button>
          </div>

          {/* Volume & Audio Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-500" /> Audio & Sound Effects
              </label>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`px-3 py-1 rounded-xl border-2 border-slate-800 text-xs font-black flex items-center gap-1 transition-all ${
                  settings.soundEnabled
                    ? 'bg-emerald-300 text-slate-900 shadow-chunky-sm'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {settings.soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> 🔊 Sound On
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> 🔇 Muted
                  </>
                )}
              </button>
            </div>

            {/* Slider */}
            <div className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span>Master Volume</span>
                <span>{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={handleVolumeChange}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-2 border-t-2 border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="btn-tactile w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 text-sm flex items-center justify-center gap-2 shadow-chunky"
            >
              <LogOut className="w-4 h-4 stroke-[3]" />
              <span>Leave Pirate Guild (Logout)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-100 dark:bg-slate-800 border-t-4 border-slate-800 dark:border-indigo-500/40 flex justify-end">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="btn-tactile bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-2 text-sm font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
