/**
 * XP Calculation Engine
 * Core principle: XP NEVER DECREASES
 */

import { XPEvent, LevelNumber, XPSummary } from './types';

// XP thresholds for each level (cumulative)
export const LEVEL_THRESHOLDS: Record<LevelNumber, number> = {
  1: 0,        // L1 starts at 0 XP
  2: 1000,     // L2 requires 1000 XP
  3: 2500,     // L3 requires 2500 XP
  4: 5000,     // L4 requires 5000 XP
  5: 8500,     // L5 requires 8500 XP
  6: 13000,    // L6 requires 13000 XP
};

// XP required to advance from one level to the next
export const XP_PER_LEVEL: Record<LevelNumber, number> = {
  1: 1000,     // L1 → L2 requires 1000 XP
  2: 1500,     // L2 → L3 requires 1500 XP
  3: 2500,     // L3 → L4 requires 2500 XP
  4: 3500,     // L4 → L5 requires 3500 XP
  5: 4500,     // L5 → L6 requires 4500 XP
  6: 0,        // L6 is max (can still earn XP for achievements)
};

/**
 * Calculate total XP from an array of XP events
 * This is the ONLY way to determine a student's XP
 */
export function calculateTotalXP(xpEvents: XPEvent[]): number {
  return xpEvents.reduce((total, event) => total + event.amount, 0);
}

/**
 * Determine current level based on total XP
 */
export function calculateLevel(totalXP: number): LevelNumber {
  if (totalXP >= LEVEL_THRESHOLDS[6]) return 6;
  if (totalXP >= LEVEL_THRESHOLDS[5]) return 5;
  if (totalXP >= LEVEL_THRESHOLDS[4]) return 4;
  if (totalXP >= LEVEL_THRESHOLDS[3]) return 3;
  if (totalXP >= LEVEL_THRESHOLDS[2]) return 2;
  return 1;
}

/**
 * Calculate XP needed to reach the next level
 */
export function calculateXPToNextLevel(totalXP: number, currentLevel: LevelNumber): number {
  if (currentLevel === 6) return 0; // Max level reached
  
  const nextLevelThreshold = LEVEL_THRESHOLDS[(currentLevel + 1) as LevelNumber];
  return Math.max(0, nextLevelThreshold - totalXP);
}

/**
 * Calculate percentage progress to next level
 */
export function calculateLevelProgress(totalXP: number, currentLevel: LevelNumber): number {
  if (currentLevel === 6) return 100; // Max level
  
  const currentLevelThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextLevelThreshold = LEVEL_THRESHOLDS[(currentLevel + 1) as LevelNumber];
  const xpInCurrentLevel = totalXP - currentLevelThreshold;
  const xpNeededForLevel = nextLevelThreshold - currentLevelThreshold;
  
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));
}

/**
 * Generate complete XP summary for a student
 */
export function generateXPSummary(xpEvents: XPEvent[], studentId: string): XPSummary {
  const totalXP = calculateTotalXP(xpEvents);
  const currentLevel = calculateLevel(totalXP);
  const xpToNextLevel = calculateXPToNextLevel(totalXP, currentLevel);
  const percentToNextLevel = calculateLevelProgress(totalXP, currentLevel);
  
  return {
    studentId,
    totalXP,
    currentLevel,
    xpToNextLevel,
    percentToNextLevel,
    lastCalculatedAt: new Date(),
  };
}

/**
 * Calculate XP for completing a challenge
 * Base XP comes from template, but can have bonuses
 */
export function calculateChallengeXP(
  baseXP: number,
  options: {
    isCheckpoint?: boolean;
    isFirstAttempt?: boolean;
    completedQuickly?: boolean; // Finished <50% of estimated time
    perfectSubmission?: boolean; // No revisions needed
  } = {}
): number {
  let xp = baseXP;
  
  // Checkpoint bonus
  if (options.isCheckpoint) {
    xp += 50;
  }
  
  // First attempt bonus (encourages trying)
  if (options.isFirstAttempt) {
    xp += 25;
  }
  
  // Speed bonus (but not punitive if slow)
  if (options.completedQuickly) {
    xp += 30;
  }
  
  // Quality bonus
  if (options.perfectSubmission) {
    xp += 40;
  }
  
  return Math.round(xp);
}

/**
 * Calculate XP for completing an entire quest
 */
export function calculateQuestCompletionXP(
  levelNumber: LevelNumber,
  completionTimeWeeks: number
): number {
  // Base quest completion bonus
  let xp = 500;
  
  // Level multiplier (higher levels = more XP)
  xp = xp * levelNumber;
  
  // Time bonus (completed in <2 weeks)
  if (completionTimeWeeks < 2) {
    xp += 250;
  }
  
  return Math.round(xp);
}

/**
 * Calculate streak bonus XP
 */
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays < 3) return 0;
  if (streakDays < 7) return 50;
  if (streakDays < 14) return 100;
  if (streakDays < 30) return 200;
  return 500; // 30+ day streak
}

/**
 * Check if student leveled up
 */
export function checkLevelUp(
  previousTotalXP: number,
  newTotalXP: number
): { leveledUp: boolean; newLevel: LevelNumber | null; xpGained: number } {
  const oldLevel = calculateLevel(previousTotalXP);
  const newLevel = calculateLevel(newTotalXP);
  const xpGained = newTotalXP - previousTotalXP;
  
  return {
    leveledUp: newLevel > oldLevel,
    newLevel: newLevel > oldLevel ? newLevel : null,
    xpGained,
  };
}

/**
 * Format XP for display (with commas)
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString('en-US');
}

/**
 * Get level name (for display)
 */
export function getLevelName(level: LevelNumber): string {
  const names: Record<LevelNumber, string> = {
    1: 'Apprentice Explorer',
    2: 'Skilled Navigator',
    3: 'Expert Adventurer',
    4: 'Master Scholar',
    5: 'Grand Sage',
    6: 'Legendary Champion',
  };
  return names[level];
}

/**
 * Get celebratory message for level up
 */
export function getLevelUpMessage(newLevel: LevelNumber): string {
  const messages: Record<LevelNumber, string> = {
    1: "Welcome to your learning journey! You're an Apprentice Explorer!",
    2: "Amazing progress! You're now a Skilled Navigator!",
    3: "Incredible work! You've become an Expert Adventurer!",
    4: "Outstanding achievement! You're a Master Scholar!",
    5: "Phenomenal dedication! You've reached Grand Sage!",
    6: "Legendary status achieved! You're a Champion of Learning!",
  };
  return messages[newLevel];
}

/**
 * Validate XP event (ensures no negative XP)
 */
export function validateXPEvent(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}
