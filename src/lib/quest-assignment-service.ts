/**
 * Quest Auto-Assignment Service
 * Handles automatic quest assignment based on Common Core competency mastery
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  CompetencyMastery,
  LearningPath,
  generateAdaptivePath,
  getNextRecommendedTask,
  loadLearningPath,
  saveLearningPath,
  getAllMasteries,
} from './adaptive-learning';
import { GradeLevel, Subject, Competency } from './learning-standards';
import { MathCurriculum } from './curriculum-index';
import type { Level, Lesson } from './curriculum-data';
import { 
  WARRIORS_CURRICULUM, 
  EXPLORERS_HUB_CURRICULUM,
  getWarriorQuestByWeek,
  getWarriorQuestById,
  type WarriorQuest,
  type ExplorerQuest 
} from './curriculum-index';
import { SkillTier } from './tier-system';

// ==================== TYPES ====================

export interface QuestAssignment {
  id: string;
  studentId: string;
  questId: string;
  questTitle: string;
  questData: any; // Quest from curriculum (Level, WarriorQuest, or ExplorerQuest)
  tier?: SkillTier; // Which tier this quest belongs to
  weekNumber?: number; // For Warriors/Explorers quests
  assignedAt: Date;
  assignedBy: 'placement-quiz' | 'tutor' | 'auto-progression' | 'wowl-ai' | 'parent';
  status: 'assigned' | 'in-progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  currentLesson?: string;
  lessonsCompleted: string[];
  challengesCompleted?: string[]; // For Warriors/Explorers challenges
  xpEarned: number;
  competenciesTargeted: string[]; // Common Core competency IDs
  difficulty: 'remedial' | 'grade-level' | 'advanced';
  estimatedTimeMinutes: number;
}

export interface QuestProgressUpdate {
  lessonId: string;
  completedAt: Date;
  performance: {
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    strugglingAreas?: string[];
  };
}

// ==================== FIRESTORE COLLECTIONS ====================

const COLLECTIONS = {
  QUEST_ASSIGNMENTS: 'quest_assignments',
  LEARNING_PATHS: 'learning_paths',
  COMPETENCY_MASTERY: 'competency_mastery',
  QUIZ_RESULTS: 'quiz_results',
};

// ==================== QUEST ASSIGNMENT ====================

/**
 * Auto-assign first quest based on placement quiz results
 */
export async function assignFirstQuestFromQuiz(
  studentId: string,
  quizResults: {
    estimatedGrade: GradeLevel;
    subject: Subject;
    competencyMastery: CompetencyMastery[];
  }
): Promise<QuestAssignment> {
  try {
    // 1. Generate adaptive learning path
    const learningPath = generateAdaptivePath(
      studentId,
      quizResults.subject,
      quizResults.estimatedGrade,
      quizResults.competencyMastery
    );

    // 2. Save learning path to database
    if (db) {
      await setDoc(
        doc(db, COLLECTIONS.LEARNING_PATHS, `${studentId}-${quizResults.subject}`),
        {
          ...learningPath,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
      );
    } else {
      // Fallback to localStorage
      saveLearningPath(learningPath);
    }

    // 3. Get first recommended quest from curriculum
    const firstCompetency = getNextRecommendedTask(learningPath);
    if (!firstCompetency) {
      throw new Error('No recommended competency found');
    }

    // 4. Find quest that teaches this competency
    const quest = findQuestForCompetency(
      firstCompetency.competency,
      quizResults.estimatedGrade
    );

    // 5. Create quest assignment
    const assignment = await assignQuestToStudent(
      studentId,
      quest.id,
      'placement-quiz',
      [firstCompetency.competency.id]
    );

    return assignment;
  } catch (error) {
    console.error('Error assigning first quest from quiz:', error);
    throw error;
  }
}

/**
 * Assign a specific quest to a student
 */
export async function assignQuestToStudent(
  studentId: string,
  questId: string,
  source: QuestAssignment['assignedBy'],
  competencyIds: string[] = []
): Promise<QuestAssignment> {
  try {
    // Get quest data from curriculum
    const quest = getQuestById(questId);
    if (!quest) {
      throw new Error(`Quest ${questId} not found`);
    }

    const assignment: QuestAssignment = {
      id: `${studentId}-${questId}-${Date.now()}`,
      studentId,
      questId,
      questTitle: quest.title,
      questData: quest,
      assignedAt: new Date(),
      assignedBy: source,
      status: 'assigned',
      lessonsCompleted: [],
      xpEarned: 0,
      competenciesTargeted: competencyIds,
      difficulty: 'grade-level', // TODO: Adjust based on student level
      estimatedTimeMinutes: quest.estimatedTimeMinutes || 120,
    };

    // Save to database
    if (db) {
      await setDoc(doc(db, COLLECTIONS.QUEST_ASSIGNMENTS, assignment.id), {
        ...assignment,
        assignedAt: Timestamp.fromDate(assignment.assignedAt),
      });
    } else {
      // Fallback to localStorage
      const key = `quest-assignment-${assignment.id}`;
      localStorage.setItem(key, JSON.stringify(assignment));
    }

    return assignment;
  } catch (error) {
    console.error('Error assigning quest to student:', error);
    throw error;
  }
}

/**
 * Get all quest assignments for a student
 */
export async function getStudentQuestAssignments(
  studentId: string
): Promise<QuestAssignment[]> {
  try {
    if (db) {
      // Firestore
      const q = query(
        collection(db, COLLECTIONS.QUEST_ASSIGNMENTS),
        where('studentId', '==', studentId),
        orderBy('assignedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          assignedAt: data.assignedAt?.toDate() || new Date(),
          startedAt: data.startedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
        } as QuestAssignment;
      });
    } else {
      // localStorage fallback
      const assignments: QuestAssignment[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('quest-assignment-')) {
          const data = localStorage.getItem(key);
          if (data) {
            const assignment = JSON.parse(data);
            if (assignment.studentId === studentId) {
              assignment.assignedAt = new Date(assignment.assignedAt);
              if (assignment.startedAt) assignment.startedAt = new Date(assignment.startedAt);
              if (assignment.completedAt) assignment.completedAt = new Date(assignment.completedAt);
              assignments.push(assignment);
            }
          }
        }
      }
      return assignments.sort((a, b) => b.assignedAt.getTime() - a.assignedAt.getTime());
    }
  } catch (error) {
    console.error('Error getting student quest assignments:', error);
    return [];
  }
}

/**
 * Get current active quest for student
 */
export async function getCurrentQuest(studentId: string): Promise<QuestAssignment | null> {
  const assignments = await getStudentQuestAssignments(studentId);
  return assignments.find(a => a.status === 'in-progress') || assignments[0] || null;
}

/**
 * Mark quest as started
 */
export async function markQuestStarted(
  studentId: string,
  questId: string
): Promise<void> {
  try {
    const assignments = await getStudentQuestAssignments(studentId);
    const assignment = assignments.find(a => a.questId === questId);
    if (!assignment) return;

    if (db) {
      await updateDoc(doc(db, COLLECTIONS.QUEST_ASSIGNMENTS, assignment.id), {
        status: 'in-progress',
        startedAt: Timestamp.now(),
      });
    } else {
      assignment.status = 'in-progress';
      assignment.startedAt = new Date();
      localStorage.setItem(`quest-assignment-${assignment.id}`, JSON.stringify(assignment));
    }
  } catch (error) {
    console.error('Error marking quest as started:', error);
  }
}

/**
 * Update quest progress after completing a lesson
 */
export async function updateQuestProgress(
  studentId: string,
  questId: string,
  progressUpdate: QuestProgressUpdate
): Promise<boolean> {
  try {
    const assignments = await getStudentQuestAssignments(studentId);
    const assignment = assignments.find(a => a.questId === questId);
    if (!assignment) return false;

    // Add lesson to completed list
    if (!assignment.lessonsCompleted.includes(progressUpdate.lessonId)) {
      assignment.lessonsCompleted.push(progressUpdate.lessonId);
    }

    // Calculate XP earned (from lesson data)
    const lesson = getLessonById(progressUpdate.lessonId);
    if (lesson) {
      assignment.xpEarned += lesson.xp || 0;
    }

    // Check if quest is complete
    const isComplete = checkQuestCompletion(assignment);
    if (isComplete) {
      assignment.status = 'completed';
      assignment.completedAt = new Date();
    } else {
      assignment.status = 'in-progress';
      assignment.currentLesson = getNextLessonId(assignment);
    }

    // Save to database
    if (db) {
      const updates: any = {
        lessonsCompleted: assignment.lessonsCompleted,
        xpEarned: assignment.xpEarned,
        status: assignment.status,
        currentLesson: assignment.currentLesson,
      };
      if (assignment.completedAt) {
        updates.completedAt = Timestamp.fromDate(assignment.completedAt);
      }
      await updateDoc(doc(db, COLLECTIONS.QUEST_ASSIGNMENTS, assignment.id), updates);
    } else {
      localStorage.setItem(`quest-assignment-${assignment.id}`, JSON.stringify(assignment));
    }

    return isComplete;
  } catch (error) {
    console.error('Error updating quest progress:', error);
    return false;
  }
}

/**
 * Auto-assign next quest when current quest completes
 */
export async function autoAssignNextQuest(
  studentId: string,
  completedQuestId: string
): Promise<QuestAssignment | null> {
  try {
    // 1. Get student's learning path
    let learningPath: LearningPath | null = null;
    
    if (db) {
      const pathDoc = await getDoc(
        doc(db, COLLECTIONS.LEARNING_PATHS, `${studentId}-reading`) // TODO: Get subject dynamically
      );
      if (pathDoc.exists()) {
        const data = pathDoc.data();
        learningPath = {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as LearningPath;
      }
    } else {
      learningPath = loadLearningPath(studentId, 'reading');
    }

    if (!learningPath) {
      console.log('No learning path found for student');
      return null;
    }

    // 2. Update learning path with completed quest
    // (Mark competencies from completed quest as progressed)
    const completedAssignment = (await getStudentQuestAssignments(studentId))
      .find(a => a.questId === completedQuestId);
    
    if (completedAssignment && completedAssignment.competenciesTargeted) {
      // Update mastery for targeted competencies
      // (This would be done in the lesson completion handler)
    }

    // 3. Get next recommended competency
    const nextCompetency = getNextRecommendedTask(learningPath);
    if (!nextCompetency) {
      console.log('No more competencies to learn');
      return null;
    }

    // 4. Find quest that teaches this competency
    const nextQuest = findQuestForCompetency(
      nextCompetency.competency,
      learningPath.currentGrade
    );

    // 5. Check if quest is already assigned
    const existingAssignments = await getStudentQuestAssignments(studentId);
    const alreadyAssigned = existingAssignments.some(a => a.questId === nextQuest.id);
    if (alreadyAssigned) {
      console.log('Quest already assigned');
      return null;
    }

    // 6. Assign the next quest
    const assignment = await assignQuestToStudent(
      studentId,
      nextQuest.id,
      'auto-progression',
      [nextCompetency.competency.id]
    );

    return assignment;
  } catch (error) {
    console.error('Error auto-assigning next quest:', error);
    return null;
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if quest is complete based on lesson completion
 */
function checkQuestCompletion(assignment: QuestAssignment): boolean {
  const quest = assignment.questData as Level;
  if (!quest || !quest.lessons) return false;

  // Quest is complete if all lessons are done
  return assignment.lessonsCompleted.length >= quest.lessons.length;
}

/**
 * Get next lesson ID for a quest
 */
function getNextLessonId(assignment: QuestAssignment): string | undefined {
  const quest = assignment.questData as Level;
  if (!quest || !quest.lessons) return undefined;

  // Find first uncompleted lesson
  for (const lesson of quest.lessons) {
    if (!assignment.lessonsCompleted.includes(lesson.id)) {
      return lesson.id;
    }
  }

  return undefined;
}

/**
 * Find quest from curriculum that teaches a specific competency
 */
function findQuestForCompetency(competency: Competency, grade: GradeLevel): Level {
  // Map competencies to curriculum levels
  // For now, use Level 1 for PreK-2nd grade
  // TODO: Build comprehensive competency → level mapping
  
  const gradeNum = gradeToNumber(grade);
  
  if (gradeNum <= 2) {
    // Use Level 1 curriculum
    return MathCurriculum[0]; // L1UM
  } else if (gradeNum <= 5) {
    // Use Level 2 curriculum
    return MathCurriculum[1]; // L2UM
  } else {
    // Use Level 3 curriculum
    return MathCurriculum[2]; // L3UM
  }
}

/**
 * Get quest by ID from curriculum
 */
function getQuestById(questId: string): Level | null {
  // Map quest IDs to levels
  // L1-Q1 through L1-Q16 → L1UM
  // L2-Q1 through L2-Q16 → L2UM
  // L3-Q1 through L3-Q16 → L3UM
  
  if (questId.startsWith('L1')) {
    return MathCurriculum[0]; // L1UM
  } else if (questId.startsWith('L2')) {
    return MathCurriculum[1]; // L2UM
  } else if (questId.startsWith('L3')) {
    return MathCurriculum[2]; // L3UM
  }
  
  return null;
}

/**
 * Get lesson by ID from curriculum
 */
function getLessonById(lessonId: string): Lesson | null {
  // Search through all levels to find the lesson
  for (const level of MathCurriculum) {
    const lesson = level.lessons.find((l: Lesson) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

/**
 * Convert grade level to number for comparison
 */
function gradeToNumber(grade: GradeLevel): number {
  const gradeMap: Record<GradeLevel, number> = {
    'PreK': 0,
    'K': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    '11': 11,
    '12': 12,
  };
  return gradeMap[grade] || 0;
}

// ==================== DEMO DATA (FOR TESTING) ====================

/**
 * Generate sample quest assignments for demo mode
 */
export function generateDemoQuestAssignments(studentId: string): QuestAssignment[] {
  const quest1 = getQuestById('L1-Q1');
  const quest2 = getQuestById('L1-Q2');

  return [
    {
      id: `${studentId}-L1-Q1-demo`,
      studentId,
      questId: 'L1-Q1',
      questTitle: quest1?.title || 'Quest 1: The First Numbers',
      questData: quest1,
      assignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      assignedBy: 'placement-quiz',
      status: 'in-progress',
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      currentLesson: 'L1UM01L2',
      lessonsCompleted: ['L1UM01L1'],
      xpEarned: 150,
      competenciesTargeted: ['prek-math-counting-1to5'],
      difficulty: 'grade-level',
      estimatedTimeMinutes: 120,
    },
    {
      id: `${studentId}-L1-Q2-demo`,
      studentId,
      questId: 'L1-Q2',
      questTitle: quest2?.title || 'Quest 2: Shape Explorers',
      questData: quest2,
      assignedAt: new Date(),
      assignedBy: 'auto-progression',
      status: 'assigned',
      lessonsCompleted: [],
      xpEarned: 0,
      competenciesTargeted: ['prek-math-shapes'],
      difficulty: 'grade-level',
      estimatedTimeMinutes: 120,
    },
  ];
}