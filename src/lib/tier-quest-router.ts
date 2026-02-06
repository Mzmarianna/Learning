/**
 * Tier-Based Quest Router
 * Routes students to appropriate curriculum based on their skill tier
 */

import { SkillTier, TIER_INFO } from './tier-system';
import {
  assignWarriorQuestByWeek,
  getCurrentWarriorQuest,
  type WarriorQuestAssignment,
} from './warriors-quest-service';
import {
  assignQuestToStudent,
  getCurrentQuest,
  type QuestAssignment,
} from './quest-assignment-service';
import type { User } from './types';

// ==================== TYPES ====================

export type TierQuestAssignment = WarriorQuestAssignment | QuestAssignment;

export interface TierAssignmentStrategy {
  tier: SkillTier;
  assignmentMethod: 'weekly' | 'competency-based' | 'level-based';
  curriculum: 'warriors' | 'explorers' | 'masters' | 'core';
}

// ==================== TIER STRATEGIES ====================

const TIER_STRATEGIES: Record<SkillTier, TierAssignmentStrategy> = {
  'early-explorers': {
    tier: 'early-explorers',
    assignmentMethod: 'weekly',
    curriculum: 'explorers',
  },
  'warriors': {
    tier: 'warriors',
    assignmentMethod: 'weekly',
    curriculum: 'warriors',
  },
  'masters': {
    tier: 'masters',
    assignmentMethod: 'competency-based',
    curriculum: 'masters', // TODO: Build Masters curriculum
  },
};

// ==================== QUEST ASSIGNMENT ROUTER ====================

/**
 * Assign appropriate quest based on student's tier
 */
export async function assignQuestByTier(
  student: User,
  source: 'placement-quiz' | 'tutor' | 'auto-progression' | 'parent' = 'auto-progression'
): Promise<TierQuestAssignment> {
  const tier = student.skillTier || 'early-explorers';
  const strategy = TIER_STRATEGIES[tier];

  switch (strategy.curriculum) {
    case 'warriors':
      return await assignWarriorsQuest(student.uid, source);
      
    case 'explorers':
      return await assignExplorersQuest(student.uid, source);
      
    case 'masters':
      return await assignMastersQuest(student.uid, source);
      
    case 'core':
    default:
      return await assignCoreQuest(student.uid, source);
  }
}

/**
 * Get current quest for student based on tier
 */
export async function getCurrentQuestByTier(
  student: User
): Promise<TierQuestAssignment | null> {
  const tier = student.skillTier || 'early-explorers';
  const strategy = TIER_STRATEGIES[tier];

  switch (strategy.curriculum) {
    case 'warriors':
      return await getCurrentWarriorQuest(student.uid);
      
    case 'explorers':
      return await getCurrentExplorersQuest(student.uid);
      
    case 'masters':
      return await getCurrentMastersQuest(student.uid);
      
    case 'core':
    default:
      return await getCurrentQuest(student.uid);
  }
}

/**
 * Calculate next week number for a student
 */
export async function calculateNextWeekNumber(
  studentId: string,
  tier: SkillTier
): Promise<number> {
  const strategy = TIER_STRATEGIES[tier];
  
  if (strategy.assignmentMethod === 'weekly') {
    // Get quest history to determine next week
    if (tier === 'warriors') {
      const { getWarriorQuestHistory } = await import('./warriors-quest-service');
      const history = await getWarriorQuestHistory(studentId);
      const completedWeeks = history.filter(q => q.status === 'completed');
      return completedWeeks.length + 1; // Next week
    } else if (tier === 'early-explorers') {
      // TODO: Implement Explorers history
      return 1; // Default to week 1
    }
  }
  
  return 1; // Default
}

// ==================== TIER-SPECIFIC ASSIGNMENT ====================

/**
 * Assign Warriors quest (6th-8th grade)
 */
async function assignWarriorsQuest(
  studentId: string,
  source: TierQuestAssignment['assignedBy']
): Promise<WarriorQuestAssignment> {
  const nextWeek = await calculateNextWeekNumber(studentId, 'warriors');
  return await assignWarriorQuestByWeek(studentId, nextWeek, source);
}

/**
 * Assign Explorers quest (3rd-5th grade)
 */
async function assignExplorersQuest(
  studentId: string,
  source: TierQuestAssignment['assignedBy']
): Promise<QuestAssignment> {
  // TODO: Implement Explorers quest assignment
  const nextWeek = await calculateNextWeekNumber(studentId, 'early-explorers');
  
  // Placeholder: Assign from Explorers curriculum
  return {
    id: `${studentId}-explorers-w${nextWeek}`,
    studentId,
    questId: `EH-W${nextWeek}-QUEST`,
    questTitle: `Explorers Week ${nextWeek}`,
    questData: {}, // TODO: Get from EXPLORERS_HUB_CURRICULUM
    tier: 'early-explorers',
    weekNumber: nextWeek,
    assignedAt: new Date(),
    assignedBy: source,
    status: 'assigned',
    lessonsCompleted: [],
    challengesCompleted: [],
    xpEarned: 0,
    competenciesTargeted: [],
    difficulty: 'grade-level',
    estimatedTimeMinutes: 240,
  };
}

/**
 * Assign Masters quest (9th-12th grade)
 */
async function assignMastersQuest(
  studentId: string,
  source: TierQuestAssignment['assignedBy']
): Promise<QuestAssignment> {
  // TODO: Implement Masters quest assignment
  return {
    id: `${studentId}-masters`,
    studentId,
    questId: 'MASTERS-Q1',
    questTitle: 'Masters Quest 1',
    questData: {},
    tier: 'masters',
    assignedAt: new Date(),
    assignedBy: source,
    status: 'assigned',
    lessonsCompleted: [],
    xpEarned: 0,
    competenciesTargeted: [],
    difficulty: 'advanced',
    estimatedTimeMinutes: 300,
  };
}

/**
 * Assign Core quest (traditional level-based)
 */
async function assignCoreQuest(
  studentId: string,
  source: TierQuestAssignment['assignedBy']
): Promise<QuestAssignment> {
  // Use existing quest assignment service for core curriculum
  return await assignQuestToStudent(studentId, 'L1-Q1', source);
}

/**
 * Get current Explorers quest
 */
async function getCurrentExplorersQuest(studentId: string): Promise<QuestAssignment | null> {
  // TODO: Implement Explorers quest retrieval
  return null;
}

/**
 * Get current Masters quest
 */
async function getCurrentMastersQuest(studentId: string): Promise<QuestAssignment | null> {
  // TODO: Implement Masters quest retrieval
  return null;
}

// ==================== TIER TRANSITION ====================

/**
 * Handle tier upgrade (e.g., Explorers → Warriors)
 */
export async function handleTierTransition(
  studentId: string,
  oldTier: SkillTier,
  newTier: SkillTier
): Promise<void> {
  console.log(`Student ${studentId} transitioning from ${oldTier} to ${newTier}`);
  
  // Complete current quest in old tier
  const currentQuest = await getCurrentQuest(studentId);
  if (currentQuest && currentQuest.status === 'in-progress') {
    // Option 1: Let them finish
    console.log('Allowing student to finish current quest before transition');
    
    // Option 2: Auto-complete with partial credit
    // await completeQuest(currentQuest.id, 'tier-transition');
  }
  
  // Assign first quest in new tier
  const newStrategy = TIER_STRATEGIES[newTier];
  console.log(`New tier strategy: ${newStrategy.curriculum} (${newStrategy.assignmentMethod})`);
  
  // Auto-assign first quest at new tier will happen on next login
}

/**
 * Check if student should be promoted to next tier
 */
export function shouldPromoteToNextTier(
  currentTier: SkillTier,
  weeksCompleted: number,
  averageMasteryLevel: number
): boolean {
  // Promotion criteria:
  // 1. Completed all weeks in current tier (16 for Warriors/Explorers)
  // 2. Average mastery level is "Proficient" or higher (>=3)
  
  const totalWeeks = currentTier === 'warriors' || currentTier === 'early-explorers' ? 16 : 12;
  
  return weeksCompleted >= totalWeeks && averageMasteryLevel >= 3;
}

/**
 * Get recommended tier based on performance
 */
export function getRecommendedTierPromotion(currentTier: SkillTier): SkillTier | null {
  const promotionPath: Record<SkillTier, SkillTier | null> = {
    'early-explorers': 'warriors',
    'warriors': 'masters',
    'masters': null, // Already at top tier
  };
  
  return promotionPath[currentTier];
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get tier info for display
 */
export function getTierDisplayInfo(tier: SkillTier) {
  const info = TIER_INFO[tier];
  const strategy = TIER_STRATEGIES[tier];
  
  return {
    ...info,
    curriculum: strategy.curriculum,
    assignmentMethod: strategy.assignmentMethod,
    totalWeeks: tier === 'warriors' || tier === 'early-explorers' ? 16 : null,
  };
}

/**
 * Validate tier assignment
 */
export function isValidTierForAge(tier: SkillTier, age: number): boolean {
  const info = TIER_INFO[tier];
  
  // Extract age range from info (e.g., "Ages 4-11")
  if (tier === 'early-explorers') {
    return age >= 4 && age <= 11;
  } else if (tier === 'warriors') {
    return age >= 12 && age <= 18;
  } else if (tier === 'masters') {
    return age >= 15;
  }
  
  return true; // Default: allow
}
