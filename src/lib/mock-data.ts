/**
 * Mock Data Generator for Mz. Marianna's Academy
 * Used for demonstration when Firebase is not configured
 * Aligned with canonical Firestore schema but returns legacy-compatible types
 */

import {
  QuestTemplate,
  ChallengeTemplate,
  QuestInstance as FirestoreQuestInstance,
  ChallengeInstance as FirestoreChallengeInstance,
  User,
  XPEvent,
  BadgeEarned,
  now,
} from './types/firestore';
import {
  QuestInstance as LegacyQuestInstance,
  ChallengeInstance as LegacyChallengeInstance,
  ChallengeStatus,
  XPSummary,
  Achievement,
} from './types';

// Re-export shouldUseMockData from firebase.ts for convenience
export { shouldUseMockData } from './firebase';

/**
 * Generate a mock quest template (L1UM-CORE - Level 1 Math Core)
 */
export function generateMockQuestTemplate(): QuestTemplate {
  return {
    questId: 'L1UM-CORE',
    level: 'L1',
    unit: 'UM',
    overlay: 'CORE',
    title: 'Number Sense Adventure',
    description: 'Master the fundamentals of counting, number recognition, and basic operations',
    badgeName: 'Number Ninja',
    usesRoblox: true, // Math quests use Roblox
    requiredCheckpoints: [1, 8, 16],
    totalChallenges: 16,
    masteryRule: {
      minCompleted: 16,
      requiresTutorConfirm: true,
      requiresAssessmentAt: [1, 8, 16],
    },
  };
}

/**
 * Generate mock challenge templates for the quest
 */
export function generateMockChallengeTemplates(): ChallengeTemplate[] {
  const challenges: ChallengeTemplate[] = [];
  const questId = 'L1UM-CORE';
  
  for (let i = 1; i <= 16; i++) {
    const isCheckpoint = i === 1 || i === 8 || i === 16;
    const challengeId = `${questId}-${String(i).padStart(2, '0')}`;
    
    challenges.push({
      challengeId,
      questId,
      number: i,
      title: getChallengeTitle(i),
      type: isCheckpoint ? 'CHECKPOINT' : (i % 2 === 0 ? 'PRACTICE' : 'LEARN'),
      instructions: `This is challenge ${i}. ${getChallengeInstructions(i)}`,
      resourceLink: `https://example.com/video/${i}`,
      robloxGameLink: i % 3 === 0 ? 'https://www.roblox.com/games/example' : undefined,
      evidenceType: isCheckpoint ? 'QUIZ' : (i % 2 === 0 ? 'PHOTO' : 'CHECKBOX'),
      xp: {
        baseComplete: isCheckpoint ? 100 : 50,
        correctnessBonus: isCheckpoint ? 50 : undefined,
        effortBonus: 25,
      },
      isCheckpoint,
    });
  }
  
  return challenges;
}

function getChallengeTitle(num: number): string {
  const titles = [
    'Assessment: What Do You Know?',
    'Counting to 10',
    'Recognizing Numbers',
    'More and Less',
    'Number Order',
    'Practice: Number Games',
    'Skip Counting',
    'Midpoint Check: Show What You Know',
    'Adding with Objects',
    'Subtraction Basics',
    'Number Stories',
    'Math in the Wild',
    'Number Patterns',
    'Practice: Roblox Math Quest',
    'Problem Solving',
    'Celebration: Master Assessment',
  ];
  return titles[num - 1] || `Challenge ${num}`;
}

function getChallengeInstructions(num: number): string {
  if (num === 1) return 'Let\'s see what you already know! This helps us personalize your journey.';
  if (num === 8) return 'Great progress! Let\'s review what you\'ve learned so far.';
  if (num === 16) return 'Amazing work! Time to celebrate and show off your mastery!';
  return 'Complete this activity and show your tutor what you learned!';
}

/**
 * Generate a mock quest instance in LEGACY format for components
 * (This is what the existing components expect)
 */
export function generateMockQuestLegacy(studentId: string, tutorId: string = 'mock-tutor'): LegacyQuestInstance {
  const challenges: LegacyChallengeInstance[] = [];
  
  // Generate 16 challenges with varied statuses to show the map
  for (let i = 1; i <= 16; i++) {
    let status: ChallengeStatus;
    
    // First 3 challenges are completed (approved)
    if (i <= 3) {
      status = 'approved';
    }
    // Challenge 4 is the current challenge (available)
    else if (i === 4) {
      status = 'available';
    }
    // Challenge 5 is in progress
    else if (i === 5) {
      status = 'in_progress';
    }
    // Challenge 6 needs revision (gentle amber, not red)
    else if (i === 6) {
      status = 'needs_revision';
    }
    // Challenge 7 is submitted, awaiting review
    else if (i === 7) {
      status = 'submitted';
    }
    // Rest are locked
    else {
      status = 'locked';
    }
    
    const challenge: LegacyChallengeInstance = {
      id: `challenge-${i}`,
      templateId: `L1UM-CORE-${String(i).padStart(2, '0')}`,
      questInstanceId: 'quest-1',
      challengeNumber: i,
      status,
      xpAwarded: status === 'approved' ? 50 : 0,
      
      // Add data for completed/in-progress challenges
      ...(status !== 'locked' && {
        startedAt: new Date(Date.now() - (17 - i) * 86400000), // Stagger start dates
      }),
      
      ...(status === 'approved' && {
        submittedAt: new Date(Date.now() - (16 - i) * 86400000),
        reviewedAt: new Date(Date.now() - (15 - i) * 86400000),
        approvedAt: new Date(Date.now() - (15 - i) * 86400000),
        reviewedBy: tutorId,
        tutorFeedback: [
          'Fantastic work! I love how you explained your thinking. 🌟',
          'Great job! Your counting skills are really improving! 💪',
          'Excellent work! You\'re becoming a number ninja! ⭐',
        ][i - 1] || undefined,
        evidence: [{
          id: `evidence-${i}`,
          type: 'image',
          content: 'mock-screenshot.jpg',
          uploadedAt: new Date(Date.now() - (16 - i) * 86400000),
        }],
      }),
      
      ...(status === 'in_progress' && {
        studentNotes: 'Working on this challenge now!',
      }),
      
      ...(status === 'needs_revision' && {
        submittedAt: new Date(Date.now() - 86400000),
        reviewedAt: new Date(Date.now() - 43200000),
        reviewedBy: tutorId,
        tutorFeedback: 'Great start! Can you try adding one more example? I think you almost have it! 💡',
        evidence: [{
          id: `evidence-${i}`,
          type: 'image',
          content: 'mock-screenshot.jpg',
          uploadedAt: new Date(Date.now() - 86400000),
        }],
      }),
      
      ...(status === 'submitted' && {
        submittedAt: new Date(Date.now() - 3600000),
        studentNotes: 'Here\'s my work! I had fun with this one.',
        evidence: [{
          id: `evidence-${i}`,
          type: 'image',
          content: 'mock-screenshot.jpg',
          uploadedAt: new Date(Date.now() - 3600000),
        }],
      }),
    };
    
    challenges.push(challenge);
  }
  
  const quest: LegacyQuestInstance = {
    id: 'quest-1',
    templateId: 'L1UM-CORE',
    studentId,
    tutorId,
    status: 'in_progress',
    progress: 3, // 3 out of 16 completed
    assignedAt: new Date(Date.now() - 20 * 86400000), // 20 days ago
    startedAt: new Date(Date.now() - 18 * 86400000),
    challenges,
    requiresTutorConfirmation: true,
    certificateIssued: false,
  };
  
  return quest;
}

/**
 * Generate mock XP summary for a student
 */
export function generateMockXPSummary(studentId: string): XPSummary {
  const totalXP = 450; // 3 challenges × 50 XP + some bonuses
  const currentLevel = 1;
  const xpToNextLevel = 550; // Need 550 more to reach Level 2
  const percentToNextLevel = (totalXP / (totalXP + xpToNextLevel)) * 100;
  
  return {
    studentId,
    totalXP,
    currentLevel,
    xpToNextLevel,
    percentToNextLevel: Math.round(percentToNextLevel),
    lastCalculatedAt: new Date(),
  };
}

/**
 * Generate mock achievements
 */
export function generateMockAchievements(studentId: string): Achievement[] {
  return [
    {
      id: 'achievement-1',
      studentId,
      type: 'first_quest',
      unlockedAt: new Date(Date.now() - 15 * 86400000),
      title: 'Quest Beginner',
      description: 'Started your first quest!',
      xpBonus: 25,
      badgeColor: '#14B8A6',
      badgeIcon: '🎯',
    },
    {
      id: 'achievement-2',
      studentId,
      type: 'streak_7',
      unlockedAt: new Date(Date.now() - 7 * 86400000),
      title: 'Week Warrior',
      description: 'Completed challenges 7 days in a row!',
      xpBonus: 50,
      badgeColor: '#F59E0B',
      badgeIcon: '🔥',
    },
  ];
}

/**
 * Generate a mock quest instance with 16 challenge instances
 */
export function generateMockQuestInstance(studentUid: string): FirestoreQuestInstance {
  const template = generateMockQuestTemplate();
  const nowTimestamp = now();
  
  return {
    questInstanceId: `${template.questId}-${studentUid}`,
    questId: template.questId,
    studentUid,
    cohortId: 'cohort-demo',
    assignedAt: nowTimestamp - (20 * 24 * 60 * 60 * 1000), // 20 days ago
    startedAt: nowTimestamp - (18 * 24 * 60 * 60 * 1000), // 18 days ago
    status: 'ACTIVE',
    progress: {
      completedCount: 3,
      requiredCompleted: false,
      mastered: false,
      tutorConfirmed: false,
    },
  };
}

/**
 * Generate mock challenge instances for demo
 */
export function generateMockChallengeInstances(
  questInstanceId: string,
  studentUid: string
): FirestoreChallengeInstance[] {
  const templates = generateMockChallengeTemplates();
  const nowTimestamp = now();
  
  return templates.map((template, index) => {
    const num = index + 1;
    let status: ChallengeInstance['status'];
    
    // First 3 challenges completed
    if (num <= 3) {
      status = 'COMPLETE';
    }
    // Challenge 4 is submitted, awaiting review
    else if (num === 4) {
      status = 'SUBMITTED';
    }
    // Challenge 5 is in progress
    else if (num === 5) {
      status = 'IN_PROGRESS';
    }
    // Rest are todo/locked
    else {
      status = 'TODO';
    }
    
    const instance: ChallengeInstance = {
      challengeInstanceId: `${template.challengeId}-${studentUid}`,
      challengeId: template.challengeId,
      questInstanceId,
      studentUid,
      status,
    };
    
    // Add completion data for completed challenges
    if (status === 'COMPLETE') {
      instance.startedAt = nowTimestamp - ((17 - num) * 24 * 60 * 60 * 1000);
      instance.completedAt = nowTimestamp - ((16 - num) * 24 * 60 * 60 * 1000);
      instance.reviewedAt = nowTimestamp - ((15 - num) * 24 * 60 * 60 * 1000);
      instance.reviewedBy = 'tutor-demo';
      instance.tutorFeedback = [
        'Fantastic work! I love how you explained your thinking. 🌟',
        'Great job! Your counting skills are really improving! 💪',
        'Excellent work! You\'re becoming a number ninja! ⭐',
      ][num - 1] || 'Amazing effort!';
      instance.evidence = {
        type: 'PHOTO',
        value: 'mock-screenshot.jpg',
        uploadedAt: nowTimestamp - ((16 - num) * 24 * 60 * 60 * 1000),
      };
      instance.xpAwarded = template.xp.baseComplete;
    }
    
    // Add data for submitted challenge
    if (status === 'SUBMITTED') {
      instance.startedAt = nowTimestamp - (2 * 60 * 60 * 1000); // 2 hours ago
      instance.evidence = {
        type: 'PHOTO',
        value: 'mock-work.jpg',
        uploadedAt: nowTimestamp - (1 * 60 * 60 * 1000), // 1 hour ago
      };
    }
    
    // Add data for in-progress challenge
    if (status === 'IN_PROGRESS') {
      instance.startedAt = nowTimestamp - (30 * 60 * 60 * 1000); // 30 minutes ago
    }
    
    return instance;
  });
}

/**
 * Generate mock XP events for a student
 */
export function generateMockXPEvents(studentUid: string): XPEvent[] {
  const nowTimestamp = now();
  const questInstanceId = `L1UM-CORE-${studentUid}`;
  
  return [
    {
      xpEventId: `xp-${studentUid}-1`,
      studentUid,
      questInstanceId,
      challengeInstanceId: `L1UM-CORE-01-${studentUid}`,
      type: 'CHALLENGE_COMPLETE',
      xp: 100,
      createdAt: nowTimestamp - (15 * 24 * 60 * 60 * 1000),
      createdBy: 'tutor-demo',
      description: 'Completed Challenge 1: Assessment',
    },
    {
      xpEventId: `xp-${studentUid}-2`,
      studentUid,
      questInstanceId,
      challengeInstanceId: `L1UM-CORE-02-${studentUid}`,
      type: 'CHALLENGE_COMPLETE',
      xp: 50,
      createdAt: nowTimestamp - (10 * 24 * 60 * 60 * 1000),
      createdBy: 'tutor-demo',
      description: 'Completed Challenge 2: Counting to 10',
    },
    {
      xpEventId: `xp-${studentUid}-3`,
      studentUid,
      questInstanceId,
      challengeInstanceId: `L1UM-CORE-03-${studentUid}`,
      type: 'CHALLENGE_COMPLETE',
      xp: 50,
      createdAt: nowTimestamp - (5 * 24 * 60 * 60 * 1000),
      createdBy: 'tutor-demo',
      description: 'Completed Challenge 3: Recognizing Numbers',
    },
    {
      xpEventId: `xp-${studentUid}-4`,
      studentUid,
      type: 'STREAK_BONUS',
      xp: 50,
      createdAt: nowTimestamp - (3 * 24 * 60 * 60 * 1000),
      createdBy: 'SYSTEM',
      description: '7-day streak bonus!',
    },
  ];
}

/**
 * Calculate total XP from events
 */
export function calculateTotalXP(xpEvents: XPEvent[]): number {
  return xpEvents.reduce((total, event) => total + event.xp, 0);
}

/**
 * Generate mock student user
 */
export function generateMockStudent(uid: string): User {
  const xpEvents = generateMockXPEvents(uid);
  const totalXP = calculateTotalXP(xpEvents);
  
  return {
    uid,
    email: 'demo@example.com',
    role: 'student',
    displayName: 'Demo Student',
    createdAt: now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: now(),
    currentLevel: 'L1',
    totalXP,
    parentUids: ['parent-demo'],
    orgIds: ['org-demo'],
    cohortIds: ['cohort-demo'],
  };
}

// Export commonly used legacy mock generator with backwards-compatible name
export { generateMockQuestLegacy as generateMockQuest };