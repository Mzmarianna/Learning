/**
 * ⚔️ WARRIORS CURRICULUM (6th-8th Grade)
 * 16-Week Comprehensive Curriculum for Ages 12-18
 * 
 * Skill Focus: 6th-8th grade competencies
 * UI Theme: Mature gaming interface with clans, strategic missions, leadership
 * Design Philosophy: Direct, strategic tone. Respect intelligence and autonomy.
 * 
 * WEEKLY SCHEDULE:
 * Monday = Math
 * Tuesday = Reading
 * Wednesday = Writing
 * Thursday = STEAM
 * Friday = Executive Function
 */

import { GradeLevel } from '../learning-standards';

// ============================================================================
// TYPES
// ============================================================================

export interface WarriorQuest {
  week: number;
  questId: string;
  theme: string;
  badge: {
    name: string;
    icon: string;
    color: string;
  };
  handsOnProject: {
    title: string;
    description: string;
    submissionType: 'text' | 'image' | 'video' | 'digital' | 'multiple';
    estimatedHours: number;
  };
  steamFocus: {
    topic: string;
    concepts: string[];
    gradeLevel: GradeLevel;
  };
  mathFocus: {
    topic: string;
    ccssStandards: string[];
    gradeLevel: GradeLevel;
  };
  readingWritingFocus: {
    topic: string;
    genre: string;
    ccssStandards: string[];
    gradeLevel: GradeLevel;
  };
  challenges: WarriorChallenge[];
  totalXP: number;
  estimatedWeeks: number;
}

export interface WarriorChallenge {
  challengeId: string;
  challengeNumber: number; // 1-5 per quest
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  title: string;
  subject: 'Math' | 'Reading' | 'Writing' | 'STEAM' | 'Executive Function';
  description: string;
  instructions: string[];
  masteryRequirements: string[];
  submissionType: 'text' | 'image' | 'video' | 'screenshot' | 'multiple' | 'digital';
  xpReward: number;
  estimatedMinutes: number;
  ccssStandards?: string[];
  materials?: string[];
}

// ============================================================================
// 16-WEEK WARRIORS CURRICULUM
// ============================================================================

export const WARRIORS_CURRICULUM: WarriorQuest[] = [
  // ========== WEEK 1: KINGDOM FOUNDATIONS ==========
  {
    week: 1,
    questId: 'WA-W1-FOUNDATIONS',
    theme: 'Kingdom Foundations',
    badge: {
      name: 'Strategic Thinker',
      icon: '🧠',
      color: '#8B5CF6',
    },
    handsOnProject: {
      title: 'Design Your Learning Strategy',
      description: 'Create a personalized 16-week learning plan using SMART goals and self-assessment data',
      submissionType: 'digital',
      estimatedHours: 2,
    },
    steamFocus: {
      topic: 'Scientific Method & Experimental Design',
      concepts: ['Variables', 'Controls', 'Data Collection', 'Analysis'],
      gradeLevel: '6',
    },
    mathFocus: {
      topic: 'Pre-Algebra Foundations',
      ccssStandards: ['CCSS.MATH.6.EE.A.2', 'CCSS.MATH.6.EE.B.6'],
      gradeLevel: '6',
    },
    readingWritingFocus: {
      topic: 'Argumentative Writing',
      genre: 'Persuasive/Argumentative',
      ccssStandards: ['CCSS.ELA-LITERACY.W.6.1', 'CCSS.ELA-LITERACY.RI.6.8'],
      gradeLevel: '6',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W1-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Variables in the Real World',
        subject: 'Math',
        description: 'Translate real-world scenarios into algebraic expressions',
        instructions: [
          'Read 5 word problems involving unknown quantities',
          'Define variables for each unknown (e.g., let x = number of hours)',
          'Write algebraic expressions representing each scenario',
          'Create your own word problem with a solution key',
        ],
        masteryRequirements: [
          'Correctly defines variables for all scenarios',
          'Translates words into accurate algebraic expressions',
          'Original word problem is solvable and clear',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
        ccssStandards: ['CCSS.MATH.6.EE.A.2'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W1-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Analyze Argument Structure',
        subject: 'Reading',
        description: 'Break down a persuasive article to identify claims, evidence, and reasoning',
        instructions: [
          'Read a persuasive op-ed or argumentative article',
          'Highlight the main claim/thesis',
          'Identify 3 pieces of supporting evidence',
          'Explain how the author uses evidence to support the claim',
          'Evaluate: Is the argument convincing? Why or why not?',
        ],
        masteryRequirements: [
          'Correctly identifies the main claim',
          'Locates relevant supporting evidence',
          'Explains the connection between evidence and claim',
          'Provides a thoughtful evaluation',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.ELA-LITERACY.RI.6.8', 'CCSS.ELA-LITERACY.RI.7.8'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W1-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Craft a Thesis Statement',
        subject: 'Writing',
        description: 'Learn to write strong, arguable thesis statements for persuasive essays',
        instructions: [
          'Review 5 sample thesis statements (strong vs. weak)',
          'Identify what makes a thesis arguable and specific',
          'Choose a debatable topic (e.g., "Should schools start later?")',
          'Write 3 different thesis statements for your topic',
          'Get peer feedback and revise your strongest thesis',
        ],
        masteryRequirements: [
          'Thesis is specific and arguable (not a fact)',
          'Previews the main argument clearly',
          'Uses precise, academic language',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 40,
        ccssStandards: ['CCSS.ELA-LITERACY.W.6.1.A'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W1-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Design a Controlled Experiment',
        subject: 'STEAM',
        description: 'Create and execute a controlled experiment testing a hypothesis of your choice',
        instructions: [
          'Choose a testable question (e.g., "Does music affect concentration during math?")',
          'Identify independent, dependent, and control variables',
          'Design a procedure with at least 3 trials',
          'Collect quantitative data',
          'Analyze results and draw evidence-based conclusions',
        ],
        masteryRequirements: [
          'Clearly identifies all variables (independent, dependent, control)',
          'Procedure is repeatable and scientifically sound',
          'Data collection is systematic and quantitative',
          'Conclusion is supported by evidence',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
        ccssStandards: ['MS-ETS1-1', 'MS-ETS1-2'],
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W1-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Strategic Goal Setting',
        subject: 'Executive Function',
        description: 'Use data and self-reflection to set SMART academic goals',
        instructions: [
          'Analyze your quiz results: What are your strengths? Growth areas?',
          'Set 3 SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)',
          'Create a strategic action plan: What will you DO to reach each goal?',
          'Design a weekly tracker to measure progress',
        ],
        masteryRequirements: [
          'Goals are SMART and based on data',
          'Action plan is specific and realistic',
          'Tracker includes measurable metrics',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 45,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 2: MEDIEVAL ECONOMICS ==========
  {
    week: 2,
    questId: 'WA-W2-ECONOMICS',
    theme: 'Medieval Economics',
    badge: {
      name: 'Kingdom Economist',
      icon: '💰',
      color: '#F59E0B',
    },
    handsOnProject: {
      title: 'Design a Medieval Economy Simulation',
      description: 'Create a working economic model with trade, currency, and supply/demand',
      submissionType: 'digital',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Economics & Systems Thinking',
      concepts: ['Supply & Demand', 'Market Forces', 'Resource Management'],
      gradeLevel: '7',
    },
    mathFocus: {
      topic: 'Ratios & Proportions',
      ccssStandards: ['CCSS.MATH.6.RP.A.3', 'CCSS.MATH.7.RP.A.2'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Informational Text & Persuasion',
      genre: 'Persuasive Letter',
      ccssStandards: ['CCSS.ELA-LITERACY.W.7.1', 'CCSS.ELA-LITERACY.RI.7.2'],
      gradeLevel: '7',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W2-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Ratios & Proportions Master',
        subject: 'Math',
        description: 'Solve real-world problems using ratios and cross-multiplication',
        instructions: [
          'Complete 10 ratio problems (e.g., recipe conversions, map scales)',
          'Solve 5 proportion problems using cross-multiplication',
          'Create a real-world scenario requiring proportional reasoning',
          'Explain your solution process step-by-step',
        ],
        masteryRequirements: [
          'All ratios and proportions solved correctly',
          'Shows work using cross-multiplication',
          'Real-world scenario is authentic and solvable',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.6.RP.A.3', 'CCSS.MATH.7.RP.A.2'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W2-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Analyze Economic Texts',
        subject: 'Reading',
        description: 'Read and analyze an informational article about medieval trade',
        instructions: [
          'Read an article about medieval economics or trade routes',
          'Identify the main idea and 3 supporting details',
          'Summarize the key concepts in your own words',
          'Compare medieval economics to modern systems',
        ],
        masteryRequirements: [
          'Correctly identifies main idea',
          'Supporting details are relevant and accurate',
          'Summary demonstrates comprehension',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 40,
        ccssStandards: ['CCSS.ELA-LITERACY.RI.7.2'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W2-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Persuasive Letter to the King',
        subject: 'Writing',
        description: 'Write a formal persuasive letter proposing an economic policy',
        instructions: [
          'Choose an economic issue (e.g., fair trade laws, tax policy)',
          'Write a formal letter to a fictional king proposing a solution',
          'Include: formal greeting, clear claim, 3 reasons with evidence, conclusion',
          'Use persuasive techniques (ethos, pathos, logos)',
        ],
        masteryRequirements: [
          'Letter follows formal structure',
          'Claim is clear and supported by evidence',
          'Uses persuasive language effectively',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
        ccssStandards: ['CCSS.ELA-LITERACY.W.7.1'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W2-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Supply & Demand Simulation',
        subject: 'STEAM',
        description: 'Create a simulation showing how supply and demand affect prices',
        instructions: [
          'Design a simple market with 1 product (e.g., bread)',
          'Create scenarios: high supply/low demand, low supply/high demand',
          'Track price changes and explain why',
          'Present findings in a graph or visual model',
        ],
        masteryRequirements: [
          'Simulation accurately models supply/demand relationship',
          'Price changes are justified by economic principles',
          'Visual presentation is clear and labeled',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 45,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W2-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Budget Your Kingdom',
        subject: 'Executive Function',
        description: 'Create a realistic budget for a fictional kingdom',
        instructions: [
          'Design a kingdom with specific needs (army, food, construction)',
          'Allocate a fixed budget (e.g., 10,000 gold pieces)',
          'Justify each spending decision',
          'Create a visual budget breakdown (pie chart or spreadsheet)',
        ],
        masteryRequirements: [
          'Budget adds up correctly',
          'Spending decisions are justified',
          'Visual is clear and accurate',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 50,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 3: ENGINEERING MARVELS ==========
  {
    week: 3,
    questId: 'WA-W3-ENGINEERING',
    theme: 'Engineering Marvels',
    badge: {
      name: 'Master Builder',
      icon: '🏗️',
      color: '#3B82F6',
    },
    handsOnProject: {
      title: 'Design & Build a Load-Bearing Bridge',
      description: 'Engineer a bridge that holds maximum weight using minimal materials',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Structural Engineering',
      concepts: ['Load Distribution', 'Tension & Compression', 'Material Properties'],
      gradeLevel: '7',
    },
    mathFocus: {
      topic: 'Geometry & Measurement',
      ccssStandards: ['CCSS.MATH.7.G.B.6', 'CCSS.MATH.6.G.A.1'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Technical Writing',
      genre: 'Procedural/Technical',
      ccssStandards: ['CCSS.ELA-LITERACY.W.7.2', 'CCSS.ELA-LITERACY.W.7.4'],
      gradeLevel: '7',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W3-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Calculate Castle Dimensions',
        subject: 'Math',
        description: 'Use area, volume, and scale to design castle components',
        instructions: [
          'Calculate the area of 5 different castle floor plans',
          'Calculate volume of 3D structures (towers, dungeons)',
          'Create a scale drawing (e.g., 1 inch = 10 feet)',
          'Solve a word problem about castle construction',
        ],
        masteryRequirements: [
          'All calculations are accurate',
          'Scale drawing is proportional and labeled',
          'Shows understanding of area vs. volume',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.7.G.B.6', 'CCSS.MATH.6.G.A.1'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W3-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Analyze Engineering Diagrams',
        subject: 'Reading',
        description: 'Read technical diagrams and blueprints to understand structures',
        instructions: [
          'Study 3 engineering diagrams (bridge, building, machine)',
          'Identify key components and their functions',
          'Write a summary of how the structure works',
          'Compare 2 different bridge designs',
        ],
        masteryRequirements: [
          'Correctly identifies structural components',
          'Explanation shows technical understanding',
          'Comparison is detailed and accurate',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 40,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W3-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write a Technical Procedure',
        subject: 'Writing',
        description: 'Create step-by-step instructions for building something',
        instructions: [
          'Choose a simple structure to build (e.g., paper bridge)',
          'Write numbered, sequential instructions',
          'Include a materials list and diagrams',
          'Test your instructions with someone else',
        ],
        masteryRequirements: [
          'Instructions are clear and sequential',
          'Materials list is complete',
          'Someone else can follow the instructions successfully',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
        ccssStandards: ['CCSS.ELA-LITERACY.W.7.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W3-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Bridge Building Challenge',
        subject: 'STEAM',
        description: 'Design and build a bridge that holds the most weight',
        instructions: [
          'Research bridge types (beam, arch, suspension, truss)',
          'Design your bridge on paper with labeled parts',
          'Build using limited materials (popsicle sticks, paper, tape)',
          'Test load capacity and document results',
        ],
        masteryRequirements: [
          'Bridge design shows engineering principles',
          'Structure successfully holds weight',
          'Testing data is recorded and analyzed',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 90,
        materials: ['Popsicle sticks', 'Glue/tape', 'Weights for testing'],
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W3-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Design Your Castle',
        subject: 'Executive Function',
        description: 'Plan a complete castle design with strategic defensive features',
        instructions: [
          'Research medieval castle architecture',
          'Create a floor plan with labeled rooms',
          'Justify each design choice (defense, function, aesthetics)',
          'Present your castle design with a 3D model or digital rendering',
        ],
        masteryRequirements: [
          'Design is functional and defensible',
          'Choices are clearly justified',
          'Presentation is professional and complete',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 60,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 4: CHEMICAL KINGDOMS ==========
  {
    week: 4,
    questId: 'WA-W4-CHEMISTRY',
    theme: 'Chemical Kingdoms',
    badge: {
      name: 'Alchemist',
      icon: '⚗️',
      color: '#10B981',
    },
    handsOnProject: {
      title: 'Chemistry Lab: Acids vs. Bases Investigation',
      description: 'Conduct experiments testing household substances and create pH scale',
      submissionType: 'video',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Chemistry Fundamentals',
      concepts: ['Acids & Bases', 'pH Scale', 'Chemical Reactions', 'Lab Safety'],
      gradeLevel: '7',
    },
    mathFocus: {
      topic: 'Ratios in Chemistry',
      ccssStandards: ['CCSS.MATH.7.RP.A.1', 'CCSS.MATH.7.RP.A.3'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Scientific Writing',
      genre: 'Lab Report',
      ccssStandards: ['CCSS.ELA-LITERACY.W.7.2', 'CCSS.ELA-LITERACY.RST.6-8.3'],
      gradeLevel: '7',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W4-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Chemical Ratio Problems',
        subject: 'Math',
        description: 'Solve ratio problems related to chemical mixtures and dilution',
        instructions: [
          'Solve 5 mixture problems (e.g., diluting solutions)',
          'Calculate ratios in chemical formulas (H₂O = 2:1 ratio)',
          'Create a concentration problem with solution',
          'Explain how ratios apply to chemistry',
        ],
        masteryRequirements: [
          'All ratio calculations are correct',
          'Shows understanding of concentration',
          'Explanation connects math to science',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
        ccssStandards: ['CCSS.MATH.7.RP.A.1'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W4-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Periodic Table Explorer',
        subject: 'Reading',
        description: 'Read about elements and interpret the periodic table',
        instructions: [
          'Research 3 elements (properties, uses, history)',
          'Learn to read the periodic table (atomic number, mass, groups)',
          'Summarize how elements combine to form compounds',
          'Create a visual guide to your favorite element',
        ],
        masteryRequirements: [
          'Element research is accurate and detailed',
          'Shows understanding of periodic table organization',
          'Visual guide is informative',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W4-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write a Lab Report',
        subject: 'Writing',
        description: 'Document a science experiment using proper lab report format',
        instructions: [
          'Choose an experiment (real or from a video)',
          'Write sections: Hypothesis, Materials, Procedure, Results, Conclusion',
          'Include data table or graph',
          'Follow scientific writing conventions (objective, past tense)',
        ],
        masteryRequirements: [
          'All lab report sections are present',
          'Writing is clear, objective, and scientific',
          'Data is organized and labeled',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.ELA-LITERACY.W.7.2', 'CCSS.ELA-LITERACY.RST.6-8.3'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W4-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Acids vs. Bases Lab',
        subject: 'STEAM',
        description: 'Test household substances to determine if they are acidic or basic',
        instructions: [
          'Gather 10 household substances (lemon juice, soap, baking soda, etc.)',
          'Test each with pH strips or red cabbage indicator',
          'Record results on a pH scale (0-14)',
          'Analyze patterns: What makes something acidic vs. basic?',
        ],
        masteryRequirements: [
          'Tests at least 10 substances',
          'Results are recorded accurately',
          'Analysis shows understanding of pH',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 60,
        materials: ['pH strips or red cabbage', 'Household substances', 'Safety goggles'],
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W4-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Design a Chemical Experiment',
        subject: 'Executive Function',
        description: 'Plan an original chemistry experiment from hypothesis to procedure',
        instructions: [
          'Choose a testable chemistry question',
          'Write a detailed experimental plan',
          'Identify variables and controls',
          'Create a materials list and safety plan',
        ],
        masteryRequirements: [
          'Experiment is scientifically sound',
          'Plan is detailed and executable',
          'Safety considerations are included',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 5: ALGEBRA QUEST ==========
  {
    week: 5,
    questId: 'WA-W5-ALGEBRA',
    theme: 'Algebra Quest',
    badge: {
      name: 'Equation Master',
      icon: '∑',
      color: '#6366F1',
    },
    handsOnProject: {
      title: 'Code an Algebraic Calculator',
      description: 'Build a simple calculator that solves equations step-by-step',
      submissionType: 'digital',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Programming & Logic',
      concepts: ['Algorithms', 'Variables', 'Functions', 'Debugging'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Multi-Step Equations',
      ccssStandards: ['CCSS.MATH.8.EE.C.7', 'CCSS.MATH.7.EE.A.1'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Mathematical Explanation',
      genre: 'Expository',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W5-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Multi-Step Equation Master',
        subject: 'Math',
        description: 'Solve complex algebraic equations with multiple operations',
        instructions: [
          'Solve 10 multi-step equations (e.g., 3(x + 2) - 5 = 16)',
          'Show all work: distribute, combine like terms, isolate variable',
          'Check your solutions by substituting back',
          'Create your own multi-step equation with solution',
        ],
        masteryRequirements: [
          'All equations solved correctly',
          'Work is shown step-by-step',
          'Solutions are verified',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.8.EE.C.7'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W5-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Translate Word Problems',
        subject: 'Reading',
        description: 'Read and interpret complex word problems requiring algebra',
        instructions: [
          'Read 5 challenging word problems',
          'Identify key information and what the variable represents',
          'Translate into algebraic equations',
          'Solve and check reasonableness of answers',
        ],
        masteryRequirements: [
          'Correctly identifies variables',
          'Translations are accurate',
          'Solutions make sense in context',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W5-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Explain Your Solution',
        subject: 'Writing',
        description: 'Write a clear mathematical explanation of your problem-solving process',
        instructions: [
          'Choose a complex algebra problem',
          'Solve it step-by-step',
          'Write a paragraph explaining EACH step and WHY you did it',
          'Use precise mathematical vocabulary',
        ],
        masteryRequirements: [
          'Explanation is clear and complete',
          'Uses mathematical terminology correctly',
          'Justifies each step logically',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 40,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W5-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Code an Algebraic Calculator',
        subject: 'STEAM',
        description: 'Build a simple program that solves linear equations',
        instructions: [
          'Choose a coding platform (Scratch, Python, JavaScript)',
          'Create a program that accepts an equation input',
          'Program solves for x and shows the answer',
          'Test with at least 5 different equations',
        ],
        masteryRequirements: [
          'Program runs without errors',
          'Correctly solves test equations',
          'Code is commented and organized',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W5-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Algebra in Your Life',
        subject: 'Executive Function',
        description: 'Identify and solve real-world problems using algebra',
        instructions: [
          'Find 3 real-life scenarios where algebra is useful',
          'Create word problems from these scenarios',
          'Solve each using algebraic methods',
          'Reflect: When will YOU use algebra in the future?',
        ],
        masteryRequirements: [
          'Scenarios are authentic and realistic',
          'Problems are correctly formulated',
          'Reflection shows deeper understanding',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 6: LITERARY LEGENDS ==========
  {
    week: 6,
    questId: 'WA-W6-LITERATURE',
    theme: 'Literary Legends',
    badge: {
      name: 'Story Analyst',
      icon: '📚',
      color: '#EC4899',
    },
    handsOnProject: {
      title: 'Literary Analysis Essay',
      description: 'Analyze theme, character development, and symbolism in a novel',
      submissionType: 'text',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Media Analysis',
      concepts: ['Narrative Structure', 'Visual Storytelling', 'Symbolism'],
      gradeLevel: '7',
    },
    mathFocus: {
      topic: 'Statistics in Literature',
      ccssStandards: ['CCSS.MATH.7.SP.A.1'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Literary Analysis',
      genre: 'Analytical Essay',
      ccssStandards: ['CCSS.ELA-LITERACY.RL.7.2', 'CCSS.ELA-LITERACY.W.7.2'],
      gradeLevel: '7',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W6-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Statistical Analysis of Literature',
        subject: 'Math',
        description: 'Use statistics to analyze patterns in a text',
        instructions: [
          'Choose a novel or short story',
          'Count frequency of key words or themes',
          'Calculate mean, median, mode of chapter lengths',
          'Create a graph showing your findings',
        ],
        masteryRequirements: [
          'Data collection is accurate',
          'Statistics are calculated correctly',
          'Graph is clear and labeled',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
        ccssStandards: ['CCSS.MATH.7.SP.A.1'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W6-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Character Analysis Deep Dive',
        subject: 'Reading',
        description: 'Analyze character development throughout a story',
        instructions: [
          'Choose a complex character from your reading',
          'Track character changes from beginning to end',
          'Find 3 key moments that reveal character traits',
          'Analyze: What motivates this character? How do they grow?',
        ],
        masteryRequirements: [
          'Analysis shows deep understanding',
          'Evidence is specific and relevant',
          'Explains character motivation clearly',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.ELA-LITERACY.RL.7.3'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W6-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write a Literary Analysis Essay',
        subject: 'Writing',
        description: 'Compose a formal essay analyzing theme in literature',
        instructions: [
          'Choose a theme from your novel (e.g., courage, identity)',
          'Write a thesis statement about how the theme develops',
          'Include 3 body paragraphs with evidence from the text',
          'Write introduction and conclusion',
        ],
        masteryRequirements: [
          'Thesis is clear and arguable',
          'Evidence supports thesis',
          'Essay follows analytical structure',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
        ccssStandards: ['CCSS.ELA-LITERACY.W.7.2', 'CCSS.ELA-LITERACY.RL.7.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W6-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Analyze Storytelling Across Media',
        subject: 'STEAM',
        description: 'Compare how a story is told in book vs. film/graphic novel',
        instructions: [
          'Choose a story available in multiple formats',
          'Watch/read both versions',
          'Compare storytelling techniques (visual, pacing, details)',
          'Analyze: What are strengths of each medium?',
        ],
        masteryRequirements: [
          'Comparison is detailed and specific',
          'Identifies unique strengths of each medium',
          'Analysis shows critical thinking',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W6-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Create Your Own Legend',
        subject: 'Executive Function',
        description: 'Design an original story using literary techniques you\'ve learned',
        instructions: [
          'Create a character with depth and motivation',
          'Design a plot with conflict and resolution',
          'Include a central theme',
          'Write the opening scene (500+ words)',
        ],
        masteryRequirements: [
          'Story has clear theme',
          'Character is well-developed',
          'Writing shows literary techniques',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 70,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 7: ECOSYSTEM WARFARE ==========
  {
    week: 7,
    questId: 'WA-W7-ECOLOGY',
    theme: 'Ecosystem Warfare',
    badge: {
      name: 'Ecosystem Defender',
      icon: '🌿',
      color: '#059669',
    },
    handsOnProject: {
      title: 'Local Ecosystem Field Study',
      description: 'Map and analyze a local food web and propose conservation strategies',
      submissionType: 'multiple',
      estimatedHours: 5,
    },
    steamFocus: {
      topic: 'Ecology & Environmental Science',
      concepts: ['Food Webs', 'Energy Flow', 'Population Dynamics', 'Conservation'],
      gradeLevel: '7',
    },
    mathFocus: {
      topic: 'Percentages & Population Growth',
      ccssStandards: ['CCSS.MATH.7.RP.A.3', 'CCSS.MATH.6.RP.A.3'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Environmental Persuasion',
      genre: 'Persuasive Essay',
      ccssStandards: ['CCSS.ELA-LITERACY.W.7.1', 'CCSS.ELA-LITERACY.RI.7.9'],
      gradeLevel: '7',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W7-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Population Math',
        subject: 'Math',
        description: 'Calculate population growth and decline using percentages',
        instructions: [
          'Solve 5 population growth problems (e.g., if a population grows 15% per year...)',
          'Calculate percentage change for endangered species data',
          'Create a word problem about ecosystem populations',
          'Graph population changes over time',
        ],
        masteryRequirements: [
          'All percentage calculations are correct',
          'Graph accurately represents data',
          'Shows understanding of growth rates',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.7.RP.A.3'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W7-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Analyze Environmental Data',
        subject: 'Reading',
        description: 'Interpret scientific data about ecosystems and climate',
        instructions: [
          'Read graphs/charts about ecosystem health',
          'Identify trends and patterns in the data',
          'Summarize key findings',
          'Make predictions based on current data',
        ],
        masteryRequirements: [
          'Accurately interprets data',
          'Identifies relevant trends',
          'Predictions are logical and justified',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W7-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Persuasive Environmental Essay',
        subject: 'Writing',
        description: 'Write an essay advocating for environmental action',
        instructions: [
          'Choose an environmental issue (deforestation, pollution, climate change)',
          'Research facts and statistics',
          'Write a persuasive essay with clear argument',
          'Include call to action',
        ],
        masteryRequirements: [
          'Argument is supported by credible evidence',
          'Uses persuasive techniques effectively',
          'Call to action is specific and realistic',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 70,
        ccssStandards: ['CCSS.ELA-LITERACY.W.7.1'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W7-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Map Your Local Food Web',
        subject: 'STEAM',
        description: 'Create a detailed food web diagram for a local ecosystem',
        instructions: [
          'Choose a local ecosystem (park, backyard, pond)',
          'Research or observe at least 10 species',
          'Create a food web showing energy flow',
          'Identify producers, consumers, decomposers',
        ],
        masteryRequirements: [
          'Food web includes at least 10 organisms',
          'Arrows correctly show energy flow',
          'All organisms are correctly categorized',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W7-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Design a Conservation Plan',
        subject: 'Executive Function',
        description: 'Create a strategic plan to protect a threatened ecosystem',
        instructions: [
          'Choose a threatened ecosystem',
          'Identify main threats and causes',
          'Propose 3-5 specific conservation strategies',
          'Create an action timeline',
        ],
        masteryRequirements: [
          'Plan addresses real threats',
          'Strategies are specific and actionable',
          'Timeline is realistic',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 8: HISTORICAL BATTLES ==========
  {
    week: 8,
    questId: 'WA-W8-HISTORY',
    theme: 'Historical Battles',
    badge: {
      name: 'History Scholar',
      icon: '⚔️',
      color: '#DC2626',
    },
    handsOnProject: {
      title: 'Historical Research Project',
      description: 'Investigate a pivotal historical event and analyze its causes and effects',
      submissionType: 'multiple',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Historical Research Methods',
      concepts: ['Primary Sources', 'Secondary Sources', 'Bias Analysis', 'Historical Context'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Historical Timeline Math',
      ccssStandards: ['CCSS.MATH.6.NS.C.7'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Historical Analysis',
      genre: 'Analytical Essay',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.1', 'CCSS.ELA-LITERACY.RH.6-8.6'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W8-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Historical Timeline Math',
        subject: 'Math',
        description: 'Calculate time spans and percentages in historical context',
        instructions: [
          'Create a timeline of 10 major historical events',
          'Calculate years between events',
          'Determine what percentage of recorded history each era represents',
          'Solve word problems about historical dates and durations',
        ],
        masteryRequirements: [
          'Timeline is accurate',
          'All calculations are correct',
          'Shows understanding of negative numbers (BCE/CE)',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.6.NS.C.7'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W8-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Evaluate Historical Arguments',
        subject: 'Reading',
        description: 'Compare different historical perspectives on the same event',
        instructions: [
          'Choose a controversial historical event',
          'Read 2 sources with different viewpoints',
          'Identify each author\'s argument and evidence',
          'Analyze bias and perspective in each source',
        ],
        masteryRequirements: [
          'Accurately summarizes both perspectives',
          'Identifies bias and point of view',
          'Evaluates strength of evidence',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
        ccssStandards: ['CCSS.ELA-LITERACY.RH.6-8.6'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W8-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Cause & Effect Historical Essay',
        subject: 'Writing',
        description: 'Analyze the causes and effects of a major historical event',
        instructions: [
          'Choose a significant historical event',
          'Identify 3 major causes',
          'Identify 3 major effects',
          'Write an essay explaining cause-effect relationships',
        ],
        masteryRequirements: [
          'Causes and effects are historically accurate',
          'Relationships are clearly explained',
          'Essay is well-organized and supported',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 65,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W8-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Primary Source Investigation',
        subject: 'STEAM',
        description: 'Analyze primary historical sources to understand an event',
        instructions: [
          'Find 3 primary sources (letters, photos, documents) from a historical event',
          'Analyze what each source reveals',
          'Compare to what textbooks say',
          'Present findings: What did primary sources teach you?',
        ],
        masteryRequirements: [
          'Sources are authentic primary sources',
          'Analysis shows critical thinking',
          'Makes connections between sources',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W8-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Historical Debate Preparation',
        subject: 'Executive Function',
        description: 'Prepare to defend a historical position with evidence',
        instructions: [
          'Choose a debatable historical question',
          'Research both sides thoroughly',
          'Prepare opening argument with evidence',
          'Anticipate counterarguments and prepare responses',
        ],
        masteryRequirements: [
          'Argument is well-researched',
          'Evidence is credible and relevant',
          'Shows understanding of opposing viewpoint',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 70,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 9: CODE WARRIOR TRAINING ==========
  {
    week: 9,
    questId: 'WA-W9-CODING',
    theme: 'Code Warrior Training',
    badge: {
      name: 'Code Master',
      icon: '💻',
      color: '#0EA5E9',
    },
    handsOnProject: {
      title: 'Build Your Own Game or App',
      description: 'Design and code a functional program using loops, conditionals, and functions',
      submissionType: 'digital',
      estimatedHours: 6,
    },
    steamFocus: {
      topic: 'Computer Programming',
      concepts: ['Algorithms', 'Loops', 'Conditionals', 'Functions', 'Debugging'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Boolean Logic',
      ccssStandards: ['CCSS.MATH.HSA.REI.D.12'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Technical Documentation',
      genre: 'Technical Writing',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W9-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Boolean Logic Puzzles',
        subject: 'Math',
        description: 'Solve logic problems using AND, OR, NOT operators',
        instructions: [
          'Complete 10 Boolean logic puzzles',
          'Create truth tables for AND, OR, NOT operations',
          'Solve complex compound statements',
          'Explain how Boolean logic is used in programming',
        ],
        masteryRequirements: [
          'All logic puzzles solved correctly',
          'Truth tables are accurate',
          'Explanation connects to programming',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 45,
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W9-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Debug the Code',
        subject: 'Reading',
        description: 'Read code to find and fix errors (debugging practice)',
        instructions: [
          'Analyze 5 code snippets with bugs',
          'Identify what each program is supposed to do',
          'Find the errors in the code',
          'Explain how to fix each bug',
        ],
        masteryRequirements: [
          'Correctly identifies all bugs',
          'Explanations show understanding of code logic',
          'Fixes are accurate',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W9-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write Code Documentation',
        subject: 'Writing',
        description: 'Document a program with clear comments and instructions',
        instructions: [
          'Choose a program you\'ve written (or will write)',
          'Add comments explaining what each section does',
          'Write a README: What does it do? How to use it?',
          'Include examples of input/output',
        ],
        masteryRequirements: [
          'Comments are clear and helpful',
          'README is complete and user-friendly',
          'Documentation helps someone else understand the code',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 40,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W9-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Algorithm Thinking',
        subject: 'STEAM',
        description: 'Design algorithms to solve real-world problems',
        instructions: [
          'Choose 3 everyday tasks (e.g., making a sandwich)',
          'Write step-by-step algorithms for each',
          'Test: Can someone follow your algorithm exactly?',
          'Optimize: Can you make it more efficient?',
        ],
        masteryRequirements: [
          'Algorithms are clear and sequential',
          'Steps are specific enough to follow',
          'Shows optimization thinking',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W9-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Code Your Own Program',
        subject: 'Executive Function',
        description: 'Plan and build a complete program from scratch',
        instructions: [
          'Choose what to build (game, quiz, calculator, art)',
          'Plan features and design the user experience',
          'Code it using a language of your choice',
          'Test and debug until it works',
        ],
        masteryRequirements: [
          'Program runs without critical errors',
          'Includes loops, conditionals, or functions',
          'Is original and creative',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 80,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 10: PROBABILITY & STATISTICS ==========
  {
    week: 10,
    questId: 'WA-W10-STATS',
    theme: 'Probability & Statistics',
    badge: {
      name: 'Data Scientist',
      icon: '📊',
      color: '#8B5CF6',
    },
    handsOnProject: {
      title: 'Design & Conduct a Statistical Survey',
      description: 'Collect data, analyze results, and present findings with visualizations',
      submissionType: 'multiple',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Data Science & Research',
      concepts: ['Survey Design', 'Sampling', 'Data Visualization', 'Statistical Analysis'],
      gradeLevel: '7',
    },
    mathFocus: {
      topic: 'Statistics & Probability',
      ccssStandards: ['CCSS.MATH.7.SP.A.1', 'CCSS.MATH.7.SP.C.7'],
      gradeLevel: '7',
    },
    readingWritingFocus: {
      topic: 'Data-Driven Writing',
      genre: 'Research Report',
      ccssStandards: ['CCSS.ELA-LITERACY.W.7.2'],
      gradeLevel: '7',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W10-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Calculate Statistical Measures',
        subject: 'Math',
        description: 'Find mean, median, mode, and range for data sets',
        instructions: [
          'Calculate mean, median, mode, range for 5 data sets',
          'Explain what each measure tells you',
          'Identify which measure best represents each data set',
          'Create a data set with specific mean/median/mode',
        ],
        masteryRequirements: [
          'All calculations are correct',
          'Explanations show understanding',
          'Can justify choice of statistical measure',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.7.SP.A.1'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W10-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Interpret Probability',
        subject: 'Reading',
        description: 'Understand and calculate probability in real scenarios',
        instructions: [
          'Read about probability (theoretical vs. experimental)',
          'Solve 10 probability problems',
          'Explain probability in your own words',
          'Design a probability experiment',
        ],
        masteryRequirements: [
          'Probability calculations are correct',
          'Shows understanding of probability concepts',
          'Experiment design is sound',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
        ccssStandards: ['CCSS.MATH.7.SP.C.7'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W10-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Data-Driven Report',
        subject: 'Writing',
        description: 'Write a research report presenting statistical findings',
        instructions: [
          'Choose a data set (sports stats, survey results, etc.)',
          'Analyze the data statistically',
          'Write a report presenting findings',
          'Include graphs and charts',
        ],
        masteryRequirements: [
          'Report is well-organized',
          'Data is presented clearly',
          'Conclusions are supported by data',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 70,
        ccssStandards: ['CCSS.ELA-LITERACY.W.7.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W10-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Design a Survey',
        subject: 'STEAM',
        description: 'Create and conduct a statistical survey',
        instructions: [
          'Choose a research question',
          'Design 5-10 survey questions',
          'Survey at least 20 people',
          'Compile and analyze results',
        ],
        masteryRequirements: [
          'Survey questions are clear and unbiased',
          'Sample size is adequate',
          'Results are analyzed statistically',
        ],
        submissionType: 'multiple',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W10-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Spot Misleading Statistics',
        subject: 'Executive Function',
        description: 'Analyze how statistics can be manipulated and learn to think critically',
        instructions: [
          'Find 3 examples of misleading statistics (ads, news, social media)',
          'Identify what makes each misleading',
          'Explain the truth behind the numbers',
          'Create guidelines for evaluating statistical claims',
        ],
        masteryRequirements: [
          'Examples are authentic',
          'Analysis shows critical thinking',
          'Guidelines are practical',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 11: GEOMETRIC WARFARE ==========
  {
    week: 11,
    questId: 'WA-W11-GEOMETRY',
    theme: 'Geometric Warfare',
    badge: {
      name: 'Geometry Master',
      icon: '📐',
      color: '#F59E0B',
    },
    handsOnProject: {
      title: '3D Design Challenge',
      description: 'Use CAD software or Roblox Studio to design a geometric structure',
      submissionType: 'digital',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: '3D Modeling & Design',
      concepts: ['CAD', 'Spatial Reasoning', '3D Geometry', 'Design Thinking'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Advanced Geometry',
      ccssStandards: ['CCSS.MATH.8.G.B.7', 'CCSS.MATH.8.G.C.9'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Logical Reasoning',
      genre: 'Geometric Proof',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W11-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Triangle Mastery',
        subject: 'Math',
        description: 'Apply Pythagorean theorem and triangle properties',
        instructions: [
          'Solve 10 Pythagorean theorem problems',
          'Find missing angles using triangle angle sum',
          'Classify triangles by sides and angles',
          'Apply to real-world scenarios (ramps, construction)',
        ],
        masteryRequirements: [
          'All calculations are correct',
          'Shows proper formula application',
          'Real-world applications are accurate',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
        ccssStandards: ['CCSS.MATH.8.G.B.7'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W11-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Coordinate Plane Adventures',
        subject: 'Reading',
        description: 'Plot and analyze shapes on coordinate grids',
        instructions: [
          'Plot 5 shapes on coordinate plane',
          'Calculate distances using coordinate geometry',
          'Find slopes of lines',
          'Analyze transformations (translations, reflections, rotations)',
        ],
        masteryRequirements: [
          'Plots are accurate',
          'Distance calculations are correct',
          'Shows understanding of transformations',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.8.G.A.3'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W11-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write a Geometric Proof',
        subject: 'Writing',
        description: 'Construct a logical proof for a geometric theorem',
        instructions: [
          'Choose a geometric theorem to prove',
          'Write a step-by-step logical proof',
          'Include diagrams',
          'Use formal proof language (given, prove, therefore)',
        ],
        masteryRequirements: [
          'Proof is logically sound',
          'Each step is justified',
          'Uses proper mathematical language',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W11-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: '3D Design Challenge',
        subject: 'STEAM',
        description: 'Design a 3D structure using geometric principles',
        instructions: [
          'Choose software (Tinkercad, Roblox Studio, SketchUp)',
          'Design a structure (building, vehicle, sculpture)',
          'Use at least 5 different geometric shapes',
          'Calculate surface area and volume',
        ],
        masteryRequirements: [
          'Design is complete and functional',
          'Uses geometric shapes appropriately',
          'Calculations are correct',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 70,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W11-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Geometry in Architecture',
        subject: 'Executive Function',
        description: 'Analyze how geometry is used in real buildings',
        instructions: [
          'Research 3 famous buildings',
          'Identify geometric shapes and principles used',
          'Explain WHY those shapes were chosen (strength, aesthetics)',
          'Design your own building using geometric principles',
        ],
        masteryRequirements: [
          'Analysis is thorough and accurate',
          'Explanations show understanding',
          'Original design applies geometric principles',
        ],
        submissionType: 'multiple',
        xpReward: 100,
        estimatedMinutes: 65,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 12: THE ENERGY CRISIS ==========
  {
    week: 12,
    questId: 'WA-W12-ENERGY',
    theme: 'The Energy Crisis',
    badge: {
      name: 'Energy Engineer',
      icon: '⚡',
      color: '#FBBF24',
    },
    handsOnProject: {
      title: 'Design a Renewable Energy Solution',
      description: 'Propose an energy solution for your school or community',
      submissionType: 'multiple',
      estimatedHours: 5,
    },
    steamFocus: {
      topic: 'Energy & Electricity',
      concepts: ['Circuits', 'Renewable Energy', 'Energy Conservation', 'Ohm\'s Law'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Electrical Math',
      ccssStandards: ['CCSS.MATH.8.EE.C.7'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Technical Report Writing',
      genre: 'Research Report',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.2', 'CCSS.ELA-LITERACY.RST.6-8.7'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W12-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Ohm\'s Law Master',
        subject: 'Math',
        description: 'Use V = IR to solve electrical problems',
        instructions: [
          'Learn Ohm\'s Law: Voltage = Current × Resistance',
          'Solve 10 problems finding V, I, or R',
          'Calculate power using P = IV',
          'Apply to real circuit scenarios',
        ],
        masteryRequirements: [
          'All calculations are correct',
          'Shows proper formula manipulation',
          'Understands relationship between V, I, R',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.8.EE.C.7'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W12-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Energy Audit',
        subject: 'Reading',
        description: 'Research and analyze energy use in buildings',
        instructions: [
          'Read about energy efficiency and audits',
          'Conduct a simple home energy audit',
          'Identify 5 ways to reduce energy use',
          'Calculate potential savings',
        ],
        masteryRequirements: [
          'Audit is thorough',
          'Recommendations are practical',
          'Calculations are reasonable',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 55,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W12-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Renewable Energy Report',
        subject: 'Writing',
        description: 'Research and write about renewable energy technologies',
        instructions: [
          'Choose a renewable energy type (solar, wind, hydro, geothermal)',
          'Research how it works',
          'Analyze pros and cons',
          'Write a report with diagrams',
        ],
        masteryRequirements: [
          'Report is well-researched',
          'Explains technology clearly',
          'Analysis is balanced',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 70,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W12-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Circuit Challenge',
        subject: 'STEAM',
        description: 'Build and test electrical circuits',
        instructions: [
          'Build 3 circuits: series, parallel, combination',
          'Test with multimeter or circuit simulator',
          'Document voltage, current, resistance at different points',
          'Explain how each circuit type works',
        ],
        masteryRequirements: [
          'Circuits are correctly constructed',
          'Measurements are accurate',
          'Explanations show understanding',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 60,
        materials: ['Battery', 'Wires', 'Bulbs/LEDs', 'Resistors (or online simulator)'],
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W12-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Design an Energy Solution',
        subject: 'Executive Function',
        description: 'Propose a renewable energy plan for your school or community',
        instructions: [
          'Assess current energy use',
          'Propose renewable energy solution',
          'Calculate costs and benefits',
          'Create implementation plan',
        ],
        masteryRequirements: [
          'Solution is realistic and specific',
          'Cost-benefit analysis is thorough',
          'Plan is actionable',
        ],
        submissionType: 'multiple',
        xpReward: 100,
        estimatedMinutes: 75,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 13: PERSUASIVE POWER ==========
  {
    week: 13,
    questId: 'WA-W13-PERSUASION',
    theme: 'Persuasive Power',
    badge: {
      name: 'Master Persuader',
      icon: '🎤',
      color: '#EC4899',
    },
    handsOnProject: {
      title: 'Write & Deliver a Persuasive Speech',
      description: 'Research, write, and present a persuasive speech on a topic you care about',
      submissionType: 'video',
      estimatedHours: 5,
    },
    steamFocus: {
      topic: 'Psychology of Persuasion',
      concepts: ['Rhetoric', 'Cognitive Biases', 'Logical Fallacies', 'Communication'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Statistics in Arguments',
      ccssStandards: ['CCSS.MATH.7.SP.A.1'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Persuasive Communication',
      genre: 'Persuasive Speech',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.1', 'CCSS.ELA-LITERACY.SL.8.4'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W13-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Statistics Don\'t Lie (Or Do They?)',
        subject: 'Math',
        description: 'Learn how statistics are used (and misused) in arguments',
        instructions: [
          'Learn about sample size, bias, correlation vs. causation',
          'Analyze 5 statistical claims from ads or articles',
          'Identify misleading statistics',
          'Create ethical vs. misleading uses of the same data',
        ],
        masteryRequirements: [
          'Can identify statistical manipulation',
          'Explains concepts clearly',
          'Shows ethical use of data',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W13-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Deconstruct a Famous Speech',
        subject: 'Reading',
        description: 'Analyze rhetorical techniques in great speeches',
        instructions: [
          'Choose a famous speech (MLK, JFK, Malala, etc.)',
          'Identify use of ethos, pathos, logos',
          'Highlight powerful language techniques',
          'Analyze what makes it effective',
        ],
        masteryRequirements: [
          'Correctly identifies rhetorical techniques',
          'Analysis is thorough and insightful',
          'Connects techniques to effectiveness',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 65,
        ccssStandards: ['CCSS.ELA-LITERACY.RI.8.6'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W13-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write a Persuasive Essay',
        subject: 'Writing',
        description: 'Craft a formal persuasive essay using ethos, pathos, and logos',
        instructions: [
          'Choose a debatable topic',
          'Research evidence and counterarguments',
          'Write essay using all three appeals',
          'Include introduction, body paragraphs, conclusion',
        ],
        masteryRequirements: [
          'Argument is clear and supported',
          'Uses ethos, pathos, logos effectively',
          'Addresses counterarguments',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 80,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.1'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W13-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Analyze Persuasive Techniques',
        subject: 'STEAM',
        description: 'Study how ads, social media, and media use persuasion',
        instructions: [
          'Collect 5 examples of persuasive media (ads, posts, videos)',
          'Identify techniques used (emotional appeal, bandwagon, etc.)',
          'Analyze target audience and effectiveness',
          'Design your own ethical persuasive campaign',
        ],
        masteryRequirements: [
          'Examples are diverse',
          'Analysis shows critical thinking',
          'Campaign is creative and ethical',
        ],
        submissionType: 'multiple',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W13-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Deliver Your Speech',
        subject: 'Executive Function',
        description: 'Present a persuasive speech and self-assess performance',
        instructions: [
          'Finalize your persuasive speech',
          'Practice delivery (pacing, tone, gestures)',
          'Record yourself presenting',
          'Self-assess: What worked? What would you improve?',
        ],
        masteryRequirements: [
          'Speech is well-delivered',
          'Uses vocal variety and body language',
          'Self-assessment is honest and insightful',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 90,
        ccssStandards: ['CCSS.ELA-LITERACY.SL.8.4'],
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 14: CELLULAR COMMAND ==========
  {
    week: 14,
    questId: 'WA-W14-BIOLOGY',
    theme: 'Cellular Command',
    badge: {
      name: 'Cell Biologist',
      icon: '🧬',
      color: '#10B981',
    },
    handsOnProject: {
      title: 'Build a 3D Cell Model',
      description: 'Create a detailed model showing all cell structures and their functions',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Cell Biology & Genetics',
      concepts: ['Cell Structure', 'DNA', 'Genetics', 'Heredity'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Genetics Probability',
      ccssStandards: ['CCSS.MATH.7.SP.C.8'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Scientific Research Writing',
      genre: 'Research Report',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.2', 'CCSS.ELA-LITERACY.RST.6-8.9'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W14-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Genetics Probability',
        subject: 'Math',
        description: 'Use Punnett squares to calculate genetic probabilities',
        instructions: [
          'Learn how to use Punnett squares',
          'Complete 10 genetic cross problems',
          'Calculate percentages for dominant/recessive traits',
          'Create your own genetics problem with solution',
        ],
        masteryRequirements: [
          'Punnett squares are correct',
          'Probabilities are calculated accurately',
          'Shows understanding of inheritance',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.MATH.7.SP.C.8'],
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W14-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Cell Processes Explorer',
        subject: 'Reading',
        description: 'Research and understand cellular processes',
        instructions: [
          'Read about mitosis, meiosis, and cell respiration',
          'Create comparison chart of mitosis vs. meiosis',
          'Explain photosynthesis and cellular respiration',
          'Summarize how cells get and use energy',
        ],
        masteryRequirements: [
          'Comparison is accurate',
          'Explanations show understanding',
          'Can connect structure to function',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W14-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'DNA Research Report',
        subject: 'Writing',
        description: 'Write about DNA structure, replication, and applications',
        instructions: [
          'Research DNA structure and function',
          'Explain how DNA replicates',
          'Describe real-world applications (forensics, medicine)',
          'Write a formal research report',
        ],
        masteryRequirements: [
          'Report is scientifically accurate',
          'Explanations are clear',
          'Shows research and understanding',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 70,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.2'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W14-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Build a Cell Model',
        subject: 'STEAM',
        description: 'Create a 3D model of a plant or animal cell',
        instructions: [
          'Choose plant or animal cell',
          'Include all major organelles (nucleus, mitochondria, etc.)',
          'Label each part and its function',
          'Use creative materials or 3D modeling software',
        ],
        masteryRequirements: [
          'Model is accurate and detailed',
          'All organelles are labeled',
          'Shows understanding of cell structure',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 90,
        materials: ['Craft supplies or 3D modeling software'],
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W14-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Genetics Detective',
        subject: 'Executive Function',
        description: 'Solve genetics problems and analyze inheritance patterns',
        instructions: [
          'Research a genetic trait or disorder',
          'Create a family pedigree chart',
          'Analyze inheritance pattern',
          'Predict probabilities for future generations',
        ],
        masteryRequirements: [
          'Pedigree is accurate',
          'Analysis shows understanding',
          'Predictions are justified',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 65,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 15: THE GREAT INVESTIGATION ==========
  {
    week: 15,
    questId: 'WA-W15-RESEARCH',
    theme: 'The Great Investigation',
    badge: {
      name: 'Master Researcher',
      icon: '🔬',
      color: '#3B82F6',
    },
    handsOnProject: {
      title: 'Independent Research Project',
      description: 'Conduct original research on a topic of your choice and present findings',
      submissionType: 'multiple',
      estimatedHours: 10,
    },
    steamFocus: {
      topic: 'Research Methods',
      concepts: ['Research Design', 'Data Collection', 'Analysis', 'Presentation'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Data Analysis',
      ccssStandards: ['CCSS.MATH.8.SP.A.1'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Academic Research',
      genre: 'Research Paper',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.7', 'CCSS.ELA-LITERACY.W.8.8'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W15-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Collect & Analyze Data',
        subject: 'Math',
        description: 'Gather data for your research and perform statistical analysis',
        instructions: [
          'Collect quantitative data for your research question',
          'Organize in tables or spreadsheets',
          'Calculate relevant statistics (mean, median, correlation)',
          'Create graphs to visualize findings',
        ],
        masteryRequirements: [
          'Data collection is systematic',
          'Statistics are calculated correctly',
          'Visualizations are clear and appropriate',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 120,
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W15-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Literature Review',
        subject: 'Reading',
        description: 'Research and synthesize existing knowledge on your topic',
        instructions: [
          'Find 5+ credible sources on your topic',
          'Read and take notes',
          'Identify what is already known',
          'Find gaps your research can fill',
        ],
        masteryRequirements: [
          'Sources are credible and relevant',
          'Summary shows synthesis',
          'Identifies research gap',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 90,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.8'],
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W15-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Write a Research Paper',
        subject: 'Writing',
        description: 'Compose a formal research paper with proper citations',
        instructions: [
          'Write sections: Introduction, Methods, Results, Discussion, Conclusion',
          'Include in-text citations (MLA or APA)',
          'Add a Works Cited/References page',
          'Revise for clarity and academic tone',
        ],
        masteryRequirements: [
          'All sections are present and complete',
          'Citations are formatted correctly',
          'Writing is clear and academic',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 150,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.7', 'CCSS.ELA-LITERACY.W.8.8'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W15-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Design Your Investigation',
        subject: 'STEAM',
        description: 'Plan and execute your research methodology',
        instructions: [
          'Finalize research question and hypothesis',
          'Design methodology (experiment, survey, observation)',
          'Collect data systematically',
          'Document process with photos/videos',
        ],
        masteryRequirements: [
          'Methodology is scientifically sound',
          'Data collection is systematic',
          'Process is well-documented',
        ],
        submissionType: 'multiple',
        xpReward: 100,
        estimatedMinutes: 90,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W15-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Present Your Findings',
        subject: 'Executive Function',
        description: 'Create and deliver a professional research presentation',
        instructions: [
          'Create slides/poster summarizing research',
          'Include: Question, Methods, Results, Conclusions',
          'Practice presentation (5-10 minutes)',
          'Present to audience and answer questions',
        ],
        masteryRequirements: [
          'Presentation is clear and professional',
          'Covers all key points',
          'Delivery is confident',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 120,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },

  // ========== WEEK 16: WARRIOR SHOWCASE ==========
  {
    week: 16,
    questId: 'WA-W16-SHOWCASE',
    theme: 'Warrior Showcase',
    badge: {
      name: 'Warrior Complete',
      icon: '👑',
      color: '#FFD700',
    },
    handsOnProject: {
      title: 'Portfolio & Mastery Defense',
      description: 'Curate your best work and present evidence of mastery across all subjects',
      submissionType: 'multiple',
      estimatedHours: 8,
    },
    steamFocus: {
      topic: 'Portfolio Curation',
      concepts: ['Self-Assessment', 'Presentation Design', 'Reflection'],
      gradeLevel: '8',
    },
    mathFocus: {
      topic: 'Growth Analysis',
      ccssStandards: ['CCSS.MATH.8.SP.A.1'],
      gradeLevel: '8',
    },
    readingWritingFocus: {
      topic: 'Reflective Writing',
      genre: 'Reflection Essay',
      ccssStandards: ['CCSS.ELA-LITERACY.W.8.3'],
      gradeLevel: '8',
    },
    challenges: [
      // MONDAY - MATH
      {
        challengeId: 'WA-W16-C1-MATH',
        challengeNumber: 1,
        dayOfWeek: 'Monday',
        title: 'Math Growth Analysis',
        subject: 'Math',
        description: 'Analyze your mathematical growth over 16 weeks',
        instructions: [
          'Review all math challenges from Weeks 1-15',
          'Calculate XP earned in math',
          'Identify areas of strength and growth',
          'Create a graph showing progress over time',
        ],
        masteryRequirements: [
          'Analysis is thorough',
          'Graph accurately represents growth',
          'Reflection shows self-awareness',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 60,
      },
      // TUESDAY - READING
      {
        challengeId: 'WA-W16-C2-READING',
        challengeNumber: 2,
        dayOfWeek: 'Tuesday',
        title: 'Peer Review & Feedback',
        subject: 'Reading',
        description: 'Review peer portfolios and provide constructive feedback',
        instructions: [
          'Review 3 peer portfolios',
          'Identify strengths in each',
          'Provide specific, constructive suggestions',
          'Reflect on what you learned from peers',
        ],
        masteryRequirements: [
          'Feedback is specific and constructive',
          'Highlights genuine strengths',
          'Reflection shows learning',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 90,
      },
      // WEDNESDAY - WRITING
      {
        challengeId: 'WA-W16-C3-WRITING',
        challengeNumber: 3,
        dayOfWeek: 'Wednesday',
        title: 'Reflective Essay',
        subject: 'Writing',
        description: 'Write about your learning journey through Warriors tier',
        instructions: [
          'Reflect on your growth across all subjects',
          'Describe challenges you overcame',
          'Identify your greatest achievements',
          'Set goals for future learning',
        ],
        masteryRequirements: [
          'Essay shows deep reflection',
          'Provides specific examples',
          'Goals are thoughtful and specific',
        ],
        submissionType: 'text',
        xpReward: 100,
        estimatedMinutes: 80,
        ccssStandards: ['CCSS.ELA-LITERACY.W.8.3'],
      },
      // THURSDAY - STEAM
      {
        challengeId: 'WA-W16-C4-STEAM',
        challengeNumber: 4,
        dayOfWeek: 'Thursday',
        title: 'Curate Your Portfolio',
        subject: 'STEAM',
        description: 'Design a digital portfolio showcasing your best work',
        instructions: [
          'Select your best work from each subject area',
          'Organize in a digital portfolio (Google Sites, Wix, etc.)',
          'Write captions explaining each piece',
          'Design for professional presentation',
        ],
        masteryRequirements: [
          'Portfolio is well-organized',
          'Work showcases growth and mastery',
          'Design is professional',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 120,
      },
      // FRIDAY - EXECUTIVE FUNCTION
      {
        challengeId: 'WA-W16-C5-EXEC',
        challengeNumber: 5,
        dayOfWeek: 'Friday',
        title: 'Mastery Defense Presentation',
        subject: 'Executive Function',
        description: 'Present your portfolio and defend your mastery claims',
        instructions: [
          'Prepare a 10-15 minute presentation',
          'Walk through portfolio highlighting key achievements',
          'Explain how you met mastery standards',
          'Present to panel (tutors, peers, family)',
        ],
        masteryRequirements: [
          'Presentation is confident and clear',
          'Provides evidence of mastery',
          'Answers questions thoughtfully',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 150,
      },
    ],
    totalXP: 500,
    estimatedWeeks: 1,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Warriors quest by week number (1-16)
 */
export function getWarriorQuestByWeek(week: number): WarriorQuest | null {
  return WARRIORS_CURRICULUM.find(q => q.week === week) || null;
}

/**
 * Get Warriors quest by ID
 */
export function getWarriorQuestById(questId: string): WarriorQuest | null {
  return WARRIORS_CURRICULUM.find(q => q.questId === questId) || null;
}

/**
 * Get all Warriors quests
 */
export function getAllWarriorQuests(): WarriorQuest[] {
  return WARRIORS_CURRICULUM;
}

/**
 * Calculate total XP available in Warriors curriculum
 */
export function getTotalWarriorsXP(): number {
  return WARRIORS_CURRICULUM.reduce((sum, quest) => sum + quest.totalXP, 0);
}

/**
 * Get Warriors quest progress (percentage complete)
 */
export function calculateWarriorQuestProgress(
  completedChallenges: string[],
  questId: string
): number {
  const quest = getWarriorQuestById(questId);
  if (!quest) return 0;
  
  const totalChallenges = quest.challenges.length;
  const completed = quest.challenges.filter(c => 
    completedChallenges.includes(c.challengeId)
  ).length;
  
  return (completed / totalChallenges) * 100;
}

/**
 * Get next uncompleted challenge
 */
export function getNextWarriorChallenge(
  completedChallenges: string[],
  questId: string
): WarriorChallenge | null {
  const quest = getWarriorQuestById(questId);
  if (!quest) return null;
  
  return quest.challenges.find(c => 
    !completedChallenges.includes(c.challengeId)
  ) || null;
}
