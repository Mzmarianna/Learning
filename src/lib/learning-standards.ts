/**
 * Grade-Level Learning Standards & Competencies
 * Based on Common Core + Orton-Gillingham (dyslexia-friendly)
 * Focus: Reading, Math, Spelling - Most Competitive Markets
 */

export type GradeLevel = 
  | 'PreK' | 'K' | '1' | '2' | '3' | '4' | '5' | '6' 
  | '7' | '8' | '9' | '10' | '11' | '12';

export type Subject = 'reading' | 'math' | 'spelling' | 'writing';

export type SkillLevel = 'emerging' | 'developing' | 'proficient' | 'advanced';

export interface Competency {
  id: string;
  subject: Subject;
  grade: GradeLevel;
  domain: string;
  skill: string;
  description: string;
  prerequisite?: string[]; // IDs of required skills
  dyslexiaFriendly: boolean;
  assessmentQuestions: AssessmentQuestion[];
  learningActivities: string[];
  masteryTime: number; // estimated hours to master
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'read-aloud' | 'match' | 'order' | 'fill-blank';
  question: string;
  audioUrl?: string; // For text-to-speech
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  skillLevel: SkillLevel;
}

// ==================== READING COMPETENCIES ====================
// Most competitive market: Reading/Literacy for dyslexic students

export const READING_COMPETENCIES: Record<GradeLevel, Competency[]> = {
  'PreK': [
    {
      id: 'prek-reading-1',
      subject: 'reading',
      grade: 'PreK',
      domain: 'Phonological Awareness',
      skill: 'Rhyming Words',
      description: 'Recognize and produce rhyming words',
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'prek-r1-q1',
          type: 'multiple-choice',
          question: '🎵 Which word rhymes with CAT?',
          audioUrl: 'PLACEHOLDER_TTS_CAT',
          options: ['BAT', 'DOG', 'BIRD', 'FISH'],
          correctAnswer: 'BAT',
          explanation: 'CAT and BAT both end with -AT sound! Great job!',
          skillLevel: 'emerging',
        },
        {
          id: 'prek-r1-q2',
          type: 'multiple-choice',
          question: '🎵 Which word rhymes with SUN?',
          audioUrl: 'PLACEHOLDER_TTS_SUN',
          options: ['FUN', 'MOON', 'STAR', 'CLOUD'],
          correctAnswer: 'FUN',
          explanation: 'SUN and FUN rhyme! They end with -UN!',
          skillLevel: 'emerging',
        },
      ],
      learningActivities: [
        'Sing rhyming songs',
        'Play rhyming games with pictures',
        'Read rhyming books aloud',
      ],
      masteryTime: 2,
    },
    {
      id: 'prek-reading-2',
      subject: 'reading',
      grade: 'PreK',
      domain: 'Letter Recognition',
      skill: 'Uppercase Letters',
      description: 'Identify all 26 uppercase letters',
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'prek-r2-q1',
          type: 'multiple-choice',
          question: '🔤 What letter is this: A',
          audioUrl: 'PLACEHOLDER_TTS_A',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          explanation: 'That\'s the letter A!',
          skillLevel: 'emerging',
        },
      ],
      learningActivities: [
        'Trace letters with finger',
        'Build letters with Play-Doh',
        'Letter scavenger hunt',
      ],
      masteryTime: 3,
    },
  ],

  'K': [
    {
      id: 'k-reading-1',
      subject: 'reading',
      grade: 'K',
      domain: 'Phonics',
      skill: 'Letter Sounds',
      description: 'Produce the primary sound for each letter',
      prerequisite: ['prek-reading-2'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'k-r1-q1',
          type: 'multiple-choice',
          question: '🔊 What sound does B make?',
          audioUrl: 'PLACEHOLDER_TTS_B',
          options: ['/b/', '/d/', '/p/', '/g/'],
          correctAnswer: '/b/',
          explanation: 'B says /b/ like in BALL!',
          skillLevel: 'developing',
        },
      ],
      learningActivities: [
        'Letter sound songs',
        'Sound sorting games',
        'Multisensory letter tracing',
      ],
      masteryTime: 4,
    },
    {
      id: 'k-reading-2',
      subject: 'reading',
      grade: 'K',
      domain: 'Phonics',
      skill: 'CVC Words',
      description: 'Read simple consonant-vowel-consonant words',
      prerequisite: ['k-reading-1'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'k-r2-q1',
          type: 'read-aloud',
          question: '📖 Read this word: CAT',
          audioUrl: 'PLACEHOLDER_TTS_CAT_WORD',
          correctAnswer: 'cat',
          explanation: 'C-A-T spells CAT! 🐱',
          skillLevel: 'developing',
        },
      ],
      learningActivities: [
        'Blend sounds together',
        'Build words with letter tiles',
        'CVC word family practice',
      ],
      masteryTime: 6,
    },
  ],

  '1': [
    {
      id: '1-reading-1',
      subject: 'reading',
      grade: '1',
      domain: 'Phonics',
      skill: 'Consonant Digraphs',
      description: 'Read words with sh, ch, th, wh',
      prerequisite: ['k-reading-2'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: '1-r1-q1',
          type: 'read-aloud',
          question: '📖 Read this word: SHOP',
          audioUrl: 'PLACEHOLDER_TTS_SHOP',
          correctAnswer: 'shop',
          explanation: 'SH makes one sound! SHOP 🛍️',
          skillLevel: 'proficient',
        },
      ],
      learningActivities: [
        'Digraph sorting',
        'Read digraph stories',
        'Spell with digraphs',
      ],
      masteryTime: 5,
    },
    {
      id: '1-reading-2',
      subject: 'reading',
      grade: '1',
      domain: 'Fluency',
      skill: 'Reading Simple Sentences',
      description: 'Read simple sentences with accuracy',
      prerequisite: ['1-reading-1'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: '1-r2-q1',
          type: 'read-aloud',
          question: '📖 Read this sentence: The cat sat on the mat.',
          audioUrl: 'PLACEHOLDER_TTS_SENTENCE',
          correctAnswer: 'the cat sat on the mat',
          explanation: 'Perfect! You read a whole sentence!',
          skillLevel: 'proficient',
        },
      ],
      learningActivities: [
        'Repeated reading practice',
        'Sight word games',
        'Partner reading',
      ],
      masteryTime: 8,
    },
  ],

  '2': [
    {
      id: '2-reading-1',
      subject: 'reading',
      grade: '2',
      domain: 'Phonics',
      skill: 'Long Vowel Patterns',
      description: 'Read words with silent e, vowel teams (ai, ea, oa)',
      prerequisite: ['1-reading-2'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: '2-r1-q1',
          type: 'multiple-choice',
          question: '📖 Which word has a long A sound?',
          audioUrl: 'PLACEHOLDER_TTS_LONG_A',
          options: ['RAIN', 'RAT', 'RAN', 'RAG'],
          correctAnswer: 'RAIN',
          explanation: 'RAIN has the long A sound from AI!',
          skillLevel: 'proficient',
        },
      ],
      learningActivities: [
        'Vowel team sorting',
        'Magic E practice',
        'Long vowel stories',
      ],
      masteryTime: 7,
    },
  ],

  '3': [
    {
      id: '3-reading-1',
      subject: 'reading',
      grade: '3',
      domain: 'Comprehension',
      skill: 'Main Idea',
      description: 'Identify the main idea in a paragraph',
      prerequisite: ['2-reading-1'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: '3-r1-q1',
          type: 'multiple-choice',
          question: '📖 Read: "Dogs are great pets. They are loyal and fun. Dogs love to play." What is the main idea?',
          audioUrl: 'PLACEHOLDER_TTS_PARAGRAPH',
          options: ['Dogs are great pets', 'Dogs love to play', 'Dogs are loyal', 'Dogs are fun'],
          correctAnswer: 'Dogs are great pets',
          explanation: 'The main idea is what the whole paragraph is about!',
          skillLevel: 'proficient',
        },
      ],
      learningActivities: [
        'Main idea graphic organizers',
        'Summarizing practice',
        'Topic sentence identification',
      ],
      masteryTime: 10,
    },
  ],

  // Grades 4-12 would follow similar pattern
  '4': [],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': [],
  '10': [],
  '11': [],
  '12': [],
};

// ==================== MATH COMPETENCIES ====================

export const MATH_COMPETENCIES: Record<GradeLevel, Competency[]> = {
  'PreK': [
    {
      id: 'prek-math-1',
      subject: 'math',
      grade: 'PreK',
      domain: 'Counting',
      skill: 'Count to 10',
      description: 'Count objects 1-10 with one-to-one correspondence',
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'prek-m1-q1',
          type: 'multiple-choice',
          question: '🍎 How many apples? 🍎🍎🍎',
          audioUrl: 'PLACEHOLDER_TTS_COUNT_APPLES',
          options: ['1', '2', '3', '4'],
          correctAnswer: '3',
          explanation: 'Count with me: 1, 2, 3! Three apples!',
          skillLevel: 'emerging',
        },
      ],
      learningActivities: [
        'Count physical objects',
        'Number songs',
        'Counting games',
      ],
      masteryTime: 2,
    },
  ],

  'K': [
    {
      id: 'k-math-1',
      subject: 'math',
      grade: 'K',
      domain: 'Number Sense',
      skill: 'Count to 20',
      description: 'Count forward to 20, starting from any number',
      prerequisite: ['prek-math-1'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'k-m1-q1',
          type: 'fill-blank',
          question: '🔢 Count: 15, 16, __, 18, 19',
          audioUrl: 'PLACEHOLDER_TTS_COUNT_SEQUENCE',
          correctAnswer: '17',
          explanation: 'The missing number is 17!',
          skillLevel: 'developing',
        },
      ],
      learningActivities: [
        'Number line activities',
        'Skip counting',
        'Number recognition games',
      ],
      masteryTime: 4,
    },
  ],

  // Grades 1-12 would follow similar pattern
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': [],
  '10': [],
  '11': [],
  '12': [],
};

// ==================== SPELLING COMPETENCIES ====================

export const SPELLING_COMPETENCIES: Record<GradeLevel, Competency[]> = {
  'PreK': [
    {
      id: 'prek-spell-1',
      subject: 'spelling',
      grade: 'PreK',
      domain: 'Pre-Writing',
      skill: 'Write Name',
      description: 'Write own first name',
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'prek-s1-q1',
          type: 'fill-blank',
          question: '✏️ Can you write your name?',
          audioUrl: 'PLACEHOLDER_TTS_WRITE_NAME',
          correctAnswer: 'STUDENT_NAME',
          explanation: 'Great job writing your name!',
          skillLevel: 'emerging',
        },
      ],
      learningActivities: [
        'Name tracing',
        'Letter formation practice',
        'Name recognition games',
      ],
      masteryTime: 3,
    },
  ],

  'K': [
    {
      id: 'k-spell-1',
      subject: 'spelling',
      grade: 'K',
      domain: 'Phonetic Spelling',
      skill: 'Spell CVC Words',
      description: 'Spell simple 3-letter words phonetically',
      prerequisite: ['k-reading-2'],
      dyslexiaFriendly: true,
      assessmentQuestions: [
        {
          id: 'k-s1-q1',
          type: 'fill-blank',
          question: '✏️ Spell the word: CAT 🐱',
          audioUrl: 'PLACEHOLDER_TTS_SPELL_CAT',
          correctAnswer: 'cat',
          explanation: 'C-A-T spells CAT!',
          skillLevel: 'developing',
        },
      ],
      learningActivities: [
        'Sound boxes',
        'Magnetic letters',
        'Word building',
      ],
      masteryTime: 5,
    },
  ],

  // Grades 1-12 would follow similar pattern
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': [],
  '10': [],
  '11': [],
  '12': [],
};

// ==================== HELPER FUNCTIONS ====================

export function getCompetenciesForGrade(grade: GradeLevel, subject: Subject): Competency[] {
  switch (subject) {
    case 'reading':
      return READING_COMPETENCIES[grade] || [];
    case 'math':
      return MATH_COMPETENCIES[grade] || [];
    case 'spelling':
      return SPELLING_COMPETENCIES[grade] || [];
    default:
      return [];
  }
}

/**
 * Get a specific competency by ID
 */
export function getCompetencyById(competencyId: string): Competency | null {
  // Search through all subjects and grades
  const allSubjects: Subject[] = ['reading', 'math', 'spelling', 'writing'];
  const allGrades: GradeLevel[] = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  for (const subject of allSubjects) {
    for (const grade of allGrades) {
      const competencies = getCompetenciesForGrade(grade, subject);
      const found = competencies.find(c => c.id === competencyId);
      if (found) return found;
    }
  }
  
  return null;
}

export function getAllCompetencies(subject: Subject): Competency[] {
  const grades: GradeLevel[] = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  return grades.flatMap(grade => getCompetenciesForGrade(grade, subject));
}

export function findPrerequisites(competencyId: string, subject: Subject): Competency[] {
  const allCompetencies = getAllCompetencies(subject);
  const competency = allCompetencies.find(c => c.id === competencyId);
  
  if (!competency || !competency.prerequisite) return [];
  
  return competency.prerequisite
    .map(prereqId => allCompetencies.find(c => c.id === prereqId))
    .filter(Boolean) as Competency[];
}

export function getNextCompetency(currentId: string, subject: Subject): Competency | null {
  const allCompetencies = getAllCompetencies(subject);
  const currentIndex = allCompetencies.findIndex(c => c.id === currentId);
  
  if (currentIndex === -1 || currentIndex === allCompetencies.length - 1) return null;
  
  return allCompetencies[currentIndex + 1];
}

// ==================== ASSESSMENT SCORING ====================

export interface AssessmentResult {
  studentId: string;
  subject: Subject;
  grade: GradeLevel;
  competencyId: string;
  score: number; // 0-100
  skillLevel: SkillLevel;
  masteredSkills: string[];
  strugglingSkills: string[];
  recommendedGrade: GradeLevel;
  nextSteps: string[];
  completedAt: Date;
}

export function calculateSkillLevel(score: number): SkillLevel {
  if (score >= 90) return 'advanced';
  if (score >= 70) return 'proficient';
  if (score >= 50) return 'developing';
  return 'emerging';
}

export function recommendGradeLevel(results: AssessmentResult[], subject: Subject): GradeLevel {
  // Find highest grade where student is proficient
  const grades: GradeLevel[] = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  for (let i = grades.length - 1; i >= 0; i--) {
    const gradeResults = results.filter(r => r.grade === grades[i]);
    if (gradeResults.length === 0) continue;
    
    const avgScore = gradeResults.reduce((sum, r) => sum + r.score, 0) / gradeResults.length;
    if (avgScore >= 70) return grades[i];
  }
  
  return 'PreK';
}