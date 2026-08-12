export interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  volume: number; // 0 to 100
}

export interface UserProfile {
  username: string;
  primaryClass: 'coding' | 'workout' | 'work' | 'study';
  isLoggedIn: boolean;
}

export interface AvatarState {
  skinTone: string;
  hairStyle: string;     // 'shanks_flow' | 'spiky' | 'short' | 'long' | 'bun' | 'afro' | 'braids'
  hairColor: string;
  eyesStyle: string;
  headItem: string;      // 'straw_hat' | 'pirate_bicorne' | 'wizard_hat' | 'crown' | 'headphones' | 'viking' | 'bunny_ears' | 'none'
  faceItem: string;      // 'zoro_eyepatch' | 'glasses' | 'goggles' | 'eyepatch' | 'monocle' | 'mask' | 'bandana' | 'none'
  outfit: string;        // 'pirate_captain' | 'gym' | 'armor' | 'hoodie' | 'cyberpunk' | 'royal'
  topColor: string;
  bottomStyle: string;   // 'pants' | 'shorts' | 'skirt' | 'robe_bottom' | 'greaves'
  bottomColor: string;
  footwear: string;      // 'sandals' | 'pirate_boots' | 'boots' | 'sneakers' | 'barefoot' | 'greaves'
  backItem: string;      // 'zoro_3swords' | 'mihawk_yoru' | 'angel_wings' | 'demon_wings' | 'shield' | 'pet_cat' | 'cape' | 'none'
  equippedTitle: string; // e.g., "Pirate King", "Greatest Swordsman"
}

export interface CustomCategory {
  id: string;
  name: string;
  colorHex: string;
  icon: string;
}

export interface CategoryChallenge {
  id: string;
  title: string;
  description: string;
  categoryId: string; // references built-in or custom category ID
  type: 'daily' | 'boss';
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  expiresAt: string;
  completed: boolean;
  bossIcon?: string;
}

export interface Quest {
  id: string;
  title: string;
  categoryId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  hasCustomDeadline: boolean;
  dueDateTime: string | null;
  status: 'idle' | 'in_progress' | 'completed' | 'failed';
  timeSpentSeconds: number;
  createdAt: string;
  completedAt?: string;
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
  categoryId?: string;
  unlockedAt?: string;
}

export interface AvatarTrait {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  unlocked: boolean;
  effect: string;
  categoryBonus?: string;
  multiplier: number;
}

export interface AppState {
  user: UserProfile;
  settings: UserSettings;
  avatar: AvatarState;
  customCategories: CustomCategory[];
  xp: number;
  streak: number;
  lastCompletedDate: string | null;
  activeQuestId: string | null;
  quests: Quest[];
  challenges: CategoryChallenge[];
  achievements: Achievement[];
  traits: AvatarTrait[];
}
