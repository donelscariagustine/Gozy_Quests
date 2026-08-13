import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AppState, AvatarState, Quest, CategoryChallenge, Achievement, AvatarTrait, CustomCategory, UserSettings, CharacterClass, TodoType } from './types/todo';
import {
  INITIAL_STATE,
  calculateLevel,
  updateStreakOnCompletion,
  getTodayDateString,
  getWeeklyChallenges,
  getClassInitialQuests,
  TODO_TYPE_LABELS,
  getXPProgress,
} from './utils/gameEngine';
import { AuthGatekeeper } from './components/AuthGatekeeper';
import { HeaderBar, ActiveTab, MainNavTab } from './components/HeaderBar';
import { FullBodyAvatarRenderer } from './components/FullBodyAvatarRenderer';
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
import { Trophy, Zap, Flame, Crown, RefreshCw, Heart, Sparkles } from 'lucide-react';

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
  const [state, setState] = useState<AppState>(getInitialAppState);

  const [isAddQuestModalOpen, setIsAddQuestModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('quests');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isSkillTreeModalOpen, setIsSkillTreeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  const handleChangeClass = (newClass: CharacterClass) => {
    const newChallenges = getWeeklyChallenges(newClass);
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, primaryClass: newClass },
      challenges: newChallenges,
    }));
  };

  const handleChangeStrategy = (newStrategy: TodoType) => {
    const newQuests = getClassInitialQuests(state.user.primaryClass, newStrategy);
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, todoType: newStrategy },
      quests: newQuests,
    }));
  };

  const handleToggleTheme = () => {
    const newTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ theme: newTheme });
  };

  // Sync Audio Settings
  useEffect(() => {
    sounds.volume = state.settings.volume;
    sounds.isMuted = !state.settings.soundEnabled;
  }, [state.settings.volume, state.settings.soundEnabled]);

  // Persist State to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Unable to save state to localStorage:', error);
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
          if (c.id.includes('focus') || c.id.includes('Kaido') || c.id.includes('Titan')) {
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
  const handleLogin = (
    username: string,
    email: string,
    age: number,
    primaryClass: CharacterClass,
    todoType: TodoType
  ) => {
    sounds.playLevelUp();
    const initialQuests = getClassInitialQuests(primaryClass, todoType);
    const weeklyChallenges = getWeeklyChallenges(primaryClass);

    setState((prev) => ({
      ...prev,
      user: {
        username,
        email,
        age,
        primaryClass,
        todoType,
        isLoggedIn: true,
      },
      quests: initialQuests,
      challenges: weeklyChallenges,
    }));
  };

  const handleLogout = () => {
    sounds.playPop();
    setState((prev) => ({
      ...prev,
      user: {
        username: '',
        email: '',
        age: 20,
        primaryClass: 'coding',
        todoType: 'strict_rpg',
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

  const handleUpdateTodoType = (todoType: TodoType) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, todoType },
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
    estimatedMinutes: number,
    hasCustomDeadline: boolean,
    dueDateTime: string | null
  ) => {
    const newQuest: Quest = {
      id: 'quest-' + Date.now(),
      title,
      categoryId,
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

  const handleCancelQuest = (id: string) => {
    setIsTimerPaused(false);
    setState((prev) => ({
      ...prev,
      activeQuestId: prev.activeQuestId === id ? null : prev.activeQuestId,
      quests: prev.quests.map((q) =>
        q.id === id ? { ...q, status: 'idle', timeSpentSeconds: 0 } : q
      ),
    }));
  };

  // OVERHAULED: Standard Quests award 0 direct XP!
  const handleFinishQuest = (id: string) => {
    const quest = state.quests.find((q) => q.id === id);
    if (!quest) return;

    const nowIso = new Date().toISOString();
    const { newStreak, newDate, streakBonusXP } = updateStreakOnCompletion(state.streak, state.lastCompletedDate);

    const oldLevel = calculateLevel(state.xp);
    const completedQuestObj: Quest = { ...quest, status: 'completed' as const, completedAt: nowIso };

    const nextQuests = state.quests.map((q) => (q.id === id ? completedQuestObj : q));

    // Update Boss & Daily Challenges
    const nextChallenges = state.challenges.map((c) => {
      if (c.categoryId === quest.categoryId) {
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

    // XP IS EXCLUSIVELY STREAK MILESTONES OR CHALLENGE REWARDS
    const totalNewXP = state.xp + streakBonusXP + bonusXP;
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

  // EXCLUSIVE XP SOURCE: Claiming completed Daily & Boss Challenges!
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
  const xpInfo = useMemo(() => getXPProgress(state.xp), [state.xp]);
  const isDark = state.settings.theme === 'dark';
  const todoInfo = TODO_TYPE_LABELS[state.user.todoType || 'strict_rpg'];

  // Auth Guard
  if (!state.user.isLoggedIn) {
    return <AuthGatekeeper onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Header Bar Spanning Full max-w-7xl Width */}
      <HeaderBar
        user={state.user}
        settings={state.settings}
        avatar={state.avatar}
        xp={state.xp}
        streak={state.streak}
        unlockedBadgesCount={unlockedBadgesCount}
        totalBadgesCount={state.achievements.length}
        traits={state.traits}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
        onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
        onOpenSkillTreeModal={() => setIsSkillTreeModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Desktop Dashboard Container with Dedicated View Switcher */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {activeTab === 'quests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* MAIN COLUMN (Desktop: 8 cols) - Active Quest Focus & Main Quest Board */}
            <div className="lg:col-span-8 space-y-6">
              {/* Active Focus Banner */}
              {activeQuestObj && (
                <ActiveQuestBanner
                  quest={activeQuestObj}
                  isPaused={isTimerPaused}
                  streak={state.streak}
                  onPauseResume={() => setIsTimerPaused(!isTimerPaused)}
                  onFinishQuest={handleFinishQuest}
                  onCancelQuest={handleCancelQuest}
                />
              )}

              {/* Task Board */}
              <TaskBoard
                quests={state.quests}
                activeQuestId={state.activeQuestId}
                streak={state.streak}
                traits={state.traits}
                customCategories={state.customCategories}
                onOpenAddQuestModal={() => setIsAddQuestModalOpen(true)}
                onStartQuest={handleStartQuest}
                onFinishQuest={handleFinishQuest}
                onCancelQuest={handleCancelQuest}
                onDeleteQuest={handleDeleteQuest}
                onClearCompleted={handleClearCompleted}
              />
            </div>

            {/* RIGHT COLUMN (Desktop: 4 cols) - Weekly Class Challenges & Achievements Matrix */}
            <div className="lg:col-span-4 space-y-6 max-w-full overflow-hidden">
              {/* Dynamic Weekly Class Challenges */}
              <BossAndDailySection
                challenges={state.challenges}
                customCategories={state.customCategories}
                onClaimReward={handleClaimChallengeReward}
              />

              {/* Achievement Matrix Preview Card */}
              <div className="card-cozy p-4 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Bounty Matrix</h3>
                  </div>

                  <span className="bg-amber-300 text-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-xs font-black">
                    {unlockedBadgesCount} / {state.achievements.length}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {state.achievements.slice(0, 10).map((ach) => (
                    <div
                      key={ach.id}
                      className={`w-9 h-9 rounded-xl border-2 border-slate-800 flex items-center justify-center text-sm shadow-chunky-sm ${
                        ach.unlocked
                          ? 'bg-amber-300 dark:bg-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 opacity-40 grayscale'
                      }`}
                      title={ach.title}
                    >
                      {ach.badgeIcon}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setIsAchievementsModalOpen(true);
                  }}
                  className="btn-tactile w-full bg-slate-800 text-white font-black py-2 text-xs"
                >
                  🏆 View All 30 Achievements
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Bosses & Challenges View */}
        {activeTab === 'challenges' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-cozy p-6 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🐲</span> Weekly Seeded Bosses & Class Challenges
              </h2>
              <BossAndDailySection
                challenges={state.challenges}
                customCategories={state.customCategories}
                onClaimReward={handleClaimChallengeReward}
              />
            </div>
          </div>
        )}

        {/* Dedicated Avatar Studio View */}
        {activeTab === 'avatar' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-cozy p-6 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 flex flex-col items-center text-center space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>👗</span> Full-Body Avatar Studio
              </h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Customize your pirate hero's headgear, face accessories, outfit, skin tone, and back items!
              </p>
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="btn-tactile bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-6 py-3 text-sm shadow-chunky-sm"
              >
                ✨ Open Wardrobe Customizer
              </button>
            </div>
          </div>
        )}

        {/* Dedicated Badges View */}
        {activeTab === 'badges' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-cozy p-6 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏆</span> 30-Achievement Bounty Matrix ({unlockedBadgesCount}/{state.achievements.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {state.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-2xl border-2 border-slate-800 flex items-center gap-3 transition-all ${
                      ach.unlocked
                        ? 'bg-amber-100 dark:bg-indigo-950/60 border-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl border-2 border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-xl shrink-0">
                      {ach.badgeIcon}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                        {ach.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        {ach.description}
                      </p>
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400">
                        +{ach.xpReward} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Skills View */}
        {activeTab === 'skills' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="card-cozy p-6 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>⚡</span> Skill Tree & Traits ({state.traits.filter((t) => t.unlocked).length}/{state.traits.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.traits.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border-2 border-slate-800 flex items-start gap-3 ${
                      t.unlocked
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500'
                        : 'bg-slate-100 dark:bg-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl border-2 border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-xl shrink-0">
                      {t.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {t.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                        {t.description}
                      </p>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                        {t.effect}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs font-bold text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto px-4 py-6 border-t-2 border-slate-300 dark:border-slate-800">
        <div>
          🏴‍☠️ Stardew x One Piece Productivity Guild • Designed for Google Antigravity
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="hover:underline text-indigo-600 dark:text-indigo-400"
          >
            Settings
          </button>
          <span>•</span>
          <button
            onClick={handleResetData}
            className="hover:underline text-rose-500"
          >
            Reset Progress
          </button>
        </div>
      </footer>

      {/* Modals & Drawers */}
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
        primaryClass={state.user.primaryClass}
        onUpdateSettings={handleUpdateSettings}
        onChangeClass={handleChangeClass}
        onLogout={handleLogout}
      />

      <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />
    </div>
  );
}

export default App;
