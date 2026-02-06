/**
 * AI Content Engine
 * Generates lessons, problems, rubrics, and assessments on-demand
 * NO EXTERNAL DEPENDENCIES - all content created internally by Wowl
 */

export interface ContentRequest {
  subject: 'math' | 'reading' | 'writing' | 'spelling' | 'science';
  topic: string;
  gradeLevel: number;
  studentLevel: number; // 1-5 (beginner to mastery)
  format: 'lesson' | 'practice' | 'project' | 'assessment' | 'video-script';
  studentInterests?: string[]; // e.g., ['Minecraft', 'Roblox', 'Art']
}

export interface GeneratedLesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  content: string; // Markdown formatted
  learningObjectives: string[];
  vocabulary: { term: string; definition: string }[];
  examples: string[];
  videoScript?: string; // For text-to-speech
  checkUnderstanding: Question[];
  practiceProblems?: Problem[];
  rubric?: Rubric;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false' | 'fill-blank';
  options?: string[]; // For multiple choice
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
}

export interface Problem {
  id: string;
  problem: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  solution: string;
  steps: string[];
  hint1?: string;
  hint2?: string;
  relatedConcept: string;
}

export interface Rubric {
  id: string;
  title: string;
  criteria: RubricCriteria[];
  passingScore: number;
  masteryScore: number;
  bonusXP: { [key: string]: number };
}

export interface RubricCriteria {
  name: string;
  description: string;
  weight: number; // 1-3
  levels: {
    beginner: { score: 1; description: string; example?: string };
    developing: { score: 2; description: string; example?: string };
    proficient: { score: 3; description: string; example?: string };
    mastery: { score: 4; description: string; example?: string };
  };
}

/**
 * Generate a complete lesson using AI
 * This eliminates need for Khan Academy or other external content
 */
export async function generateLesson(
  request: ContentRequest
): Promise<GeneratedLesson> {
  // In production, this would call OpenAI GPT-4
  // For now, return structured mock data

  const lessonId = `${request.subject.toUpperCase()}-${request.topic.replace(/\s+/g, '-')}-L${request.studentLevel}`;

  // Mock AI-generated content (replace with OpenAI call in production)
  const lesson: GeneratedLesson = {
    id: lessonId,
    title: generateTitle(request),
    subject: request.subject,
    topic: request.topic,
    duration: request.format === 'video-script' ? 10 : 15,
    content: generateContent(request),
    learningObjectives: generateObjectives(request),
    vocabulary: generateVocabulary(request),
    examples: generateExamples(request),
    videoScript: request.format === 'video-script' ? generateVideoScript(request) : undefined,
    checkUnderstanding: generateQuestions(request),
    practiceProblems: request.format === 'practice' ? generatePracticeProblems(request) : undefined,
    rubric: request.format === 'project' || request.format === 'assessment' ? generateRubric(request) : undefined,
  };

  return lesson;
}

/**
 * Generate practice problems on-demand
 * Infinite practice without external sites like Khan Academy
 */
export function generatePracticeProblems(
  request: ContentRequest,
  count: number = 10
): Problem[] {
  const problems: Problem[] = [];

  for (let i = 0; i < count; i++) {
    problems.push(generateSingleProblem(request, i));
  }

  return problems;
}

function generateSingleProblem(request: ContentRequest, index: number): Problem {
  // This would use AI to generate unique problems
  // For now, mock data based on subject/topic

  if (request.subject === 'math') {
    return generateMathProblem(request, index);
  } else if (request.subject === 'reading') {
    return generateReadingProblem(request, index);
  } else if (request.subject === 'writing') {
    return generateWritingProblem(request, index);
  } else {
    return generateGenericProblem(request, index);
  }
}

function generateMathProblem(request: ContentRequest, index: number): Problem {
  // Example: Generate multiplication problems
  const num1 = Math.floor(Math.random() * 12) + 1;
  const num2 = Math.floor(Math.random() * 12) + 1;
  const answer = num1 * num2;

  // Make it Minecraft-themed for engagement
  const contexts = [
    `You're building in Minecraft. Each row has ${num1} blocks, and you have ${num2} rows. How many blocks total?`,
    `Your Roblox shop sells items for ${num1} Robux each. If ${num2} players buy one, how much Robux do you earn?`,
    `You craft ${num1} potions per hour. After ${num2} hours, how many potions do you have?`,
  ];

  return {
    id: `${request.subject}-${index}`,
    problem: contexts[index % contexts.length],
    difficulty: request.studentLevel as 1 | 2 | 3 | 4 | 5,
    solution: `${answer}`,
    steps: [
      `Multiply ${num1} × ${num2}`,
      `${num1} × ${num2} = ${answer}`,
      `Answer: ${answer}`,
    ],
    hint1: `Think about ${num1} groups of ${num2}`,
    hint2: `Try breaking it down: ${num1} × ${num2} = ${num1} + ${num1} + ... (${num2} times)`,
    relatedConcept: 'Multiplication as repeated addition',
  };
}

function generateReadingProblem(request: ContentRequest, index: number): Problem {
  return {
    id: `${request.subject}-${index}`,
    problem: 'Read the passage and identify the main idea.',
    difficulty: request.studentLevel as 1 | 2 | 3 | 4 | 5,
    solution: 'The main idea is...',
    steps: [
      'Read the passage carefully',
      'Identify key points',
      'Summarize in one sentence',
    ],
    relatedConcept: 'Main idea identification',
  };
}

function generateWritingProblem(request: ContentRequest, index: number): Problem {
  const prompts = [
    'Write a paragraph about your favorite video game. Include a topic sentence, 3 supporting details, and a conclusion.',
    'Describe a character from your favorite book or game. Use at least 5 descriptive words.',
    'Write a short story (5 sentences) about an adventure in Minecraft or Roblox.',
  ];

  return {
    id: `${request.subject}-${index}`,
    problem: prompts[index % prompts.length],
    difficulty: request.studentLevel as 1 | 2 | 3 | 4 | 5,
    solution: 'Student-created response (reviewed by AI)',
    steps: [
      'Brainstorm your ideas',
      'Write a first draft',
      'Revise for clarity and detail',
      'Check spelling and grammar',
    ],
    hint1: 'Start with a strong opening sentence',
    hint2: 'Use specific examples from your experience',
    relatedConcept: 'Paragraph structure',
  };
}

function generateGenericProblem(request: ContentRequest, index: number): Problem {
  return {
    id: `${request.subject}-${index}`,
    problem: `Practice problem ${index + 1} for ${request.topic}`,
    difficulty: request.studentLevel as 1 | 2 | 3 | 4 | 5,
    solution: 'Answer',
    steps: ['Step 1', 'Step 2', 'Step 3'],
    relatedConcept: request.topic,
  };
}

/**
 * Generate comprehensive rubric for ANY assignment
 * Clear expectations = less anxiety for neurodivergent students
 */
function generateRubric(request: ContentRequest): Rubric {
  if (request.subject === 'writing') {
    return {
      id: `RUBRIC-${request.topic}`,
      title: `${request.topic} Writing Rubric`,
      criteria: [
        {
          name: 'Content & Ideas',
          description: 'Clear, focused ideas with relevant details',
          weight: 3,
          levels: {
            beginner: {
              score: 1,
              description: 'Unclear ideas, missing details',
              example: 'I like games. They are fun.',
            },
            developing: {
              score: 2,
              description: 'Some clear ideas, limited details',
              example: 'I like Minecraft because it is creative.',
            },
            proficient: {
              score: 3,
              description: 'Clear ideas with supporting details',
              example: 'I enjoy Minecraft because I can build creative structures and explore caves.',
            },
            mastery: {
              score: 4,
              description: 'Exceptional ideas with vivid, specific details',
              example: 'Minecraft captivates me because I can design intricate redstone machines, explore mysterious strongholds, and collaborate with friends on massive building projects.',
            },
          },
        },
        {
          name: 'Organization',
          description: 'Logical flow with clear beginning, middle, end',
          weight: 2,
          levels: {
            beginner: {
              score: 1,
              description: 'No clear structure, ideas jump around',
            },
            developing: {
              score: 2,
              description: 'Some structure, but transitions are weak',
            },
            proficient: {
              score: 3,
              description: 'Clear structure with good transitions',
            },
            mastery: {
              score: 4,
              description: 'Excellent structure that enhances the message',
            },
          },
        },
        {
          name: 'Word Choice',
          description: 'Precise, engaging vocabulary',
          weight: 2,
          levels: {
            beginner: {
              score: 1,
              description: 'Simple, repetitive words',
            },
            developing: {
              score: 2,
              description: 'Some variety in word choice',
            },
            proficient: {
              score: 3,
              description: 'Strong vocabulary that fits the topic',
            },
            mastery: {
              score: 4,
              description: 'Sophisticated, precise word choice',
            },
          },
        },
        {
          name: 'Mechanics',
          description: 'Spelling, grammar, punctuation',
          weight: 1,
          levels: {
            beginner: {
              score: 1,
              description: 'Many errors that interfere with meaning',
            },
            developing: {
              score: 2,
              description: 'Some errors, mostly understandable',
            },
            proficient: {
              score: 3,
              description: 'Few errors, well-edited',
            },
            mastery: {
              score: 4,
              description: 'Nearly error-free',
            },
          },
        },
      ],
      passingScore: 9, // Average of 2.25 per criterion (developing+)
      masteryScore: 14, // Average of 3.5 per criterion (proficient+)
      bonusXP: {
        early_submission: 25,
        peer_review_given: 25,
        revision_completed: 10,
        mastery_achieved: 50,
      },
    };
  }

  // Generic rubric for other subjects
  return {
    id: `RUBRIC-${request.topic}`,
    title: `${request.topic} Rubric`,
    criteria: [
      {
        name: 'Understanding',
        description: 'Demonstrates understanding of concept',
        weight: 3,
        levels: {
          beginner: { score: 1, description: 'Limited understanding' },
          developing: { score: 2, description: 'Partial understanding' },
          proficient: { score: 3, description: 'Clear understanding' },
          mastery: { score: 4, description: 'Deep, comprehensive understanding' },
        },
      },
      {
        name: 'Application',
        description: 'Applies concept to solve problems',
        weight: 2,
        levels: {
          beginner: { score: 1, description: 'Cannot apply concept' },
          developing: { score: 2, description: 'Applies with significant help' },
          proficient: { score: 3, description: 'Applies independently' },
          mastery: { score: 4, description: 'Applies creatively to new situations' },
        },
      },
      {
        name: 'Accuracy',
        description: 'Work is correct and complete',
        weight: 2,
        levels: {
          beginner: { score: 1, description: 'Many errors' },
          developing: { score: 2, description: 'Some errors' },
          proficient: { score: 3, description: 'Mostly accurate' },
          mastery: { score: 4, description: 'Highly accurate' },
        },
      },
    ],
    passingScore: 6,
    masteryScore: 10,
    bonusXP: {
      early_completion: 25,
      help_peer: 25,
      mastery: 50,
    },
  };
}

// Helper functions
function generateTitle(request: ContentRequest): string {
  const formats = {
    lesson: 'Introduction to',
    practice: 'Practice:',
    project: 'Project:',
    assessment: 'Assessment:',
    'video-script': 'Learn:',
  };

  return `${formats[request.format]} ${capitalize(request.topic)}`;
}

function generateContent(request: ContentRequest): string {
  // This would be AI-generated in production
  return `
# ${capitalize(request.topic)}

Welcome! In this lesson, we'll explore **${request.topic}** in a way that makes sense for YOUR learning style.

## What You'll Learn

By the end of this lesson, you'll be able to:
- Understand the key concepts of ${request.topic}
- Apply ${request.topic} to real-world situations
- Build projects using ${request.topic}

## Let's Get Started!

${request.topic} is all about...

[AI-generated content would go here in production]

## Try It Yourself

Now it's your turn to practice what you've learned!
  `.trim();
}

function generateObjectives(request: ContentRequest): string[] {
  return [
    `Understand the fundamentals of ${request.topic}`,
    `Apply ${request.topic} to solve problems`,
    `Create projects that demonstrate mastery of ${request.topic}`,
  ];
}

function generateVocabulary(request: ContentRequest): { term: string; definition: string }[] {
  return [
    { term: 'Key Term 1', definition: 'Definition of important concept' },
    { term: 'Key Term 2', definition: 'Definition of another concept' },
  ];
}

function generateExamples(request: ContentRequest): string[] {
  const interests = request.studentInterests || ['Minecraft', 'Roblox'];

  return [
    `Example using ${interests[0]}: ...`,
    `Real-world example: ...`,
    `Another example: ...`,
  ];
}

function generateVideoScript(request: ContentRequest): string {
  return `
Hey there! I'm Wowl, your learning companion. Today we're going to explore ${request.topic}.

[Introduction - 2 minutes]
Let me show you why ${request.topic} is actually pretty cool...

[Main Content - 6 minutes]
Here's how ${request.topic} works...

[Examples - 2 minutes]
Let's see this in action with a ${request.studentInterests?.[0] || 'Minecraft'} example...

[Wrap-up - 1 minute]
Now you're ready to practice! Let's check your understanding with a quick quiz.
  `.trim();
}

function generateQuestions(request: ContentRequest): Question[] {
  return [
    {
      id: 'q1',
      question: `What is the main idea of ${request.topic}?`,
      type: 'multiple-choice',
      options: [
        'Correct answer',
        'Distractor 1',
        'Distractor 2',
        'Distractor 3',
      ],
      correctAnswer: 0,
      explanation: 'This is correct because...',
      hint: 'Think about the key concept we discussed',
    },
    {
      id: 'q2',
      question: `How would you apply ${request.topic} in Minecraft?`,
      type: 'short-answer',
      correctAnswer: 'Open-ended response',
      explanation: 'Good answers include...',
    },
  ];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Evaluate student work using AI
 * Provides instant feedback without waiting for teacher
 */
export async function evaluateSubmission(
  submission: string,
  rubric: Rubric,
  subject: string
): Promise<{
  scores: { [criteriaName: string]: number };
  totalScore: number;
  passed: boolean;
  mastery: boolean;
  feedback: string[];
  suggestions: string[];
  xpEarned: number;
}> {
  // This would use AI to evaluate in production
  // For now, return mock evaluation

  const scores: { [criteriaName: string]: number } = {};
  let totalScore = 0;

  rubric.criteria.forEach((criteria) => {
    // Mock scoring (would be AI-evaluated)
    const score = Math.floor(Math.random() * 3) + 2; // 2-4
    scores[criteria.name] = score;
    totalScore += score;
  });

  const passed = totalScore >= rubric.passingScore;
  const mastery = totalScore >= rubric.masteryScore;

  const feedback: string[] = [];
  const suggestions: string[] = [];

  rubric.criteria.forEach((criteria) => {
    if (scores[criteria.name] < 3) {
      suggestions.push(
        `Try to improve ${criteria.name}: ${criteria.levels.proficient.description}`
      );
    } else if (scores[criteria.name] === 4) {
      feedback.push(`Excellent work on ${criteria.name}!`);
    }
  });

  let xpEarned = passed ? 100 : 50;
  if (mastery) xpEarned += rubric.bonusXP.mastery || 50;

  return {
    scores,
    totalScore,
    passed,
    mastery,
    feedback,
    suggestions,
    xpEarned,
  };
}
