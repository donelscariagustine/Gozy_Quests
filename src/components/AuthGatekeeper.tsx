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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050811] text-slate-100 py-12 selection:bg-indigo-600 selection:text-white">
      <div className="card-cozy w-full max-w-2xl p-6 sm:p-8 bg-[#0f172a] text-slate-100 border-4 border-slate-800 shadow-2xl animate-pop-in space-y-6 relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Guild Banner Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-2xl border-2 border-slate-700 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 fill-amber-400" /> Enter Pirate Guild
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Gozy Quests RPG
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-medium">
            Customize your adventurer profile, select your Hero Class & Productivity Strategy to generate strategy-tailored challenges!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hero Adventurer Name Input */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Hero Luffy"
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            {/* Email Input */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@guild.rpg"
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-bold placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            {/* Age Input */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Age
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-bold focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Character Class Selection Cards */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-indigo-400" /> Choose Starting Hero Class
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
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm scale-105'
                        : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
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
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" /> Choose Your Productivity Strategy
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
                    className={`rounded-2xl border-2 p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm scale-105'
                        : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
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
            <div className="rounded-2xl border-2 border-slate-800 bg-[#1e293b] p-3">
              <div className="text-lg">🥋</div>
              <div className="text-xs font-black text-white mt-1">Full-Body RPG Avatar</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Custom gear, One Piece katanas & hats.</div>
            </div>

            <div className="rounded-2xl border-2 border-slate-800 bg-[#1e293b] p-3">
              <div className="text-lg">🎯</div>
              <div className="text-xs font-black text-white mt-1">Class-Tailored Bosses</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Weekly challenges for Coders, Gym, & Study.</div>
            </div>

            <div className="rounded-2xl border-2 border-slate-800 bg-[#1e293b] p-3">
              <div className="text-lg">⚡</div>
              <div className="text-xs font-black text-white mt-1">Productivity Strategies</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Choose between Strict Sprints or Habits.</div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="btn-tactile w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 text-base flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#020617] cursor-pointer transition-all"
          >
            <span>Begin Adventure</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </form>
      </div>
    </div>
  );
};
