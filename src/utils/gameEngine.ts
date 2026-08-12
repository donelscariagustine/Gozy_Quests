import { AppState, Achievement, Quest, CategoryChallenge, UserProfile, AvatarState, AvatarTrait, CustomCategory, UserSettings } from '../types/todo';

export interface CategoryDisplayInfo {
  id: string;
  name: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const BUILTIN_CATEGORIES: Record<string, CategoryDisplayInfo> = {
  coding: { id: 'coding', name: 'Coding', icon: '💻', badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80', badgeText: 'text-indigo-900 dark:text-indigo-200', badgeBorder: 'border-indigo-400' },
  workout: { id: 'workout', name: 'Workout', icon: '🏋️‍♂️', badgeBg: 'bg-rose-100 dark:bg-rose-950/80', badgeText: 'text-rose-900 dark:text-rose-200', badgeBorder: 'border-rose-400' },
  work: { id: 'work', name: 'Work', icon: '💼', badgeBg: 'bg-amber-100 dark:bg-amber-950/80', badgeText: 'text-amber-900 dark:text-amber-200', badgeBorder: 'border-amber-400' },
  study: { id: 'study', name: 'Study', icon: '📚', badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80', badgeText: 'text-emerald-900 dark:text-emerald-200', badgeBorder: 'border-emerald-400' },
  chores: { id: 'chores', name: 'Chores', icon: '🧹', badgeBg: 'bg-sky-100 dark:bg-sky-950/80', badgeText: 'text-sky-900 dark:text-sky-200', badgeBorder: 'border-sky-400' },
  creative: { id: 'creative', name: 'Creative', icon: '🎨', badgeBg: 'bg-purple-100 dark:bg-purple-950/80', badgeText: 'text-purple-900 dark:text-purple-200', badgeBorder: 'border-purple-400' },
  other: { id: 'other', name: 'Other', icon: '📦', badgeBg: 'bg-slate-100 dark:bg-slate-800', badgeText: 'text-slate-800 dark:text-slate-200', badgeBorder: 'border-slate-400' },
};

export const CATEGORIES = BUILTIN_CATEGORIES;

export const INITIAL_USER: UserProfile = {
  username: '',
  primaryClass: 'coding',
  isLoggedIn: false,
};

export const INITIAL_SETTINGS: UserSettings = {
  theme: 'light',
  soundEnabled: true,
  volume: 80,
};

export const INITIAL_AVATAR: AvatarState = {
  skinTone: '#F1C27D',
  hairStyle: 'shanks_flow',
  hairColor: '#D63031',
  eyesStyle: 'cute_sparkle',
  headItem: 'straw_hat',
  faceItem: 'zoro_eyepatch',
  outfit: 'pirate_captain',
  topColor: '#E17055',
  bottomStyle: 'shorts',
  bottomColor: '#74B9FF',
  footwear: 'sandals',
  backItem: 'zoro_3swords',
  equippedTitle: 'Pirate King',
};

export const AVAILABLE_TITLES = [
  'Pirate King',
  'Greatest Swordsman',
  'Code Mage',
  'Fitness Titan',
  'Guild Master',
  'Grand Line Conqueror',
];

export const HERO_CLASSES = [
  { id: 'coding', name: 'Code Mage 💻', icon: '🪄', desc: 'Master of algorithms & magical syntax' },
  { id: 'workout', name: 'Fitness Warrior 🏋️‍♂️', icon: '⚔️', desc: 'Unstoppable physical fortitude' },
  { id: 'work', name: 'Guild Executive 💼', icon: '👔', desc: 'Commanding leader of operations' },
  { id: 'study', name: 'Arch-Scholar 📚', icon: '📖', desc: 'Arch-seeker of ancient knowledge' },
];

export function getClassSpecificChallenges(primaryClass: 'coding' | 'workout' | 'work' | 'study'): CategoryChallenge[] {
  const get24h = () => new Date(Date.now() + 86400000).toISOString();
  const get72h = () => new Date(Date.now() + 86400000 * 3).toISOString();

  switch (primaryClass) {
    case 'coding':
      return [
        {
          id: 'c1',
          title: 'Code Master Sprint',
          description: 'Complete 3 Coding Quests today',
          categoryId: 'coding',
          type: 'daily',
          targetCount: 3,
          currentCount: 0,
          rewardXp: 75,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '💻',
        },
        {
          id: 'c2',
          title: 'Syntax Focus Surge',
          description: 'Accumulate 45 mins of Coding focus',
          categoryId: 'coding',
          type: 'daily',
          targetCount: 45,
          currentCount: 0,
          rewardXp: 100,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '🧠',
        },
        {
          id: 'b1',
          title: 'Bug Leviathan Boss',
          description: 'Finish 3 HARD Coding Quests to debug the Grand Line',
          categoryId: 'coding',
          type: 'boss',
          targetCount: 3,
          currentCount: 0,
          rewardXp: 350,
          expiresAt: get72h(),
          completed: false,
          bossIcon: '👾',
        },
      ];

    case 'workout':
      return [
        {
          id: 'w1',
          title: 'Daily Warmup Sprint',
          description: 'Complete 2 Workout Quests today',
          categoryId: 'workout',
          type: 'daily',
          targetCount: 2,
          currentCount: 0,
          rewardXp: 60,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '🏋️‍♂️',
        },
        {
          id: 'w2',
          title: 'Sweat Equity Focus',
          description: 'Accumulate 45 mins of Workout focus',
          categoryId: 'workout',
          type: 'daily',
          targetCount: 45,
          currentCount: 0,
          rewardXp: 100,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '🔥',
        },
        {
          id: 'b2',
          title: 'Leg Day Colossus Boss',
          description: 'Finish 3 HARD Workout Quests to overpower',
          categoryId: 'workout',
          type: 'boss',
          targetCount: 3,
          currentCount: 0,
          rewardXp: 350,
          expiresAt: get72h(),
          completed: false,
          bossIcon: '🏋️‍♂️',
        },
      ];

    case 'work':
      return [
        {
          id: 'wk1',
          title: 'Executive Focus Sprint',
          description: 'Complete 2 Work Quests today',
          categoryId: 'work',
          type: 'daily',
          targetCount: 2,
          currentCount: 0,
          rewardXp: 60,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '💼',
        },
        {
          id: 'wk2',
          title: 'Operations Flow',
          description: 'Accumulate 45 mins of Work focus',
          categoryId: 'work',
          type: 'daily',
          targetCount: 45,
          currentCount: 0,
          rewardXp: 100,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '📈',
        },
        {
          id: 'b3',
          title: 'Fleet Admiral Procrastination Boss',
          description: 'Finish 4 Work Quests to conquer deadline backlog',
          categoryId: 'work',
          type: 'boss',
          targetCount: 4,
          currentCount: 0,
          rewardXp: 400,
          expiresAt: get72h(),
          completed: false,
          bossIcon: '👔',
        },
      ];

    case 'study':
      return [
        {
          id: 's1',
          title: 'Arch-Scholar Reading',
          description: 'Complete 2 Study Quests today',
          categoryId: 'study',
          type: 'daily',
          targetCount: 2,
          currentCount: 0,
          rewardXp: 60,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '📚',
        },
        {
          id: 's2',
          title: 'Ancient Knowledge Focus',
          description: 'Accumulate 45 mins of Study focus',
          categoryId: 'study',
          type: 'daily',
          targetCount: 45,
          currentCount: 0,
          rewardXp: 100,
          expiresAt: get24h(),
          completed: false,
          bossIcon: '🧠',
        },
        {
          id: 'b4',
          title: 'Void Century Library Boss',
          description: 'Finish 4 Study Quests to decode ancient lore',
          categoryId: 'study',
          type: 'boss',
          targetCount: 4,
          currentCount: 0,
          rewardXp: 400,
          expiresAt: get72h(),
          completed: false,
          bossIcon: '📖',
        },
      ];
  }
}

export const INITIAL_CUSTOM_CATEGORIES: CustomCategory[] = [
  { id: 'custom-1', name: 'Gaming', colorHex: '#8B5CF6', icon: '🎮' },
  { id: 'custom-2', name: 'Reading', colorHex: '#10B981', icon: '📖' },
];

export const INITIAL_TRAITS: AvatarTrait[] = [
  { id: 'code_ninja', name: 'Code Ninja', description: 'Master of algorithms & logic.', icon: '🥷', requiredLevel: 3, unlocked: false, effect: '+10% XP bonus on Coding Quests', categoryBonus: 'coding', multiplier: 0.1 },
  { id: 'iron_will', name: 'Iron Will', description: 'Unshakeable physical discipline.', icon: '🛡️', requiredLevel: 4, unlocked: false, effect: '+10% XP bonus on Workout Quests', categoryBonus: 'workout', multiplier: 0.1 },
  { id: 'scholar', name: 'Bookworm', description: 'Deep focus knowledge absorption.', icon: '📖', requiredLevel: 5, unlocked: false, effect: '+10% XP bonus on Study Quests', categoryBonus: 'study', multiplier: 0.1 },
  { id: 'master_artisan', name: 'Master Artisan', description: 'Creative mastery unlocked.', icon: '✨', requiredLevel: 7, unlocked: false, effect: '+15% XP bonus on Creative Quests', categoryBonus: 'creative', multiplier: 0.15 },
  { id: 'time_lord', name: 'Time Lord', description: 'Temporal mastery across all quests.', icon: '⏳', requiredLevel: 10, unlocked: false, effect: '+15% XP bonus across ALL categories', multiplier: 0.15 },
];

export const INITIAL_30_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'Set Sail', description: 'Complete your 1st quest', badgeIcon: '⛵', xpReward: 20, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'quest_10', title: 'Adventurer I', description: 'Complete 10 total quests', badgeIcon: '⭐', xpReward: 50, unlocked: false, progress: 0, maxProgress: 10 },
  { id: 'quest_50', title: 'Adventurer II', description: 'Complete 50 total quests', badgeIcon: '👑', xpReward: 150, unlocked: false, progress: 0, maxProgress: 50 },
  { id: 'quest_100', title: 'Pirate King', description: 'Complete 100 total quests', badgeIcon: '🏴‍☠️', xpReward: 500, unlocked: false, progress: 0, maxProgress: 100 },
  { id: 'code_10', title: 'Full-Stack Mage', description: 'Complete 10 Coding quests', badgeIcon: '💻', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, categoryId: 'coding' },
  { id: 'fit_10', title: 'Gym Titan', description: 'Complete 10 Workout quests', badgeIcon: '💪', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, categoryId: 'workout' },
  { id: 'study_10', title: 'Arch-Scholar', description: 'Complete 10 Study quests', badgeIcon: '🎓', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, categoryId: 'study' },
  { id: 'work_10', title: 'Fleet Admiral', description: 'Complete 10 Work quests', badgeIcon: '💼', xpReward: 100, unlocked: false, progress: 0, maxProgress: 10, categoryId: 'work' },
  { id: 'three_swords', title: 'Three-Sword Style', description: 'Equip 3 Katanas & complete a Hard quest', badgeIcon: '⚔️', xpReward: 100, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'black_blade', title: 'Greatest Swordsman', description: "Equip Mihawk's Yoru Blade", badgeIcon: '🗡️', xpReward: 50, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'straw_hat_will', title: 'Inherited Will', description: 'Equip Straw Hat & reach 7-day streak', badgeIcon: '👒', xpReward: 150, unlocked: false, progress: 0, maxProgress: 7 },
  { id: 'emperor_hair', title: 'Red-Haired Legend', description: 'Equip Emperor Hair & complete 5 Hard quests', badgeIcon: '🔴', xpReward: 120, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'deadline_clutch', title: 'Beat the Grand Line', description: 'Finish a quest within 15 mins of deadline', badgeIcon: '⏱️', xpReward: 75, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'night_owl', title: 'Night Owl', description: 'Complete a quest between 12 AM and 4 AM', badgeIcon: '🦉', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a quest between 5 AM and 7 AM', badgeIcon: '🌅', xpReward: 30, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'streak_3', title: 'On Fire', description: 'Reach a 3-day completion streak', badgeIcon: '🔥', xpReward: 50, unlocked: false, progress: 0, maxProgress: 3 },
  { id: 'streak_7', title: 'Unstoppable', description: 'Reach a 7-day completion streak', badgeIcon: '⚡', xpReward: 150, unlocked: false, progress: 0, maxProgress: 7 },
  { id: 'streak_30', title: 'Immortal Legend', description: 'Reach a 30-day completion streak', badgeIcon: '🌟', xpReward: 500, unlocked: false, progress: 0, maxProgress: 30 },
  { id: 'wardrobe_king', title: 'Fashion Icon', description: 'Save custom full-body avatar outfit', badgeIcon: '🎨', xpReward: 25, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'dark_knight', title: 'Embrace the Shadows', description: 'Switch app to Dark Mode in Settings', badgeIcon: '🌙', xpReward: 15, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'sound_check', title: 'Audio Engineer', description: 'Adjust volume controls in Settings', badgeIcon: '🔊', xpReward: 10, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'boss_slayer', title: 'Sea Beast Slayer', description: 'Defeat your first Boss Battle', badgeIcon: '🐲', xpReward: 200, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'hard_spree', title: 'Heavy Lifter', description: 'Complete 5 Hard difficulty quests', badgeIcon: '🏋️', xpReward: 150, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'time_master', title: 'Time Lord', description: 'Accumulate 300 total focus minutes', badgeIcon: '⏳', xpReward: 300, unlocked: false, progress: 0, maxProgress: 300 },
  { id: 'clean_slate', title: 'Clear Board', description: 'Clear all active quests from board', badgeIcon: '🧹', xpReward: 50, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'overachiever', title: 'Overachiever', description: 'Complete 5 quests in a single calendar day', badgeIcon: '🏆', xpReward: 100, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'custom_cat', title: 'Trailblazer', description: 'Create your first Custom Quest Category', badgeIcon: '✨', xpReward: 35, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'custom_timer', title: 'Precise Navigator', description: 'Use custom deadline calendar on a quest', badgeIcon: '📅', xpReward: 25, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'trophy_hunter', title: 'Bounty Hunter', description: 'Unlock 15 other achievements', badgeIcon: '🥇', xpReward: 300, unlocked: false, progress: 0, maxProgress: 15 },
  { id: 'completionist', title: 'Grand Line Conqueror', description: 'Unlock 25 total achievements', badgeIcon: '💎', xpReward: 1000, unlocked: false, progress: 0, maxProgress: 25 },
];

const getFutureDueTime = (hoursFromNow: number): string => {
  return new Date(Date.now() + hoursFromNow * 3600000).toISOString().slice(0, 16);
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'sample-1',
    title: 'Master Gear 5: Write TypeScript state engine 💻',
    categoryId: 'coding',
    difficulty: 'easy',
    estimatedMinutes: 15,
    hasCustomDeadline: false,
    dueDateTime: getFutureDueTime(4),
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Overpower Kaido Dragon: Refactor core engine 🐲',
    categoryId: 'coding',
    difficulty: 'hard',
    estimatedMinutes: 45,
    hasCustomDeadline: true,
    dueDateTime: getFutureDueTime(24),
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Zoro workout: 100 Katana swings ⚔️',
    categoryId: 'workout',
    difficulty: 'easy',
    estimatedMinutes: 15,
    hasCustomDeadline: false,
    dueDateTime: getFutureDueTime(1),
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Study Void Century ancient text 📚',
    categoryId: 'study',
    difficulty: 'medium',
    estimatedMinutes: 25,
    hasCustomDeadline: false,
    dueDateTime: getFutureDueTime(12),
    status: 'idle',
    timeSpentSeconds: 0,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_STATE: AppState = {
  user: INITIAL_USER,
  settings: INITIAL_SETTINGS,
  avatar: INITIAL_AVATAR,
  customCategories: INITIAL_CUSTOM_CATEGORIES,
  xp: 0,
  streak: 0,
  lastCompletedDate: null,
  activeQuestId: null,
  quests: INITIAL_QUESTS,
  challenges: getClassSpecificChallenges('coding'),
  achievements: INITIAL_30_ACHIEVEMENTS,
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

export function calculateFinalXP(
  baseXP: number,
  streak: number,
  categoryId: string,
  activeTraits: AvatarTrait[]
): { finalXP: number; traitBonusXP: number; streakBonusXP: number } {
  const streakMult = streak * 0.05;

  let traitMult = 0;
  activeTraits.forEach((t) => {
    if (t.unlocked) {
      if (t.categoryBonus === categoryId || !t.categoryBonus) {
        traitMult += t.multiplier;
      }
    }
  });

  const streakBonusXP = Math.floor(baseXP * streakMult);
  const traitBonusXP = Math.floor(baseXP * traitMult);

  const finalXP = baseXP + streakBonusXP + traitBonusXP;
  return { finalXP, traitBonusXP, streakBonusXP };
}

export function getCategoryInfo(categoryId: string, customCategories: CustomCategory[]): CategoryDisplayInfo {
  if (BUILTIN_CATEGORIES[categoryId]) {
    return BUILTIN_CATEGORIES[categoryId];
  }

  const custom = customCategories.find((c) => c.id === categoryId);
  if (custom) {
    return {
      id: custom.id,
      name: custom.name,
      icon: custom.icon,
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80',
      badgeText: 'text-indigo-950 dark:text-indigo-100',
      badgeBorder: 'border-indigo-400',
    };
  }

  return BUILTIN_CATEGORIES['other'];
}

export function getDeadlineStatus(dueDateTimeStr: string | null): {
  isOverdue: boolean;
  isUrgent: boolean;
  hoursRemaining: number;
  formattedText: string;
} {
  if (!dueDateTimeStr) {
    return { isOverdue: false, isUrgent: false, hoursRemaining: 999, formattedText: 'No Due Date' };
  }

  const now = new Date().getTime();
  const due = new Date(dueDateTimeStr).getTime();
  const diffMs = due - now;

  if (diffMs <= 0) {
    return { isOverdue: true, isUrgent: true, hoursRemaining: 0, formattedText: 'Overdue!' };
  }

  const hoursRemaining = diffMs / 3600000;
  const minsRemaining = Math.floor(diffMs / 60000);

  if (minsRemaining < 60) {
    return { isOverdue: false, isUrgent: true, hoursRemaining, formattedText: `${minsRemaining}m left` };
  } else if (hoursRemaining < 24) {
    return { isOverdue: false, isUrgent: hoursRemaining < 2, hoursRemaining, formattedText: `${Math.floor(hoursRemaining)}h left` };
  } else {
    const days = Math.floor(hoursRemaining / 24);
    return { isOverdue: false, isUrgent: false, hoursRemaining, formattedText: `${days}d left` };
  }
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
