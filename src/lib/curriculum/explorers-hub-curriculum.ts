/**
 * 16-WEEK EXPLORERS HUB CURRICULUM
 * For ages 8-12 (3rd-5th grade competencies)
 * Tier: EXPLORERS
 * 
 * Each week = 1 Quest with 4-6 challenges across STEAM + Math + Reading/Writing
 */

import { GradeLevel } from '../learning-standards';

// ============================================================================
// TYPES
// ============================================================================

export type Quest = ExplorerQuest;

export interface ExplorerQuest {
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
    submissionType: 'photo' | 'video' | 'digital' | 'multiple';
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
  challenges: ExplorerChallenge[];
  totalXP: number;
  estimatedWeeks: number;
}

export interface ExplorerChallenge {
  challengeId: string;
  challengeNumber: number; // 1-16 within quest
  title: string;
  subject: 'STEAM' | 'Math' | 'Reading' | 'Writing' | 'Project';
  description: string;
  instructions: string[];
  masteryRequirements: string[];
  submissionType: 'text' | 'image' | 'video' | 'screenshot' | 'multiple';
  xpReward: number;
  estimatedMinutes: number;
  ccssStandards?: string[];
  materials?: string[];
}

// ============================================================================
// 16-WEEK CURRICULUM
// ============================================================================

export const EXPLORERS_HUB_CURRICULUM: ExplorerQuest[] = [
  
  // ========== WEEK 1: FOUNDATIONS ==========
  {
    week: 1,
    questId: 'EH-W1-FOUNDATIONS',
    theme: 'Foundations',
    badge: {
      name: 'The Origin',
      icon: '🌟',
      color: 'from-blue-500 to-cyan-500',
    },
    handsOnProject: {
      title: 'Digital Explorer Portfolio',
      description: 'Create your personal learning portfolio showcasing who you are as an explorer',
      submissionType: 'digital',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Scientific Method',
      concepts: ['Observation', 'Hypothesis', 'Experimentation', 'Conclusion'],
      gradeLevel: '3',
    },
    mathFocus: {
      topic: 'Logic & Multi-Step Reasoning',
      ccssStandards: ['CCSS.MATH.3.OA.8', 'CCSS.MATH.4.OA.3'],
      gradeLevel: '3',
    },
    readingWritingFocus: {
      topic: 'SMART Goals Writing',
      genre: 'Expository',
      ccssStandards: ['CCSS.ELA-LITERACY.W.3.2', 'CCSS.ELA-LITERACY.W.4.2'],
      gradeLevel: '3',
    },
    challenges: [
      {
        challengeId: 'EH-W1-C1',
        challengeNumber: 1,
        title: 'Meet the Scientific Method',
        subject: 'STEAM',
        description: 'Learn the 5 steps scientists use to explore the world',
        instructions: [
          'Watch the Scientific Method video',
          'Identify the 5 steps: Observe, Question, Hypothesize, Experiment, Conclude',
          'Complete the Scientific Method matching game',
          'Write one example of each step from your own life',
        ],
        masteryRequirements: [
          'Can name all 5 steps of the Scientific Method',
          'Provides real-world examples for each step',
          'Explains why the order matters',
        ],
        submissionType: 'text',
        xpReward: 50,
        estimatedMinutes: 30,
        ccssStandards: ['3-5-ETS1-1'],
      },
      {
        challengeId: 'EH-W1-C2',
        challengeNumber: 2,
        title: 'Your First Experiment',
        subject: 'STEAM',
        description: 'Design and conduct a simple experiment using the Scientific Method',
        instructions: [
          'Choose a question (example: "Which paper airplane design flies farthest?")',
          'Make a hypothesis (your prediction)',
          'Test it 3 times and record data',
          'Take photos of your experiment',
          'Write your conclusion',
        ],
        masteryRequirements: [
          'Follows all 5 steps of Scientific Method',
          'Records data clearly',
          'Explains whether hypothesis was correct and why',
        ],
        submissionType: 'multiple',
        xpReward: 75,
        estimatedMinutes: 45,
        materials: ['Paper', 'Measuring tape or ruler', 'Camera for photos'],
      },
      {
        challengeId: 'EH-W1-C3',
        challengeNumber: 3,
        title: 'Multi-Step Math Missions',
        subject: 'Math',
        description: 'Solve real-world problems that require multiple steps',
        instructions: [
          'Read each story problem carefully',
          'Identify what you know and what you need to find',
          'Show your work for each step',
          'Solve 5 multi-step problems',
          'Explain your reasoning',
        ],
        masteryRequirements: [
          'Solves multi-step problems correctly',
          'Shows clear work for each step',
          'Explains the strategy used',
        ],
        submissionType: 'image',
        xpReward: 50,
        estimatedMinutes: 40,
        ccssStandards: ['CCSS.MATH.3.OA.8', 'CCSS.MATH.4.OA.3'],
      },
      {
        challengeId: 'EH-W1-C4',
        challengeNumber: 4,
        title: 'SMART Goals Writing',
        subject: 'Writing',
        description: 'Write 3 SMART goals for your Explorer journey',
        instructions: [
          'Learn what SMART means: Specific, Measurable, Achievable, Relevant, Time-bound',
          'Write 3 goals for this 16-week journey',
          'Make sure each goal is SMART',
          'Explain WHY each goal matters to you',
        ],
        masteryRequirements: [
          'All 3 goals meet SMART criteria',
          'Goals are personal and meaningful',
          'Includes explanation of why goals matter',
        ],
        submissionType: 'text',
        xpReward: 50,
        estimatedMinutes: 30,
        ccssStandards: ['CCSS.ELA-LITERACY.W.3.2', 'CCSS.ELA-LITERACY.W.4.2'],
      },
      {
        challengeId: 'EH-W1-C5',
        challengeNumber: 5,
        title: 'Build Your Digital Portfolio',
        subject: 'Project',
        description: 'Create your Explorer Portfolio with an About Me page',
        instructions: [
          'Choose a platform (Google Slides, Canva, PowerPoint, or digital journal)',
          'Create an "About Me" page with photo and bio',
          'Add your SMART Goals page',
          'Include your first experiment',
          'Design a cover page',
        ],
        masteryRequirements: [
          'Portfolio is organized and visually appealing',
          'Includes all required sections',
          'Shows personality and creativity',
        ],
        submissionType: 'digital',
        xpReward: 100,
        estimatedMinutes: 60,
      },
    ],
    totalXP: 325,
    estimatedWeeks: 1,
  },

  // ========== WEEK 2: ANCIENT CIVILIZATIONS ==========
  {
    week: 2,
    questId: 'EH-W2-ANCIENT',
    theme: 'Ancient Civilizations',
    badge: {
      name: 'Time Traveler',
      icon: '⏳',
      color: 'from-amber-600 to-orange-500',
    },
    handsOnProject: {
      title: 'Ancient Tool Prototypes',
      description: 'Build working models of ancient tools and machines',
      submissionType: 'multiple',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Engineering & Levers',
      concepts: ['Simple machines', 'Fulcrum', 'Force', 'Mechanical advantage'],
      gradeLevel: '3',
    },
    mathFocus: {
      topic: 'Ancient Number Systems',
      ccssStandards: ['CCSS.MATH.4.NBT.1', 'CCSS.MATH.5.NBT.1'],
      gradeLevel: '4',
    },
    readingWritingFocus: {
      topic: 'Historical Perspective Writing',
      genre: 'Narrative',
      ccssStandards: ['CCSS.ELA-LITERACY.W.3.3', 'CCSS.ELA-LITERACY.W.4.3'],
      gradeLevel: '4',
    },
    challenges: [
      {
        challengeId: 'EH-W2-C1',
        challengeNumber: 1,
        title: 'Ancient Number Systems Explorer',
        subject: 'Math',
        description: 'Learn how ancient civilizations counted (Egyptian, Roman, Mayan)',
        instructions: [
          'Study Egyptian hieroglyphic numbers',
          'Learn Roman numerals (I, V, X, L, C, D, M)',
          'Convert your age to Roman numerals',
          'Write your birth year in Egyptian hieroglyphs',
          'Compare: Which system is easiest? Why?',
        ],
        masteryRequirements: [
          'Can read and write Roman numerals to 100',
          'Understands place value in ancient systems',
          'Compares advantages/disadvantages of different systems',
        ],
        submissionType: 'image',
        xpReward: 50,
        estimatedMinutes: 35,
        ccssStandards: ['CCSS.MATH.4.NBT.1'],
      },
      {
        challengeId: 'EH-W2-C2',
        challengeNumber: 2,
        title: 'Simple Machines Investigation',
        subject: 'STEAM',
        description: 'Discover the 6 simple machines used in ancient engineering',
        instructions: [
          'Learn the 6 simple machines: lever, pulley, wheel & axle, inclined plane, wedge, screw',
          'Find 3 examples of each in your home',
          'Draw and label each type',
          'Explain how it makes work easier',
        ],
        masteryRequirements: [
          'Identifies all 6 simple machines',
          'Provides real-world examples',
          'Explains mechanical advantage',
        ],
        submissionType: 'multiple',
        xpReward: 60,
        estimatedMinutes: 40,
      },
      {
        challengeId: 'EH-W2-C3',
        challengeNumber: 3,
        title: 'Build a Working Lever',
        subject: 'STEAM',
        description: 'Construct a lever and test how it multiplies force',
        instructions: [
          'Build a lever using: ruler/stick (beam), pencil (fulcrum), small object (load)',
          'Test 3 fulcrum positions: near load, middle, near effort',
          'Record which position makes lifting easiest',
          'Take photos of your setup',
          'Explain: Where should the fulcrum go to lift heavy objects?',
        ],
        masteryRequirements: [
          'Lever functions correctly',
          'Tests multiple fulcrum positions',
          'Explains relationship between fulcrum position and force needed',
        ],
        submissionType: 'multiple',
        xpReward: 75,
        estimatedMinutes: 45,
        materials: ['Ruler or stick', 'Pencil or dowel', 'Small objects to lift', 'Camera'],
      },
      {
        challengeId: 'EH-W2-C4',
        challengeNumber: 4,
        title: 'Day in the Life: Ancient Engineer',
        subject: 'Writing',
        description: 'Write a first-person narrative as an ancient Egyptian engineer building the pyramids',
        instructions: [
          'Research: How were pyramids built?',
          'Choose your role: architect, stone cutter, or lever operator',
          'Write a 1-page journal entry describing your day',
          'Include: What tools you use, what challenges you face, how you feel',
          'Use sensory details (what you see, hear, smell, feel)',
        ],
        masteryRequirements: [
          'Narrative is historically accurate',
          'Uses first-person perspective',
          'Includes sensory details and emotions',
          'Shows understanding of ancient engineering',
        ],
        submissionType: 'text',
        xpReward: 60,
        estimatedMinutes: 45,
        ccssStandards: ['CCSS.ELA-LITERACY.W.3.3', 'CCSS.ELA-LITERACY.W.4.3'],
      },
      {
        challengeId: 'EH-W2-C5',
        challengeNumber: 5,
        title: 'Ancient Tool Prototype',
        subject: 'Project',
        description: 'Build a model of an ancient tool using household materials',
        instructions: [
          'Choose a tool: shaduf (water lifter), lever, catapult, or pyramid block mover',
          'Research how it worked',
          'Build a working model using cardboard, sticks, string, etc.',
          'Test it and record results',
          'Create a 1-minute video demonstration',
        ],
        masteryRequirements: [
          'Model is structurally sound',
          'Demonstrates understanding of engineering principles',
          'Video clearly explains how tool works',
          'Reflects on what ancient engineers understood',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 90,
        materials: ['Cardboard', 'String', 'Sticks/skewers', 'Tape/glue', 'Small weights'],
      },
    ],
    totalXP: 345,
    estimatedWeeks: 1,
  },

  // ========== WEEK 3: LANDFORMS ==========
  {
    week: 3,
    questId: 'EH-W3-LANDFORMS',
    theme: 'Landforms',
    badge: {
      name: 'The Mapper',
      icon: '🗺️',
      color: 'from-green-600 to-emerald-500',
    },
    handsOnProject: {
      title: 'Volcano / Earthquake Simulation',
      description: 'Build a working volcano and earthquake shake table',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Plate Tectonics',
      concepts: ['Earth layers', 'Tectonic plates', 'Earthquakes', 'Volcanoes'],
      gradeLevel: '4',
    },
    mathFocus: {
      topic: 'Graphing + Mean/Median/Range',
      ccssStandards: ['CCSS.MATH.3.MD.3', 'CCSS.MATH.4.MD.4', 'CCSS.MATH.5.MD.2'],
      gradeLevel: '4',
    },
    readingWritingFocus: {
      topic: 'Informative Landform Description',
      genre: 'Informational',
      ccssStandards: ['CCSS.ELA-LITERACY.W.4.2', 'CCSS.ELA-LITERACY.W.5.2'],
      gradeLevel: '4',
    },
    challenges: [
      {
        challengeId: 'EH-W3-C1',
        challengeNumber: 1,
        title: 'Earth\'s Layers Investigation',
        subject: 'STEAM',
        description: 'Explore the 4 layers of Earth: crust, mantle, outer core, inner core',
        instructions: [
          'Watch Earth layers video',
          'Create a labeled diagram showing all 4 layers',
          'Research the temperature and composition of each layer',
          'Make a comparison: Earth is like a hard-boiled egg. Explain.',
        ],
        masteryRequirements: [
          'Diagram is accurate and labeled',
          'Explains characteristics of each layer',
          'Makes accurate comparisons',
        ],
        submissionType: 'image',
        xpReward: 50,
        estimatedMinutes: 30,
      },
      {
        challengeId: 'EH-W3-C2',
        challengeNumber: 2,
        title: 'Tectonic Plates & Earthquakes',
        subject: 'STEAM',
        description: 'Learn how plate movement causes earthquakes and volcanoes',
        instructions: [
          'Study a map of tectonic plates',
          'Identify the "Ring of Fire"',
          'Explain: What happens when plates collide? Separate? Slide past each other?',
          'Find 3 recent earthquakes and plot them on a world map',
        ],
        masteryRequirements: [
          'Identifies major plate boundaries',
          'Explains 3 types of plate movement',
          'Connects earthquakes to plate tectonics',
        ],
        submissionType: 'multiple',
        xpReward: 60,
        estimatedMinutes: 40,
      },
      {
        challengeId: 'EH-W3-C3',
        challengeNumber: 3,
        title: 'Earthquake Data Analysis',
        subject: 'Math',
        description: 'Graph earthquake magnitudes and calculate mean, median, and range',
        instructions: [
          'Use data: Last 10 earthquakes in California (magnitude)',
          'Create a bar graph of the data',
          'Calculate the mean (average) magnitude',
          'Find the median (middle value)',
          'Calculate the range (highest - lowest)',
          'Write: What does this data tell us about earthquake patterns?',
        ],
        masteryRequirements: [
          'Graph is accurate and labeled',
          'Calculations are correct',
          'Interprets data meaningfully',
        ],
        submissionType: 'image',
        xpReward: 60,
        estimatedMinutes: 45,
        ccssStandards: ['CCSS.MATH.4.MD.4', 'CCSS.MATH.5.MD.2'],
      },
      {
        challengeId: 'EH-W3-C4',
        challengeNumber: 4,
        title: 'Informative Landform Article',
        subject: 'Writing',
        description: 'Write a 2-paragraph informational text about a landform',
        instructions: [
          'Choose a landform: volcano, mountain, valley, canyon, or island',
          'Research: How is it formed? Where are examples found?',
          'Paragraph 1: Describe the landform (what it looks like)',
          'Paragraph 2: Explain how it forms (geological process)',
          'Include a labeled diagram',
        ],
        masteryRequirements: [
          'Text is organized and informative',
          'Uses domain-specific vocabulary',
          'Diagram supports text',
          'Explains geological processes accurately',
        ],
        submissionType: 'multiple',
        xpReward: 65,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.ELA-LITERACY.W.4.2'],
      },
      {
        challengeId: 'EH-W3-C5',
        challengeNumber: 5,
        title: 'Build a Working Volcano',
        subject: 'Project',
        description: 'Construct a volcano model and simulate an eruption',
        instructions: [
          'Build volcano shape using: clay, papier-mâché, or playdough around a bottle',
          'Paint and decorate realistically',
          'Create eruption using: baking soda + vinegar (or Mentos + soda)',
          'Record a video of your eruption',
          'Explain: How is this similar to a real volcanic eruption? How is it different?',
        ],
        masteryRequirements: [
          'Model is structurally sound',
          'Eruption is successful',
          'Video includes scientific explanation',
          'Compares model to real volcanoes',
        ],
        submissionType: 'video',
        xpReward: 100,
        estimatedMinutes: 90,
        materials: ['Bottle', 'Clay/papier-mâché', 'Paint', 'Baking soda', 'Vinegar', 'Food coloring'],
      },
    ],
    totalXP: 335,
    estimatedWeeks: 1,
  },

  // ========== WEEK 4: STATES OF MATTER ==========
  {
    week: 4,
    questId: 'EH-W4-MATTER',
    theme: 'States of Matter',
    badge: {
      name: 'The Alchemist',
      icon: '⚗️',
      color: 'from-purple-600 to-pink-500',
    },
    handsOnProject: {
      title: '3D Molecule Models',
      description: 'Build models of molecules in solid, liquid, and gas states',
      submissionType: 'multiple',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Density & Change',
      concepts: ['Solid', 'Liquid', 'Gas', 'Density', 'Phase change'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Ratios & Proportions',
      ccssStandards: ['CCSS.MATH.6.RP.A.1', 'CCSS.MATH.6.RP.A.2', 'CCSS.MATH.6.RP.A.3'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Scientific Lab Journaling',
      genre: 'Technical',
      ccssStandards: ['CCSS.ELA-LITERACY.W.4.2', 'CCSS.ELA-LITERACY.W.5.2'],
      gradeLevel: '5',
    },
    challenges: [
      {
        challengeId: 'EH-W4-C1',
        challengeNumber: 1,
        title: 'States of Matter Exploration',
        subject: 'STEAM',
        description: 'Investigate the properties of solids, liquids, and gases',
        instructions: [
          'Find 5 examples of each state of matter in your home',
          'Test properties: Does it have definite shape? Definite volume?',
          'Create a comparison chart',
          'Draw particle diagrams showing how molecules are arranged in each state',
        ],
        masteryRequirements: [
          'Identifies properties of each state',
          'Particle diagrams are accurate',
          'Explains molecular behavior',
        ],
        submissionType: 'multiple',
        xpReward: 55,
        estimatedMinutes: 35,
      },
      {
        challengeId: 'EH-W4-C2',
        challengeNumber: 2,
        title: 'Density Detective',
        subject: 'STEAM',
        description: 'Experiment with density using household liquids',
        instructions: [
          'Gather 5 liquids: water, oil, honey, dish soap, rubbing alcohol',
          'Predict: Which is most dense? Least dense?',
          'Create a density tower by pouring slowly into a clear container',
          'Observe the layers',
          'Explain: Why do less dense liquids float on top of denser ones?',
        ],
        masteryRequirements: [
          'Successfully creates density tower',
          'Makes accurate predictions',
          'Explains density concept',
        ],
        submissionType: 'multiple',
        xpReward: 70,
        estimatedMinutes: 45,
        materials: ['Clear container', 'Water', 'Oil', 'Honey', 'Dish soap', 'Rubbing alcohol'],
      },
      {
        challengeId: 'EH-W4-C3',
        challengeNumber: 3,
        title: 'Ratios in Recipes',
        subject: 'Math',
        description: 'Use ratios and proportions to scale recipes',
        instructions: [
          'Choose a simple recipe (cookies, slime, pancakes)',
          'Original recipe serves 4. Scale it to serve 8.',
          'Show your ratio work: If 2 cups flour → 4 people, then ___ cups → 8 people',
          'Solve 5 ratio problems',
          'Create a table showing original vs. doubled amounts',
        ],
        masteryRequirements: [
          'Correctly applies ratio reasoning',
          'Shows clear work',
          'Understands proportional relationships',
        ],
        submissionType: 'image',
        xpReward: 60,
        estimatedMinutes: 40,
        ccssStandards: ['CCSS.MATH.6.RP.A.3'],
      },
      {
        challengeId: 'EH-W4-C4',
        challengeNumber: 4,
        title: 'Scientific Lab Journal Entry',
        subject: 'Writing',
        description: 'Document an experiment using proper lab journal format',
        instructions: [
          'Conduct the ice melting experiment: Does salt make ice melt faster?',
          'Journal format: Title, Date, Question, Hypothesis, Materials, Procedure, Observations, Conclusion',
          'Include data table showing melting times',
          'Write objective observations (what you saw, not what you think)',
          'Draw a conclusion based on evidence',
        ],
        masteryRequirements: [
          'Follows proper lab journal format',
          'Observations are objective and detailed',
          'Conclusion is supported by data',
          'Uses scientific vocabulary',
        ],
        submissionType: 'multiple',
        xpReward: 65,
        estimatedMinutes: 50,
        ccssStandards: ['CCSS.ELA-LITERACY.W.5.2'],
        materials: ['Ice cubes', 'Salt', 'Timer', 'Two bowls'],
      },
      {
        challengeId: 'EH-W4-C5',
        challengeNumber: 5,
        title: 'Molecule Models',
        subject: 'Project',
        description: 'Build 3D models showing molecular arrangement in solid, liquid, and gas',
        instructions: [
          'Use materials: marshmallows/balls (molecules) + toothpicks (bonds)',
          'Build Model 1: Solid (molecules tightly packed, fixed positions)',
          'Build Model 2: Liquid (molecules close but can slide)',
          'Build Model 3: Gas (molecules far apart, free movement)',
          'Take photos and label each',
          'Write: How does particle movement relate to state of matter?',
        ],
        masteryRequirements: [
          'Models accurately represent molecular arrangement',
          'Shows understanding of particle motion',
          'Explains relationship between arrangement and properties',
        ],
        submissionType: 'multiple',
        xpReward: 95,
        estimatedMinutes: 60,
        materials: ['Marshmallows or foam balls', 'Toothpicks', 'Cardboard base', 'Labels'],
      },
    ],
    totalXP: 345,
    estimatedWeeks: 1,
  },

  // ========== WEEKS 5-16 SUMMARY (To be expanded) ==========
  // Week 5: Water Cycle - Hydrologist badge
  // Week 6: Solar System - Astrophysicist badge
  // Week 7: Ecosystems - The Guardian badge
  // Week 8: Human Body - Inner Machine badge
  // Week 9: Physics & Motion - The Pilot badge
  // Week 10: Economics - Entrepreneur badge
  // Week 11: Structural Engineering - The Architect badge
  // Week 12: Energy Systems - Power Source badge
  // Week 13: Chemistry - Master Chef badge
  // Week 14: Modern History - Civic Leader badge
  // Week 15: Investigation - The Specialist badge
  // Week 16: Showcase - Master Explorer badge

  // ========== WEEK 5: WATER CYCLE ==========
  {
    week: 5,
    questId: 'EH-W5-WATER',
    theme: 'Water Cycle',
    badge: {
      name: 'Hydrologist',
      icon: '💧',
      color: 'from-blue-400 to-cyan-400',
    },
    handsOnProject: {
      title: 'Water Simulation Box',
      description: 'Build a closed system showing evaporation, condensation, and precipitation',
      submissionType: 'video',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Pressure Systems',
      concepts: ['Evaporation', 'Condensation', 'Precipitation', 'Water pressure'],
      gradeLevel: '4',
    },
    mathFocus: {
      topic: 'Multi-Digit Operations',
      ccssStandards: ['CCSS.MATH.4.NBT.4', 'CCSS.MATH.4.NBT.5', 'CCSS.MATH.4.NBT.6'],
      gradeLevel: '4',
    },
    readingWritingFocus: {
      topic: 'Summarizing Science Texts',
      genre: 'Informational Summary',
      ccssStandards: ['CCSS.ELA-LITERACY.RI.4.2', 'CCSS.ELA-LITERACY.W.4.2'],
      gradeLevel: '4',
    },
    challenges: [],
    totalXP: 320,
    estimatedWeeks: 1,
  },

  // ========== WEEK 6: SOLAR SYSTEM ==========
  {
    week: 6,
    questId: 'EH-W6-SOLAR',
    theme: 'Solar System',
    badge: {
      name: 'Astrophysicist',
      icon: '🌌',
      color: 'from-indigo-600 to-purple-600',
    },
    handsOnProject: {
      title: 'Rotating Sun–Earth–Moon Model',
      description: 'Build a mechanical model showing planetary rotation and revolution',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Celestial Mechanics',
      concepts: ['Rotation', 'Revolution', 'Orbit', 'Gravity', 'Phases of the moon'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Scientific Notation & Scaling',
      ccssStandards: ['CCSS.MATH.5.NBT.2', 'CCSS.MATH.6.EE.2'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Reflective "Unknown" Writing',
      genre: 'Reflective Essay',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.3'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 360,
    estimatedWeeks: 1,
  },

  // ========== WEEK 7: ECOSYSTEMS ==========
  {
    week: 7,
    questId: 'EH-W7-ECOSYSTEMS',
    theme: 'Ecosystems',
    badge: {
      name: 'The Guardian',
      icon: '🌿',
      color: 'from-green-500 to-lime-500',
    },
    handsOnProject: {
      title: 'Miniature Terrarium',
      description: 'Create a self-sustaining closed ecosystem',
      submissionType: 'multiple',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Energy Flow',
      concepts: ['Food chains', 'Food webs', 'Producers', 'Consumers', 'Decomposers'],
      gradeLevel: '4',
    },
    mathFocus: {
      topic: 'Area via Unit Squares',
      ccssStandards: ['CCSS.MATH.3.MD.6', 'CCSS.MATH.4.MD.3'],
      gradeLevel: '4',
    },
    readingWritingFocus: {
      topic: 'Descriptive Habitat Writing',
      genre: 'Descriptive',
      ccssStandards: ['CCSS.ELA-LITERACY.W.4.3'],
      gradeLevel: '4',
    },
    challenges: [],
    totalXP: 330,
    estimatedWeeks: 1,
  },

  // ========== WEEK 8: HUMAN BODY ==========
  {
    week: 8,
    questId: 'EH-W8-BODY',
    theme: 'Human Body',
    badge: {
      name: 'Inner Machine',
      icon: '🫀',
      color: 'from-red-500 to-pink-500',
    },
    handsOnProject: {
      title: 'Working Lung Model',
      description: 'Build a functional model of the respiratory system',
      submissionType: 'video',
      estimatedHours: 3,
    },
    steamFocus: {
      topic: 'Body Systems',
      concepts: ['Respiratory', 'Circulatory', 'Digestive', 'Muscular', 'Skeletal'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Area & Perimeter (Composite Shapes)',
      ccssStandards: ['CCSS.MATH.4.MD.3', 'CCSS.MATH.5.NF.4'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Persuasive Health Essay',
      genre: 'Persuasive',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.1'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 340,
    estimatedWeeks: 1,
  },

  // ========== WEEK 9: PHYSICS & MOTION ==========
  {
    week: 9,
    questId: 'EH-W9-PHYSICS',
    theme: 'Physics & Motion',
    badge: {
      name: 'The Pilot',
      icon: '🚀',
      color: 'from-sky-500 to-blue-600',
    },
    handsOnProject: {
      title: 'Balloon-Powered Racers',
      description: 'Design and race balloon-powered vehicles',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: "Newton's Laws",
      concepts: ['Inertia', 'Force = mass × acceleration', 'Action-reaction', 'Friction'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Speed = Distance ÷ Time',
      ccssStandards: ['CCSS.MATH.5.MD.1', 'CCSS.MATH.6.RP.3'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Inventor Biography',
      genre: 'Biography',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.2'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 350,
    estimatedWeeks: 1,
  },

  // ========== WEEK 10: ECONOMICS ==========
  {
    week: 10,
    questId: 'EH-W10-ECONOMICS',
    theme: 'Economics',
    badge: {
      name: 'Entrepreneur',
      icon: '💼',
      color: 'from-yellow-500 to-amber-600',
    },
    handsOnProject: {
      title: 'Virtual Storefront',
      description: 'Create a business plan and digital storefront for a product',
      submissionType: 'digital',
      estimatedHours: 5,
    },
    steamFocus: {
      topic: 'Algorithms & Logic',
      concepts: ['Supply & demand', 'Profit & loss', 'Marketing', 'Decision trees'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Budgeting + Percent Change',
      ccssStandards: ['CCSS.MATH.5.NBT.7', 'CCSS.MATH.6.RP.3'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Business Proposal Writing',
      genre: 'Persuasive Business',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.1'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 370,
    estimatedWeeks: 1,
  },

  // ========== WEEK 11: STRUCTURAL ENGINEERING ==========
  {
    week: 11,
    questId: 'EH-W11-ENGINEERING',
    theme: 'Structural Engineering',
    badge: {
      name: 'The Architect',
      icon: '🏗️',
      color: 'from-gray-600 to-slate-700',
    },
    handsOnProject: {
      title: 'Spaghetti Bridge Test',
      description: 'Design and build a bridge that can hold the most weight',
      submissionType: 'video',
      estimatedHours: 5,
    },
    steamFocus: {
      topic: 'Tension & Compression',
      concepts: ['Structural forces', 'Bridge types', 'Load distribution', 'Triangles'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Geometry in Design',
      ccssStandards: ['CCSS.MATH.4.G.1', 'CCSS.MATH.5.G.3'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Explanatory Tech Report',
      genre: 'Technical Writing',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.2'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 380,
    estimatedWeeks: 1,
  },

  // ========== WEEK 12: ENERGY SYSTEMS ==========
  {
    week: 12,
    questId: 'EH-W12-ENERGY',
    theme: 'Energy Systems',
    badge: {
      name: 'Power Source',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
    },
    handsOnProject: {
      title: 'Electrical Circuits',
      description: 'Build simple and parallel circuits with lights and switches',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Renewables',
      concepts: ['Solar', 'Wind', 'Hydro', 'Circuits', 'Conductors & insulators'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Data Tables → Graphs',
      ccssStandards: ['CCSS.MATH.5.MD.2', 'CCSS.MATH.6.SP.4'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: '"Solar City" Creative Story',
      genre: 'Science Fiction',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.3'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 360,
    estimatedWeeks: 1,
  },

  // ========== WEEK 13: CHEMISTRY ==========
  {
    week: 13,
    questId: 'EH-W13-CHEMISTRY',
    theme: 'Chemistry',
    badge: {
      name: 'Master Chef',
      icon: '👨‍🍳',
      color: 'from-orange-500 to-red-500',
    },
    handsOnProject: {
      title: 'Kitchen Chemistry',
      description: 'Conduct 5 kitchen chemistry experiments and analyze results',
      submissionType: 'video',
      estimatedHours: 4,
    },
    steamFocus: {
      topic: 'Physical vs Chemical Change',
      concepts: ['Reactions', 'pH', 'Acids & bases', 'Endothermic', 'Exothermic'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Metric Conversions',
      ccssStandards: ['CCSS.MATH.5.MD.1'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Procedural Text Analysis',
      genre: 'Procedural',
      ccssStandards: ['CCSS.ELA-LITERACY.W.4.2'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 350,
    estimatedWeeks: 1,
  },

  // ========== WEEK 14: MODERN HISTORY ==========
  {
    week: 14,
    questId: 'EH-W14-HISTORY',
    theme: 'Modern History',
    badge: {
      name: 'Civic Leader',
      icon: '🗽',
      color: 'from-blue-600 to-indigo-700',
    },
    handsOnProject: {
      title: 'Digital Storyboard',
      description: 'Create a digital timeline of a historical movement',
      submissionType: 'digital',
      estimatedHours: 5,
    },
    steamFocus: {
      topic: 'Digital Citizenship',
      concepts: ['Online safety', 'Media literacy', 'Civic responsibility', 'Voting'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Coordinate Plane Mapping',
      ccssStandards: ['CCSS.MATH.5.G.1', 'CCSS.MATH.5.G.2'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Reflective History Essay',
      genre: 'Reflective Essay',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.1'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 340,
    estimatedWeeks: 1,
  },

  // ========== WEEK 15: INVESTIGATION ==========
  {
    week: 15,
    questId: 'EH-W15-INVESTIGATION',
    theme: 'Investigation',
    badge: {
      name: 'The Specialist',
      icon: '🔍',
      color: 'from-teal-500 to-cyan-600',
    },
    handsOnProject: {
      title: 'Capstone Draft',
      description: 'Begin your final capstone project combining all learning',
      submissionType: 'multiple',
      estimatedHours: 6,
    },
    steamFocus: {
      topic: 'Independent Inquiry',
      concepts: ['Research methods', 'Hypothesis testing', 'Data collection', 'Analysis'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Cumulative Review',
      ccssStandards: ['CCSS.MATH.3.OA.8', 'CCSS.MATH.4.NBT.6', 'CCSS.MATH.5.MD.2'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Portfolio Polishing',
      genre: 'Portfolio Curation',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.4'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 400,
    estimatedWeeks: 1,
  },

  // ========== WEEK 16: SHOWCASE ==========
  {
    week: 16,
    questId: 'EH-W16-SHOWCASE',
    theme: 'Showcase',
    badge: {
      name: 'Master Explorer',
      icon: '🏆',
      color: 'from-yellow-500 to-orange-500',
    },
    handsOnProject: {
      title: 'Public Exhibition',
      description: 'Present your capstone project and portfolio to an audience',
      submissionType: 'video',
      estimatedHours: 8,
    },
    steamFocus: {
      topic: 'Collaborative Challenge',
      concepts: ['Teamwork', 'Presentation', 'Peer review', 'Reflection'],
      gradeLevel: '5',
    },
    mathFocus: {
      topic: 'Data Visualization',
      ccssStandards: ['CCSS.MATH.5.MD.2', 'CCSS.MATH.6.SP.4'],
      gradeLevel: '5',
    },
    readingWritingFocus: {
      topic: 'Self-Assessment Journal',
      genre: 'Reflective Journal',
      ccssStandards: ['CCSS.ELA-LITERACY.W.5.3'],
      gradeLevel: '5',
    },
    challenges: [],
    totalXP: 500,
    estimatedWeeks: 1,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getQuestByWeek(week: number): ExplorerQuest | null {
  return EXPLORERS_HUB_CURRICULUM.find(q => q.week === week) || null;
}

/**
 * Get quest by ID
 */
export function getQuestById(questId: string): Quest | undefined {
  return EXPLORERS_HUB_CURRICULUM.find((q) => q.questId === questId);
}

/**
 * Get quest ID from challenge ID
 */
export function getQuestIdFromChallenge(challengeId: string): string {
  // Challenge ID format: EH-W1-C1, EH-W2-C3, etc.
  const weekMatch = challengeId.match(/W(\d+)/);
  if (!weekMatch) return '';
  
  const week = parseInt(weekMatch[1]);
  const quest = getQuestByWeek(week);
  return quest?.questId || '';
}

export function getChallengeById(challengeId: string): ExplorerChallenge | null {
  for (const quest of EXPLORERS_HUB_CURRICULUM) {
    const challenge = quest.challenges.find(c => c.challengeId === challengeId);
    if (challenge) return challenge;
  }
  return null;
}

export function getTotalXPForCurriculum(): number {
  return EXPLORERS_HUB_CURRICULUM.reduce((sum, quest) => sum + quest.totalXP, 0);
}

export function getQuestsBySubject(subject: ExplorerChallenge['subject']): ExplorerQuest[] {
  return EXPLORERS_HUB_CURRICULUM.filter(quest => 
    quest.challenges.some(c => c.subject === subject)
  );
}

// ============================================================================
// BADGE SYSTEM
// ============================================================================

export const EXPLORER_BADGES = EXPLORERS_HUB_CURRICULUM.map(quest => ({
  badgeId: `BADGE-${quest.questId}`,
  name: quest.badge.name,
  icon: quest.badge.icon,
  color: quest.badge.color,
  questId: quest.questId,
  earnedBy: 'Completing all challenges in ' + quest.theme,
}));