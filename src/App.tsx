import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AppState, AvatarState, Quest, CategoryChallenge, Achievement, AvatarTrait, CustomCategory, UserSettings } from './types/todo';
import {
  INITIAL_STATE,
  calculateLevel,
  DIFFICULTY_XP,
  updateStreakOnCompletion,
  calculateFinalXP,
  getTodayDateString,
  getClassSpecificChallenges,
} from './utils/gameEngine';
import { AuthGatekeeper } from './components/AuthGatekeeper';
import { HeaderBar } from './components/HeaderBar';
import { ResponsiveNavBar, NavigationTab } from './components/ResponsiveNavBar';
import { TaskBoard } from './components/TaskBoard';
import { ActiveQuestBanner } from './components/ActiveQuestBanner';
import { AddQuestForm } from './components/AddQuestForm';
import { AddCategoryModal } from './components/AddCategoryModal';
import { BossAndDailySection } from './components/BossAndDailySection';
import { AvatarModal } from './components/AvatarModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { AchievementCabinet } from './components/AchievementCabinet';
import { SettingsModal } from './components/SettingsModal';
import { LevelUpModal } from './components/LevelUpModal';
import { sounds } from './utils/audio';
import { RefreshCw, Heart } from 'lucide-react';

const STORAGE_KEY = 'gamified_todo_app_state';

const getInitialAppState = (): AppState => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed?.user?.isLoggedIn === true && parsed?.user?.username) {
        return {
          ...INITIAL_STATE,
          ...parsed,
          user: { ...INITIAL_STATE.user, ...(parsed.user || {}) },
          settings: { ...INITIAL_STATE.settings, ...(parsed.settings || {}) },
          avatar: { ...INITIAL_STATE.avatar, ...(parsed.avatar || {}) },
          customCategories: parsed.customCategories || INITIAL_STATE.customCategories,
          quests: parsed.quests || INITIAL_STATE.quests,
          challenges: INITIAL_STATE.challenges.map((defCh) => {
            const found = (parsed.challenges || []).find((c: CategoryChallenge) => c.id === defCh.id);
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
    }
  } catch (error) {
    console.warn('LocalStorage access blocked or unreadable:', error);
  }

  // DEFAULT STATE FOR NEW / INCOGNITO USERS (MUST SHOW LOGIN)
  return INITIAL_STATE;
};

export function App() {
  // Persistent State initialized safely
  const [state, setState] = useState<AppState>(getInitialAppState);

  const [activeTab, setActiveTab] = useState<NavigationTab>('quests');
  const [isAddQuestModalOpen, setIsAddQuestModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isSkillTreeModalOpen, setIsSkillTreeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  // Sync Audio Settings
  useEffect(() => {
    sounds.volume = state.settings.volume;
    sounds.isMuted = !state.settings.soundEnabled;
  }, [state.settings.volume, state.settings.soundEnabled]);

  // Persist State to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage save fallback
    }
  }, [state]);

  // Guaranteed Dark/Light Theme Engine
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.theme]);

  // Real-Time Focus Timer Tick Engine
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
          if (c.id === 'boss_bug_leviathan') {
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

  // Confetti trigger
  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#FDCB6E', '#55E6C1', '#FF7675', '#74B9FF', '#A29BFE', '#D63031'],
    });
  };

  // Auth Handlers
  const handleLogin = (username: string, primaryClass: 'coding' | 'workout' | 'work' | 'study') => {
    sounds.playLevelUp();
    setState((prev) => ({
      ...prev,
      user: {
        username,
        primaryClass,
        isLoggedIn: true,
      },
      challenges: getClassSpecificChallenges(primaryClass),
    }));
  };

  const handleLogout = () => {
    sounds.playPop();
    setState((prev) => ({
      ...prev,
      user: {
        username: '',
        isLoggedIn: false,
      },
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    let bonusXP = 0;
    const newlyUnlocked: Achievement[] = [];

    const updatedAchievements = state.achievements.map((a) => {
      if (a.unlocked) return a;
      let shouldUnlock = false;

      if (a.id === 'dark_knight' && newSettings.theme === 'dark') {
        shouldUnlock = true;
      }
      if (a.id === 'sound_check' && (newSettings.volume !== undefined || newSettings.soundEnabled !== undefined)) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        bonusXP += a.xpReward;
        const unlockedObj = { ...a, unlocked: true, progress: a.maxProgress };
        newlyUnlocked.push(unlockedObj);
        return unlockedObj;
      }
      return a;
    });

    if (newlyUnlocked.length > 0) {
      sounds.playAchievementUnlocked();
      triggerConfetti();
    }

    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
      xp: prev.xp + bonusXP,
      achievements: updatedAchievements,
    }));
  };

  // Add Custom Category Handler
  const handleAddCategory = (name: string, icon: string, colorHex: string) => {
    const newCategory: CustomCategory = {
      id: 'custom-' + Date.now(),
      name,
      icon,
      colorHex,
    };

    const nextCustom = [...state.customCategories, newCategory];
    const { updatedAchievements, bonusXP, newlyUnlocked } = evaluateAchievements(
      state.quests,
      state.streak,
      state.achievements,
      state.challenges,
      false,
      undefined,
      nextCustom
    );

    if (newlyUnlocked.length > 0) {
      sounds.playAchievementUnlocked();
      triggerConfetti();
    }

    setState((prev) => ({
      ...prev,
      customCategories: nextCustom,
      xp: prev.xp + bonusXP,
      achievements: updatedAchievements,
    }));
  };

  // Evaluate Traits
  const evaluateTraits = (
    currentXP: number,
    currentQuests: Quest[],
    currentStreak: number,
    currentTraits: AvatarTrait[]
  ): { updatedTraits: AvatarTrait[] } => {
    const level = calculateLevel(currentXP);
    const completedCoding = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'coding').length;
    const completedWorkout = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'workout').length;
    const completedStudy = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'study').length;

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
        return { ...t, unlocked: true };
      }
      return t;
    });

    return { updatedTraits };
  };

  // Evaluate 30 Achievements
  const evaluateAchievements = (
    currentQuests: Quest[],
    currentStreak: number,
    currentAchievements: Achievement[],
    currentChallenges: CategoryChallenge[],
    isAvatarCustomized: boolean = false,
    lastCompletedQuest?: Quest,
    currentCustomCategories: CustomCategory[] = state.customCategories
  ): { updatedAchievements: Achievement[]; bonusXP: number; newlyUnlocked: Achievement[] } => {
    const totalCompleted = currentQuests.filter((q) => q.status === 'completed').length;
    const completedCoding = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'coding').length;
    const completedWorkout = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'workout').length;
    const completedStudy = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'study').length;
    const completedWork = currentQuests.filter((q) => q.status === 'completed' && q.categoryId === 'work').length;
    const completedHard = currentQuests.filter((q) => q.status === 'completed' && q.difficulty === 'hard').length;
    const activeQuestsCount = currentQuests.filter((q) => q.status !== 'completed').length;

    const completedBossesCount = currentChallenges.filter((c) => c.type === 'boss' && c.completed).length;

    const totalFocusSeconds = currentQuests.reduce((acc, q) => acc + q.timeSpentSeconds, 0);
    const totalFocusMinutes = Math.floor(totalFocusSeconds / 60);

    const todayStr = getTodayDateString();
    const todayCompletedCount = currentQuests.filter(
      (q) => q.status === 'completed' && q.completedAt && q.completedAt.split('T')[0] === todayStr
    ).length;

    const currentHour = new Date().getHours();
    const isNightTime = currentHour >= 0 && currentHour < 4;
    const isEarlyBirdTime = currentHour >= 5 && currentHour < 7;

    const otherUnlockedCount = currentAchievements.filter(
      (a) => a.id !== 'trophy_hunter' && a.id !== 'completionist' && a.unlocked
    ).length;

    const totalUnlockedCount = currentAchievements.filter((a) => a.unlocked).length;

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

        case 'code_10':
          newProgress = Math.min(10, completedCoding);
          shouldUnlock = completedCoding >= 10;
          break;
        case 'fit_10':
          newProgress = Math.min(10, completedWorkout);
          shouldUnlock = completedWorkout >= 10;
          break;
        case 'study_10':
          newProgress = Math.min(10, completedStudy);
          shouldUnlock = completedStudy >= 10;
          break;
        case 'work_10':
          newProgress = Math.min(10, completedWork);
          shouldUnlock = completedWork >= 10;
          break;

        case 'three_swords':
          if (state.avatar.backItem === 'zoro_3swords' && lastCompletedQuest && lastCompletedQuest.difficulty === 'hard') {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'black_blade':
          if (state.avatar.backItem === 'mihawk_yoru') {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'straw_hat_will':
          if (state.avatar.headItem === 'straw_hat') {
            newProgress = Math.min(7, currentStreak);
            shouldUnlock = currentStreak >= 7;
          }
          break;

        case 'emperor_hair':
          if (state.avatar.hairStyle === 'shanks_flow') {
            newProgress = Math.min(5, completedHard);
            shouldUnlock = completedHard >= 5;
          }
          break;

        case 'deadline_clutch':
          if (lastCompletedQuest && lastCompletedQuest.dueDateTime) {
            const due = new Date(lastCompletedQuest.dueDateTime).getTime();
            const now = new Date().getTime();
            const diffMins = (due - now) / 60000;
            if (diffMins > 0 && diffMins <= 15) {
              newProgress = 1;
              shouldUnlock = true;
            }
          }
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

        case 'wardrobe_king':
          if (isAvatarCustomized) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'dark_knight':
          if (state.settings.theme === 'dark') {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'sound_check':
          if (state.settings.volume !== 80 || !state.settings.soundEnabled) {
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

        case 'time_master':
          newProgress = Math.min(300, totalFocusMinutes);
          shouldUnlock = totalFocusMinutes >= 300;
          break;

        case 'clean_slate':
          if (activeQuestsCount === 0 && totalCompleted > 0) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'overachiever':
          newProgress = Math.min(5, todayCompletedCount);
          shouldUnlock = todayCompletedCount >= 5;
          break;

        case 'custom_cat':
          newProgress = Math.min(1, currentCustomCategories.length);
          shouldUnlock = currentCustomCategories.length >= 1;
          break;

        case 'custom_timer':
          if (lastCompletedQuest && lastCompletedQuest.hasCustomDeadline) {
            newProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'trophy_hunter':
          newProgress = Math.min(15, otherUnlockedCount);
          shouldUnlock = otherUnlockedCount >= 15;
          break;

        case 'completionist':
          newProgress = Math.min(25, totalUnlockedCount);
          shouldUnlock = totalUnlockedCount >= 25;
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

  // Quest Handlers
  const handleAddQuest = (
    title: string,
    categoryId: string,
    difficulty: 'easy' | 'medium' | 'hard',
    estimatedMinutes: number,
    hasCustomDeadline: boolean,
    dueDateTime: string | null
  ) => {
    const newQuest: Quest = {
      id: 'quest-' + Date.now(),
      title,
      categoryId,
      difficulty,
      estimatedMinutes,
      hasCustomDeadline,
      dueDateTime,
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
    const { finalXP } = calculateFinalXP(baseXP, newStreak, quest.categoryId, state.traits);

    const oldLevel = calculateLevel(state.xp);
    const completedQuestObj: Quest = { ...quest, status: 'completed' as const, completedAt: nowIso };

    const nextQuests = state.quests.map((q) => (q.id === id ? completedQuestObj : q));

    // Update Boss & Daily Challenges
    const nextChallenges = state.challenges.map((c) => {
      if (c.id === 'daily_code' && quest.categoryId === 'coding') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      if (c.id === 'daily_workout' && quest.categoryId === 'workout') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      if (c.id === 'boss_legday_colossus' && quest.categoryId === 'workout' && quest.difficulty === 'hard') {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      if (c.id === 'boss_procrastination_dragon' && (quest.categoryId === 'work' || quest.categoryId === 'study')) {
        return { ...c, currentCount: Math.min(c.targetCount, c.currentCount + 1) };
      }
      return c;
    });

    const { updatedAchievements, bonusXP, newlyUnlocked } = evaluateAchievements(
      nextQuests,
      newStreak,
      state.achievements,
      nextChallenges,
      false,
      completedQuestObj
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

  const handleSelectTab = (tab: NavigationTab) => {
    if (tab === 'settings') {
      setIsSettingsModalOpen(true);
    } else if (tab === 'avatar') {
      setIsAvatarModalOpen(true);
    } else if (tab === 'badges') {
      setIsAchievementsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all pirate quests, levels, and avatar state back to default?')) {
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
  const isDark = state.settings.theme === 'dark';

  // Auth Guard
  if (!state.user.isLoggedIn) {
    return <AuthGatekeeper onLogin={(name, cls) => handleLogin(name, cls)} />;
  }

  return (
    <div
      className={`min-h-screen pb-20 md:pb-8 pt-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-between transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#FAF6EE] text-slate-800'
      }`}
    >
      <div>
        {/* Active Focus Banner */}
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
          user={state.user}
          settings={state.settings}
          avatar={state.avatar}
          xp={state.xp}
          streak={state.streak}
          unlockedBadgesCount={unlockedBadgesCount}
          totalBadgesCount={state.achievements.length}
          traits={state.traits}
          onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
          onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
          onOpenSkillTreeModal={() => setIsSkillTreeModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        {/* Responsive Desktop & Mobile Navigation Bar */}
        <ResponsiveNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          unlockedBadgesCount={unlockedBadgesCount}
          totalBadgesCount={state.achievements.length}
        />

        {/* Content Tab Views */}
        {activeTab === 'quests' && (
          <TaskBoard
            quests={state.quests}
            activeQuestId={state.activeQuestId}
            streak={state.streak}
            traits={state.traits}
            customCategories={state.customCategories}
            onOpenAddQuestModal={() => setIsAddQuestModalOpen(true)}
            onStartQuest={handleStartQuest}
            onFinishQuest={handleFinishQuest}
            onDeleteQuest={handleDeleteQuest}
            onClearCompleted={handleClearCompleted}
          />
        )}

        {activeTab === 'challenges' && (
          <BossAndDailySection
            challenges={state.challenges}
            customCategories={state.customCategories}
            onClaimReward={handleClaimChallengeReward}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-300 dark:border-slate-800 pt-6">
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400 inline" />
          <span>for Pirate Guild Focus & Grand Line Conquest</span>
        </div>

        <button
          onClick={handleResetData}
          className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
        >
          <RefreshCw className="w-3 h-3" /> Reset Demo Data
        </button>
      </footer>

      {/* Modal Overlay Dialogs */}
      <AddQuestForm
        isOpen={isAddQuestModalOpen}
        onClose={() => setIsAddQuestModalOpen(false)}
        customCategories={state.customCategories}
        onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
        onAddQuest={handleAddQuest}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
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

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={state.settings}
        onUpdateSettings={handleUpdateSettings}
        onLogout={handleLogout}
      />

      <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
    </div>
  );
}

export default App;
