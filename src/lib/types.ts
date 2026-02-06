/**
 * Core Type Definitions for Mz. Marianna's Academy
 * Aligned with Firestore data architecture
 */

import { SkillTier } from './tier-system';

// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = 'student' | 'parent' | 'tutor' | 'admin' | 'teacher' | 'school';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Student-specific
  currentLevel?: number; // L1-L6
  currentProgram?: ProgramType;
  totalXP?: number;
  parentIds?: string[]; // Parent UIDs
  tutorIds?: string[]; // Tutor UIDs
  
  // Tier System (Skill-based progression)
  skillTier?: SkillTier; // Content tier based on competencies
  uiTier?: SkillTier; // UI tier (can differ from skill tier for age-appropriateness)
  age?: number; // For UI tier calculation
  
  // Parent-specific
  studentIds?: string[]; // Student UIDs
  
  // Tutor-specific
  assignedStudentIds?: string[]; // Student UIDs
  
  // Accessibility preferences
  preferences?: UserPreferences;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  highContrast: boolean;
  reducedMotion: boolean;
  focusMode: boolean; // ADHD-friendly: dims everything except current task
  soundEffects: boolean;
  notifications: {
    email: boolean;
    inApp: boolean;
    weeklyDigest: boolean;
  };
}

// ============================================================================
// CURRICULUM TYPES (Templates - Read Only)
// ============================================================================

export type ProgramType = 'CORE' | 'PRAXIS' | 'EXPLORERS';
export type UnitType = 'UM' | 'UR' | 'UW' | 'US' | 'UEF'; // Math, Reading, Writing, STEAM, Exec Function
export type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface Program {
  id: string; // 'CORE', 'PRAXIS', 'EXPLORERS'
  name: string;
  description: string;
  type: ProgramType;
  isOverlay: boolean; // PRAXIS and EXPLORERS overlay on CORE
}

export interface Level {
  id: string; // 'L1', 'L2', ..., 'L6'
  number: LevelNumber;
  name: string;
  description: string;
  skillFocus: string; // Not age-based
  questCount: number; // Should be 30 (5 units × 6 quests per level)
}

export interface QuestTemplate {
  id: string; // e.g., 'L1-UM-Q1'
  levelId: string; // 'L1'
  levelNumber: LevelNumber;
  unit: UnitType;
  questNumber: number; // 1-6 per unit
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedDuration: string; // e.g., "2-3 weeks"
  challengeCount: number; // Always 16
  challengeIds: string[]; // Array of 16 challenge IDs
}

export interface ChallengeTemplate {
  id: string; // e.g., 'L1-UM-Q1-C1'
  questId: string; // Parent quest
  levelId: string;
  unit: UnitType;
  challengeNumber: number; // 1-16
  isCheckpoint: boolean; // #1 (Assessment), #8 (Midpoint), #16 (Celebration)
  checkpointType?: 'assessment' | 'midpoint' | 'celebration';
  
  title: string;
  instructions: string;
  materialNeeded?: string[];
  estimatedMinutes: number;
  
  // Content
  videoUrl?: string;
  resourceLinks?: string[];
  robloxIntegration?: RobloxIntegration; // For Math (UM) challenges
  
  // Evidence requirements
  evidenceType: 'text' | 'image' | 'video' | 'roblox' | 'multiple';
  evidencePrompt: string; // What the student should submit
  
  // XP rewards
  baseXP: number; // XP awarded on completion
}

export interface RobloxIntegration {
  gameId: string;
  gameUrl: string;
  taskDescription: string;
  requiredBadges?: string[]; // Roblox badge IDs
  completionCriteria: string;
}

// ============================================================================
// RUNTIME TYPES (User Data - Mutable)
// ============================================================================

export type QuestStatus = 'not_started' | 'in_progress' | 'pending_review' | 'completed' | 'mastered';
export type ChallengeStatus = 'locked' | 'available' | 'in_progress' | 'submitted' | 'approved' | 'needs_revision';

export interface QuestInstance {
  id: string; // Firestore doc ID
  templateId: string; // Reference to QuestTemplate
  studentId: string;
  tutorId: string; // Assigned tutor
  
  status: QuestStatus;
  progress: number; // 0-16 (number of approved challenges)
  
  assignedAt: Date;
  startedAt?: Date;
  submittedAt?: Date; // When student marks all as done
  completedAt?: Date; // When tutor confirms mastery (16/16)
  
  challenges: ChallengeInstance[]; // 16 challenges
  
  // Mastery requirements
  requiresTutorConfirmation: boolean; // Always true for mastery
  tutorConfirmedAt?: Date;
  certificateIssued: boolean;
}

export interface ChallengeInstance {
  id: string; // Unique instance ID
  templateId: string; // Reference to ChallengeTemplate
  questInstanceId: string;
  
  challengeNumber: number; // 1-16
  status: ChallengeStatus;
  
  // Student work
  startedAt?: Date;
  submittedAt?: Date;
  evidence?: Evidence[];
  studentNotes?: string;
  
  // Tutor feedback
  reviewedAt?: Date;
  reviewedBy?: string; // Tutor UID
  tutorFeedback?: string; // Only positive, encouraging feedback
  approvedAt?: Date;
  
  // XP tracking
  xpAwarded: number;
  xpEventId?: string; // Reference to XPEvent doc
}

export interface Evidence {
  id: string;
  type: 'text' | 'image' | 'video' | 'roblox' | 'link';
  content: string; // Text content or URL
  uploadedAt: Date;
  
  // For images/videos
  fileName?: string;
  fileSize?: number;
  storageUrl?: string; // Firebase Storage URL
  
  // For Roblox
  robloxData?: {
    badgeId?: string;
    gameplayTime?: number;
    completionProof?: string;
  };
}

// ============================================================================
// XP SYSTEM (Append-Only Ledger)
// ============================================================================

export type XPEventType = 'challenge_complete' | 'quest_complete' | 'level_up' | 'streak_bonus' | 'special_achievement';

export interface XPEvent {
  id: string; // Firestore doc ID
  studentId: string;
  type: XPEventType;
  amount: number; // Always positive - XP never decreases
  timestamp: Date;
  
  // References
  challengeInstanceId?: string;
  questInstanceId?: string;
  achievementId?: string;
  
  // Metadata
  description: string; // e.g., "Completed Challenge 3: Fraction Pizza Party"
  celebrationShown: boolean; // Track if user saw the XP gain animation
}

export interface XPSummary {
  studentId: string;
  totalXP: number; // Calculated by summing all XPEvent.amount
  currentLevel: LevelNumber;
  xpToNextLevel: number;
  percentToNextLevel: number;
  lastCalculatedAt: Date;
}

// ============================================================================
// MASTERY & ACHIEVEMENTS
// ============================================================================

export interface Certificate {
  id: string;
  studentId: string;
  questInstanceId: string;
  levelId: string;
  unit: UnitType;
  
  issuedAt: Date;
  issuedBy: string; // Tutor UID
  
  // Certificate data
  studentName: string;
  questTitle: string;
  completionDate: Date;
  pdfUrl?: string; // Generated PDF in Storage
}

export interface Achievement {
  id: string;
  studentId: string;
  type: 'first_quest' | 'level_up' | 'perfect_week' | 'streak_7' | 'streak_30' | 'all_units_l1' | 'fast_learner' | 'helper' | 'custom';
  
  unlockedAt: Date;
  title: string;
  description: string;
  iconUrl?: string;
  xpBonus: number;
  
  // Badge visual
  badgeColor: string; // Hex color
  badgeIcon: string; // Icon name or emoji
}

// ============================================================================
// WEEKLY RHYTHM (Reduces Anxiety)
// ============================================================================

export interface WeeklySchedule {
  id: string; // studentId
  studentId: string;
  
  // Predictable weekly pattern
  mondayTasks: string[]; // Challenge IDs or types
  tuesdayTasks: string[];
  wednesdayTasks: string[];
  thursdayTasks: string[];
  fridayTasks: string[];
  weekendTasks?: string[];
  
  // Rhythm preferences
  preferredStartTime: string; // e.g., "3:00 PM"
  sessionDuration: number; // Minutes
  breakFrequency: number; // Minutes between breaks
  
  // Notifications
  reminderEnabled: boolean;
  reminderTime: string; // e.g., "2:30 PM" (30 min before)
}

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

export interface StudentProgressReport {
  studentId: string;
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  
  // Summary
  questsCompleted: number;
  challengesCompleted: number;
  totalXPEarned: number;
  currentLevel: LevelNumber;
  
  // Per-unit breakdown
  unitProgress: {
    [key in UnitType]: {
      questsCompleted: number;
      challengesCompleted: number;
      xpEarned: number;
      averageTimePerChallenge: number; // Minutes
    };
  };
  
  // Engagement
  daysActive: number;
  longestStreak: number;
  currentStreak: number;
  averageSessionDuration: number; // Minutes
  
  // Struggle indicators (for tutor intervention)
  challengesNeedingRevision: number;
  averageRevisionsPerChallenge: number;
  challengesWithLongDuration: string[]; // Challenge IDs taking >3x expected time
}

// ============================================================================
// FIRESTORE COLLECTION NAMES (Constants)
// ============================================================================

export const COLLECTIONS = {
  // Templates (Read-Only)
  PROGRAMS: 'programs',
  LEVELS: 'levels',
  QUEST_TEMPLATES: 'questTemplates',
  CHALLENGE_TEMPLATES: 'challengeTemplates',
  
  // Runtime (Mutable)
  USERS: 'users',
  QUEST_INSTANCES: 'questInstances',
  XP_EVENTS: 'xpEvents',
  CERTIFICATES: 'certificates',
  ACHIEVEMENTS: 'achievements',
  WEEKLY_SCHEDULES: 'weeklySchedules',
  
  // Analytics
  PROGRESS_REPORTS: 'progressReports',
} as const;

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Helper to convert Firestore timestamps to Date
export const timestampToDate = (timestamp: FirestoreTimestamp | Date): Date => {
  if (timestamp instanceof Date) return timestamp;
  return new Date(timestamp.seconds * 1000);
};