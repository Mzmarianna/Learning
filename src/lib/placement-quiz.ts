/**
 * Placement Quiz System
 * Determines student's starting tier and skill levels
 */

export type TierLevel = 'early-explorers' | 'explorers' | 'warriors';
export type SkillLevel = number; // 1-10
export type LearningStyle = 'visual' | 'kinesthetic' | 'auditory' | 'mixed';

export interface QuizQuestion {
  id: string;
  category: 'background' | 'math' | 'reading' | 'writing' | 'neurodivergent';
  question: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'interactive';
  options?: string[];
  correctAnswer?: string | number;
  skillWeight?: number; // How much this affects skill level (1-5)
  ageRange?: string; // Show only for certain ages
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number;
  isCorrect?: boolean;
  timeSpent?: number; // seconds
}

export interface PlacementResult {
  tier: TierLevel;
  mathLevel: SkillLevel;
  readingLevel: SkillLevel;
  writingLevel: SkillLevel;
  overallLevel: SkillLevel;
  learningStyle: LearningStyle;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  recommendedStartQuest: string;
  neurodivergentSupports: string[];
}

// ============================================================================
// QUIZ QUESTIONS
// ============================================================================

export const PLACEMENT_QUIZ_QUESTIONS: QuizQuestion[] = [
  // BACKGROUND (3 questions)
  {
    id: 'bg-1',
    category: 'background',
    question: 'How old is the student?',
    type: 'scale',
    options: ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
    skillWeight: 0,
  },
  {
    id: 'bg-2',
    category: 'background',
    question: 'What is the student\'s previous education experience?',
    type: 'multiple-choice',
    options: [
      'No formal education yet',
      'Homeschooled (1-2 years)',
      'Homeschooled (3+ years)',
      'Traditional school (1-2 years)',
      'Traditional school (3+ years)',
      'Mix of homeschool and traditional',
    ],
    skillWeight: 1,
  },
  {
    id: 'bg-3',
    category: 'background',
    question: 'How does the student learn best?',
    type: 'multiple-choice',
    options: [
      'By seeing (watching videos, looking at pictures)',
      'By doing (hands-on activities, building things)',
      'By listening (stories, explanations)',
      'A mix of all of these',
    ],
    skillWeight: 0,
  },

  // MATH ASSESSMENT (7 questions - adaptive)
  {
    id: 'math-1',
    category: 'math',
    question: 'Can the student count to 10?',
    type: 'multiple-choice',
    options: ['Not yet', 'With help', 'Yes, confidently'],
    correctAnswer: 'Yes, confidently',
    skillWeight: 1,
    ageRange: '4-6',
  },
  {
    id: 'math-2',
    category: 'math',
    question: 'What is 5 + 3?',
    type: 'multiple-choice',
    options: ['6', '7', '8', '9', 'Not sure'],
    correctAnswer: '8',
    skillWeight: 2,
    ageRange: '5-8',
  },
  {
    id: 'math-3',
    category: 'math',
    question: 'What is 12 + 7?',
    type: 'multiple-choice',
    options: ['17', '18', '19', '20', 'Not sure'],
    correctAnswer: '19',
    skillWeight: 3,
    ageRange: '7-10',
  },
  {
    id: 'math-4',
    category: 'math',
    question: 'What is 25 × 4?',
    type: 'multiple-choice',
    options: ['90', '95', '100', '105', 'Not sure'],
    correctAnswer: '100',
    skillWeight: 4,
    ageRange: '9-14',
  },
  {
    id: 'math-5',
    category: 'math',
    question: 'If a pizza has 8 slices and you eat 3, what fraction is left?',
    type: 'multiple-choice',
    options: ['3/8', '5/8', '3/5', '5/3', 'Not sure'],
    correctAnswer: '5/8',
    skillWeight: 4,
    ageRange: '10-18',
  },
  {
    id: 'math-6',
    category: 'math',
    question: 'Does the student enjoy solving puzzles and problems?',
    type: 'scale',
    options: ['Not at all', 'A little', 'Sometimes', 'Often', 'Loves it!'],
    skillWeight: 1,
  },
  {
    id: 'math-7',
    category: 'math',
    question: 'Solve: 2x + 5 = 13. What is x?',
    type: 'multiple-choice',
    options: ['3', '4', '5', '6', 'Not sure'],
    correctAnswer: '4',
    skillWeight: 5,
    ageRange: '12-18',
  },

  // READING ASSESSMENT (7 questions - adaptive)
  {
    id: 'read-1',
    category: 'reading',
    question: 'Can the student recognize letters of the alphabet?',
    type: 'multiple-choice',
    options: ['A few letters', 'About half', 'Most letters', 'All letters'],
    correctAnswer: 'All letters',
    skillWeight: 1,
    ageRange: '4-6',
  },
  {
    id: 'read-2',
    category: 'reading',
    question: 'Can the student read simple 3-letter words (like "cat", "dog")?',
    type: 'multiple-choice',
    options: ['Not yet', 'With help', 'Yes, independently'],
    correctAnswer: 'Yes, independently',
    skillWeight: 2,
    ageRange: '5-7',
  },
  {
    id: 'read-3',
    category: 'reading',
    question: 'The cat sat on the ___.',
    type: 'multiple-choice',
    options: ['mat', 'bat', 'hat', 'rat'],
    correctAnswer: 'mat',
    skillWeight: 2,
    ageRange: '6-8',
  },
  {
    id: 'read-4',
    category: 'reading',
    question: 'What does "enormous" mean?',
    type: 'multiple-choice',
    options: ['Very small', 'Very large', 'Very fast', 'Very slow'],
    correctAnswer: 'Very large',
    skillWeight: 3,
    ageRange: '8-12',
  },
  {
    id: 'read-5',
    category: 'reading',
    question: 'Read this sentence: "The quick brown fox jumps over the lazy dog." What is the fox doing?',
    type: 'multiple-choice',
    options: ['Running', 'Jumping', 'Sleeping', 'Eating'],
    correctAnswer: 'Jumping',
    skillWeight: 3,
    ageRange: '7-10',
  },
  {
    id: 'read-6',
    category: 'reading',
    question: 'How often does the student read for fun?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
    skillWeight: 1,
  },
  {
    id: 'read-7',
    category: 'reading',
    question: 'What is the main idea of this passage? "Dolphins are intelligent marine mammals. They communicate using clicks and whistles. Dolphins live in groups called pods and help each other find food."',
    type: 'multiple-choice',
    options: [
      'Dolphins eat fish',
      'Dolphins are smart and social animals',
      'Dolphins make sounds',
      'Dolphins live in water',
    ],
    correctAnswer: 'Dolphins are smart and social animals',
    skillWeight: 4,
    ageRange: '10-18',
  },

  // WRITING ASSESSMENT (5 questions - adaptive)
  {
    id: 'write-1',
    category: 'writing',
    question: 'Can the student write their own name?',
    type: 'multiple-choice',
    options: ['Not yet', 'With help', 'Yes, independently'],
    correctAnswer: 'Yes, independently',
    skillWeight: 1,
    ageRange: '4-6',
  },
  {
    id: 'write-2',
    category: 'writing',
    question: 'Can the student write simple sentences (like "I like dogs")?',
    type: 'multiple-choice',
    options: ['Not yet', 'With help', 'Yes, with few errors', 'Yes, correctly'],
    correctAnswer: 'Yes, correctly',
    skillWeight: 2,
    ageRange: '6-9',
  },
  {
    id: 'write-3',
    category: 'writing',
    question: 'Can the student write a short paragraph (3-5 sentences)?',
    type: 'multiple-choice',
    options: ['Not yet', 'With significant help', 'With some help', 'Yes, independently'],
    correctAnswer: 'Yes, independently',
    skillWeight: 3,
    ageRange: '8-12',
  },
  {
    id: 'write-4',
    category: 'writing',
    question: 'Does the student enjoy creative writing or storytelling?',
    type: 'scale',
    options: ['Not at all', 'A little', 'Sometimes', 'Often', 'Loves it!'],
    skillWeight: 1,
  },
  {
    id: 'write-5',
    category: 'writing',
    question: 'Can the student write a multi-paragraph essay with introduction, body, and conclusion?',
    type: 'multiple-choice',
    options: ['Not yet', 'With help', 'Yes, basic structure', 'Yes, well-developed'],
    correctAnswer: 'Yes, well-developed',
    skillWeight: 5,
    ageRange: '11-18',
  },

  // NEURODIVERGENT SCREENING (7 questions)
  {
    id: 'neuro-1',
    category: 'neurodivergent',
    question: 'Does the student have difficulty focusing on tasks for extended periods?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    skillWeight: 0,
  },
  {
    id: 'neuro-2',
    category: 'neurodivergent',
    question: 'Does the student need to move around while learning?',
    type: 'scale',
    options: ['Not at all', 'A little', 'Sometimes', 'Often', 'Always'],
    skillWeight: 0,
  },
  {
    id: 'neuro-3',
    category: 'neurodivergent',
    question: 'How does the student handle transitions between activities?',
    type: 'multiple-choice',
    options: [
      'Easily, no problem',
      'Usually okay with warning',
      'Sometimes struggles',
      'Often has difficulty',
      'Very challenging',
    ],
    skillWeight: 0,
  },
  {
    id: 'neuro-4',
    category: 'neurodivergent',
    question: 'Does the student have strong interests or "favorite topics" they love to talk about?',
    type: 'scale',
    options: ['Not really', 'A few interests', 'Some strong interests', 'Very focused interests', 'Intense special interests'],
    skillWeight: 0,
  },
  {
    id: 'neuro-5',
    category: 'neurodivergent',
    question: 'How sensitive is the student to sounds, lights, or textures?',
    type: 'multiple-choice',
    options: [
      'Not sensitive',
      'Slightly sensitive',
      'Moderately sensitive',
      'Very sensitive',
      'Extremely sensitive',
    ],
    skillWeight: 0,
  },
  {
    id: 'neuro-6',
    category: 'neurodivergent',
    question: 'Does the student work better with visual supports (pictures, charts, diagrams)?',
    type: 'scale',
    options: ['Not particularly', 'A little', 'Somewhat', 'Definitely', 'Essential'],
    skillWeight: 0,
  },
  {
    id: 'neuro-7',
    category: 'neurodivergent',
    question: 'Does the student have diagnosed ADHD, autism, dyslexia, or other learning differences?',
    type: 'multiple-choice',
    options: [
      'No diagnosis',
      'Suspected but not diagnosed',
      'ADHD',
      'Autism/ASD',
      'Dyslexia',
      'Multiple diagnoses',
      'Other learning difference',
    ],
    skillWeight: 0,
  },
];

// ============================================================================
// SCORING ALGORITHM
// ============================================================================

/**
 * Calculate placement based on quiz answers
 */
export function calculatePlacement(answers: QuizAnswer[]): PlacementResult {
  // Get student age
  const ageAnswer = answers.find(a => a.questionId === 'bg-1');
  const age = parseInt(ageAnswer?.answer as string || '8');

  // Calculate skill levels
  const mathLevel = calculateSkillLevel(answers, 'math');
  const readingLevel = calculateSkillLevel(answers, 'reading');
  const writingLevel = calculateSkillLevel(answers, 'writing');
  const overallLevel = Math.round((mathLevel + readingLevel + writingLevel) / 3);

  // Determine tier
  const tier = determineTier(age, overallLevel, answers);

  // Determine learning style
  const learningStyle = determineLearningStyle(answers);

  // Identify strengths and growth areas
  const { strengths, growthAreas } = identifyStrengthsAndGrowth(
    mathLevel,
    readingLevel,
    writingLevel,
    answers
  );

  // Generate recommendations
  const recommendations = generateRecommendations(tier, strengths, growthAreas, answers);

  // Determine starting quest
  const recommendedStartQuest = determineStartQuest(tier, overallLevel);

  // Neurodivergent supports
  const neurodivergentSupports = determineSupports(answers);

  return {
    tier,
    mathLevel,
    readingLevel,
    writingLevel,
    overallLevel,
    learningStyle,
    strengths,
    growthAreas,
    recommendations,
    recommendedStartQuest,
    neurodivergentSupports,
  };
}

/**
 * Calculate skill level for a category (1-10)
 */
function calculateSkillLevel(answers: QuizAnswer[], category: string): SkillLevel {
  const categoryQuestions = PLACEMENT_QUIZ_QUESTIONS.filter(q => q.category === category);
  const categoryAnswers = answers.filter(a =>
    categoryQuestions.some(q => q.id === a.questionId)
  );

  let totalScore = 0;
  let maxScore = 0;

  categoryAnswers.forEach(answer => {
    const question = categoryQuestions.find(q => q.id === answer.questionId);
    if (!question || !question.skillWeight) return;

    maxScore += question.skillWeight * 2; // Max 2 points per weight

    // Calculate score based on answer
    if (question.type === 'multiple-choice' && question.correctAnswer) {
      if (answer.answer === question.correctAnswer) {
        totalScore += question.skillWeight * 2; // Full points
      } else if (answer.answer !== 'Not sure') {
        totalScore += question.skillWeight * 0.5; // Partial credit for trying
      }
    } else if (question.type === 'scale') {
      // Scale questions: convert to 0-2 range
      const options = question.options || [];
      const answerIndex = options.indexOf(answer.answer as string);
      const scoreRatio = answerIndex / (options.length - 1);
      totalScore += question.skillWeight * scoreRatio * 2;
    }
  });

  if (maxScore === 0) return 5; // Default if no questions answered

  // Convert to 1-10 scale
  const percentage = (totalScore / maxScore) * 100;
  return Math.max(1, Math.min(10, Math.round(percentage / 10)));
}

/**
 * Determine appropriate tier
 */
function determineTier(age: number, overallLevel: SkillLevel, answers: QuizAnswer[]): TierLevel {
  // Age-based baseline
  if (age <= 6) {
    return overallLevel >= 7 ? 'explorers' : 'early-explorers';
  } else if (age <= 10) {
    if (overallLevel <= 3) return 'early-explorers';
    if (overallLevel >= 7) return 'warriors';
    return 'explorers';
  } else {
    // Ages 11-18
    if (overallLevel <= 4) return 'explorers';
    return 'warriors';
  }
}

/**
 * Determine learning style
 */
function determineLearningStyle(answers: QuizAnswer[]): LearningStyle {
  const styleAnswer = answers.find(a => a.questionId === 'bg-3');
  if (!styleAnswer) return 'mixed';

  const answer = styleAnswer.answer as string;
  if (answer.includes('seeing')) return 'visual';
  if (answer.includes('doing')) return 'kinesthetic';
  if (answer.includes('listening')) return 'auditory';
  return 'mixed';
}

/**
 * Identify strengths and growth areas
 */
function identifyStrengthsAndGrowth(
  mathLevel: SkillLevel,
  readingLevel: SkillLevel,
  writingLevel: SkillLevel,
  answers: QuizAnswer[]
) {
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  // Skill-based strengths
  if (mathLevel >= 7) strengths.push('Strong mathematical reasoning');
  if (readingLevel >= 7) strengths.push('Excellent reading comprehension');
  if (writingLevel >= 7) strengths.push('Advanced writing skills');

  // Interest-based strengths
  const mathEnjoyment = answers.find(a => a.questionId === 'math-6');
  if (mathEnjoyment && (mathEnjoyment.answer === 'Often' || mathEnjoyment.answer === 'Loves it!')) {
    strengths.push('Enjoys problem-solving and puzzles');
  }

  const readingEnjoyment = answers.find(a => a.questionId === 'read-6');
  if (readingEnjoyment && (readingEnjoyment.answer === 'Often' || readingEnjoyment.answer === 'Daily')) {
    strengths.push('Loves reading and exploring stories');
  }

  const writingEnjoyment = answers.find(a => a.questionId === 'write-4');
  if (writingEnjoyment && (writingEnjoyment.answer === 'Often' || writingEnjoyment.answer === 'Loves it!')) {
    strengths.push('Creative storyteller and writer');
  }

  // Growth areas
  if (mathLevel <= 4) growthAreas.push('Mathematical skills development');
  if (readingLevel <= 4) growthAreas.push('Reading fluency and comprehension');
  if (writingLevel <= 4) growthAreas.push('Writing expression and mechanics');

  // Ensure we have at least one of each
  if (strengths.length === 0) strengths.push('Eager learner with great potential');
  if (growthAreas.length === 0) growthAreas.push('Continued skill refinement');

  return { strengths, growthAreas };
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  tier: TierLevel,
  strengths: string[],
  growthAreas: string[],
  answers: QuizAnswer[]
): string[] {
  const recommendations: string[] = [];

  // Movement needs
  const movementNeed = answers.find(a => a.questionId === 'neuro-2');
  if (movementNeed && (movementNeed.answer === 'Often' || movementNeed.answer === 'Always')) {
    recommendations.push('Incorporate movement breaks and kinesthetic learning activities');
  }

  // Visual supports
  const visualSupport = answers.find(a => a.questionId === 'neuro-6');
  if (visualSupport && (visualSupport.answer === 'Definitely' || visualSupport.answer === 'Essential')) {
    recommendations.push('Use visual schedules, charts, and diagrams for all lessons');
  }

  // Special interests
  const specialInterests = answers.find(a => a.questionId === 'neuro-4');
  if (specialInterests && (specialInterests.answer === 'Very focused interests' || specialInterests.answer === 'Intense special interests')) {
    recommendations.push('Connect learning to student\'s special interests whenever possible');
  }

  // Transition support
  const transitionDifficulty = answers.find(a => a.questionId === 'neuro-3');
  if (transitionDifficulty && (transitionDifficulty.answer === 'Often has difficulty' || transitionDifficulty.answer === 'Very challenging')) {
    recommendations.push('Provide advance warnings and visual timers for transitions');
  }

  // General tier-based recommendations
  if (tier === 'early-explorers') {
    recommendations.push('Focus on hands-on, play-based learning experiences');
    recommendations.push('Keep sessions short (15-20 minutes) with frequent breaks');
  } else if (tier === 'warriors') {
    recommendations.push('Encourage self-directed project-based learning');
    recommendations.push('Provide opportunities for leadership and peer tutoring');
  }

  return recommendations;
}

/**
 * Determine starting quest
 */
function determineStartQuest(tier: TierLevel, overallLevel: SkillLevel): string {
  if (tier === 'early-explorers') return 'EH-W1'; // Early Explorers Week 1
  if (tier === 'explorers') return 'EX-W1'; // Explorers Week 1
  return 'WR-W1'; // Warriors Week 1
}

/**
 * Determine neurodivergent supports
 */
function determineSupports(answers: QuizAnswer[]): string[] {
  const supports: string[] = [];

  const focusDifficulty = answers.find(a => a.questionId === 'neuro-1');
  if (focusDifficulty && (focusDifficulty.answer === 'Often' || focusDifficulty.answer === 'Always')) {
    supports.push('Chunking tasks into smaller steps');
    supports.push('Built-in focus breaks every 15-20 minutes');
  }

  const sensoryNeeds = answers.find(a => a.questionId === 'neuro-5');
  if (sensoryNeeds && (sensoryNeeds.answer === 'Very sensitive' || sensoryNeeds.answer === 'Extremely sensitive')) {
    supports.push('Quiet learning environment with noise-canceling options');
    supports.push('Flexible sensory accommodations');
  }

  const diagnosis = answers.find(a => a.questionId === 'neuro-7');
  if (diagnosis) {
    if ((diagnosis.answer as string).includes('ADHD')) {
      supports.push('ADHD-friendly: XP never decreases, gamified progress');
      supports.push('Choice in activity order and pacing');
    }
    if ((diagnosis.answer as string).includes('Autism')) {
      supports.push('Clear expectations, visual schedules, predictable routines');
      supports.push('Time to process and special interest integration');
    }
    if ((diagnosis.answer as string).includes('Dyslexia')) {
      supports.push('Orton-Gillingham multisensory reading approach');
      supports.push('Text-to-speech and assistive technology');
    }
  }

  if (supports.length === 0) {
    supports.push('Neurodivergent-friendly environment for all learners');
  }

  return supports;
}
