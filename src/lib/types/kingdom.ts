/**
 * Learning Kingdom Type Definitions
 * Warrior system, clans, executive functioning, and gamification
 */

// ============================================================================
// WARRIOR IDENTITY SYSTEM
// ============================================================================

export type WarriorRank = 'Novice' | 'Skilled' | 'Master' | 'Legendary';

export interface WarriorProfile {
  uid: string;
  displayName: string;
  warriorName: string; // "Alex the Brave"
  rank: WarriorRank;
  title: string; // "Apprentice of the Kingdom", "Guardian of Knowledge", etc.
  
  // Visual Identity
  avatar: {
    helmet: string;
    armor: string;
    weapon: string;
    pet?: string;
    mount?: string;
    color: string; // Primary color theme
  };
  
  // Stats
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  
  // Clan Membership
  clanId?: string;
  clanRole?: 'leader' | 'officer' | 'member' | 'recruit';
  joinedClanAt?: Date;
  
  // Progression
  questsCompleted: number;
  challengesCompleted: number;
  bossesDefeated: number;
  perfectChallenges: number; // 100% accuracy
  
  // Streaks (Key Engagement Metric)
  currentStreak: number; // Days in a row
  longestStreak: number;
  lastActiveDate: Date;
  
  // Achievements
  badgeIds: string[];
  powerIds: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CLAN SYSTEM (Social Belonging)
// ============================================================================

export interface Clan {
  id: string;
  name: string; // "Dragon Warriors", "Phoenix Rising"
  emblem: string; // 🐉, 🦅, 🐺, 🦁, etc.
  color: string; // Hex color for branding
  motto: string; // "United We Rise"
  description: string;
  
  // Leadership
  leaderId: string; // Rotates monthly
  officerIds: string[]; // Up to 3 officers
  
  // Members
  memberIds: string[];
  maxMembers: number; // Default 20
  isOpen: boolean; // Open to join or invite-only
  
  // Stats (This Week)
  weeklyXP: number; // Resets every Monday
  totalXP: number; // All-time
  rank: number; // Global leaderboard position
  level: number; // Clan progression
  
  // Unlocks
  hallLevel: number; // Visual base upgrades
  abilities: ClanAbility[];
  achievements: string[]; // ClanAchievement IDs
  
  // Activity
  createdAt: Date;
  lastActiveAt: Date;
  weeklyGoal?: number; // Optional XP target
}

export interface ClanAbility {
  id: string;
  name: string; // "Double XP Hour", "Group Study Bonus"
  description: string;
  effect: string;
  unlockedAt: Date;
  cooldownHours?: number;
  lastUsedAt?: Date;
}

export interface ClanQuest {
  id: string;
  clanId: string;
  title: string;
  description: string;
  goal: number; // e.g., "Solve 100 problems together"
  progress: number;
  xpReward: number;
  
  startDate: Date;
  endDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface ClanMessage {
  id: string;
  clanId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'message' | 'help-request' | 'celebration' | 'announcement';
  timestamp: Date;
  reactions: { emoji: string; userIds: string[] }[];
}

// ============================================================================
// QUEST SYSTEM (Narrative Framework)
// ============================================================================

export interface QuestStory {
  questId: string; // L1-UM-Q1
  title: string; // "The Fraction Fortress"
  story: string; // Narrative hook
  location: string; // "The Multiplier Mountains"
  npcGuide: string; // "Professor Multiply"
  questGiver: string; // "The King of Knowledge"
  
  // Progression
  chapter: number; // 1-16 (matches challenges)
  chapterTitles: string[]; // Story arc for each challenge
}

export interface BossChallenge {
  challengeId: string; // Links to Challenge #8 or #16
  bossName: string; // "The Fraction Dragon"
  bossType: 'Midpoint' | 'Final';
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Special mechanics
  lives: number; // Usually 3
  timeLimit?: number; // Seconds
  requiredAccuracy: number; // e.g., 80% to pass
  
  // Rewards
  xpReward: number;
  badgeReward?: string;
  cosmetic Reward?: string;
}

// ============================================================================
// CHALLENGE MECHANICS
// ============================================================================

export type ChallengeType = 'Battle' | 'Puzzle' | 'Build' | 'Explore' | 'Boss';

export interface ChallengeStory {
  challengeId: string;
  type: ChallengeType;
  title: string; // "Defeat the Half-Dragon"
  story: string; // Brief narrative
  
  // Mechanics
  task: string; // What student must do
  successCriteria: string; // How they know they won
  
  // Help system
  hints: string[]; // 3 progressive hints
  wowlSupportAvailable: boolean;
  peerHelpAllowed: boolean;
}

export interface ChallengeRewards {
  challengeId: string;
  baseXP: number;
  
  // Bonus Conditions
  bonuses: {
    perfect: number; // 100% accuracy
    fast: number; // Under time limit
    creative: number; // Creative solution (tutor-awarded)
    firstTry: number; // No hints used
    helpedOther: number; // Helped clan member
  };
  
  // Random Rewards (Variable Reinforcement)
  mysteryChance: number; // 0-100% chance of mystery bonus
  mysteryMin: number;
  mysteryMax: number;
}

// ============================================================================
// EXECUTIVE FUNCTIONING XP SYSTEM
// ============================================================================

export type TaskCategory = 
  | 'routine' 
  | 'planning' 
  | 'self-regulation' 
  | 'organization' 
  | 'communication' 
  | 'self-care' 
  | 'collaboration' 
  | 'metacognition';

export interface ExecutiveTask {
  id: string;
  category: TaskCategory;
  task: string;
  description: string;
  xpReward: number;
  
  // Frequency
  frequency: 'daily' | 'weekly' | 'per-session';
  maxPerDay?: number; // Limit completions
  
  // Timing
  scheduledTime?: string; // e.g., "9:00 AM"
  reminderEnabled: boolean;
  reminderMinutesBefore?: number;
  
  // Progress
  streak: number; // Consecutive days/weeks
  totalCompletions: number;
  lastCompletedAt?: Date;
}

export interface DailyTaskList {
  studentId: string;
  date: string; // YYYY-MM-DD
  tasks: {
    taskId: string;
    completed: boolean;
    completedAt?: Date;
    xpEarned: number;
  }[];
  
  // Summary
  totalXP: number;
  tasksCompleted: number;
  tasksTotal: number;
  perfectDay: boolean; // All tasks completed
}

export const EXECUTIVE_FUNCTION_TASKS: ExecutiveTask[] = [
  // Morning Routine
  {
    id: 'ef-login',
    category: 'routine',
    task: 'Log in to platform',
    description: 'Start your warrior day!',
    xpReward: 5,
    frequency: 'daily',
    maxPerDay: 1,
    scheduledTime: '8:00 AM',
    reminderEnabled: true,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-check-quests',
    category: 'planning',
    task: "Check today's quests",
    description: 'Review your daily missions',
    xpReward: 5,
    frequency: 'daily',
    maxPerDay: 1,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-set-goals',
    category: 'planning',
    task: 'Set 3 goals for today',
    description: 'Plan your path to victory',
    xpReward: 10,
    frequency: 'daily',
    maxPerDay: 1,
    streak: 0,
    totalCompletions: 0,
  },
  
  // During Learning
  {
    id: 'ef-break',
    category: 'self-regulation',
    task: 'Take a 5-min break after 25 min',
    description: 'Rest your warrior mind',
    xpReward: 5,
    frequency: 'per-session',
    maxPerDay: 6,
    reminderEnabled: true,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-ask-help',
    category: 'communication',
    task: 'Ask Wowl for help when stuck',
    description: 'Smart warriors ask for guidance',
    xpReward: 10,
    frequency: 'per-session',
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-submit-evidence',
    category: 'organization',
    task: 'Submit evidence for challenge',
    description: 'Prove your mastery',
    xpReward: 10,
    frequency: 'per-session',
    streak: 0,
    totalCompletions: 0,
  },
  
  // Organization
  {
    id: 'ef-organize',
    category: 'organization',
    task: 'Organize backpack/desk',
    description: 'A tidy space = focused mind',
    xpReward: 15,
    frequency: 'daily',
    maxPerDay: 1,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-plan-tomorrow',
    category: 'planning',
    task: "Plan tomorrow's schedule",
    description: 'Prepare for the next battle',
    xpReward: 10,
    frequency: 'daily',
    maxPerDay: 1,
    scheduledTime: '7:00 PM',
    reminderEnabled: true,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-review',
    category: 'metacognition',
    task: 'Review what I learned today',
    description: 'Reflect on your victories',
    xpReward: 10,
    frequency: 'daily',
    maxPerDay: 1,
    streak: 0,
    totalCompletions: 0,
  },
  
  // Social/Communication
  {
    id: 'ef-help-clan',
    category: 'collaboration',
    task: 'Help a clan member',
    description: 'Strengthen your clan',
    xpReward: 25,
    frequency: 'daily',
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-thank-teacher',
    category: 'communication',
    task: 'Thank teacher for feedback',
    description: 'Gratitude builds bonds',
    xpReward: 10,
    frequency: 'per-session',
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-share-progress',
    category: 'communication',
    task: 'Share progress with parent',
    description: 'Keep your allies informed',
    xpReward: 15,
    frequency: 'weekly',
    maxPerDay: 1,
    streak: 0,
    totalCompletions: 0,
  },
  
  // Self-Care
  {
    id: 'ef-water',
    category: 'self-care',
    task: 'Drink water during session',
    description: 'Hydrate your warrior body',
    xpReward: 5,
    frequency: 'per-session',
    maxPerDay: 4,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-stretch',
    category: 'self-care',
    task: 'Stretch between challenges',
    description: 'Keep your body ready',
    xpReward: 5,
    frequency: 'per-session',
    maxPerDay: 4,
    streak: 0,
    totalCompletions: 0,
  },
  {
    id: 'ef-breathe',
    category: 'self-regulation',
    task: 'Take deep breaths if frustrated',
    description: 'Calm mind = clear thinking',
    xpReward: 10,
    frequency: 'per-session',
    streak: 0,
    totalCompletions: 0,
  },
];

// ============================================================================
// BADGE & ACHIEVEMENT SYSTEM
// ============================================================================

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  rarity: BadgeRarity;
  color: string; // Hex color
  
  // Unlock Criteria
  criteria: {
    type: 'quest' | 'challenge' | 'streak' | 'xp' | 'clan' | 'custom';
    requirement: string;
    value: number;
  };
  
  // Rewards
  xpBonus: number;
  unlocks?: string[]; // Cosmetics, powers, etc.
}

export interface StudentBadge {
  studentId: string;
  badgeId: string;
  unlockedAt: Date;
  displayOnProfile: boolean;
  order: number; // For sorting on profile
}

// ============================================================================
// COSMETIC SYSTEM (Avatar Customization)
// ============================================================================

export type CosmeticType = 'helmet' | 'armor' | 'weapon' | 'shield' | 'pet' | 'mount' | 'background';

export interface Cosmetic {
  id: string;
  type: CosmeticType;
  name: string;
  description: string;
  rarity: BadgeRarity;
  
  // Visual
  imageUrl: string;
  animationUrl?: string; // For pets/mounts
  color: string;
  
  // Unlock
  unlockCriteria: {
    type: 'xp' | 'level' | 'quest' | 'robux' | 'achievement';
    value: number | string;
  };
  
  // Status
  isLocked: boolean;
  unlockedBy?: string[]; // Student UIDs who have it
}

// ============================================================================
// POWER-UP SYSTEM
// ============================================================================

export interface PowerUp {
  id: string;
  name: string; // "Double XP Hour", "Skip Challenge"
  description: string;
  icon: string;
  rarity: BadgeRarity;
  
  // Effect
  effect: {
    type: 'xp-multiplier' | 'time-extension' | 'skip' | 'hint' | 'clan-boost';
    value: number;
    durationMinutes?: number;
  };
  
  // Availability
  unlockLevel: number;
  cost?: number; // XP cost to use
  cooldownHours?: number;
  maxUses?: number; // Per day/week
}

export interface StudentPowerUp {
  studentId: string;
  powerUpId: string;
  unlockedAt: Date;
  usesRemaining: number;
  lastUsedAt?: Date;
  activeUntil?: Date; // For time-based effects
}

// ============================================================================
// LEADERBOARD SYSTEM
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  displayName: string;
  warriorName: string;
  avatar: WarriorProfile['avatar'];
  score: number; // XP or other metric
  change: number; // +/- from yesterday
  badge?: string; // Top 3 get special badge
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'clan' | 'quest' | 'daily' | 'weekly';
  period: 'day' | 'week' | 'month' | 'all-time';
  title: string;
  
  entries: LeaderboardEntry[];
  lastUpdated: Date;
  
  // Filters
  levelFilter?: number; // Only show same level
  ageFilter?: string; // Age groups
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export interface Notification {
  id: string;
  studentId: string;
  type: 'quest' | 'clan' | 'achievement' | 'reminder' | 'social' | 'system';
  priority: 'low' | 'medium' | 'high';
  
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string; // Deep link
  
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

export interface EngagementMetrics {
  studentId: string;
  date: string; // YYYY-MM-DD
  
  // Time
  sessionDuration: number; // Minutes
  challengesAttempted: number;
  challengesCompleted: number;
  
  // XP Sources
  xpFromChallenges: number;
  xpFromExecutiveTasks: number;
  xpFromClanActivities: number;
  xpFromBonuses: number;
  xpTotal: number;
  
  // Behavioral
  helpRequestsToWowl: number;
  helpRequestsToClan: number;
  helpGivenToClan: number;
  streakMaintained: boolean;
  
  // Struggle Indicators
  hintsUsed: number;
  challengesAbandoned: number;
  frustratedQuits: number; // Left mid-challenge
}
