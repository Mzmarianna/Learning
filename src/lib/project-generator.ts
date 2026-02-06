/**
 * Project-Based Learning Generator
 * Wowl creates real-world projects for students to demonstrate mastery
 * NOW: Curriculum-integrated with dynamic difficulty adjustment
 */

import { Competency, Subject, GradeLevel, SkillLevel } from './learning-standards';
import { Lesson, Level } from './curriculum-data';
import { CompetencyMastery } from './adaptive-learning';

export interface Project {
  id: string;
  title: string;
  description: string;
  competencies: string[]; // Competency IDs being assessed
  lessonIds?: string[]; // Linked curriculum lessons
  subject: Subject;
  gradeLevel: GradeLevel;
  estimatedTime: number; // minutes
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  platforms: ProjectPlatform[];
  deliverables: Deliverable[];
  evaluationCriteria: EvaluationCriterion[];
  wowlPrompt: string; // What Wowl says when presenting the project
  exampleIdeas: string[];
  scaffolding?: ScaffoldingSupport; // Support based on student level
}

export interface ProjectPlatform {
  name: 'roblox' | 'minecraft' | 'scratch' | 'tinkercad' | 'canva' | 'video' | 'photo' | 'written';
  isPreferred: boolean;
  instructions?: string;
}

export interface Deliverable {
  type: 'screenshot' | 'video' | 'link' | 'photo' | 'document';
  description: string;
  required: boolean;
}

export interface EvaluationCriterion {
  id: string;
  competencyId: string;
  description: string;
  points: number;
  examples: {
    excellent: string;
    good: string;
    needsWork: string;
  };
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  studentId: string;
  submittedAt: Date;
  files: SubmittedFile[];
  studentNotes?: string;
  status: 'submitted' | 'under-review' | 'evaluated' | 'needs-revision';
  evaluation?: ProjectEvaluation;
}

export interface SubmittedFile {
  type: 'screenshot' | 'video' | 'link' | 'photo' | 'document';
  url: string;
  filename: string;
  notes?: string;
}

export interface ProjectEvaluation {
  evaluatedAt: Date;
  evaluatedBy: 'wowl-ai' | 'teacher' | string; // AI or teacher user ID
  criteriaScores: CriterionScore[];
  totalPoints: number;
  maxPoints: number;
  percentageScore: number;
  feedback: string;
  wowlComment: string;
  competenciesMastered: string[];
  competenciesNeedWork: string[];
  nextSteps: string[];
}

export interface CriterionScore {
  criterionId: string;
  pointsEarned: number;
  maxPoints: number;
  feedback: string;
  evidence: string; // What they saw in the submission
}

export interface ScaffoldingSupport {
  level: SkillLevel;
  hints: string[];
  examples: string[];
  resources: string[];
}

// ==================== PROJECT TEMPLATES ====================

const PROJECT_TEMPLATES: Record<string, (competencies: Competency[]) => Project> = {
  // MATH PROJECTS
  'bridge-engineering': (competencies) => ({
    id: 'bridge-engineering',
    title: 'Build a Bridge',
    description: 'Design and build a functional bridge in Roblox Studio. Use math to calculate measurements, angles, and structural integrity.',
    competencies: competencies.map(c => c.id),
    subject: 'math',
    gradeLevel: '5' as GradeLevel,
    estimatedTime: 60,
    difficulty: 'intermediate',
    platforms: [
      { name: 'roblox', isPreferred: true, instructions: 'Use Roblox Studio to build your bridge' },
      { name: 'minecraft', isPreferred: false, instructions: 'Build in creative mode' },
      { name: 'tinkercad', isPreferred: false, instructions: '3D model your bridge' },
    ],
    deliverables: [
      { type: 'screenshot', description: 'Top view of your bridge showing measurements', required: true },
      { type: 'screenshot', description: 'Side view showing height and angles', required: true },
      { type: 'video', description: 'Walk-through of your bridge (bonus)', required: false },
      { type: 'document', description: 'Math calculations you used', required: true },
    ],
    evaluationCriteria: [
      {
        id: 'measurements',
        competencyId: competencies[0]?.id || 'measurement',
        description: 'Bridge uses accurate measurements',
        points: 25,
        examples: {
          excellent: 'All measurements labeled clearly, calculations shown, consistent units',
          good: 'Most measurements labeled, basic calculations shown',
          needsWork: 'Few measurements or incorrect calculations',
        },
      },
      {
        id: 'symmetry',
        competencyId: competencies[1]?.id || 'geometry',
        description: 'Bridge is symmetrical and balanced',
        points: 25,
        examples: {
          excellent: 'Perfect symmetry, both sides identical, balanced design',
          good: 'Mostly symmetrical with minor differences',
          needsWork: 'Unbalanced or asymmetrical',
        },
      },
      {
        id: 'functionality',
        competencyId: competencies[0]?.id || 'problem-solving',
        description: 'Bridge is functional (can cross it)',
        points: 25,
        examples: {
          excellent: 'Strong structure, easily crossable, logical design',
          good: 'Functional but could be stronger',
          needsWork: 'Unstable or incomplete',
        },
      },
      {
        id: 'creativity',
        competencyId: competencies[0]?.id || 'application',
        description: 'Creative design that shows understanding',
        points: 25,
        examples: {
          excellent: 'Unique design, extra features, shows deep understanding',
          good: 'Standard design done well',
          needsWork: 'Basic or incomplete',
        },
      },
    ],
    wowlPrompt: `Time for a real-world project. Build a bridge in Roblox Studio. Use the math you've learned—measurements, angles, symmetry. Make it functional. Submit screenshots and show your calculations.`,
    exampleIdeas: [
      'Suspension bridge with cables',
      'Arch bridge using curves',
      'Truss bridge with triangular supports',
      'Drawbridge with moving parts',
    ],
  }),

  'garden-design': (competencies) => ({
    id: 'garden-design',
    title: 'Design a Garden',
    description: 'Create a garden layout using area, perimeter, and fractions. Calculate plant spacing and garden bed dimensions.',
    competencies: competencies.map(c => c.id),
    subject: 'math',
    gradeLevel: '3' as GradeLevel,
    estimatedTime: 45,
    difficulty: 'foundation',
    platforms: [
      { name: 'roblox', isPreferred: true, instructions: 'Build in Roblox Studio' },
      { name: 'minecraft', isPreferred: false },
      { name: 'canva', isPreferred: false, instructions: 'Design a top-down view' },
    ],
    deliverables: [
      { type: 'screenshot', description: 'Overhead view of garden with measurements', required: true },
      { type: 'document', description: 'Area and perimeter calculations', required: true },
    ],
    evaluationCriteria: [
      {
        id: 'area-perimeter',
        competencyId: competencies[0]?.id || 'area',
        description: 'Correct area and perimeter calculations',
        points: 30,
        examples: {
          excellent: 'All calculations correct and clearly shown',
          good: 'Mostly correct with minor errors',
          needsWork: 'Major calculation errors',
        },
      },
      {
        id: 'spacing',
        competencyId: competencies[1]?.id || 'fractions',
        description: 'Plants spaced evenly using fractions/division',
        points: 30,
        examples: {
          excellent: 'Perfect spacing, shows division work',
          good: 'Mostly even spacing',
          needsWork: 'Uneven or no spacing calculations',
        },
      },
      {
        id: 'design',
        competencyId: competencies[0]?.id || 'application',
        description: 'Garden design is logical and organized',
        points: 40,
        examples: {
          excellent: 'Well-organized sections, labeled, makes sense',
          good: 'Basic organization',
          needsWork: 'Disorganized or incomplete',
        },
      },
    ],
    wowlPrompt: `Design a garden. Calculate the area and perimeter of your garden beds. Space plants evenly using fractions. Show your math work.`,
    exampleIdeas: [
      'Vegetable garden with rows',
      'Flower garden with circular beds',
      'Herb spiral garden',
      'Raised bed garden',
    ],
  }),

  // READING PROJECTS
  'story-world': (competencies) => ({
    id: 'story-world',
    title: 'Build Your Story World',
    description: 'Create a world in Roblox based on a story you read. Build settings, add characters, write descriptions.',
    competencies: competencies.map(c => c.id),
    subject: 'reading',
    gradeLevel: '7' as GradeLevel,
    estimatedTime: 90,
    difficulty: 'intermediate',
    platforms: [
      { name: 'roblox', isPreferred: true },
      { name: 'minecraft', isPreferred: false },
      { name: 'written', isPreferred: false, instructions: 'Write detailed descriptions' },
    ],
    deliverables: [
      { type: 'screenshot', description: 'Main setting from the story', required: true },
      { type: 'document', description: 'Written description of your world (200 words)', required: true },
      { type: 'video', description: 'Tour of your world explaining story elements', required: false },
    ],
    evaluationCriteria: [
      {
        id: 'accuracy',
        competencyId: competencies[0]?.id || 'comprehension',
        description: 'World matches story details accurately',
        points: 30,
        examples: {
          excellent: 'All major story elements included accurately',
          good: 'Most story elements present',
          needsWork: 'Missing key story details',
        },
      },
      {
        id: 'description',
        competencyId: competencies[1]?.id || 'writing',
        description: 'Written description is detailed and clear',
        points: 40,
        examples: {
          excellent: 'Vivid descriptions, proper grammar, 200+ words',
          good: 'Basic descriptions, minor grammar errors',
          needsWork: 'Very brief or many errors',
        },
      },
      {
        id: 'interpretation',
        competencyId: competencies[0]?.id || 'analysis',
        description: 'Shows understanding of story themes',
        points: 30,
        examples: {
          excellent: 'Deep understanding, creative interpretation',
          good: 'Basic understanding shown',
          needsWork: 'Limited understanding',
        },
      },
    ],
    wowlPrompt: `Pick a story you've read. Build the world in Roblox. Include the main settings and characters. Write a description explaining your choices.`,
    exampleIdeas: [
      'Hogwarts from Harry Potter',
      'The arena from Hunger Games',
      'The neighborhood from a realistic fiction book',
      'Fantasy world from any book',
    ],
  }),

  'video-summary': (competencies) => ({
    id: 'video-summary',
    title: 'Video Book Summary',
    description: 'Create a 2-minute video summarizing a book. Practice main idea, details, and public speaking.',
    competencies: competencies.map(c => c.id),
    subject: 'reading',
    gradeLevel: '7' as GradeLevel,
    estimatedTime: 60,
    difficulty: 'intermediate',
    platforms: [
      { name: 'video', isPreferred: true, instructions: 'Record yourself or use screen recording' },
      { name: 'canva', isPreferred: false, instructions: 'Create a video presentation' },
    ],
    deliverables: [
      { type: 'video', description: '2-3 minute video summary', required: true },
      { type: 'document', description: 'Script or outline', required: true },
    ],
    evaluationCriteria: [
      {
        id: 'main-idea',
        competencyId: competencies[0]?.id || 'main-idea',
        description: 'Clearly states the main idea',
        points: 25,
        examples: {
          excellent: 'Main idea stated clearly in first 30 seconds',
          good: 'Main idea present but not clearly stated',
          needsWork: 'Main idea unclear or missing',
        },
      },
      {
        id: 'details',
        competencyId: competencies[1]?.id || 'details',
        description: 'Includes important supporting details',
        points: 25,
        examples: {
          excellent: '3+ key details, well-explained',
          good: '2 details included',
          needsWork: 'Few or no details',
        },
      },
      {
        id: 'organization',
        competencyId: competencies[0]?.id || 'organization',
        description: 'Video is organized and easy to follow',
        points: 25,
        examples: {
          excellent: 'Clear beginning, middle, end',
          good: 'Mostly organized',
          needsWork: 'Disorganized or hard to follow',
        },
      },
      {
        id: 'delivery',
        competencyId: competencies[0]?.id || 'speaking',
        description: 'Clear speaking and presentation',
        points: 25,
        examples: {
          excellent: 'Clear voice, good pace, engaging',
          good: 'Understandable with minor issues',
          needsWork: 'Difficult to understand or very rushed',
        },
      },
    ],
    wowlPrompt: `Make a 2-minute video summarizing a book you read. State the main idea, include key details, organize it well. Send me the video and your script.`,
    exampleIdeas: [
      'Talk directly to camera',
      'Use slides with your voice',
      'Screen record yourself with visuals',
      'Interview-style summary',
    ],
  }),
};

// ==================== GENERATE PROJECT ====================

export function generateProject(
  subject: Subject,
  competencies: Competency[],
  studentInterests?: string[]
): Project {
  // Match project template to subject and competencies
  const subjectTemplates = Object.entries(PROJECT_TEMPLATES)
    .filter(([key, template]) => {
      const project = template(competencies);
      return project.subject === subject;
    });

  if (subjectTemplates.length === 0) {
    // Generate generic project
    return generateGenericProject(subject, competencies);
  }

  // Pick a template (could be randomized or based on interests)
  const [templateKey, templateFn] = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
  
  return templateFn(competencies);
}

function generateGenericProject(subject: Subject, competencies: Competency[]): Project {
  return {
    id: `project-${Date.now()}`,
    title: `${subject} Project: ${competencies[0]?.skill || 'Skill Practice'}`,
    description: `Apply what you've learned about ${competencies.map(c => c.skill).join(', ')} in a real-world project.`,
    competencies: competencies.map(c => c.id),
    subject,
    gradeLevel: '5' as GradeLevel,
    estimatedTime: 60,
    difficulty: 'intermediate',
    platforms: [
      { name: 'photo', isPreferred: true },
      { name: 'video', isPreferred: false },
      { name: 'written', isPreferred: false },
    ],
    deliverables: [
      { type: 'photo', description: 'Photo of your completed project', required: true },
      { type: 'document', description: 'Explanation of your work', required: true },
    ],
    evaluationCriteria: competencies.map((c, idx) => ({
      id: `criterion-${idx}`,
      competencyId: c.id,
      description: `Demonstrates ${c.skill}`,
      points: Math.floor(100 / competencies.length),
      examples: {
        excellent: `Clear demonstration of ${c.skill} mastery`,
        good: `Shows understanding of ${c.skill}`,
        needsWork: `Needs more work on ${c.skill}`,
      },
    })),
    wowlPrompt: `Create a project that demonstrates ${competencies.map(c => c.skill).join(' and ')}. Show your work and explain your process.`,
    exampleIdeas: [
      'Real-world application',
      'Creative demonstration',
      'Problem-solving project',
    ],
  };
}

// ==================== AI EVALUATION ====================

export async function evaluateProjectWithAI(
  submission: ProjectSubmission,
  project: Project
): Promise<ProjectEvaluation> {
  // In production, this would call OpenAI or similar
  // For now, we'll create a mock evaluation
  
  // Simulate AI analysis
  const criteriaScores: CriterionScore[] = project.evaluationCriteria.map(criterion => {
    // Randomize for demo (in production, AI analyzes actual submission)
    const pointsEarned = Math.floor(Math.random() * criterion.points) + Math.floor(criterion.points * 0.6);
    
    return {
      criterionId: criterion.id,
      pointsEarned,
      maxPoints: criterion.points,
      feedback: generateAIFeedback(criterion, pointsEarned, criterion.points),
      evidence: `Reviewed submission files`,
    };
  });

  const totalPoints = criteriaScores.reduce((sum, score) => sum + score.pointsEarned, 0);
  const maxPoints = criteriaScores.reduce((sum, score) => sum + score.maxPoints, 0);
  const percentageScore = Math.round((totalPoints / maxPoints) * 100);

  // Determine mastered competencies
  const competenciesMastered: string[] = [];
  const competenciesNeedWork: string[] = [];

  project.evaluationCriteria.forEach(criterion => {
    const score = criteriaScores.find(s => s.criterionId === criterion.id);
    if (score) {
      const percentage = (score.pointsEarned / score.maxPoints) * 100;
      if (percentage >= 80) {
        competenciesMastered.push(criterion.competencyId);
      } else if (percentage < 60) {
        competenciesNeedWork.push(criterion.competencyId);
      }
    }
  });

  return {
    evaluatedAt: new Date(),
    evaluatedBy: 'wowl-ai',
    criteriaScores,
    totalPoints,
    maxPoints,
    percentageScore,
    feedback: generateOverallFeedback(percentageScore, project),
    wowlComment: generateWowlComment(percentageScore, competenciesMastered.length),
    competenciesMastered,
    competenciesNeedWork,
    nextSteps: generateNextSteps(competenciesNeedWork, project),
  };
}

function generateAIFeedback(criterion: EvaluationCriterion, earned: number, max: number): string {
  const percentage = (earned / max) * 100;
  
  if (percentage >= 90) {
    return `Excellent work on ${criterion.description.toLowerCase()}. ${criterion.examples.excellent}`;
  } else if (percentage >= 70) {
    return `Good work on ${criterion.description.toLowerCase()}. ${criterion.examples.good}`;
  } else {
    return `${criterion.description} needs improvement. ${criterion.examples.needsWork}`;
  }
}

function generateOverallFeedback(percentage: number, project: Project): string {
  if (percentage >= 90) {
    return `Outstanding work on this project. You've demonstrated strong understanding of the concepts. Your ${project.title.toLowerCase()} shows mastery.`;
  } else if (percentage >= 70) {
    return `Solid work on this project. You understand most concepts. A few areas could use refinement, but you're on the right track.`;
  } else if (percentage >= 50) {
    return `You're making progress. This project shows you understand the basics. Let's work on strengthening a few areas before moving forward.`;
  } else {
    return `This project needs more work. Let's revisit some concepts and try again. I'll help you improve specific areas.`;
  }
}

function generateWowlComment(percentage: number, masteredCount: number): string {
  if (percentage >= 90) {
    return `Strong work. You've mastered ${masteredCount} competencies with this project.`;
  } else if (percentage >= 70) {
    return `Good progress. ${masteredCount} competencies demonstrated. Keep building on this.`;
  } else if (percentage >= 50) {
    return `You're learning. ${masteredCount} competencies shown. Let's strengthen the others.`;
  } else {
    return `This needs more work. Let me help you improve before we move forward.`;
  }
}

function generateNextSteps(needWork: string[], project: Project): string[] {
  if (needWork.length === 0) {
    return ['Move on to next competency', 'Try a more advanced project', 'Review and strengthen mastery'];
  }

  const steps: string[] = needWork.map(compId => {
    const criterion = project.evaluationCriteria.find(c => c.competencyId === compId);
    return `Review ${criterion?.description || 'this concept'} with additional practice`;
  });

  steps.push('Revise this project with improvements');
  steps.push('Schedule a review session if needed');

  return steps;
}

// ==================== STORAGE ====================

export function saveProject(project: Project): void {
  const key = `project-${project.id}`;
  localStorage.setItem(key, JSON.stringify(project));
}

export function loadProject(projectId: string): Project | null {
  const key = `project-${projectId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

export function saveSubmission(submission: ProjectSubmission): void {
  const key = `submission-${submission.id}`;
  localStorage.setItem(key, JSON.stringify(submission));
}

export function loadSubmission(submissionId: string): ProjectSubmission | null {
  const key = `submission-${submissionId}`;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  
  const submission: ProjectSubmission = JSON.parse(stored);
  submission.submittedAt = new Date(submission.submittedAt);
  if (submission.evaluation) {
    submission.evaluation.evaluatedAt = new Date(submission.evaluation.evaluatedAt);
  }
  return submission;
}

export function getStudentSubmissions(studentId: string): ProjectSubmission[] {
  const submissions: ProjectSubmission[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('submission-')) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const submission: ProjectSubmission = JSON.parse(stored);
        if (submission.studentId === studentId) {
          submission.submittedAt = new Date(submission.submittedAt);
          if (submission.evaluation) {
            submission.evaluation.evaluatedAt = new Date(submission.evaluation.evaluatedAt);
          }
          submissions.push(submission);
        }
      }
    }
  }
  
  return submissions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}