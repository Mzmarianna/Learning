/**
 * Quest-to-Competency Mapping
 * Maps curriculum lessons to Common Core competencies
 */

import { Competency, getCompetencyById } from './learning-standards';

// ==================== LESSON → COMPETENCY MAPPING ====================

/**
 * Maps each lesson ID to the Common Core competencies it teaches
 * 
 * Format: 'LessonID': ['competency-id-1', 'competency-id-2', ...]
 */
export const LESSON_COMPETENCY_MAP: Record<string, string[]> = {
  // ====================
  // LEVEL 1 - UNIT 1: Counting to 10
  // ====================
  'L1UM01L1': [
    'prek-math-counting-1to5',
    'prek-math-number-recognition',
  ],
  'L1UM01L2': [
    'prek-math-counting-6to10',
    'k-math-counting-fluency',
  ],
  'L1UM01L3': [
    'k-math-counting-objects',
    'k-math-cardinality',
  ],

  // ====================
  // LEVEL 1 - UNIT 2: Shapes & Colors
  // ====================
  'L1UM02L1': [
    'prek-math-shapes-basic',
    'prek-math-visual-recognition',
  ],
  'L1UM02L2': [
    'prek-math-shapes-sorting',
    'k-math-geometry-basics',
  ],
  'L1UM02L3': [
    'prek-math-colors',
    'prek-math-attributes',
  ],

  // ====================
  // LEVEL 1 - UNIT 3: Addition (1-5)
  // ====================
  'L1UM03L1': [
    'k-math-addition-concepts',
    'k-math-combining-sets',
  ],
  'L1UM03L2': [
    'k-math-addition-1to5',
    'k-math-number-bonds',
  ],
  'L1UM03L3': [
    'k-math-addition-fluency',
    'grade1-math-addition-strategies',
  ],

  // ====================
  // LEVEL 1 - UNIT 4: Subtraction (1-5)
  // ====================
  'L1UM04L1': [
    'k-math-subtraction-concepts',
    'k-math-taking-away',
  ],
  'L1UM04L2': [
    'k-math-subtraction-1to5',
    'k-math-difference',
  ],
  'L1UM04L3': [
    'k-math-subtraction-fluency',
    'grade1-math-subtraction-strategies',
  ],

  // ====================
  // LEVEL 1 - UNIT 5: Numbers to 20
  // ====================
  'L1UM05L1': [
    'k-math-counting-11to15',
    'k-math-teen-numbers',
  ],
  'L1UM05L2': [
    'k-math-counting-16to20',
    'grade1-math-place-value-tens',
  ],
  'L1UM05L3': [
    'k-math-counting-to-20-fluency',
    'grade1-math-number-sequence',
  ],

  // ====================
  // LEVEL 1 - UNIT 6: Patterns
  // ====================
  'L1UM06L1': [
    'k-math-patterns-AB',
    'k-math-repeating-patterns',
  ],
  'L1UM06L2': [
    'k-math-patterns-ABC',
    'k-math-pattern-extension',
  ],
  'L1UM06L3': [
    'k-math-pattern-creation',
    'grade1-math-algebraic-thinking',
  ],

  // ====================
  // READING/PHONICS LESSONS (when added)
  // ====================
  'L1UR01L1': [
    'prek-reading-rhyming',
    'prek-reading-phonological-awareness',
  ],
  'L1UR01L2': [
    'prek-reading-letter-sounds',
    'k-reading-letter-recognition',
  ],
  'L1UR01L3': [
    'k-reading-cvc-words',
    'grade1-reading-phonics',
  ],

  // TODO: Add mappings for Level 2 & 3 lessons
};

// ==================== FUNCTIONS ====================

/**
 * Get all Common Core competencies taught by a specific lesson
 */
export function getLessonCompetencies(lessonId: string): Competency[] {
  const competencyIds = LESSON_COMPETENCY_MAP[lessonId] || [];
  return competencyIds
    .map(id => getCompetencyById(id))
    .filter(comp => comp !== null) as Competency[];
}

/**
 * Get all lessons that teach a specific competency
 */
export function getLessonsForCompetency(competencyId: string): string[] {
  const lessons: string[] = [];
  
  for (const [lessonId, competencies] of Object.entries(LESSON_COMPETENCY_MAP)) {
    if (competencies.includes(competencyId)) {
      lessons.push(lessonId);
    }
  }
  
  return lessons;
}

/**
 * Check if a lesson teaches a specific competency
 */
export function lessonTeachesCompetency(lessonId: string, competencyId: string): boolean {
  const competencies = LESSON_COMPETENCY_MAP[lessonId] || [];
  return competencies.includes(competencyId);
}

/**
 * Get all competencies taught in a quest (all lessons combined)
 */
export function getQuestCompetencies(questId: string): Competency[] {
  const allCompetencies = new Set<string>();
  
  // Find all lessons in this quest
  for (const lessonId of Object.keys(LESSON_COMPETENCY_MAP)) {
    if (lessonId.startsWith(questId.replace('Q', 'UM'))) {
      const lessonComps = LESSON_COMPETENCY_MAP[lessonId] || [];
      lessonComps.forEach(comp => allCompetencies.add(comp));
    }
  }
  
  return Array.from(allCompetencies)
    .map(id => getCompetencyById(id))
    .filter(comp => comp !== null) as Competency[];
}

/**
 * Get recommended quest for a competency
 * (Finds the quest that best teaches this competency)
 */
export function getRecommendedQuestForCompetency(competencyId: string): string | null {
  const lessons = getLessonsForCompetency(competencyId);
  if (lessons.length === 0) return null;
  
  // Extract quest ID from first lesson
  // Format: L1UM01L1 → L1-Q1 (assuming UM01 = Q1)
  const firstLesson = lessons[0];
  const match = firstLesson.match(/L(\d+)UM(\d+)/);
  if (match) {
    const [, level, unit] = match;
    return `L${level}-Q${unit}`;
  }
  
  return null;
}

// ==================== PERFORMANCE TRACKING ====================

export interface LessonPerformance {
  lessonId: string;
  studentId: string;
  completedAt: Date;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // minutes
  strugglingAreas?: string[];
}

/**
 * Update competency mastery based on lesson performance
 */
export async function updateCompetenciesFromLesson(
  performance: LessonPerformance,
  saveFunction: (studentId: string, competencyId: string, data: any) => Promise<void>
): Promise<void> {
  const competencies = getLessonCompetencies(performance.lessonId);
  
  for (const competency of competencies) {
    const successRate = (performance.correctAnswers / performance.totalQuestions) * 100;
    
    await saveFunction(performance.studentId, competency.id, {
      competencyId: competency.id,
      studentId: performance.studentId,
      subject: competency.subject,
      lessonId: performance.lessonId,
      successRate,
      timeSpent: performance.timeSpent,
      lastAttemptDate: performance.completedAt,
      strugglingAreas: performance.strugglingAreas || [],
    });
  }
}

// ==================== ADAPTIVE DIFFICULTY ====================

/**
 * Determine if student needs remedial, grade-level, or advanced content
 * based on competency mastery
 */
export interface DifficultyRecommendation {
  level: 'remedial' | 'grade-level' | 'advanced';
  reason: string;
  nextQuestId?: string;
  supportActivities?: string[];
}

export function getAdaptiveDifficultyRecommendation(
  studentMastery: { competencyId: string; successRate: number }[],
  targetCompetency: Competency
): DifficultyRecommendation {
  // Check if student has mastered prerequisites
  const prerequisites = targetCompetency.prerequisite || [];
  const prereqMastery = prerequisites.map(prereqId => {
    const mastery = studentMastery.find(m => m.competencyId === prereqId);
    return mastery?.successRate || 0;
  });
  
  const avgPrereqMastery = prereqMastery.length > 0
    ? prereqMastery.reduce((sum, rate) => sum + rate, 0) / prereqMastery.length
    : 100; // No prereqs = ready
  
  // Struggling with prerequisites → remedial
  if (avgPrereqMastery < 60) {
    return {
      level: 'remedial',
      reason: 'Student needs to strengthen prerequisite skills first',
      supportActivities: [
        'Review prerequisite lessons',
        'Practice with visual aids',
        'One-on-one tutoring session',
      ],
    };
  }
  
  // Strong in prerequisites + current competency → advanced
  const currentMastery = studentMastery.find(m => m.competencyId === targetCompetency.id);
  if (avgPrereqMastery > 90 && (currentMastery?.successRate || 0) > 85) {
    return {
      level: 'advanced',
      reason: 'Student is excelling - ready for enrichment',
      supportActivities: [
        'Challenge problems',
        'Real-world applications',
        'Skip ahead to next competency',
      ],
    };
  }
  
  // Just right
  return {
    level: 'grade-level',
    reason: 'Student is ready for grade-level content',
  };
}

// ==================== DEMO/TESTING DATA ====================

/**
 * Get sample competency mapping for testing
 */
export function getSampleLessonCompetencyData(): {
  lessonId: string;
  title: string;
  competencies: Competency[];
}[] {
  return [
    {
      lessonId: 'L1UM01L1',
      title: 'Count to 5',
      competencies: getLessonCompetencies('L1UM01L1'),
    },
    {
      lessonId: 'L1UM01L2',
      title: 'Count to 10',
      competencies: getLessonCompetencies('L1UM01L2'),
    },
    {
      lessonId: 'L1UM03L1',
      title: 'Addition Basics',
      competencies: getLessonCompetencies('L1UM03L1'),
    },
  ];
}

/**
 * Validate that all lessons have competency mappings
 */
export function validateCompetencyMappings(allLessonIds: string[]): {
  mapped: string[];
  unmapped: string[];
  coverage: number;
} {
  const mapped = allLessonIds.filter(id => LESSON_COMPETENCY_MAP[id]);
  const unmapped = allLessonIds.filter(id => !LESSON_COMPETENCY_MAP[id]);
  const coverage = (mapped.length / allLessonIds.length) * 100;
  
  return {
    mapped,
    unmapped,
    coverage: Math.round(coverage),
  };
}
