# 🏴‍☠️ Gozy Quests — RPG Productivity Web Application Documentation

Welcome to the official technical and product documentation for **Gozy Quests** (formerly Pirate Guild RPG Productivity App). This document provides an exhaustive breakdown of the web application's architecture, data schema, game mechanics, component hierarchy, UI design system, and developer workflows.

---

## 📖 Table of Contents

1. [Executive Summary & System Architecture](#1-executive-summary--system-architecture)
2. [Technology Stack & Dependencies](#2-technology-stack--dependencies)
3. [Game Engine & Economy Rules](#3-game-engine--economy-rules)
4. [Data Schema & State Management](#4-data-schema--state-management)
5. [UI/UX & Design System](#5-uiux--design-system)
6. [Component Hierarchy & Routing](#6-component-hierarchy--routing)
7. [Audio & Visual Effects Engine](#7-audio--visual-effects-engine)
8. [Developer Setup & Production Build](#8-developer-setup--production-build)

---

## 1. Executive Summary & System Architecture

**Gozy Quests** is a cozy, high-aesthetic RPG productivity web application combining the charming aesthetic of *Stardew Valley* with the epic adventure theme of *One Piece*. 

### Key Architectural Principles
- **Client-Side State Persistence**: Complete state is managed in React state and automatically synchronized to `localStorage` under the key `'gamified_todo_app_state'`.
- **Incognito & Auth Gatekeeper Guard**: New sessions or empty storage default `user.isLoggedIn` to `false`, immediately rendering the `<AuthGatekeeper/>` signup screen with 3 specialty value cards and productivity strategy selectors.
- **Strict XP Economy**: Standard quests serve strictly as focus timer sessions and award **0 direct XP**. XP is earned exclusively by completing Daily Challenges, defeating Weekly Class Bosses, maintaining Daily Streaks, and unlocking Trophies.
- **Fail-Safe Accidental Timer Safety**: If a user accidentally starts a quest focus timer, a dedicated **`↩️ Reverse / Reset`** action button reverts the quest status back to `'idle'` and clears the active timer session without awarding unearned progress.

---

## 2. Technology Stack & Dependencies

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React 18 (Vite) | Single-Page Application (SPA) built with functional React components and TypeScript |
| **Styling Engine** | Tailwind CSS v3 | Custom utility-first CSS with dark mode class inheritance (`dark`), custom shadows (`shadow-chunky`), and tactile borders |
| **Icons** | Lucide React | Modern, clean vector icon suite for UI controls and badge displays |
| **Avatar Canvas** | HTML5 Canvas 2D API | Procedural 2D full-body pixel/chibi avatar rendering engine |
| **Audio Synthesizer**| Web Audio API | Zero-dependency procedural audio tone generator for tactile clicks, level-ups, and achievements |
| **FX & Particle Engine**| Canvas Confetti | Dynamic multi-color particle explosions triggered on achievements and level-ups |

---

## 3. Game Engine & Economy Rules

### 3.1 Level & Progression Math

The leveling engine uses a clean linear XP curve where each level requires **100 XP**:

$$\text{Level} = \left\lfloor \frac{\text{XP}}{100} \right\rfloor + 1$$

$$\text{Current Level XP} = \text{XP} \bmod 100$$

$$\text{Progress Percent} = \left( \frac{\text{Current Level XP}}{100} \right) \times 100\%$$

*Example:* A hero with **340 XP** is at **Level 4** with **40 / 100 XP** (40% progress).

### 3.2 Hero Classes

Users select one of four primary Hero Classes, which dynamically configures default quest templates and generates tailored weekly boss challenges:

1. **Code Mage 💻 (`coding`)**: Master of algorithms and syntax. Bosses include *Bug Leviathan* and *Kaido Refactor Titan*.
2. **Fitness Warrior 🏋️‍♂️ (`workout`)**: Fortitude and physical strength. Bosses include *Leg Day Colossus* and *Iron Gym Titan*.
3. **Guild Executive 💼 (`work`)**: Leadership and operations. Bosses include *Inbox Zero Kraken* and *Deliverable Dragon*.
4. **Arch-Scholar 📚 (`study`)**: Knowledge and research. Bosses include *Final Exam Hydra* and *Thesis Behemoth*.

### 3.3 Daily Streaks & Multipliers

- Completing at least 1 quest or daily challenge per calendar day increments the consecutive `streak`.
- Streaks award bonus XP upon completion: $\text{Bonus XP} = \min(50, \text{streak} \times 10)$.

---

## 4. Data Schema & State Management

The entire application state is represented by the `AppState` interface and persisted under `localStorage.getItem('gamified_todo_app_state')`:

```typescript
export type CharacterClass = 'coding' | 'workout' | 'work' | 'study';
export type TodoType = 'strict_rpg' | 'casual_habits' | 'project_bosses';
export type ActiveTab = 'quests' | 'avatar' | 'challenges' | 'badges';

export interface UserProfile {
  username: string;
  email: string;
  age: number;
  primaryClass: CharacterClass;
  todoType: TodoType;
  isLoggedIn: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  volume: number; // 0 to 100
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

export interface Quest {
  id: string;
  title: string;
  categoryId: CharacterClass | string;
  estimatedMinutes: number;
  hasCustomDeadline: boolean;
  dueDateTime: string | null;
  status: 'idle' | 'in_progress' | 'completed';
  timeSpentSeconds: number;
  createdAt: string;
  completedAt?: string;
}

export interface CategoryChallenge {
  id: string;
  title: string;
  description: string;
  categoryId: CharacterClass;
  type: 'daily' | 'boss';
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  completed: boolean;
  assignedWeekSeed: number;
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
```

---

## 5. UI/UX & Design System

### 5.1 Dual Theme Engine Tokens

Theme mode is inherited dynamically from the root container (`<div className={isDark ? 'dark bg-[#050811] text-slate-100' : 'bg-[#fffbeb] text-slate-900'}>`):

| UI Token | Light Mode Palette (`bg-[#fffbeb]`) | Deep Midnight Navy Mode Palette (`bg-[#050811]`) |
| :--- | :--- | :--- |
| **Page Canvas** | `bg-[#fffbeb]` (Warm Light Cream) | `dark:bg-[#050811]` (Deep Midnight Navy) |
| **Container Cards** | `bg-white text-slate-900 border-slate-800` | `dark:bg-[#0f172a] dark:text-slate-100 dark:border-indigo-500/30` |
| **Inputs & Badges** | `bg-amber-100/60 text-slate-900` | `dark:bg-[#1e293b] dark:text-slate-100 dark:border-slate-700` |
| **Navigation Bar** | `bg-slate-50 border-slate-200` | `dark:bg-[#0b0f19] dark:border-slate-800` |
| **Primary Buttons** | `bg-indigo-600 hover:bg-indigo-700 text-white` | `bg-indigo-600 hover:bg-indigo-500 text-white` |

### 5.2 Header Bar Layout

The top header is structured into 4 compact clusters:
1. **Upscaled Hero Emblem**: `h-16 w-16 sm:h-20 sm:w-20` (64px mobile, 80px desktop) with golden/amber gradient border and glowing emblem badge (`✨`). Clicking opens Avatar Studio.
2. **User Level & Class Info**: Username, Level badge (`LVL N`), and primary class indicator.
3. **Compact XP Progress Bar**: Real-time progress towards the next level requirement.
4. **Quick Action Controls**:
   - Streak Badge (`🔥 N Days`)
   - Quick Theme Toggle (`☀️/🌙`)
   - Settings Drawer Trigger (`⚙️`)

---

## 6. Component Hierarchy & Routing

```
App.tsx (Root State Engine & Theme Provider)
 ├── AuthGatekeeper.tsx (Renders when user.isLoggedIn === false)
 ├── HeaderBar.tsx (Upscaled Emblem, XP Bar, Streak, Theme Toggle, Settings Trigger, 4-Tab Bar)
 ├── Main Layout Router (<main className="max-w-7xl mx-auto">)
 │    ├── [Tab: quests] TaskBoard.tsx
 │    │    ├── 3-State Status Filter Bar (⏳ To Complete, ✅ Completed, 📋 All Quests)
 │    │    ├── Category Pills Scroller
 │    │    ├── ActiveQuestBanner.tsx (Countdown Timer, Finish Work, ↩️ Reverse Timer)
 │    │    ├── Quest Cards Grid
 │    │    └── AddQuestForm.tsx (Dual Timer Controls: Custom Focus Mins & Datetime Picker)
 │    ├── [Tab: avatar] FullBodyAvatarStudio.tsx (Canvas 2D Character Studio & Titles)
 │    ├── [Tab: challenges] BossAndDailySection.tsx (Weekly Class Bosses & Daily Challenges)
 │    └── [Tab: badges] AchievementMatrixView.tsx (30 Trophy Matrix & Claims)
 ├── SettingsModal.tsx (Floating Settings Drawer: Theme, Volume, Hero Class, Logout)
 ├── AvatarModal.tsx / SkillTreeModal.tsx / AchievementCabinet.tsx (Overlay Modals)
 └── LevelUpModal.tsx (Level Up Celebration Overlay)
```

---

## 7. Audio & Visual Effects Engine

### 7.1 Web Audio API Synthesizer (`src/utils/audio.ts`)

Zero-dependency procedural sound engine providing instant tactile audio feedback:

- `sounds.playPop()`: Short 400Hz to 800Hz frequency glide tone for button clicks.
- `sounds.playTaskComplete()`: 3-note ascending major chord (C5-E5-G5) for completing quests.
- `sounds.playLevelUp()`: 5-note victory fanfare for level-ups.
- `sounds.playAchievementUnlocked()`: Arpeggiated shimmer chime for unlocking trophies.

### 7.2 Canvas Confetti Explosions

Triggered automatically upon reaching a new level or unlocking a trophy badge, firing 90 multi-colored particles across the viewport canvas.

---

## 8. Developer Setup & Production Build

### 8.1 Installation

```bash
# Clone the repository
git clone https://github.com/donelscariagustine/Gozy_Quests.git

# Navigate to directory
cd Gozy_Quests

# Install dependencies
npm install
```

### 8.2 Development Server

```bash
npm run dev
# Server ready at http://localhost:5173/ or http://localhost:5174/
```

### 8.3 Production Build & Verification

```bash
# Compile TypeScript & bundle assets via Vite
npx vite build

# Preview production build locally
npx vite preview
```

---

*Documentation compiled & verified for Gozy Quests v1.0.0.*
