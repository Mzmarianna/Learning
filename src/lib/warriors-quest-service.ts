/**
 * Warriors Quest Assignment & Progress Service
 * Handles Warriors tier (6th-8th grade) quest assignment and tracking
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  WARRIORS_CURRICULUM,
  getWarriorQuestByWeek,
  getWarriorQuestById,
  calculateWarriorQuestProgress,
  type WarriorQuest,
  type WarriorChallenge,
} from './curriculum-index';
import type { QuestAssignment } from './quest-assignment-service';
import { SkillTier } from './tier-system';

// ==================== TYPES ====================

export interface WarriorQuestAssignment extends QuestAssignment {
  tier: 'warriors';
  weekNumber: number;
  questData: WarriorQuest;
  challengesCompleted: string[];
  currentDay?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
}

export interface ChallengeSubmission {
  challengeId: string;
  studentId: string;
  submissionData: {
    type: 'text' | 'image' | 'video' | 'screenshot' | 'multiple' | 'digital';
    content: string | string[]; // Text or URLs
  };
  submittedAt: Date;
  status: 'pending-review' | 'reviewed' | 'mastered';
  masteryLevel?: 'emerging' | 'developing' | 'proficient' | 'advanced' | 'mastered';
  feedback?: string;
  xpAwarded: number;
}

// ==================== FIRESTORE COLLECTIONS ====================

const COLLECTIONS = {
  WARRIOR_QUESTS: 'warrior_quest_assignments',
  CHALLENGE_SUBMISSIONS: 'challenge_submissions',
  WARRIOR_PROGRESS: 'warrior_progress',
};

// ==================== QUEST ASSIGNMENT ====================

/**
 * Assign Warriors quest based on week number
 */
export async function assignWarriorQuestByWeek(
  studentId: string,
  weekNumber: number,
  source: 'placement-quiz' | 'tutor' | 'auto-progression' | 'parent' = 'auto-progression'
): Promise<WarriorQuestAssignment> {
  try {
    const quest = getWarriorQuestByWeek(weekNumber);
    if (!quest) {
      throw new Error(`Warriors quest for week ${weekNumber} not found`);
    }

    const assignment: WarriorQuestAssignment = {
      id: `${studentId}-${quest.questId}-${Date.now()}`,
      studentId,
      questId: quest.questId,
      questTitle: quest.theme,
      questData: quest,
      tier: 'warriors',
      weekNumber,
      assignedAt: new Date(),
      assignedBy: source,
      status: 'assigned',
      lessonsCompleted: [],
      challengesCompleted: [],
      xpEarned: 0,
      competenciesTargeted: extractCompetencies(quest),
      difficulty: 'grade-level',
      estimatedTimeMinutes: quest.challenges.reduce((sum, c) => sum + c.estimatedMinutes, 0),
    };

    // Save to database
    if (db) {
      await setDoc(doc(db, COLLECTIONS.WARRIOR_QUESTS, assignment.id), {
        ...assignment,
        assignedAt: Timestamp.fromDate(assignment.assignedAt),
      });
    } else {
      // Fallback to localStorage
      localStorage.setItem(`warrior-quest-${assignment.id}`, JSON.stringify(assignment));
    }

    return assignment;
  } catch (error) {
    console.error('Error assigning Warriors quest:', error);
    throw error;
  }
}

/**
 * Get current Warriors quest for student
 */
export async function getCurrentWarriorQuest(
  studentId: string
): Promise<WarriorQuestAssignment | null> {
  try {
    if (db) {
      const q = query(
        collection(db, COLLECTIONS.WARRIOR_QUESTS),
        where('studentId', '==', studentId),
        where('status', 'in', ['assigned', 'in-progress']),
        orderBy('assignedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const data = snapshot.docs[0].data();
      return {
        ...data,
        assignedAt: data.assignedAt?.toDate() || new Date(),
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
      } as WarriorQuestAssignment;
    } else {
      // localStorage fallback
      const assignments: WarriorQuestAssignment[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('warrior-quest-')) {
          const data = localStorage.getItem(key);
          if (data) {
            const assignment = JSON.parse(data);
            if (assignment.studentId === studentId && 
                (assignment.status === 'assigned' || assignment.status === 'in-progress')) {
              assignments.push(assignment);
            }
          }
        }
      }
      return assignments.sort((a, b) => 
        new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
      )[0] || null;
    }
  } catch (error) {
    console.error('Error getting current Warriors quest:', error);
    return null;
  }
}

/**
 * Get all Warriors quests for a student
 */
export async function getWarriorQuestHistory(
  studentId: string
): Promise<WarriorQuestAssignment[]> {
  try {
    if (db) {
      const q = query(
        collection(db, COLLECTIONS.WARRIOR_QUESTS),
        where('studentId', '==', studentId),
        orderBy('weekNumber', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          assignedAt: data.assignedAt?.toDate() || new Date(),
          startedAt: data.startedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
        } as WarriorQuestAssignment;
      });
    } else {
      const assignments: WarriorQuestAssignment[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('warrior-quest-')) {
          const data = localStorage.getItem(key);
          if (data) {
            const assignment = JSON.parse(data);
            if (assignment.studentId === studentId) {
              assignments.push(assignment);
            }
          }
        }
      }
      return assignments.sort((a, b) => a.weekNumber - b.weekNumber);
    }
  } catch (error) {
    console.error('Error getting Warriors quest history:', error);
    return [];
  }
}

// ==================== CHALLENGE SUBMISSION ====================

/**
 * Submit a challenge for review
 */
export async function submitChallenge(
  studentId: string,
  challengeId: string,
  submissionData: ChallengeSubmission['submissionData']
): Promise<ChallengeSubmission> {
  try {
    const submission: ChallengeSubmission = {
      challengeId,
      studentId,
      submissionData,
      submittedAt: new Date(),
      status: 'pending-review',
      xpAwarded: 0, // Will be set after review
    };

    // Save to database
    const submissionId = `${studentId}-${challengeId}-${Date.now()}`;
    if (db) {
      await setDoc(doc(db, COLLECTIONS.CHALLENGE_SUBMISSIONS, submissionId), {
        ...submission,
        submittedAt: Timestamp.fromDate(submission.submittedAt),
      });
    } else {
      localStorage.setItem(`challenge-sub-${submissionId}`, JSON.stringify(submission));
    }

    return submission;
  } catch (error) {
    console.error('Error submitting challenge:', error);
    throw error;
  }
}

/**
 * Review and grade a challenge submission
 */
export async function reviewChallengeSubmission(
  submissionId: string,
  masteryLevel: ChallengeSubmission['masteryLevel'],
  feedback: string,
  xpAwarded: number
): Promise<void> {
  try {
    const updates = {
      status: 'reviewed' as const,
      masteryLevel,
      feedback,
      xpAwarded,
      reviewedAt: db ? Timestamp.now() : new Date(),
    };

    if (db) {
      await updateDoc(doc(db, COLLECTIONS.CHALLENGE_SUBMISSIONS, submissionId), updates);
    } else {
      const key = `challenge-sub-${submissionId}`;
      const data = localStorage.getItem(key);
      if (data) {
        const submission = JSON.parse(data);
        Object.assign(submission, updates);
        localStorage.setItem(key, JSON.stringify(submission));
      }
    }

    // If mastered, update quest progress
    if (masteryLevel === 'mastered') {
      // Get submission to find student and challenge
      const submission = await getChallengeSubmission(submissionId);
      if (submission) {
        await markChallengeComplete(submission.studentId, submission.challengeId, xpAwarded);
      }
    }
  } catch (error) {
    console.error('Error reviewing challenge:', error);
    throw error;
  }
}

/**
 * Get challenge submission
 */
async function getChallengeSubmission(submissionId: string): Promise<ChallengeSubmission | null> {
  try {
    if (db) {
      const docSnap = await getDoc(doc(db, COLLECTIONS.CHALLENGE_SUBMISSIONS, submissionId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date(),
        } as ChallengeSubmission;
      }
    } else {
      const key = `challenge-sub-${submissionId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting challenge submission:', error);
    return null;
  }
}

// ==================== PROGRESS TRACKING ====================

/**
 * Mark a challenge as complete
 */
export async function markChallengeComplete(
  studentId: string,
  challengeId: string,
  xpEarned: number
): Promise<void> {
  try {
    // Find the quest this challenge belongs to
    const currentQuest = await getCurrentWarriorQuest(studentId);
    if (!currentQuest) {
      console.warn('No current quest found for student');
      return;
    }

    // Add challenge to completed list
    if (!currentQuest.challengesCompleted.includes(challengeId)) {
      currentQuest.challengesCompleted.push(challengeId);
    }

    // Update XP
    currentQuest.xpEarned += xpEarned;

    // Update current day
    const challenge = currentQuest.questData.challenges.find(c => c.challengeId === challengeId);
    if (challenge) {
      currentQuest.currentDay = challenge.dayOfWeek;
    }

    // Check if quest is complete (all 5 challenges done)
    const isComplete = currentQuest.challengesCompleted.length >= 5;
    if (isComplete) {
      currentQuest.status = 'completed';
      currentQuest.completedAt = new Date();
    } else {
      currentQuest.status = 'in-progress';
    }

    // Save updates
    if (db) {
      const updates: any = {
        challengesCompleted: currentQuest.challengesCompleted,
        xpEarned: currentQuest.xpEarned,
        status: currentQuest.status,
        currentDay: currentQuest.currentDay,
      };
      if (currentQuest.completedAt) {
        updates.completedAt = Timestamp.fromDate(currentQuest.completedAt);
      }
      if (!currentQuest.startedAt) {
        updates.startedAt = Timestamp.now();
      }
      await updateDoc(doc(db, COLLECTIONS.WARRIOR_QUESTS, currentQuest.id), updates);
    } else {
      if (!currentQuest.startedAt) {
        currentQuest.startedAt = new Date();
      }
      localStorage.setItem(`warrior-quest-${currentQuest.id}`, JSON.stringify(currentQuest));
    }

    // If quest complete, auto-assign next week's quest
    if (isComplete) {
      await autoAssignNextWarriorQuest(studentId, currentQuest.weekNumber);
    }
  } catch (error) {
    console.error('Error marking challenge complete:', error);
    throw error;
  }
}

/**
 * Auto-assign next Warriors quest
 */
async function autoAssignNextWarriorQuest(
  studentId: string,
  completedWeek: number
): Promise<WarriorQuestAssignment | null> {
  try {
    const nextWeek = completedWeek + 1;
    
    // Check if next week exists (Warriors has 16 weeks)
    if (nextWeek > 16) {
      console.log('Student has completed all Warriors quests!');
      return null;
    }

    // Check if already assigned
    const history = await getWarriorQuestHistory(studentId);
    const alreadyAssigned = history.some(q => q.weekNumber === nextWeek);
    if (alreadyAssigned) {
      console.log(`Week ${nextWeek} already assigned`);
      return null;
    }

    // Assign next week's quest
    return await assignWarriorQuestByWeek(studentId, nextWeek, 'auto-progression');
  } catch (error) {
    console.error('Error auto-assigning next Warriors quest:', error);
    return null;
  }
}

/**
 * Get Warriors progress summary
 */
export async function getWarriorsProgressSummary(studentId: string) {
  try {
    const history = await getWarriorQuestHistory(studentId);
    const currentQuest = await getCurrentWarriorQuest(studentId);

    const completed = history.filter(q => q.status === 'completed');
    const totalXP = history.reduce((sum, q) => sum + q.xpEarned, 0);
    const totalChallengesCompleted = history.reduce(
      (sum, q) => sum + (q.challengesCompleted?.length || 0),
      0
    );

    return {
      weeksCompleted: completed.length,
      totalWeeks: 16,
      currentWeek: currentQuest?.weekNumber || 0,
      totalXP,
      maxXP: 8000, // 16 weeks × 500 XP
      challengesCompleted: totalChallengesCompleted,
      totalChallenges: 80, // 16 weeks × 5 challenges
      progressPercent: (completed.length / 16) * 100,
      currentQuestProgress: currentQuest
        ? (currentQuest.challengesCompleted.length / 5) * 100
        : 0,
    };
  } catch (error) {
    console.error('Error getting Warriors progress summary:', error);
    return {
      weeksCompleted: 0,
      totalWeeks: 16,
      currentWeek: 0,
      totalXP: 0,
      maxXP: 8000,
      challengesCompleted: 0,
      totalChallenges: 80,
      progressPercent: 0,
      currentQuestProgress: 0,
    };
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract Common Core competencies from Warriors quest
 */
function extractCompetencies(quest: WarriorQuest): string[] {
  const competencies: string[] = [];

  // Extract from CCSS standards in challenges
  quest.challenges.forEach(challenge => {
    if (challenge.ccssStandards) {
      competencies.push(...challenge.ccssStandards);
    }
  });

  // Add unique competencies
  return [...new Set(competencies)];
}

/**
 * Get next challenge to complete
 */
export function getNextChallenge(quest: WarriorQuestAssignment): WarriorChallenge | null {
  const completed = quest.challengesCompleted || [];
  
  // Find first uncompleted challenge
  for (const challenge of quest.questData.challenges) {
    if (!completed.includes(challenge.challengeId)) {
      return challenge;
    }
  }
  
  return null;
}

/**
 * Check if student can access a challenge
 */
export function canAccessChallenge(
  quest: WarriorQuestAssignment,
  challengeNumber: number
): boolean {
  // For Warriors: Can only do challenges in order (Mon, Tue, Wed, Thu, Fri)
  const completed = quest.challengesCompleted || [];
  return completed.length === challengeNumber - 1;
}

// ==================== DEMO DATA ====================

/**
 * Generate demo Warriors quest for testing
 */
export function generateDemoWarriorQuest(studentId: string): WarriorQuestAssignment {
  const quest = getWarriorQuestByWeek(1);
  if (!quest) {
    throw new Error('Demo quest not found');
  }

  return {
    id: `${studentId}-${quest.questId}-demo`,
    studentId,
    questId: quest.questId,
    questTitle: quest.theme,
    questData: quest,
    tier: 'warriors',
    weekNumber: 1,
    assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    assignedBy: 'placement-quiz',
    status: 'in-progress',
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    currentDay: 'Wednesday',
    lessonsCompleted: [],
    challengesCompleted: ['WA-W1-C1-MATH', 'WA-W1-C2-READING'],
    xpEarned: 200,
    competenciesTargeted: extractCompetencies(quest),
    difficulty: 'grade-level',
    estimatedTimeMinutes: quest.challenges.reduce((sum, c) => sum + c.estimatedMinutes, 0),
  };
}
