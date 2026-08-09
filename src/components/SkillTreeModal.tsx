import React from 'react';
import { AvatarTrait } from '../types/todo';
import { Sparkles, X, Lock, CheckCircle2, Zap } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  traits: AvatarTrait[];
  currentLevel: number;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  isOpen,
  onClose,
  traits,
  currentLevel,
}) => {
  if (!isOpen) return null;

  const unlockedCount = traits.filter((t) => t.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] bg-[#FAF6EE]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-indigo-200 border-b-4 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-300 border-2 border-slate-800 rounded-xl shadow-chunky-sm text-xl">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Skill Tree & Traits</h2>
              <p className="text-xs font-bold text-slate-700">
                Unlocked {unlockedCount} of {traits.length} Passive Adventurer Skills
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-indigo-300 text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traits.map((trait) => {
              const isUnlocked = trait.unlocked;
              const isLevelMet = currentLevel >= trait.requiredLevel;

              return (
                <div
                  key={trait.id}
                  className={`card-cozy p-4.5 flex flex-col justify-between transition-all relative ${
                    isUnlocked
                      ? 'bg-indigo-50/90 border-indigo-500 shadow-chunky-lg'
                      : 'bg-white border-slate-700 opacity-90'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className={`w-12 h-12 rounded-2xl border-3 border-slate-800 flex items-center justify-center text-2xl shadow-chunky-sm ${
                        isUnlocked
                          ? 'bg-indigo-300 animate-bounce-subtle'
                          : 'bg-slate-100 filter grayscale opacity-70'
                      }`}
                    >
                      {trait.icon}
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border-2 border-slate-800 ${
                        isUnlocked
                          ? 'bg-emerald-300 text-emerald-950'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Req: Level {trait.requiredLevel}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{trait.name}</h4>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />}
                    </div>
                    <p className="text-xs text-slate-600 leading-tight">{trait.description}</p>
                  </div>

                  {/* Bonus Effect Banner */}
                  <div className="mt-auto">
                    <div
                      className={`p-2 rounded-xl text-xs font-black border-2 border-slate-800 flex items-center gap-1.5 ${
                        isUnlocked
                          ? 'bg-indigo-200 text-indigo-950'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-300 flex-shrink-0" />
                      <span className="truncate">{trait.effect}</span>
                    </div>

                    {!isUnlocked && (
                      <div className="mt-2 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>
                          {isLevelMet
                            ? 'Complete required category quests to unlock'
                            : `Reach Level ${trait.requiredLevel} to unlock`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-indigo-100 border-t-4 border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="btn-tactile bg-white hover:bg-slate-100 px-6 py-2 text-sm font-bold text-slate-800"
          >
            Close Skill Tree
          </button>
        </div>
      </div>
    </div>
  );
};
