import { AppState, Achievement, Quest, Challenge, AvatarState, AvatarTrait, QuestCategory } from '../types/todo';

export interface CategoryInfo {
  id: QuestCategory;
  name: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const CATEGORIES: Record<QuestCategory, CategoryInfo> = {
  coding: {
    id: 'coding',
    name: 'Coding',
    icon: '💻',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-900',
    badgeBorder: 'border-indigo-400',
  },
  workout: {
    id: 'workout',
    name: 'Workout',
    icon: '🏋️‍♂️',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    badgeBorder: 'border-rose-400',
  },
  work: {
    id: 'work',
    name: 'Work',
    icon: '💼',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-400',
  },
  study: {
    id: 'study',
    name: 'Study',
    icon: '📚',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-400',
  },
  chores: {
    id: 'chores',
    name: 'Chores',
    icon: '🧹',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    badgeBorder: 'border-sky-400',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    icon: '🎨',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-400',
  },
};

export const INITIAL_AVATAR: AvatarState = {
  userName: 'Alex',
  userAgeRank: 'Young Adventurer (18-25)',
  skinColor: '#F1C27D',
  hairStyle: 'short',
  hairColor: '#4A3728',
  outfitColor: '#6C5CE7',
  accessory: 'glasses',
  equippedTitle: 'Code Wizard',
};

export const AVAILABLE_TITLES = [
  'Novice Adventurer',
  'Code Wizard',
  'Fitness Titan',
  'Scholar Supreme',
  'Master Creator',
  'Guild Master',
  'Legendary Hero',
];

export const INITIAL_TRAITS: AvatarTrait[] = [
  {
    id: 'code_ninja',
    name: 'Code Ninja',
    description: 'Master of algorithms & logic.',
    icon: '🥷',
    requiredLevel: 3,
    unlocked: false,
    effect: '+10% XP bonus on Coding Quests',
    categoryBonus: 'coding',
    multiplier: 0.1,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Unshakeable physical discipline.',
    icon: '🛡️',
    requiredLevel: 4,
    unlocked: false,
    effect: '+10% XP bonus on Workout Quests',
    categoryBonus: 'workout',
    multiplier: 0.1,
  },
  {
    id: 'scholar',
    name: 'Bookworm',
    description: 'Deep focus knowledge absorption.',
    icon: '📖',
    requiredLevel: 5,
    unlocked: false,
    effect: '+10% XP bonus on Study Quests',
    categoryBonus: 'study',
    multiplier: 0.1,
  },
  {
    id: 'master_artisan',
    name: 'Master Artisan',
    description: 'Creative mastery unlocked.',
    icon: '✨',
    requiredLevel: 7,
    unlocked: false,
    effect: '+15% XP bonus on Creative Quests',
    categoryBonus: 'creative',
    multiplier: 0.15,
  },
  {
    id: 'time_lord',
    name: 'Time Lord',
    description: 'Temporal mastery across all quests.',
    icon: '⏳',
    requiredLevel: 10,
    unlocked: false,
    effect: '+15% XP bonus across ALL categories',
    multiplier: 0.15,
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'daily_code',
    title: 'Coding Sprint',
    description: 'Complete 2 Coding Quests today',
    category: 'coding',
    type: 'daily',
    targetCount: 2,
    currentCount: 0,
    rewardXp: 60,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    bossIcon: '💻',
  },
  {
    id: 'deep_focus',
    title: 'Deep Focus',
    description: 'Focus for at least 45 total minutes today',
    type: 'daily',
    targetCount: 45,
    currentCount: 0,
    rewardXp: 75,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    bossIcon: '🧠',
  },
  {
    id: 'boss_dragon',
    title: 'Procrastination Dragon',
    description: 'Boss Battle: Complete 3 Hard Quests to defeat',
    type: 'boss',
    targetCount: 3,
    currentCount: 0,
    rewardXp: 250,
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    completed: false,
    bossIcon: '🐲',
  },
  {
    id: 'boss_bug_leviathan',
    title: 'Code Bug Leviathan',
    description: 'Boss Battle: Complete 3 Coding Quests to debug',
    category: 'coding',
    type: 'boss',
    targetCount: 3,
    currentCount: 0,
    rewardXp: 300,
    expiresAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    completed: false,
    bossIcon: '👾',
  },
  {
    id: 'boss_legday_colossus',
    title: 'Leg Day Colossus',
    description: 'Boss Battle: Complete 3 Workout Quests to overpower',
    category: 'workout',
    type: 'boss',
    targetCount: 3,
    currentCount: 0,
    rewardXp: 300,
    expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    completed: false,
    bossIcon: '🏋️‍♂️',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Quest', description: 'Complete your 1st quest', badgeIcon: '🌱', xpReward: 20, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'quest_10', title: 'Adventurer I', description: 'Complete 10 quests total', badgeIcon: '⭐', xpReward: 50, unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'quest_50', title: 'Adventurer II', description: 'Complete 50 quests total', badgeIcon: '👑', xpReward: 150, unlocked: false, progress: 0, maxProgress: 50 },
  { id: 'quest_100', title: 'Guild Master', description: 'Complete 100 quests total', badgeIcon: '🎖️', xpReward: 350, unlocked: false, progress: 0, maxProgress: 100 },
  { id: 'code_1', title: 'Hello World', description: 'Complete your 1st Coding quest', badgeIcon: '💻', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1, category: 'coding' },
  { id: 'code_10', title: 'Full-Stack Hero', description: 'Complete 10 Coding quests', badgeIcon: '🚀', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, category: 'coding' },
  { id: 'fit_1', title: 'Warmup', description: 'Complete your 1st Workout quest', badgeIcon: '🏃', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1, category: 'workout' },
  { id: 'fit_10', title: 'Beast Mode', description: 'Complete 10 Workout quests', badgeIcon: '💪', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, category: 'workout' },
  { id: 'study_1', title: 'Curiosity', description: 'Complete your 1st Study quest', badgeIcon: '📖', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1, category: 'study' },
  { id: 'study_10', title: 'Scholar', description: 'Complete 10 Study quests', badgeIcon: '🎓', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, category: 'study' },
  { id: 'work_10', title: 'Executive', description: 'Complete 10 Work quests', badgeIcon: '💼', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, category: 'work' },
  { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day streak', badgeIcon: '🔥', xpReward: 50, unlocked: false, progress: 0, maxProgress: 3 },
  { id: 'streak_7', title: 'Unstoppable', description: 'Maintain a 7-day streak', badgeIcon: '⚡', xpReward: 150, unlocked: false, progress: 0, maxProgress: 7 },
  { id: 'streak_30', title: 'Immortal', description: 'Maintain a 30-day streak', badgeIcon: '🌟', xpReward: 500, unlocked: false, progress: 0, maxProgress: 30 },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete a quest between 12 AM and 4 AM', badgeIcon: '🦉', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a quest between 5 AM and 7 AM', badgeIcon: '🌅', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'boss_slayer', title: 'Boss Slayer', description: 'Defeat your first Boss Battle', badgeIcon: '🗡️', xpReward: 200, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'hard_spree', title: 'Heavy Hitter', description: 'Complete 5 Hard difficulty quests', badgeIcon: '🏋️', xpReward: 150, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'stylist', title: 'Fashion Icon', description: 'Customize your Avatar & equip a Title', badgeIcon: '🎨', xpReward: 25, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'perfectionist', title: 'Clean Slate', description: 'Clear all active quests on your board', badgeIcon: '🧹', xpReward: 50, unlocked: false, progress: 0, maxProgress: 1 },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'sample-1',
    title: 'Write TypeScript interfaces for RPG system 💻',
    category: 'coding',
    difficulty: 'easy',
    estimatedMinutes: 15,
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Slay Code Bug Leviathan: Refactor core engine 👾',
    category: 'coding',
    difficulty: 'hard',
    estimatedMinutes: 45,
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Morning stretch & warm tea 🍵',
    category: 'workout',
    difficulty: 'easy',
    estimatedMinutes: 15,
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Read 2 chapters of system architecture 📚',
    category: 'study',
    difficulty: 'medium',
    estimatedMinutes: 25,
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_STATE: AppState = {
  avatar: INITIAL_AVATAR,
  xp: 0,
  streak: 0,
  lastCompletedDate: null,
  activeQuestId: null,
  quests: INITIAL_QUESTS,
  challenges: INITIAL_CHALLENGES,
  achievements: INITIAL_ACHIEVEMENTS,
  traits: INITIAL_TRAITS,
};

export function calculateLevel(xp: number): number {
  return Math.floor(0.1 * Math.sqrt(xp)) + 1;
}

export function getXPProgress(totalXP: number): {
  level: number;
  baseXP: number;
  nextXP: number;
  currentLevelXP: number;
  neededLevelXP: number;
  progressPercent: number;
} {
  const level = calculateLevel(totalXP);
  const baseXP = Math.pow((level - 1) / 0.1, 2);
  const nextXP = Math.pow(level / 0.1, 2);

  const currentLevelXP = totalXP - baseXP;
  const neededLevelXP = nextXP - baseXP;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXP / neededLevelXP) * 100));

  return {
    level,
    baseXP,
    nextXP,
    currentLevelXP,
    neededLevelXP,
    progressPercent,
  };
}

export const DIFFICULTY_XP: Record<'easy' | 'medium' | 'hard', number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function updateStreakOnCompletion(currentStreak: number, lastCompletedDate: string | null): { newStreak: number; newDate: string } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (!lastCompletedDate) {
    return { newStreak: 1, newDate: today };
  }

  if (lastCompletedDate === today) {
    return { newStreak: currentStreak, newDate: today };
  } else if (lastCompletedDate === yesterday) {
    return { newStreak: currentStreak + 1, newDate: today };
  } else {
    return { newStreak: 1, newDate: today };
  }
}

// Calculate final XP with streak & active skill traits multipliers
export function calculateFinalXP(
  baseXP: number,
  streak: number,
  category: QuestCategory,
  activeTraits: AvatarTrait[]
): { finalXP: number; traitBonusXP: number; streakBonusXP: number } {
  const streakMult = streak * 0.05;

  let traitMult = 0;
  activeTraits.forEach((t) => {
    if (t.unlocked) {
      if (t.categoryBonus === category || !t.categoryBonus) {
        traitMult += t.multiplier;
      }
    }
  });

  const streakBonusXP = Math.floor(baseXP * streakMult);
  const traitBonusXP = Math.floor(baseXP * traitMult);

  const finalXP = baseXP + streakBonusXP + traitBonusXP;
  return { finalXP, traitBonusXP, streakBonusXP };
}

export function formatTimeMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatTimeHuman(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}
