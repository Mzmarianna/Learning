/**
 * Curriculum-to-Project Mapper
 * Wowl uses this to generate inquiry-based projects from curriculum competencies
 * Dynamically adjusts difficulty based on student mastery
 */

import { Lesson, Level } from './curriculum-data';
import { Competency, Subject, GradeLevel, SkillLevel } from './learning-standards';
import { Project, ProjectPlatform, ScaffoldingSupport, generateProject } from './project-generator';
import { CompetencyMastery, getStudentCompetencies } from './adaptive-learning';

// ==================== CURRICULUM COMPETENCY MAPPING ====================

/**
 * Maps curriculum lessons to learning competencies
 */
export interface LessonCompetencyMapping {
  lessonId: string;
  lessonTitle: string;
  competencyIds: string[];
  suggestedProjects: string[]; // Project template IDs
}

/**
 * Level 1 Math Competency Mappings
 */
export const L1_MATH_COMPETENCIES: LessonCompetencyMapping[] = [
  {
    lessonId: 'L1UM01',
    lessonTitle: 'Count to 10',
    competencyIds: ['counting-1-10', 'number-recognition', 'one-to-one-correspondence'],
    suggestedProjects: ['counting-collection', 'number-poster'],
  },
  {
    lessonId: 'L1UM02',
    lessonTitle: 'Count to 20',
    competencyIds: ['counting-11-20', 'number-sequence', 'skip-counting'],
    suggestedProjects: ['counting-game', 'number-line-build'],
  },
  {
    lessonId: 'L1UM05',
    lessonTitle: 'Addition Basics',
    competencyIds: ['addition-within-10', 'number-bonds', 'problem-solving'],
    suggestedProjects: ['addition-story', 'roblox-treasure-counter'],
  },
  {
    lessonId: 'L1UM08',
    lessonTitle: 'Patterns',
    competencyIds: ['pattern-recognition', 'pattern-extension', 'sequencing'],
    suggestedProjects: ['pattern-builder', 'minecraft-pattern-floor'],
  },
  {
    lessonId: 'L1UM11',
    lessonTitle: 'Shapes',
    competencyIds: ['shape-identification', 'geometry-basics', 'spatial-awareness'],
    suggestedProjects: ['shape-city', 'roblox-shape-museum'],
  },
  {
    lessonId: 'L1UM13',
    lessonTitle: 'Money Counter',
    competencyIds: ['coin-recognition', 'money-counting', 'addition-application'],
    suggestedProjects: ['virtual-store', 'roblox-shop'],
  },
];

/**
 * Level 2 Math Competency Mappings
 */
export const L2_MATH_COMPETENCIES: LessonCompetencyMapping[] = [
  {
    lessonId: 'L2UM01',
    lessonTitle: 'Place Value',
    competencyIds: ['place-value-tens-ones', 'number-composition', 'base-ten'],
    suggestedProjects: ['place-value-house', 'number-breakdown-video'],
  },
  {
    lessonId: 'L2UM03',
    lessonTitle: 'Addition with Regrouping',
    competencyIds: ['addition-regrouping', 'multi-digit-addition', 'carrying'],
    suggestedProjects: ['regrouping-visual', 'addition-story-problem'],
  },
  {
    lessonId: 'L2UM07',
    lessonTitle: 'Time',
    competencyIds: ['telling-time', 'elapsed-time', 'time-word-problems'],
    suggestedProjects: ['daily-schedule', 'minecraft-clock-tower'],
  },
  {
    lessonId: 'L2UM08',
    lessonTitle: 'Data & Graphs',
    competencyIds: ['data-collection', 'graphing', 'data-interpretation'],
    suggestedProjects: ['survey-project', 'roblox-data-display'],
  },
];

/**
 * Level 3 Math Competency Mappings
 */
export const L3_MATH_COMPETENCIES: LessonCompetencyMapping[] = [
  {
    lessonId: 'L3UM01',
    lessonTitle: 'Multiplication Tables',
    competencyIds: ['multiplication-facts', 'skip-counting', 'arrays'],
    suggestedProjects: ['multiplication-video-game', 'roblox-times-table-world'],
  },
  {
    lessonId: 'L3UM05',
    lessonTitle: 'Division Basics',
    competencyIds: ['division-concepts', 'equal-groups', 'division-facts'],
    suggestedProjects: ['sharing-simulation', 'minecraft-division-challenge'],
  },
  {
    lessonId: 'L3UM07',
    lessonTitle: 'Area & Perimeter',
    competencyIds: ['area-calculation', 'perimeter-measurement', 'geometry-application'],
    suggestedProjects: ['garden-design', 'roblox-room-planner'],
  },
  {
    lessonId: 'L3UM10',
    lessonTitle: 'Fractions',
    competencyIds: ['fraction-concepts', 'equivalent-fractions', 'fraction-comparison'],
    suggestedProjects: ['pizza-fraction-shop', 'minecraft-fraction-builder'],
  },
];

// ==================== INQUIRY-BASED PROJECT TEMPLATES ====================

export interface InquiryProjectTemplate {
  id: string;
  title: string;
  description: string;
  drivingQuestion: string; // The inquiry question students investigate
  subject: Subject;
  gradeRange: GradeLevel[];
  competencyIds: string[];
  estimatedTime: number; // minutes
  difficulty: 'foundation' | 'intermediate' | 'advanced';
  platforms: ProjectPlatform[];
  phases: ProjectPhase[];
  scaffoldingByLevel: Record<SkillLevel, ScaffoldingSupport>;
}

export interface ProjectPhase {
  phase: number;
  name: string;
  duration: number; // minutes
  activities: string[];
  deliverables: string[];
}

/**
 * Inquiry-Based Math Projects
 */
export const INQUIRY_MATH_PROJECTS: InquiryProjectTemplate[] = [
  {
    id: 'counting-collection',
    title: 'What Can You Count?',
    description: 'Create a collection of items and count them in different ways',
    drivingQuestion: 'How many different ways can you count and organize a collection?',
    subject: 'math',
    gradeRange: ['K', '1'],
    competencyIds: ['counting-1-10', 'number-recognition', 'grouping'],
    estimatedTime: 30,
    difficulty: 'foundation',
    platforms: [
      { name: 'photo', isPreferred: true, instructions: 'Take photos of your collections' },
      { name: 'video', isPreferred: false, instructions: 'Video yourself counting' },
    ],
    phases: [
      {
        phase: 1,
        name: 'Collect',
        duration: 10,
        activities: ['Find 10 items you want to count', 'Organize them in a way that makes sense to you'],
        deliverables: ['Photo of your collection'],
      },
      {
        phase: 2,
        name: 'Count & Organize',
        duration: 15,
        activities: ['Count your items in different ways (groups, lines, circles)', 'Try skip counting if you can'],
        deliverables: ['Photos showing different arrangements', 'Written numbers'],
      },
      {
        phase: 3,
        name: 'Explain',
        duration: 5,
        activities: ['Explain which counting method was easiest and why'],
        deliverables: ['Short explanation (written or video)'],
      },
    ],
    scaffoldingByLevel: {
      emerging: {
        level: 'emerging',
        hints: [
          'Start with items you can touch and move',
          'Try making groups of 2 or 5',
          'Draw a picture of your count',
        ],
        examples: ['Count toy cars', 'Count blocks', 'Count stuffed animals'],
        resources: ['Counting videos', 'Number chart'],
      },
      developing: {
        level: 'developing',
        hints: [
          'Try multiple grouping strategies',
          'Count the same items in different arrangements',
          'Use skip counting (2s, 5s)',
        ],
        examples: ['Count and regroup items', 'Make arrays', 'Create patterns'],
        resources: ['Skip counting songs', 'Array examples'],
      },
      proficient: {
        level: 'proficient',
        hints: [
          'Count larger collections (20-50 items)',
          'Compare different counting methods',
          'Explain which is most efficient',
        ],
        examples: ['Count large collections', 'Create multiple groupings', 'Analyze efficiency'],
        resources: ['Advanced counting strategies'],
      },
      advanced: {
        level: 'advanced',
        hints: [
          'Count 100+ items using efficient strategies',
          'Teach someone else your counting method',
          'Solve a real counting problem',
        ],
        examples: ['Count classroom supplies', 'Inventory project', 'Counting survey'],
        resources: ['Real-world counting applications'],
      },
    },
  },

  {
    id: 'roblox-treasure-counter',
    title: 'Treasure Island Addition',
    description: 'Build a treasure island in Roblox where players solve addition problems to find treasure',
    drivingQuestion: 'How can addition help you find and count treasure?',
    subject: 'math',
    gradeRange: ['1', '2'],
    competencyIds: ['addition-within-10', 'addition-within-20', 'problem-solving'],
    estimatedTime: 60,
    difficulty: 'intermediate',
    platforms: [
      { name: 'roblox', isPreferred: true, instructions: 'Use Roblox Studio' },
      { name: 'minecraft', isPreferred: false, instructions: 'Build in creative mode' },
    ],
    phases: [
      {
        phase: 1,
        name: 'Design Your Island',
        duration: 20,
        activities: ['Build an island with different areas', 'Hide treasure chests in different locations'],
        deliverables: ['Screenshot of island overview'],
      },
      {
        phase: 2,
        name: 'Create Addition Challenges',
        duration: 25,
        activities: [
          'Create addition problems that give clues to treasure locations',
          'Example: "Find 3 red coins + 4 blue coins = ? treasure chest"',
          'Place signs with your addition problems',
        ],
        deliverables: ['Screenshots of 5+ addition challenges', 'Answer key document'],
      },
      {
        phase: 3,
        name: 'Test & Explain',
        duration: 15,
        activities: [
          'Test your treasure hunt',
          'Explain how addition helps find treasure',
        ],
        deliverables: ['Video walkthrough', 'Written explanation'],
      },
    ],
    scaffoldingByLevel: {
      emerging: {
        level: 'emerging',
        hints: [
          'Use addition within 5 (1+2, 2+3)',
          'Use pictures to show addition',
          'Start with 2-3 treasure locations',
        ],
        examples: ['2+1=3 coins', '3+2=5 gems'],
        resources: ['Addition visual aids', 'Roblox basic building tutorial'],
      },
      developing: {
        level: 'developing',
        hints: [
          'Use addition within 10',
          'Create 5+ treasure challenges',
          'Add some subtraction puzzles too',
        ],
        examples: ['5+4=9 treasure', '7+3=10 coins'],
        resources: ['Addition strategies video', 'Roblox intermediate building'],
      },
      proficient: {
        level: 'proficient',
        hints: [
          'Use addition within 20',
          'Create multi-step problems',
          'Add timer or scoring system',
        ],
        examples: ['12+8=20 points', 'If you find 7, then 6 more, how many total?'],
        resources: ['Multi-step problem examples', 'Roblox scripting basics'],
      },
      advanced: {
        level: 'advanced',
        hints: [
          'Use addition with regrouping',
          'Create complex multi-step treasure hunts',
          'Add Roblox scripts for auto-checking answers',
        ],
        examples: ['Scripted treasure hunt', 'Auto-grading addition quiz'],
        resources: ['Roblox Lua scripting', 'Advanced game design'],
      },
    },
  },

  {
    id: 'garden-design',
    title: 'Design a Garden',
    description: 'Plan and design a garden using area, perimeter, and measurement',
    drivingQuestion: 'How can math help you design the perfect garden?',
    subject: 'math',
    gradeRange: ['3', '4', '5'],
    competencyIds: ['area-calculation', 'perimeter-measurement', 'measurement', 'fractions'],
    estimatedTime: 90,
    difficulty: 'intermediate',
    platforms: [
      { name: 'roblox', isPreferred: true },
      { name: 'minecraft', isPreferred: false },
      { name: 'canva', isPreferred: false },
      { name: 'photo', isPreferred: false },
    ],
    phases: [
      {
        phase: 1,
        name: 'Research & Plan',
        duration: 20,
        activities: [
          'Decide what to grow (flowers, vegetables, herbs)',
          'Research spacing requirements',
          'Sketch your garden layout',
        ],
        deliverables: ['Garden sketch with measurements'],
      },
      {
        phase: 2,
        name: 'Calculate',
        duration: 30,
        activities: [
          'Calculate area of each garden bed',
          'Calculate perimeter for fencing',
          'Calculate plant spacing (use fractions/division)',
          'Determine how many plants fit',
        ],
        deliverables: ['Math calculations document', 'Show all work'],
      },
      {
        phase: 3,
        name: 'Build',
        duration: 30,
        activities: [
          'Build your garden in Roblox/Minecraft/Canva',
          'Label measurements clearly',
          'Add plants with correct spacing',
        ],
        deliverables: ['Screenshots of garden (top view & side view)', 'Labels showing measurements'],
      },
      {
        phase: 4,
        name: 'Present',
        duration: 10,
        activities: ['Explain your math choices', 'What would you change?'],
        deliverables: ['Short presentation (video or written)'],
      },
    ],
    scaffoldingByLevel: {
      emerging: {
        level: 'emerging',
        hints: [
          'Start with simple rectangles',
          'Use whole numbers for measurements',
          'Calculate area of 1-2 garden beds',
        ],
        examples: ['4x6 bed = 24 square feet', 'Perimeter = 4+6+4+6 = 20 feet'],
        resources: ['Area and perimeter videos', 'Simple garden examples'],
      },
      developing: {
        level: 'developing',
        hints: [
          'Use multiple garden beds',
          'Include different shapes (rectangles, squares)',
          'Calculate total area of multiple beds',
        ],
        examples: ['3 beds: 24 + 16 + 20 = 60 sq ft total'],
        resources: ['Composite area tutorials'],
      },
      proficient: {
        level: 'proficient',
        hints: [
          'Use complex shapes (L-shapes, circular beds)',
          'Calculate plant spacing with fractions',
          'Include a budget (cost per square foot)',
        ],
        examples: ['Circular bed area = πr²', 'Plants every 1.5 feet'],
        resources: ['Circle area formulas', 'Fraction spacing'],
      },
      advanced: {
        level: 'advanced',
        hints: [
          'Design a full yard layout',
          'Include pathways (subtract from total area)',
          'Optimize for max plants in limited space',
          'Calculate soil volume needed (3D)',
        ],
        examples: ['Volume of raised beds', 'Optimization problems'],
        resources: ['3D geometry', 'Optimization strategies'],
      },
    },
  },

  {
    id: 'roblox-times-table-world',
    title: 'Multiplication World',
    description: 'Build a world in Roblox where everything represents multiplication facts',
    drivingQuestion: 'How can you visualize multiplication to make it easier to understand?',
    subject: 'math',
    gradeRange: ['3', '4'],
    competencyIds: ['multiplication-facts', 'arrays', 'skip-counting'],
    estimatedTime: 75,
    difficulty: 'intermediate',
    platforms: [
      { name: 'roblox', isPreferred: true },
      { name: 'minecraft', isPreferred: false },
    ],
    phases: [
      {
        phase: 1,
        name: 'Choose Your Times Tables',
        duration: 10,
        activities: ['Pick 3-5 times tables to focus on (2x, 3x, 5x, etc.)'],
        deliverables: ['List of chosen times tables'],
      },
      {
        phase: 2,
        name: 'Design Visual Representations',
        duration: 30,
        activities: [
          'Build arrays for each multiplication fact',
          'Example: 3x4 = build a 3-row by 4-column array of blocks',
          'Create at least 5 arrays per times table',
          'Add signs showing the equation',
        ],
        deliverables: ['Screenshots of arrays', 'Signs showing equations'],
      },
      {
        phase: 3,
        name: 'Create a Challenge',
        duration: 25,
        activities: [
          'Add a quiz area where players solve multiplication',
          'Hide answers around your world',
          'Make it interactive',
        ],
        deliverables: ['Video tour of your world', 'Challenge quiz document'],
      },
      {
        phase: 4,
        name: 'Reflect',
        duration: 10,
        activities: ['Which times table was easiest to build? Why?', 'What patterns did you notice?'],
        deliverables: ['Written reflection'],
      },
    ],
    scaffoldingByLevel: {
      emerging: {
        level: 'emerging',
        hints: [
          'Start with 2x, 5x, and 10x tables (easier patterns)',
          'Build small arrays (up to 5)',
          'Use clear labels',
        ],
        examples: ['2x3 = 6 blocks in a 2x3 array'],
        resources: ['Skip counting songs', 'Array visual examples'],
      },
      developing: {
        level: 'developing',
        hints: [
          'Include 3x, 4x tables',
          'Build arrays up to 10',
          'Show the relationship between arrays',
        ],
        examples: ['Show how 3x4 and 4x3 are the same (commutative)'],
        resources: ['Multiplication strategies', 'Array patterns'],
      },
      proficient: {
        level: 'proficient',
        hints: [
          'Include all times tables 1-10',
          'Create connections between facts (3x4 = 3x2 + 3x2)',
          'Add a timed challenge',
        ],
        examples: ['Fact families', 'Doubling strategies'],
        resources: ['Multiplication fact strategies'],
      },
      advanced: {
        level: 'advanced',
        hints: [
          'Include times tables up to 12x12',
          'Add Roblox scripts for auto-checking',
          'Create a multiplayer quiz game',
        ],
        examples: ['Scripted quiz system', 'Leaderboard'],
        resources: ['Roblox scripting for math games'],
      },
    },
  },
];

// ==================== DYNAMIC PROJECT GENERATOR ====================

/**
 * Generate an inquiry-based project for a student based on their current competencies
 */
export function generateInquiryProject(
  studentId: string,
  subject: Subject,
  currentLesson?: Lesson,
  studentMastery?: CompetencyMastery[]
): InquiryProjectTemplate | null {
  // Get student's current competencies
  const competencies = getStudentCompetencies(studentId);
  
  // Determine student's skill level
  const avgMastery = studentMastery 
    ? studentMastery.reduce((sum, m) => sum + m.successRate, 0) / studentMastery.length 
    : 50;
  
  const skillLevel: SkillLevel = 
    avgMastery >= 90 ? 'advanced' :
    avgMastery >= 70 ? 'proficient' :
    avgMastery >= 50 ? 'developing' : 'emerging';

  // Find matching inquiry projects
  let matchingProjects: InquiryProjectTemplate[] = [];

  if (subject === 'math') {
    matchingProjects = INQUIRY_MATH_PROJECTS.filter(project => {
      // Check if project matches student's competencies
      const hasMatchingCompetency = project.competencyIds.some(compId => 
        competencies.some(c => c.id === compId)
      );
      return hasMatchingCompetency;
    });
  }

  if (matchingProjects.length === 0) {
    return null;
  }

  // Pick project based on difficulty and student level
  const appropriateProjects = matchingProjects.filter(project => {
    if (skillLevel === 'emerging' && project.difficulty === 'foundation') return true;
    if (skillLevel === 'developing' && (project.difficulty === 'foundation' || project.difficulty === 'intermediate')) return true;
    if (skillLevel === 'proficient' && project.difficulty === 'intermediate') return true;
    if (skillLevel === 'advanced' && (project.difficulty === 'intermediate' || project.difficulty === 'advanced')) return true;
    return false;
  });

  if (appropriateProjects.length === 0) {
    // Fall back to any matching project
    return matchingProjects[0];
  }

  // Return a random appropriate project
  return appropriateProjects[Math.floor(Math.random() * appropriateProjects.length)];
}

/**
 * Get scaffolding for a student based on their skill level
 */
export function getProjectScaffolding(
  project: InquiryProjectTemplate,
  studentMastery?: CompetencyMastery[]
): ScaffoldingSupport {
  const avgMastery = studentMastery 
    ? studentMastery.reduce((sum, m) => sum + m.successRate, 0) / studentMastery.length 
    : 50;
  
  const skillLevel: SkillLevel = 
    avgMastery >= 90 ? 'advanced' :
    avgMastery >= 70 ? 'proficient' :
    avgMastery >= 50 ? 'developing' : 'emerging';

  return project.scaffoldingByLevel[skillLevel];
}

/**
 * Convert InquiryProjectTemplate to regular Project format
 */
export function inquiryToProject(
  inquiryTemplate: InquiryProjectTemplate,
  studentMastery?: CompetencyMastery[]
): Project {
  const scaffolding = getProjectScaffolding(inquiryTemplate, studentMastery);

  return {
    id: inquiryTemplate.id,
    title: inquiryTemplate.title,
    description: inquiryTemplate.description,
    competencies: inquiryTemplate.competencyIds,
    subject: inquiryTemplate.subject,
    gradeLevel: inquiryTemplate.gradeRange[0], // Use first grade in range
    estimatedTime: inquiryTemplate.estimatedTime,
    difficulty: inquiryTemplate.difficulty,
    platforms: inquiryTemplate.platforms,
    deliverables: inquiryTemplate.phases.flatMap(phase => 
      phase.deliverables.map((d, idx) => ({
        type: guessDeliverableType(d),
        description: d,
        required: idx === 0, // First deliverable per phase is required
      }))
    ),
    evaluationCriteria: inquiryTemplate.competencyIds.map((compId, idx) => ({
      id: `criterion-${idx}`,
      competencyId: compId,
      description: `Demonstrates ${compId.replace(/-/g, ' ')}`,
      points: Math.floor(100 / inquiryTemplate.competencyIds.length),
      examples: {
        excellent: 'Strong demonstration of mastery',
        good: 'Shows understanding',
        needsWork: 'Needs more practice',
      },
    })),
    wowlPrompt: `${inquiryTemplate.drivingQuestion}\n\n${inquiryTemplate.description}`,
    exampleIdeas: scaffolding.examples,
    scaffolding,
  };
}

function guessDeliverableType(description: string): 'screenshot' | 'video' | 'link' | 'photo' | 'document' {
  const lower = description.toLowerCase();
  if (lower.includes('screenshot')) return 'screenshot';
  if (lower.includes('video')) return 'video';
  if (lower.includes('photo')) return 'photo';
  if (lower.includes('link')) return 'link';
  return 'document';
}