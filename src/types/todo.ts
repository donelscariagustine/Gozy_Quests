export type QuestCategory = 'coding' | 'workout' | 'work' | 'study' | 'chores' | 'creative';

export interface AvatarTrait {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  unlocked: boolean;
  effect: string; // e.g. "+10% XP on Coding Quests"
  categoryBonus?: QuestCategory;
  multiplier: number; // e.g. 0.1 for +10%
}

export interface AvatarState {
  userName: string;
  userAgeRank: string;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  outfitColor: string;
  accessory: string;
  equippedTitle: string; // e.g., "Novice Adventurer", "Code Wizard", "Fitness Titan"
}

export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  difficulty: 'easy' | 'medium' | 'hard'; // Easy=10XP, Medium=25XP, Hard=50XP
  estimatedMinutes: number;              // Target focus duration
  status: 'idle' | 'in_progress' | 'completed';
  timeSpentSeconds: number;
  createdAt: string;
  completedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category?: QuestCategory;
  type: 'daily' | 'boss';
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  expiresAt: string;
  completed: boolean;
  bossIcon?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  xpReward: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category?: QuestCategory | 'general';
  unlockedAt?: string;
}

export interface AppState {
  avatar: AvatarState;
  xp: number;
  streak: number;
  lastCompletedDate: string | null;
  activeQuestId: string | null;
  quests: Quest[];
  challenges: Challenge[];
  achievements: Achievement[];
  traits: AvatarTrait[];
}
