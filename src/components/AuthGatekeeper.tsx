import React, { useState } from 'react';
import { HERO_CLASSES } from '../utils/gameEngine';
import { CharacterClass, TodoType } from '../types/todo';
import { Sparkles, User, Mail, Calendar, ArrowRight, Wand2, Shield } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AuthGatekeeperProps {
  onLogin: (
    username: string,
    email: string,
    age: number,
    primaryClass: CharacterClass,
    todoType: TodoType
  ) => void;
}

export const AuthGatekeeper: React.FC<AuthGatekeeperProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Hero Alex');
  const [email, setEmail] = useState('alex@guild.rpg');
  const [age, setAge] = useState<number>(22);
  const [primaryClass, setPrimaryClass] = useState<CharacterClass>('coding');
  const [todoType, setTodoType] = useState<TodoType>('strict_rpg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    sounds.playLevelUp();
    onLogin(username.trim(), email.trim(), age, primaryClass, todoType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF6EE] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-12">
      <div className="card-cozy w-full max-w-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 shadow-chunky-lg animate-pop-in space-y-6 relative overflow-hidden">
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
            Customize your adventurer profile, select your Hero Class & Productivity Strategy to generate strategy-tailored challenges!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hero Adventurer Name Input */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-500" /> Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Hero Luffy"
                className="w-full px-3.5 py-2.5 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40 text-xs"
                required
              />
            </div>

            {/* Email Input */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@guild.rpg"
                className="w-full px-3.5 py-2.5 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40 text-xs"
                required
              />
            </div>

            {/* Age Input */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Age
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                className="w-full px-3.5 py-2.5 rounded-2xl border-3 border-slate-800 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-indigo-500/40 text-xs"
                required
              />
            </div>
          </div>

          {/* Character Class Selection Cards */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
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
                      setPrimaryClass(cls.id as CharacterClass);
                    }}
                    className={`p-3.5 rounded-2xl border-3 border-slate-800 dark:border-indigo-400 text-left transition-all flex flex-col justify-between cursor-pointer ${
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

          {/* Choose Your Productivity Strategy Cards */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" /> Choose Your Productivity Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'strict_rpg', title: '⚡ Strict Sprints', desc: 'Timed focus & strict deadlines' },
                { id: 'casual_habits', title: '🌿 Casual Tracker', desc: 'Flexible daily routines' },
                { id: 'project_bosses', title: '⚔️ Boss Fights', desc: 'Break projects into boss battles' },
              ].map((strategy) => {
                const isSelected = todoType === strategy.id;

                return (
                  <button
                    key={strategy.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setTodoType(strategy.id as TodoType);
                    }}
                    className={`rounded-2xl border-2 border-slate-800 p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-chunky-sm translate-y-[-2px]'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-black">{strategy.title}</div>
                    <div className="text-[10px] opacity-80 mt-1 leading-tight">{strategy.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Specialty Highlights on Login Screen */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-slate-800 bg-amber-100 dark:bg-slate-800 p-3 shadow-chunky-sm">
              <div className="text-lg">🥋</div>
              <div className="text-xs font-black text-slate-900 dark:text-white mt-1">Full-Body RPG Avatar</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Custom gear, One Piece katanas & hats.</div>
            </div>

            <div className="rounded-2xl border-2 border-slate-800 bg-indigo-100 dark:bg-slate-800 p-3 shadow-chunky-sm">
              <div className="text-lg">🎯</div>
              <div className="text-xs font-black text-slate-900 dark:text-white mt-1">Class-Tailored Bosses</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Weekly challenges for Coders, Gym, & Study.</div>
            </div>

            <div className="rounded-2xl border-2 border-slate-800 bg-emerald-100 dark:bg-slate-800 p-3 shadow-chunky-sm">
              <div className="text-lg">⚡</div>
              <div className="text-xs font-black text-slate-900 dark:text-white mt-1">Productivity Strategies</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Choose between Strict Sprints or Habits.</div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="btn-tactile w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black py-4 text-base flex items-center justify-center gap-2 shadow-chunky cursor-pointer"
          >
            <span>Begin Adventure</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </form>
      </div>
    </div>
  );
};
