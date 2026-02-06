/**
 * Adaptive Learning Path System
 * Customizes learning based on mastered/unmastered competencies
 */

import { 
  Competency, 
  GradeLevel, 
  Subject, 
  SkillLevel,
  getCompetenciesForGrade,
  findPrerequisites,
  getNextCompetency 
} from './learning-standards';

export interface CompetencyMastery {
  competencyId: string;
  studentId: string;
  subject: Subject;
  attempts: number;
  successRate: number; // 0-100
  lastAttemptDate: Date;
  masteryLevel: SkillLevel;
  isMastered: boolean;
  strugglingAreas: string[];
  timeSpent: number; // minutes
}

export interface LearningPath {
  id: string;
  studentId: string;
  subject: Subject;
  currentGrade: GradeLevel;
  targetGrade: GradeLevel;
  competencies: LearningPathCompetency[];
  createdAt: Date;
  updatedAt: Date;
  completionPercentage: number;
}

export interface LearningPathCompetency {
  competency: Competency;
  mastery: CompetencyMastery | null;
  status: 'not-started' | 'in-progress' | 'mastered' | 'needs-review';
  priority: 'high' | 'medium' | 'low';
  estimatedTimeRemaining: number; // minutes
}

// ==================== MASTERY THRESHOLDS ====================

const MASTERY_THRESHOLDS = {
  mastered: 90, // 90%+ success rate
  proficient: 70, // 70-89%
  developing: 50, // 50-69%
  emerging: 0, // 0-49%
};

const MASTERY_ATTEMPTS_MIN = 3; // Need at least 3 attempts to determine mastery

// ==================== DETERMINE MASTERY ====================

export function calculateMasteryLevel(successRate: number, attempts: number): {
  level: SkillLevel;
  isMastered: boolean;
} {
  if (attempts < MASTERY_ATTEMPTS_MIN) {
    return { level: 'emerging', isMastered: false };
  }

  if (successRate >= MASTERY_THRESHOLDS.mastered) {
    return { level: 'advanced', isMastered: true };
  } else if (successRate >= MASTERY_THRESHOLDS.proficient) {
    return { level: 'proficient', isMastered: false };
  } else if (successRate >= MASTERY_THRESHOLDS.developing) {
    return { level: 'developing', isMastered: false };
  } else {
    return { level: 'emerging', isMastered: false };
  }
}

// ==================== GENERATE LEARNING PATH ====================

export function generateAdaptivePath(
  studentId: string,
  subject: Subject,
  currentGrade: GradeLevel,
  assessmentResults: CompetencyMastery[]
): LearningPath {
  // Get all competencies for current grade
  const gradeCompetencies = getCompetenciesForGrade(currentGrade, subject);

  // Map competencies to learning path items
  const pathCompetencies: LearningPathCompetency[] = gradeCompetencies.map(comp => {
    const mastery = assessmentResults.find(m => m.competencyId === comp.id);
    const status = determineStatus(mastery);
    const priority = determinePriority(comp, mastery, assessmentResults);

    return {
      competency: comp,
      mastery: mastery || null,
      status,
      priority,
      estimatedTimeRemaining: estimateTimeRemaining(comp, mastery),
    };
  });

  // Sort by priority (high first) and prerequisites
  const sorted = sortByPriorityAndPrerequisites(pathCompetencies);

  return {
    id: `path-${studentId}-${subject}-${Date.now()}`,
    studentId,
    subject,
    currentGrade,
    targetGrade: currentGrade, // Can be adjusted
    competencies: sorted,
    createdAt: new Date(),
    updatedAt: new Date(),
    completionPercentage: calculateCompletionPercentage(sorted),
  };
}

function determineStatus(mastery: CompetencyMastery | null | undefined): LearningPathCompetency['status'] {
  if (!mastery) return 'not-started';
  if (mastery.isMastered) return 'mastered';
  if (mastery.attempts > 0 && mastery.successRate < 50) return 'needs-review';
  return 'in-progress';
}

function determinePriority(
  competency: Competency,
  mastery: CompetencyMastery | null | undefined,
  allMastery: CompetencyMastery[]
): 'high' | 'medium' | 'low' {
  // High priority if:
  // 1. Has prerequisites that are mastered
  // 2. Currently struggling (low success rate)
  // 3. Is foundational (no prerequisites)

  if (!mastery || mastery.attempts === 0) {
    // Not started yet
    if (!competency.prerequisite || competency.prerequisite.length === 0) {
      return 'high'; // Foundational skill
    }

    // Check if prerequisites are mastered
    const prereqsMastered = competency.prerequisite.every(prereqId => {
      const prereqMastery = allMastery.find(m => m.competencyId === prereqId);
      return prereqMastery?.isMastered;
    });

    return prereqsMastered ? 'high' : 'low';
  }

  // Struggling = high priority
  if (mastery.successRate < 60) {
    return 'high';
  }

  // Close to mastery = medium priority
  if (mastery.successRate >= 60 && mastery.successRate < 90) {
    return 'medium';
  }

  // Mastered = low priority (review only)
  return 'low';
}

function estimateTimeRemaining(
  competency: Competency,
  mastery: CompetencyMastery | null | undefined
): number {
  const baseTime = competency.masteryTime * 60; // Convert hours to minutes

  if (!mastery) return baseTime;

  // Adjust based on current mastery
  const remainingPercentage = (100 - mastery.successRate) / 100;
  return Math.ceil(baseTime * remainingPercentage);
}

function sortByPriorityAndPrerequisites(
  competencies: LearningPathCompetency[]
): LearningPathCompetency[] {
  // Create a dependency graph
  const sorted: LearningPathCompetency[] = [];
  const remaining = [...competencies];

  while (remaining.length > 0) {
    // Find items with no unmet prerequisites
    const ready = remaining.filter(item => {
      if (!item.competency.prerequisite || item.competency.prerequisite.length === 0) {
        return true;
      }

      // Check if all prerequisites are already in sorted
      return item.competency.prerequisite.every(prereqId =>
        sorted.some(s => s.competency.id === prereqId)
      );
    });

    if (ready.length === 0) {
      // Circular dependency or error - add remaining as-is
      sorted.push(...remaining);
      break;
    }

    // Sort ready items by priority
    ready.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sorted.push(...ready);
    ready.forEach(item => {
      const idx = remaining.indexOf(item);
      remaining.splice(idx, 1);
    });
  }

  return sorted;
}

function calculateCompletionPercentage(competencies: LearningPathCompetency[]): number {
  if (competencies.length === 0) return 0;
  const mastered = competencies.filter(c => c.status === 'mastered').length;
  return Math.round((mastered / competencies.length) * 100);
}

// ==================== UPDATE MASTERY ====================

export function updateCompetencyMastery(
  existing: CompetencyMastery | null,
  competencyId: string,
  studentId: string,
  subject: Subject,
  isCorrect: boolean,
  timeSpent: number,
  strugglingArea?: string
): CompetencyMastery {
  const attempts = existing ? existing.attempts + 1 : 1;
  const previousSuccesses = existing ? existing.successRate * existing.attempts / 100 : 0;
  const newSuccesses = previousSuccesses + (isCorrect ? 1 : 0);
  const successRate = Math.round((newSuccesses / attempts) * 100);
  const totalTime = existing ? existing.timeSpent + timeSpent : timeSpent;

  const { level, isMastered } = calculateMasteryLevel(successRate, attempts);

  const strugglingAreas = existing ? [...existing.strugglingAreas] : [];
  if (!isCorrect && strugglingArea && !strugglingAreas.includes(strugglingArea)) {
    strugglingAreas.push(strugglingArea);
  }

  return {
    competencyId,
    studentId,
    subject,
    attempts,
    successRate,
    lastAttemptDate: new Date(),
    masteryLevel: level,
    isMastered,
    strugglingAreas,
    timeSpent: totalTime,
  };
}

// ==================== GET STUDENT DATA ====================

/**
 * Get all competencies for a student (mock implementation - replace with real data)
 */
export function getStudentCompetencies(studentId: string): Competency[] {
  // Mock implementation - in production, fetch from database
  // For now, return some basic competencies for testing
  return [];
}

/**
 * Get student's mastery data for competencies (mock implementation)
 */
export function getStudentCompetencyMastery(studentId: string, subject?: Subject): CompetencyMastery[] {
  // Mock implementation - in production, fetch from database
  return [];
}

// ==================== GET NEXT TASK ====================

export function getNextRecommendedTask(
  path: LearningPath
): LearningPathCompetency | null {
  // Find highest priority unmastered competency
  const highPriority = path.competencies.find(
    c => c.priority === 'high' && c.status !== 'mastered'
  );

  if (highPriority) return highPriority;

  // Find medium priority
  const mediumPriority = path.competencies.find(
    c => c.priority === 'medium' && c.status !== 'mastered'
  );

  if (mediumPriority) return mediumPriority;

  // Find any unmastered
  const anyUnmastered = path.competencies.find(c => c.status !== 'mastered');

  return anyUnmastered || null;
}

// ==================== WOWL ADAPTIVE MESSAGES ====================

export function getWowlAdaptiveMessage(
  competency: LearningPathCompetency
): string {
  const { status, priority, mastery } = competency;

  if (status === 'mastered') {
    return `You've mastered ${competency.competency.skill}. Moving on.`;
  }

  if (status === 'needs-review') {
    return `${competency.competency.skill} needs more work. Let's approach it differently.`;
  }

  if (priority === 'high' && mastery && mastery.successRate < 50) {
    return `${competency.competency.skill} is causing trouble. I'll break it down for you.`;
  }

  if (priority === 'high' && !mastery) {
    return `Time to work on ${competency.competency.skill}. This is foundational.`;
  }

  if (mastery && mastery.successRate >= 70 && mastery.successRate < 90) {
    return `${competency.competency.skill}: ${mastery.successRate}% success rate. A bit more practice and you'll have it.`;
  }

  return `Let's work on ${competency.competency.skill}.`;
}

// ==================== STORAGE (Demo Mode) ====================

export function saveLearningPath(path: LearningPath): void {
  localStorage.setItem(`learningPath-${path.studentId}-${path.subject}`, JSON.stringify(path));
}

export function loadLearningPath(studentId: string, subject: Subject): LearningPath | null {
  const stored = localStorage.getItem(`learningPath-${studentId}-${subject}`);
  if (!stored) return null;

  const path: LearningPath = JSON.parse(stored);
  path.createdAt = new Date(path.createdAt);
  path.updatedAt = new Date(path.updatedAt);
  path.competencies.forEach(c => {
    if (c.mastery) {
      c.mastery.lastAttemptDate = new Date(c.mastery.lastAttemptDate);
    }
  });

  return path;
}

export function saveCompetencyMastery(mastery: CompetencyMastery): void {
  const key = `mastery-${mastery.studentId}-${mastery.competencyId}`;
  localStorage.setItem(key, JSON.stringify(mastery));
}

export function loadCompetencyMastery(studentId: string, competencyId: string): CompetencyMastery | null {
  const key = `mastery-${studentId}-${competencyId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  const mastery: CompetencyMastery = JSON.parse(stored);
  mastery.lastAttemptDate = new Date(mastery.lastAttemptDate);
  return mastery;
}

export function getAllMasteries(studentId: string, subject: Subject): CompetencyMastery[] {
  const masteries: CompetencyMastery[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`mastery-${studentId}-`)) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const mastery: CompetencyMastery = JSON.parse(stored);
        if (mastery.subject === subject) {
          mastery.lastAttemptDate = new Date(mastery.lastAttemptDate);
          masteries.push(mastery);
        }
      }
    }
  }

  return masteries;
}