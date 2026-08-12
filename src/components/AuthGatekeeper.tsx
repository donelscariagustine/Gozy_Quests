import React, { useState } from 'react';
import { HERO_CLASSES } from '../utils/gameEngine';
import { Sparkles, User, ArrowRight, Wand2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AuthGatekeeperProps {
  onLogin: (username: string, primaryClass: 'coding' | 'workout' | 'work' | 'study') => void;
}

export const AuthGatekeeper: React.FC<AuthGatekeeperProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Hero Alex');
  const [primaryClass, setPrimaryClass] = useState<'coding' | 'workout' | 'work' | 'study'>('coding');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    sounds.playLevelUp();
    onLogin(username.trim(), primaryClass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF6EE] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="card-cozy w-full max-w-xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 shadow-chunky-lg animate-pop-in space-y-6 relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-200/50 dark:bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Guild Banner Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white px-4 py-1.5 rounded-2xl border-2 border-slate-800 dark:border-indigo-400 text-xs font-black uppercase tracking-wider shadow-chunky-sm">
            <Sparkles className="w-4 h-4 fill-amber-400" /> Enter Pirate Guild
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Cozy Quests RPG
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
            Select your starting Hero Class to generate custom daily focus sprints and boss battles!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Adventurer Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <User className="w-4 h-4 text-indigo-500" /> Hero Adventurer Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Hero Luffy"
              className="w-full px-4 py-3 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40 text-sm"
              required
            />
          </div>

          {/* Character Class Selection Cards */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-indigo-500" /> Choose Starting Hero Class
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HERO_CLASSES.map((cls) => {
                const isSelected = primaryClass === cls.id;

                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setPrimaryClass(cls.id as 'coding' | 'workout' | 'work' | 'study');
                    }}
                    className={`p-3.5 rounded-2xl border-3 border-slate-800 dark:border-indigo-400 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white shadow-chunky-sm translate-y-[-2px]'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cls.icon}</div>
                    <div>
                      <h4 className="text-xs font-black">{cls.name}</h4>
                      <p className="text-[10px] opacity-80 leading-tight mt-0.5">{cls.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-tactile w-full bg-emerald-400 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-slate-900 font-black py-3.5 text-base flex items-center justify-center gap-2 shadow-chunky"
          >
            <span>Enter Pirate Guild</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </form>
      </div>
    </div>
  );
};
