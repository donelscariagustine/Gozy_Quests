import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AppState, AvatarState, Quest, Challenge, Achievement, AvatarTrait, QuestCategory } from './types/todo';
import {
  INITIAL_STATE,
  calculateLevel,
  DIFFICULTY_XP,
  updateStreakOnCompletion,
  calculateFinalXP,
} from './utils/gameEngine';
import { HeaderBar } from './components/HeaderBar';
import { TaskBoard } from './components/TaskBoard';
import { ActiveQuestBanner } from './components/ActiveQuestBanner';
import { AddQuestForm } from './components/AddQuestForm';
import { BossAndDailySection } from './components/BossAndDailySection';
import { AvatarModal } from './components/AvatarModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { AchievementCabinet } from './components/AchievementCabinet';
import { LevelUpModal } from './components/LevelUpModal';
import { sounds } from './utils/audio';
import { Swords, ListTodo, RefreshCw, Heart } from 'lucide-react';

const STORAGE_KEY = 'gamified_todo_state';

export function App() {
  // 1. Initialize State from localStorage
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          avatar: { ...INITIAL_STATE.avatar, ...(parsed.avatar || {}) },
          quests: parsed.quests || INITIAL_STATE.quests,
          challenges: INITIAL_STATE.challenges.map((defCh) => {
            const found = (parsed.challenges || []).find((c: Challenge) => c.id === defCh.id);
            return found ? { ...defCh, ...found } : defCh;
          }),
          achievements: INITIAL_STATE.achievements.map((defAch) => {
            const found = (parsed.achievements || []).find((a: Achievement) => a.id === defAch.id);
            return found ? { ...defAch, ...found } : defAch;
          }),
          traits: INITIAL_STATE.traits.map((defTrait) => {
            const found = (parsed.traits || []).find((t: AvatarTrait) => t.id === defTrait.id);
            return found ? { ...defTrait, ...found } : defTrait;
          }),
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<'quests' | 'challenges'>('quests');
  const [isAddQuestModalOpen, setIsAddQuestModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isSkillTreeModalOpen, setIsSkillTreeModalOpen] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // 2. Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage write error
    }
  }, [state]);

  // 3. Real-Time Focus Timer Tick Engine
  useEffect(() => {
    if (!state.activeQuestId || isTimerPaused) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.activeQuestId) return prev;

        const updatedQuests = prev.quests.map((q) =>
          q.id === prev.activeQuestId ? { ...q, timeSpentSeconds: q.timeSpentSeconds + 1 } : q
        );

        const totalFocusSeconds = updatedQuests.reduce((acc, q) => acc + q.timeSpentSeconds, 0);
        const totalFocusMinutes = Math.floor(totalFocusSeconds / 60);

        const updatedChallenges = prev.challenges.map((c) => {
          if (c.id === 'deep_focus') {
            return { ...c, currentCount: Math.min(c.targetCount, totalFocusMinutes) };
          }
          return c;
        });

        return {
          ...prev,
          quests: updatedQuests,
          challenges: updatedChallenges,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.activeQuestId, isTimerPaused]);

  // Confetti helper
  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#FDCB6E', '#55E6C1', '#FF7675', '#74B9FF', '#A29BFE'],
    });
  };

  // 4. Evaluate Skill Tree Traits Unlocks
  const evaluateTraits = (
    currentXP: number,
    currentQuests: Quest[],
    currentStreak: number,
    currentTraits: AvatarTrait[]
  ): { updatedTraits: AvatarTrait[]; newlyUnlockedTraits: AvatarTrait[] } => {
    const level = calculateLevel(currentXP);
    const completedCoding = currentQuests.filter((q) => q.status === 'completed' && q.category === 'coding').length;
    const completedWorkout = currentQuests.filter((q) => q.status === 'completed' && q.category === 'workout').length;
    const completedStudy = currentQuests.filter((q) => q.status === 'completed' && q.category === 'study').length;

    const newlyUnlockedTraits: AvatarTrait[] = [];

    const updatedTraits = currentTraits.map((t) => {
      if (t.unlocked) return t;

      let shouldUnlock = false;

      switch (t.id) {
        case 'code_ninja':
          shouldUnlock = level >= 3 || completedCoding >= 5;
          break;
        case 'iron_will':
          shouldUnlock = level >= 4 || completedWorkout >= 5;
          break;
        case 'scholar':
          shouldUnlock = level >= 5 || completedStudy >= 5;
          break;
        case 'master_artisan':
          shouldUnlock = level >= 7;
          break;
        case 'time_lord':
          shouldUnlock = level >= 10 && currentStreak >= 7;
          break;
      }

      if (shouldUnlock) {
        const unlockedTrait = { ...t, unlocked: true };
        newlyUnlockedTraits.push(unlockedTrait);
        return unlockedTrait;
      }

      return t;
    });

    return { updatedTraits, newlyUnlockedTraits };
  };

  // 5. Evaluate 20 Achievements Unlocks
  const evaluateAchievements = (
    currentQuests: Quest[],
    currentStreak: number,
    currentAchievements: Achievement[],
    currentChallenges: Challenge[],
    isAvatarCustomized: boolean = false
  ): { updatedAchievements: Achievement[]; bonusXP: number; newlyUnlocked: Achievement[] } => {
    const totalCompleted = currentQuests.filter((q) => q.status === 'completed').length;
    const completedCoding = currentQuests.filter((q) => q.status === 'completed' && q.category === 'coding').length;
    const completedWorkout = currentQuests.filter((q) => q.status === 'completed' && q.category === 'workout').length;
    const completedStudy = currentQuests.filter((q) => q.status === 'completed' && q.category === 'study').length;
    const completedWork = currentQuests.filter((q) => q.status === 'completed' && q.category === 'work').length;
    const completedHard = currentQuests.filter((q) => q.status === 'completed' && q.difficulty === 'hard').length;
    const activeQuestsCount = currentQuests.filter((q) => q.status !== 'completed').length;

    const completedBossesCount = currentChallenges.filter((c) => c.type === 'boss' && c.completed).length;

    const currentHour = new Date().getHours();
    const isNightTime = currentHour >= 0 && currentHour < 4;
    const isEarlyBirdTime = currentHour >= 5 && currentHour < 7;

    let bonusXP = 0;
    const newlyUnlocked: Achievement[] = [];

    const updatedAchievements = currentAchievements.map((ach) => {
      if (ach.unlocked) return ach;

      let newProgress = ach.progress;
      let shouldUnlock = false;

      switch (ach.id) {
        case 'first_step':
          newProgress = Math.min(1, totalCompleted);
          shouldUnlock = totalCompleted >= 1;
          break;
        case 'quest_10':
          newProgress = Math.min(10, totalCompleted);
          shouldUnlock = totalCompleted >= 10;
          break;
        case 'quest_50':
          newProgress = Math.min(50, totalCompleted);
          shouldUnlock = totalCompleted >= 50;
          break;
        case 'quest_100':
          newProgress = Math.min(100, totalCompleted);
          shouldUnlock = totalCompleted >= 100;
          break;

        case 'code_1':
          newProgress = Math.min(1, completedCoding);
          shouldUnlock = completedCoding >= 1;
          break;
        case 'code_10':
          newProgress = Math.min(10, completedCoding);
          shouldUnlock = completedCoding >= 10;
          break;

        case 'fit_1':
          newProgress = Math.min(1, completedWorkout);
          shouldUnlock = completedWorkout >= 1;
          break;
        case 'fit_10':
          newProgress = Math.min(10, completedWorkout);
          shouldUnlock = completedWorkout >= 10;
          break;

        case 'study_1':
          newProgress = Math.min(1, completedStudy);
          shouldUnlock = completedStudy >= 1;
          break;
        case 'study_10':
          newProgress = Math.min(10, completedStudy);
          shouldUnlock = completedStudy >= 10;
          break;

        case 'work_10':
          newProgress = Math.min(10, completedWork);
          shouldUnlock = completedWork >= 10;
          break;

        case 'streak_3':
          newProgress = Math.min(3, currentStreak);
          shouldUnlock = currentStreak >= 3;
          break;
        case 'streak_7':
          newProgress = Math.min(7, currentStreak);
          shouldUnlock = currentStreak >= 7;
          break;
        case 'streak_30':
          newProgress = Math.min(30, currentStreak);
          shouldUnlock = currentStreak >= 30;
          break;

        case 'night_owl':
          if (isNightTime && totalCompleted > 0) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;
        case 'early_bird':
          if (isEarlyBirdTime && totalCompleted > 0) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'boss_slayer':
          newProgress = Math.min(1, completedBossesCount);
          shouldUnlock = completedBossesCount >= 1;
          break;

        case 'hard_spree':
          newProgress = Math.min(5, completedHard);
          shouldUnlock = completedHard >= 5;
          break;

        case 'stylist':
          if (isAvatarCustomized) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'perfectionist':
          if (activeQuestsCount === 0 && totalCompleted > 0) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        bonusXP += ach.xpReward;
        const unlockedObj = {
          ...ach,
          progress: ach.maxProgress,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        newlyUnlocked.push(unlockedObj);
        return unlockedObj;
      }

      return { ...ach, progress: newProgress };
    });

    return { updatedAchievements, bonusXP, newlyUnlocked };
  };

  // 6. Quest Operations
  const handleAddQuest = (
    title: string,
    category: QuestCategory,
    difficulty: 'easy' | 'medium' | 'hard',
    estimatedMinutes: number
  ) => {
    const newQuest: Quest = {
      id: 'quest-' + Date.now(),
      title,
      category,
      difficulty,
      estimatedMinutes,
      status: 'idle',
      timeSpentSeconds: 0,
      createdAt: new Date().toISOString(),
    };

    const nextQuests = [newQuest, ...state.quests];
    const { updatedAchievements, bonusXP, newlyUnlocked } = evaluateAchievements(
      nextQuests,
      state.streak,
      state.achievements,
      state.challenges
    );

    const { updatedTraits } = evaluateTraits(
      state.xp + bonusXP,
      nextQuests,
      state.streak,
      state.traits
    );

    setState((prev) => ({
      ...prev,
      quests: nextQuests,
      xp: prev.xp + bonusXP,
      achievements: updatedAchievements,
      traits: updatedTraits,
    }));

    if (newlyUnlocked.length > 0) {
      sounds.playAchievementUnlocked();
      triggerConfetti();
    }
  };

  const handleStartQuest = (id: string) => {
    setIsTimerPaused(false);
    setState((prev) => ({
      ...prev,
      activeQuestId: id,
      quests: prev.quests.map((q) => (q.id === id ? { ...q, status: 'in_progress' } : q)),
    }));
  };

  const handleFinishQuest = (id: string) => {
    const quest = state.quests.find((q) => q.id === id);
    if (!quest) return;

    const nowIso = new Date().toISOString();
    const { newStreak, newDate } = updateStreakOnCompletion(state.streak, state.lastCompletedDate);

    const baseXP = DIFFICULTY_XP[quest.difficulty];
    const { finalXP } = calculateFinalXP(baseXP, newStreak, quest.category, state.traits);

    const oldLevel = calculateLevel(state.xp);

    const nextQuests = state.quests.map((q) =>
      q.id === id ? { ...q, status: 'completed' as const, completedAt: nowIso } : q
    );

    // Update Boss & Daily Challenges
    const nextChallenges = state.challenges.map((c) => {
      if (c.id === 'daily_code' && quest.category === 'coding') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      if (c.id === 'boss_dragon' && quest.difficulty === 'hard') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      if (c.id === 'boss_bug_leviathan' && quest.category === 'coding') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      if (c.id === 'boss_legday_colossus' && quest.category === 'workout') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      return c;
    });

    // Evaluate Achievements & Traits
    const { updatedAchievements, bonusXP, newlyUnlocked } = evaluateAchievements(
      nextQuests,
      newStreak,
      state.achievements,
      nextChallenges
    );

    const totalNewXP = state.xp + finalXP + bonusXP;
    const newLevel = calculateLevel(totalNewXP);

    const { updatedTraits } = evaluateTraits(
      totalNewXP,
      nextQuests,
      newStreak,
      state.traits
    );

    if (newLevel > oldLevel) {
      sounds.playLevelUp();
      setLevelUpLevel(newLevel);
      triggerConfetti();
    } else if (newlyUnlocked.length > 0) {
      sounds.playAchievementUnlocked();
      triggerConfetti();
    } else {
      sounds.playTaskComplete();
      triggerConfetti();
    }

    setState((prev) => ({
      ...prev,
      activeQuestId: prev.activeQuestId === id ? null : prev.activeQuestId,
      quests: nextQuests,
      challenges: nextChallenges,
      streak: newStreak,
      lastCompletedDate: newDate,
      xp: totalNewXP,
      achievements: updatedAchievements,
      traits: updatedTraits,
    }));
  };

  const handleDeleteQuest = (id: string) => {
    const nextQuests = state.quests.filter((q) => q.id !== id);
    const { updatedAchievements, bonusXP, newlyUnlocked } = evaluateAchievements(
      nextQuests,
      state.streak,
      state.achievements,
      state.challenges
    );

    setState((prev) => ({
      ...prev,
      activeQuestId: prev.activeQuestId === id ? null : prev.activeQuestId,
      quests: nextQuests,
      xp: prev.xp + bonusXP,
      achievements: updatedAchievements,
    }));

    if (newlyUnlocked.length > 0) {
      sounds.playAchievementUnlocked();
      triggerConfetti();
    }
  };

  const handleClearCompleted = () => {
    const nextQuests = state.quests.filter((q) => q.status !== 'completed');
    setState((prev) => ({ ...prev, quests: nextQuests }));
  };

  const handleClaimChallengeReward = (challengeId: string) => {
    const targetChallenge = state.challenges.find((c) => c.id === challengeId);
    if (!targetChallenge || targetChallenge.completed) return;

    const oldLevel = calculateLevel(state.xp);
    const newTotalXP = state.xp + targetChallenge.rewardXp;
    const newLevel = calculateLevel(newTotalXP);

    const updatedChallenges = state.challenges.map((c) =>
      c.id === challengeId ? { ...c, completed: true } : c
    );

    const { updatedAchievements } = evaluateAchievements(
      state.quests,
      state.streak,
      state.achievements,
      updatedChallenges
    );

    const { updatedTraits } = evaluateTraits(
      newTotalXP,
      state.quests,
      state.streak,
      state.traits
    );

    if (newLevel > oldLevel) {
      sounds.playLevelUp();
      setLevelUpLevel(newLevel);
    } else {
      sounds.playAchievementUnlocked();
    }
    triggerConfetti();

    setState((prev) => ({
      ...prev,
      xp: newTotalXP,
      challenges: updatedChallenges,
      achievements: updatedAchievements,
      traits: updatedTraits,
    }));
  };

  const handleSaveAvatar = (newAvatar: AvatarState) => {
    const { updatedAchievements, bonusXP, newlyUnlocked } = evaluateAchievements(
      state.quests,
      state.streak,
      state.achievements,
      state.challenges,
      true
    );

    const oldLevel = calculateLevel(state.xp);
    const newTotalXP = state.xp + bonusXP;
    const newLevel = calculateLevel(newTotalXP);

    if (newlyUnlocked.length > 0) {
      sounds.playAchievementUnlocked();
      triggerConfetti();
    }
    if (newLevel > oldLevel) {
      sounds.playLevelUp();
      setLevelUpLevel(newLevel);
    }

    setState((prev) => ({
      ...prev,
      avatar: newAvatar,
      xp: newTotalXP,
      achievements: updatedAchievements,
    }));
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sounds.isMuted = newMuted;
    if (!newMuted) sounds.playPop();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all quests, level, and category progress?')) {
      sounds.playPop();
      localStorage.removeItem(STORAGE_KEY);
      setState(INITIAL_STATE);
    }
  };

  const activeQuestObj = useMemo(
    () => state.quests.find((q) => q.id === state.activeQuestId),
    [state.quests, state.activeQuestId]
  );

  const unlockedBadgesCount = useMemo(
    () => state.achievements.filter((a) => a.unlocked).length,
    [state.achievements]
  );

  const currentLevel = useMemo(() => calculateLevel(state.xp), [state.xp]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-between">
      <div>
        {/* Sticky Active Quest Timer Banner */}
        {activeQuestObj && (
          <ActiveQuestBanner
            quest={activeQuestObj}
            isPaused={isTimerPaused}
            streak={state.streak}
            traits={state.traits}
            onPauseResume={() => setIsTimerPaused(!isTimerPaused)}
            onFinishQuest={handleFinishQuest}
          />
        )}

        {/* Header Bar */}
        <HeaderBar
          avatar={state.avatar}
          xp={state.xp}
          streak={state.streak}
          unlockedBadgesCount={unlockedBadgesCount}
          totalBadgesCount={state.achievements.length}
          traits={state.traits}
          onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
          onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
          onOpenSkillTreeModal={() => setIsSkillTreeModalOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />

        {/* Main Tab Navigation Bar */}
        <div className="flex gap-2 mb-6 border-b-4 border-slate-800 pb-3">
          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('quests');
            }}
            className={`btn-tactile px-5 py-2.5 text-sm font-black flex items-center gap-2 ${
              activeTab === 'quests'
                ? 'bg-amber-300 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                : 'bg-white text-slate-600 hover:bg-amber-50'
            }`}
          >
            <ListTodo className="w-4 h-4" /> Quests Board
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setActiveTab('challenges');
            }}
            className={`btn-tactile px-5 py-2.5 text-sm font-black flex items-center gap-2 ${
              activeTab === 'challenges'
                ? 'bg-rose-400 text-slate-900 shadow-chunky-sm translate-y-[-2px]'
                : 'bg-white text-slate-600 hover:bg-rose-50'
            }`}
          >
            <Swords className="w-4 h-4" /> Boss Battles & Dailies
          </button>
        </div>

        {/* Content View */}
        {activeTab === 'quests' ? (
          <TaskBoard
            quests={state.quests}
            activeQuestId={state.activeQuestId}
            streak={state.streak}
            traits={state.traits}
            onOpenAddQuestModal={() => setIsAddQuestModalOpen(true)}
            onStartQuest={handleStartQuest}
            onFinishQuest={handleFinishQuest}
            onDeleteQuest={handleDeleteQuest}
            onClearCompleted={handleClearCompleted}
          />
        ) : (
          <BossAndDailySection
            challenges={state.challenges}
            onClaimReward={handleClaimChallengeReward}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs font-bold text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-300 pt-6">
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400 inline" />
          <span>for Gamified Focus & Productivity</span>
        </div>

        <button
          onClick={handleResetData}
          className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
        >
          <RefreshCw className="w-3 h-3" /> Reset Demo Data
        </button>
      </footer>

      {/* Modal Dialogs */}
      <AddQuestForm
        isOpen={isAddQuestModalOpen}
        onClose={() => setIsAddQuestModalOpen(false)}
        onAddQuest={handleAddQuest}
      />

      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        avatar={state.avatar}
        onSaveAvatar={handleSaveAvatar}
      />

      <SkillTreeModal
        isOpen={isSkillTreeModalOpen}
        onClose={() => setIsSkillTreeModalOpen(false)}
        traits={state.traits}
        currentLevel={currentLevel}
      />

      <AchievementCabinet
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={state.achievements}
      />

      <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
    </div>
  );
}

export default App;
