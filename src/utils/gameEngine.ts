import { AppState, Achievement, Quest, CategoryChallenge, UserProfile, AvatarState, AvatarTrait, CustomCategory, UserSettings, CharacterClass, TodoType } from '../types/todo';

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

export const TODO_TYPE_LABELS: Record<TodoType, { label: string; icon: string; desc: string }> = {
  strict_rpg: { label: 'Strict RPG Sprints', icon: '⚡', desc: 'Pomodoro focus & strict deadlines' },
  casual_habits: { label: 'Casual Habit Tracker', icon: '🌿', desc: 'Flexible daily routines' },
  project_bosses: { label: 'Project Boss Fights', icon: '⚔️', desc: 'Direct boss damage deliverables' },
};

export const INITIAL_USER: UserProfile = {
  username: '',
  email: '',
  age: 20,
  primaryClass: 'coding',
  todoType: 'strict_rpg',
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

export function getWeeklySeed(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

// Full Expanded Challenge Bank (10+ challenges per class)
export const CHALLENGE_BANK: Record<CharacterClass, { id: string; title: string; description: string; type: 'daily' | 'boss'; targetCount: number; rewardXp: number; bossIcon?: string }[]> = {
  coding: [
    { id: 'c1', title: 'Code Warmup Sprint', description: 'Complete 2 Coding Quests', type: 'daily', targetCount: 2, rewardXp: 50, bossIcon: '💻' },
    { id: 'c2', title: 'Syntax Focus Surge', description: 'Accumulate 45 mins of Coding focus', type: 'daily', targetCount: 45, rewardXp: 75, bossIcon: '🧠' },
    { id: 'c3', title: 'Algorithm Sprint', description: 'Finish 1 Coding Quest', type: 'daily', targetCount: 1, rewardXp: 80, bossIcon: '⚡' },
    { id: 'c4', title: 'Refactor Warmup', description: 'Complete 3 Coding Quests today', type: 'daily', targetCount: 3, rewardXp: 90, bossIcon: '🔧' },
    { id: 'c5', title: 'TypeScript Haki Surge', description: 'Accumulate 60 mins of Coding focus', type: 'daily', targetCount: 60, rewardXp: 120, bossIcon: '✨' },
    { id: 'b1', title: 'Bug Leviathan Boss', description: 'Complete 4 Coding Quests this week', type: 'boss', targetCount: 4, rewardXp: 300, bossIcon: '👾' },
    { id: 'b2', title: 'Kaido Refactor Titan Boss', description: 'Accumulate 120 mins of Coding focus time', type: 'boss', targetCount: 120, rewardXp: 500, bossIcon: '🐲' },
    { id: 'b3', title: 'Full-Stack Kraken Boss', description: 'Finish 3 Coding Quests before time runs out', type: 'boss', targetCount: 3, rewardXp: 450, bossIcon: '🐙' },
  ],
  workout: [
    { id: 'w1', title: 'Daily Stretch Warmup', description: 'Complete 2 Workout Quests', type: 'daily', targetCount: 2, rewardXp: 50, bossIcon: '🏋️‍♂️' },
    { id: 'w2', title: 'Cardio Blast Focus', description: 'Accumulate 30 mins of Workout focus', type: 'daily', targetCount: 30, rewardXp: 75, bossIcon: '🔥' },
    { id: 'w3', title: 'Powerlifting Sprint', description: 'Complete 1 Workout Quest', type: 'daily', targetCount: 1, rewardXp: 80, bossIcon: '💪' },
    { id: 'w4', title: 'Haki Agility Warmup', description: 'Complete 3 Workout Quests today', type: 'daily', targetCount: 3, rewardXp: 90, bossIcon: '⚡' },
    { id: 'w5', title: 'Endurance Marathon Focus', description: 'Accumulate 60 mins of Workout focus', type: 'daily', targetCount: 60, rewardXp: 120, bossIcon: '🏃‍♂️' },
    { id: 'bw1', title: 'Leg Day Colossus Boss', description: 'Finish 3 Workout Quests to overpower', type: 'boss', targetCount: 3, rewardXp: 350, bossIcon: '🏋️‍♂️' },
    { id: 'bw2', title: 'Iron Gym Titan Boss', description: 'Accumulate 120 mins of Workout focus time', type: 'boss', targetCount: 120, rewardXp: 500, bossIcon: '🛡️' },
    { id: 'bw3', title: 'Conqueror Stamina Boss', description: 'Complete 5 Workout Quests this week', type: 'boss', targetCount: 5, rewardXp: 450, bossIcon: '🏆' },
  ],
  work: [
    { id: 'wk1', title: 'Executive Sprint', description: 'Complete 2 Work Quests', type: 'daily', targetCount: 2, rewardXp: 50, bossIcon: '💼' },
    { id: 'wk2', title: 'Operations Focus', description: 'Accumulate 45 mins of Work focus', type: 'daily', targetCount: 45, rewardXp: 75, bossIcon: '📈' },
    { id: 'wk3', title: 'Inbox Zero Sprint', description: 'Complete 1 Work Quest', type: 'daily', targetCount: 1, rewardXp: 80, bossIcon: '✉️' },
    { id: 'wk4', title: 'Leadership Warmup', description: 'Complete 3 Work Quests today', type: 'daily', targetCount: 3, rewardXp: 90, bossIcon: '👔' },
    { id: 'wk5', title: 'Sprint Delivery Focus', description: 'Accumulate 60 mins of Work focus', type: 'daily', targetCount: 60, rewardXp: 120, bossIcon: '🚀' },
    { id: 'bwk1', title: 'Fleet Admiral Procrastination Boss', description: 'Finish 4 Work Quests to conquer deadline backlog', type: 'boss', targetCount: 4, rewardXp: 400, bossIcon: '👔' },
    { id: 'bwk2', title: 'Q3 Goal Leviathan Boss', description: 'Accumulate 120 mins of Work focus time', type: 'boss', targetCount: 120, rewardXp: 500, bossIcon: '📊' },
    { id: 'bwk3', title: 'Grand Line Corporate Colossus Boss', description: 'Finish 3 Work Quests', type: 'boss', targetCount: 3, rewardXp: 450, bossIcon: '🏢' },
  ],
  study: [
    { id: 's1', title: 'Arch-Scholar Reading', description: 'Complete 2 Study Quests', type: 'daily', targetCount: 2, rewardXp: 50, bossIcon: '📚' },
    { id: 's2', title: 'Deep Focus Library', description: 'Accumulate 45 mins of Study focus', type: 'daily', targetCount: 45, rewardXp: 75, bossIcon: '🧠' },
    { id: 's3', title: 'Research Sprint', description: 'Complete 1 Study Quest', type: 'daily', targetCount: 1, rewardXp: 80, bossIcon: '📖' },
    { id: 's4', title: 'Memory Palace Warmup', description: 'Complete 3 Study Quests today', type: 'daily', targetCount: 3, rewardXp: 90, bossIcon: '🔮' },
    { id: 's5', title: 'Poneglyph Cipher Focus', description: 'Accumulate 60 mins of Study focus', type: 'daily', targetCount: 60, rewardXp: 120, bossIcon: '📜' },
    { id: 'bs1', title: 'Void Century Library Boss', description: 'Finish 4 Study Quests to decode ancient lore', type: 'boss', targetCount: 4, rewardXp: 400, bossIcon: '📖' },
    { id: 'bs2', title: 'Arch-Mage Dissertation Boss', description: 'Accumulate 120 mins of Study focus time', type: 'boss', targetCount: 120, rewardXp: 500, bossIcon: '🎓' },
    { id: 'bs3', title: 'Ancient Cipher Leviathan Boss', description: 'Finish 3 Study Quests', type: 'boss', targetCount: 3, rewardXp: 450, bossIcon: '🗿' },
  ],
};

// Deterministic Weekly Challenge Selection Algorithm
export function getWeeklyChallenges(primaryClass: CharacterClass): CategoryChallenge[] {
  const seed = getWeeklySeed();
  const pool = CHALLENGE_BANK[primaryClass] || CHALLENGE_BANK['coding'];

  const dailyPool = pool.filter((c) => c.type === 'daily');
  const bossPool = pool.filter((c) => c.type === 'boss');

  // Pick 3 daily challenges deterministically based on seed
  const selectedDailies: CategoryChallenge[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = (seed + i * 3) % dailyPool.length;
    const item = dailyPool[idx];
    selectedDailies.push({
      ...item,
      categoryId: primaryClass,
      currentCount: 0,
      completed: false,
      assignedWeekSeed: seed,
    });
  }

  // Pick 1 boss challenge deterministically based on seed
  const bossIdx = seed % bossPool.length;
  const bossItem = bossPool[bossIdx];
  const selectedBoss: CategoryChallenge = {
    ...bossItem,
    categoryId: primaryClass,
    currentCount: 0,
    completed: false,
    assignedWeekSeed: seed,
  };

  return [...selectedDailies, selectedBoss];
}

// Generate Default Template Quests tailored to selected Class & Productivity Strategy
export function getClassInitialQuests(primaryClass: CharacterClass, strategy: TodoType = 'strict_rpg'): Quest[] {
  const getFutureDueTime = (hoursFromNow: number): string => {
    return new Date(Date.now() + hoursFromNow * 3600000).toISOString().slice(0, 16);
  };

  if (strategy === 'project_bosses') {
    return [
      {
        id: 'q-boss-1',
        title: `⚔️ Phase 1 Boss Strike: Build core ${primaryClass} deliverable`,
        categoryId: primaryClass,
        estimatedMinutes: 45,
        hasCustomDeadline: true,
        dueDateTime: getFutureDueTime(12),
        status: 'idle',
        timeSpentSeconds: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q-boss-2',
        title: `🐲 Deal 200 HP Damage: Complete ${primaryClass} milestone`,
        categoryId: primaryClass,
        estimatedMinutes: 60,
        hasCustomDeadline: true,
        dueDateTime: getFutureDueTime(24),
        status: 'idle',
        timeSpentSeconds: 0,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  if (strategy === 'casual_habits') {
    return [
      {
        id: 'q-habit-1',
        title: `🌿 Daily Routine: 15m easy ${primaryClass} practice`,
        categoryId: primaryClass,
        estimatedMinutes: 15,
        hasCustomDeadline: false,
        dueDateTime: null,
        status: 'idle',
        timeSpentSeconds: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q-habit-2',
        title: '🌱 Consistent Streak: Complete 20m focus session',
        categoryId: primaryClass,
        estimatedMinutes: 20,
        hasCustomDeadline: false,
        dueDateTime: null,
        status: 'idle',
        timeSpentSeconds: 0,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // Default: strict_rpg (Pomodoro timed sprints)
  switch (primaryClass) {
    case 'coding':
      return [
        {
          id: 'q-code-1',
          title: '⚡ 25m Pomodoro: Master Gear 5 TypeScript engine 💻',
          categoryId: 'coding',
          estimatedMinutes: 25,
          hasCustomDeadline: false,
          dueDateTime: getFutureDueTime(4),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'q-code-2',
          title: '🔥 Strict Sprint: Overpower Kaido Refactor 🐲',
          categoryId: 'coding',
          estimatedMinutes: 45,
          hasCustomDeadline: true,
          dueDateTime: getFutureDueTime(24),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
      ];

    case 'workout':
      return [
        {
          id: 'q-work-1',
          title: '⚡ 20m Sprint: Zoro 100 Katana Heavy Swings ⚔️',
          categoryId: 'workout',
          estimatedMinutes: 20,
          hasCustomDeadline: false,
          dueDateTime: getFutureDueTime(2),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'q-work-2',
          title: '🔥 Strict Sprint: Leg Day Colossus Squat Sets 🏋️‍♂️',
          categoryId: 'workout',
          estimatedMinutes: 45,
          hasCustomDeadline: true,
          dueDateTime: getFutureDueTime(24),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
      ];

    case 'work':
      return [
        {
          id: 'q-exec-1',
          title: '⚡ 25m Sprint: Fleet Admiral Operations Sprint 💼',
          categoryId: 'work',
          estimatedMinutes: 25,
          hasCustomDeadline: false,
          dueDateTime: getFutureDueTime(5),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'q-exec-2',
          title: '🔥 Strict Sprint: Clear Grand Line Project Backlog 📊',
          categoryId: 'work',
          estimatedMinutes: 50,
          hasCustomDeadline: true,
          dueDateTime: getFutureDueTime(24),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
      ];

    case 'study':
      return [
        {
          id: 'q-study-1',
          title: '⚡ 30m Sprint: Decode Void Century Ancient Text 📚',
          categoryId: 'study',
          estimatedMinutes: 30,
          hasCustomDeadline: false,
          dueDateTime: getFutureDueTime(6),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'q-study-2',
          title: '🔥 Strict Sprint: Translate Poneglyph Cipher 📜',
          categoryId: 'study',
          estimatedMinutes: 60,
          hasCustomDeadline: true,
          dueDateTime: getFutureDueTime(24),
          status: 'idle',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
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
  { id: 'three_swords', title: 'Three-Sword Style', description: 'Equip 3 Katanas & complete a quest', badgeIcon: '⚔️', xpReward: 100, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'black_blade', title: 'Greatest Swordsman', description: "Equip Mihawk's Yoru Blade", badgeIcon: '🗡️', xpReward: 50, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'straw_hat_will', title: 'Inherited Will', description: 'Equip Straw Hat & reach 7-day streak', badgeIcon: '👒', xpReward: 150, unlocked: false, progress: 0, maxProgress: 7 },
  { id: 'emperor_hair', title: 'Red-Haired Legend', description: 'Equip Emperor Hair & complete 5 quests', badgeIcon: '🔴', xpReward: 120, unlocked: false, progress: 0, maxProgress: 5 },
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
  { id: 'hard_spree', title: 'Heavy Lifter', description: 'Complete 5 difficulty quests', badgeIcon: '🏋️', xpReward: 150, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'time_master', title: 'Time Lord', description: 'Accumulate 300 total focus minutes', badgeIcon: '⏳', xpReward: 300, unlocked: false, progress: 0, maxProgress: 300 },
  { id: 'clean_slate', title: 'Clear Board', description: 'Clear all active quests from board', badgeIcon: '🧹', xpReward: 50, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'overachiever', title: 'Overachiever', description: 'Complete 5 quests in a single calendar day', badgeIcon: '🏆', xpReward: 100, unlocked: false, progress: 0, maxProgress: 5 },
  { id: 'custom_cat', title: 'Trailblazer', description: 'Create your first Custom Quest Category', badgeIcon: '✨', xpReward: 35, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'custom_timer', title: 'Precise Navigator', description: 'Use custom deadline calendar on a quest', badgeIcon: '📅', xpReward: 25, unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'trophy_hunter', title: 'Bounty Hunter', description: 'Unlock 15 other achievements', badgeIcon: '🥇', xpReward: 300, unlocked: false, progress: 0, maxProgress: 15 },
  { id: 'completionist', title: 'Grand Line Conqueror', description: 'Unlock 25 total achievements', badgeIcon: '💎', xpReward: 1000, unlocked: false, progress: 0, maxProgress: 25 },
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
  quests: getClassInitialQuests('coding', 'strict_rpg'),
  challenges: getWeeklyChallenges('coding'),
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

export function updateStreakOnCompletion(currentStreak: number, lastCompletedDate: string | null): { newStreak: number; newDate: string; streakBonusXP: number } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (!lastCompletedDate) {
    return { newStreak: 1, newDate: today, streakBonusXP: 25 };
  }

  if (lastCompletedDate === today) {
    return { newStreak: currentStreak, newDate: today, streakBonusXP: 0 };
  } else if (lastCompletedDate === yesterday) {
    const nextStreak = currentStreak + 1;
    return { newStreak: nextStreak, newDate: today, streakBonusXP: nextStreak * 25 };
  } else {
    return { newStreak: 1, newDate: today, streakBonusXP: 25 };
  }
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
