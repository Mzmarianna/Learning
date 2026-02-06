/**
 * Quest Narrative System
 * Transforms boring units into epic adventures
 */

import { QuestStory, BossChallenge, ChallengeStory, ChallengeType } from './types/kingdom';

// ============================================================================
// QUEST NARRATIVES DATABASE
// ============================================================================

export const QUEST_NARRATIVES: Record<string, QuestStory> = {
  // ========== WARRIORS TIER (6TH-8TH GRADE) ==========
  'WA-W1-FOUNDATIONS': {
    questId: 'WA-W1-FOUNDATIONS',
    title: 'Kingdom Foundations',
    story: 'You\'ve entered the warrior tier. Your first mission: Prove you can think strategically, solve complex problems, and lead others. The kingdom needs warriors who can analyze, create, and defend their work.',
    location: 'The Strategic Council Chamber',
    npcGuide: 'Commander Strategos',
    questGiver: 'The High Council',
    chapter: 1,
    chapterTitles: [
      'Design Your Experiment',
      'Master Variables & Expressions',
      'Craft Your Thesis',
      'Analyze Arguments',
      'Set Strategic Goals',
    ],
  },

  'WA-W2-ECONOMICS': {
    questId: 'WA-W2-ECONOMICS',
    title: 'Medieval Economics & Trade',
    story: 'The kingdom\'s treasury is running low! As a warrior, you must understand how economics, trade, and resource management keep a kingdom alive. Learn to budget, trade, and make strategic financial decisions.',
    location: 'The Grand Marketplace',
    npcGuide: 'Merchant Lord Aurum',
    questGiver: 'The Royal Treasurer',
    chapter: 2,
    chapterTitles: [
      'Supply & Demand Simulation',
      'Master Ratios & Proportions',
      'Persuade the King',
      'Analyze Economic Texts',
      'Budget Your Kingdom',
    ],
  },

  'WA-W3-ENGINEERING': {
    questId: 'WA-W3-ENGINEERING',
    title: 'Engineering & Architecture',
    story: 'The kingdom needs stronger defenses! Learn the art of engineering—from bridges to castles. Use geometry, physics, and strategic planning to build structures that will stand the test of time.',
    location: 'The Engineering Guild',
    npcGuide: 'Master Builder Archimedes',
    questGiver: 'The Royal Engineer',
    chapter: 3,
    chapterTitles: [
      'Build a Bridge',
      'Calculate Castle Dimensions',
      'Write Technical Procedures',
      'Interpret Engineering Diagrams',
      'Design Your Fortress',
    ],
  },

  'WA-W4-CHEMISTRY': {
    questId: 'WA-W4-CHEMISTRY',
    title: 'Alchemy & Chemistry',
    story: 'The royal alchemist seeks an apprentice! Dive into the science of matter—learn about atoms, molecules, reactions, and the periodic table. Transform your kitchen into a laboratory.',
    location: 'The Royal Laboratory',
    npcGuide: 'Alchemist Mendeleev',
    questGiver: 'The Court Scientist',
    chapter: 4,
    chapterTitles: [
      'Test Acids & Bases',
      'Solve Chemical Ratios',
      'Write a Lab Report',
      'Explore the Periodic Table',
      'Design Your Experiment',
    ],
  },

  'WA-W5-ALGEBRA': {
    questId: 'WA-W5-ALGEBRA',
    title: 'The Algebra Frontier',
    story: 'Venture into the unknown lands of algebra! Master equations, variables, and problem-solving. Algebra is the language of advanced mathematics—learn to speak it fluently.',
    location: 'The Equation Forge',
    npcGuide: 'Professor Variable',
    questGiver: 'The Math Sage',
    chapter: 5,
    chapterTitles: [
      'Code an Algebraic Calculator',
      'Conquer Multi-Step Equations',
      'Explain Your Solution',
      'Translate Word Problems',
      'Algebra in Your Life',
    ],
  },

  'WA-W6-LITERATURE': {
    questId: 'WA-W6-LITERATURE',
    title: 'Literary Analysis & Legends',
    story: 'The kingdom\'s stories hold hidden wisdom. As a scholar-warrior, learn to analyze legends, identify themes, and understand symbolism. Every great leader must know the power of stories.',
    location: 'The Library of Legends',
    npcGuide: 'Scribe Sophia',
    questGiver: 'The Head Librarian',
    chapter: 6,
    chapterTitles: [
      'Analyze Storytelling Across Media',
      'Statistical Analysis of Literature',
      'Write Literary Analysis',
      'Character Development Study',
      'Create Your Own Legend',
    ],
  },

  'WA-W7-ECOLOGY': {
    questId: 'WA-W7-ECOLOGY',
    title: 'Ecosystems & Environmental Science',
    story: 'The kingdom\'s forests are in danger! Learn about ecosystems, food webs, and environmental balance. A warrior protects not just people, but the land itself.',
    location: 'The Emerald Forest',
    npcGuide: 'Ranger Sylvan',
    questGiver: 'The Forest Keeper',
    chapter: 7,
    chapterTitles: [
      'Map Your Local Food Web',
      'Calculate Population Changes',
      'Write Environmental Essay',
      'Analyze Environmental Data',
      'Design Conservation Plan',
    ],
  },

  'WA-W8-HISTORY': {
    questId: 'WA-W8-HISTORY',
    title: 'Historical Analysis & Critical Reading',
    story: 'To understand the present, you must study the past. Learn to analyze primary sources, evaluate bias, and understand cause and effect in history. The past holds lessons for future warriors.',
    location: 'The Archives of Time',
    npcGuide: 'Chronicler Marcus',
    questGiver: 'The Royal Historian',
    chapter: 8,
    chapterTitles: [
      'Investigate Primary Sources',
      'Create Historical Timeline',
      'Write Cause & Effect Essay',
      'Evaluate Historical Arguments',
      'Prepare Historical Debate',
    ],
  },

  'WA-W9-CODING': {
    questId: 'WA-W9-CODING',
    title: 'Introduction to Programming',
    story: 'The kingdom needs technologists! Learn to code—create programs, solve logic puzzles, and build your first game. Programming is problem-solving at its finest.',
    location: 'The Code Academy',
    npcGuide: 'Technomancer Ada',
    questGiver: 'The Head of Innovation',
    chapter: 9,
    chapterTitles: [
      'Think Like a Programmer',
      'Master Boolean Logic',
      'Write Code Documentation',
      'Debug & Fix Errors',
      'Build Your First Program',
    ],
  },

  'WA-W10-STATS': {
    questId: 'WA-W10-STATS',
    title: 'Data Science & Probability',
    story: 'Numbers tell stories—if you know how to read them. Learn statistics, probability, and data analysis. Make informed decisions backed by evidence.',
    location: 'The Data Observatory',
    npcGuide: 'Statistician Pascal',
    questGiver: 'The Royal Data Analyst',
    chapter: 10,
    chapterTitles: [
      'Design a Survey',
      'Calculate Statistical Measures',
      'Write Data-Driven Report',
      'Master Probability',
      'Spot Misleading Statistics',
    ],
  },

  'WA-W11-GEOMETRY': {
    questId: 'WA-W11-GEOMETRY',
    title: 'Advanced Geometry & Spatial Reasoning',
    story: 'Return to geometry, but at the warrior level. Master 3D shapes, proofs, coordinate planes, and spatial reasoning. Build structures that defy gravity.',
    location: 'The Geometry Citadel',
    npcGuide: 'Architect Euclid',
    questGiver: 'The Master Geometer',
    chapter: 11,
    chapterTitles: [
      '3D Design Challenge',
      'Conquer Triangles',
      'Write Geometric Proofs',
      'Master Coordinate Plane',
      'Geometry in Architecture',
    ],
  },

  'WA-W12-ENERGY': {
    questId: 'WA-W12-ENERGY',
    title: 'Energy & Electricity',
    story: 'The kingdom faces an energy crisis! Learn about electricity, circuits, and renewable energy. Power the kingdom\'s future with science and innovation.',
    location: 'The Energy Reactor',
    npcGuide: 'Engineer Tesla',
    questGiver: 'The Chief Energy Officer',
    chapter: 12,
    chapterTitles: [
      'Build Circuits',
      'Master Ohm\'s Law',
      'Research Renewable Energy',
      'Conduct Energy Audit',
      'Design Energy Solution',
    ],
  },

  'WA-W13-PERSUASION': {
    questId: 'WA-W13-PERSUASION',
    title: 'Rhetoric & Persuasion',
    story: 'A warrior\'s words can be as powerful as their sword. Learn the art of persuasion—rhetoric, debate, and public speaking. Convince, inspire, and lead through language.',
    location: 'The Hall of Rhetoric',
    npcGuide: 'Orator Cicero',
    questGiver: 'The Speech Master',
    chapter: 13,
    chapterTitles: [
      'Analyze Persuasive Techniques',
      'Statistics in Persuasion',
      'Write Persuasive Essay',
      'Deconstruct Famous Speeches',
      'Deliver Your Speech',
    ],
  },

  'WA-W14-BIOLOGY': {
    questId: 'WA-W14-BIOLOGY',
    title: 'Cell Biology & Genetics',
    story: 'Life\'s greatest mysteries hide in the smallest places. Explore cells, DNA, and genetics. Understand the building blocks of all living things.',
    location: 'The Genetics Laboratory',
    npcGuide: 'Biologist Darwin',
    questGiver: 'The Head Geneticist',
    chapter: 14,
    chapterTitles: [
      'Build a Cell Model',
      'Calculate Genetics Probability',
      'Write DNA Research Report',
      'Study Cell Processes',
      'Solve Genetics Mysteries',
    ],
  },

  'WA-W15-CAPSTONE': {
    questId: 'WA-W15-CAPSTONE',
    title: 'The Great Investigation',
    story: 'Your ultimate test as a warrior: Design and complete an original research project. Combine everything you\'ve learned—science, math, writing, critical thinking—into one comprehensive investigation.',
    location: 'The Research Institute',
    npcGuide: 'Master Researcher Curie',
    questGiver: 'The Grand Council',
    chapter: 15,
    chapterTitles: [
      'Design Your Investigation',
      'Collect & Analyze Data',
      'Write Research Paper',
      'Conduct Literature Review',
      'Present Your Findings',
    ],
  },

  'WA-W16-SHOWCASE': {
    questId: 'WA-W16-SHOWCASE',
    title: 'Warrior Portfolio & Mastery Defense',
    story: 'Your final challenge: Prove your mastery. Create a portfolio showcasing your best work, reflect on your journey, and defend your learning before the High Council. Graduate as a true warrior.',
    location: 'The Hall of Champions',
    npcGuide: 'Council Elder Athena',
    questGiver: 'The High Council',
    chapter: 16,
    chapterTitles: [
      'Curate Your Portfolio',
      'Analyze Your Math Growth',
      'Write Reflective Essay',
      'Peer Review & Feedback',
      'Mastery Defense Presentation',
    ],
  },

  // ========== LEVEL 1 - MATH ==========
  'L1-UM-Q1': {
    questId: 'L1-UM-Q1',
    title: 'The Counting Castle',
    story: 'The kingdom\'s ancient treasure is locked behind magical doors numbered 1 through 10. Only warriors who master the art of counting can unlock each door and claim the treasure within!',
    location: 'Counting Castle',
    npcGuide: 'Count Vonumber',
    questGiver: 'The King of Mathematics',
    chapter: 1,
    chapterTitles: [
      'The Castle Gates',
      'Door of One',
      'Door of Two',
      'Door of Three',
      'Door of Four',
      'Door of Five',
      'Door of Six',
      'Midpoint Challenge',
      'Door of Seven',
      'Door of Eight',
      'Door of Nine',
      'Door of Ten',
      'The Counting Race',
      'The Number Sequence',
      'Practice Battle',
      'The Treasure Guardian',
    ],
  },
  
  'L1-UM-Q2': {
    questId: 'L1-UM-Q2',
    title: 'The Addition Arena',
    story: 'In the legendary Addition Arena, warriors train to combine their forces! Learn to add numbers together to defeat increasingly powerful opponents.',
    location: 'Addition Arena',
    npcGuide: 'Addy the Adder',
    questGiver: 'Arena Master Summus',
    chapter: 1,
    chapterTitles: [
      'Arena Entrance',
      'Adding Small Numbers',
      'The Power of Plus',
      'Combining Forces',
      'Adding to 10',
      'Number Bonds',
      'Speed Training',
      'Midpoint Boss Battle',
      'Adding to 20',
      'Double Digits',
      'Three Number Sums',
      'The Addition Matrix',
      'Word Problems Begin',
      'Real World Adding',
      'Arena Championship',
      'The Grand Sum Master',
    ],
  },
  
  'L1-UM-Q3': {
    questId: 'L1-UM-Q3',
    title: 'The Subtraction Summit',
    story: 'Climb the treacherous Subtraction Summit where warriors learn the ancient art of taking away. Each step up the mountain requires mastering a new subtraction skill!',
    location: 'Subtraction Summit',
    npcGuide: 'Minus the Mountain Guide',
    questGiver: 'Peak Keeper',
    chapter: 1,
    chapterTitles: [
      'Base Camp',
      'Taking Away Basics',
      'The Minus Sign',
      'Subtracting Small',
      'From 10 and Under',
      'Counting Back',
      'The Difference',
      'Midpoint Ascent',
      'From 20 and Under',
      'Double Digit Descent',
      'Missing Numbers',
      'Fact Families',
      'Word Problems',
      'Real Life Scenarios',
      'Summit Approach',
      'Peak Conquest',
    ],
  },
  
  // ========== LEVEL 1 - READING ==========
  'L1-UR-Q1': {
    questId: 'L1-UR-Q1',
    title: 'The Alphabet Tower',
    story: 'The ancient Alphabet Tower has 26 floors, each representing a letter. Climb from A to Z, mastering the sound and shape of each letter to reach the top and unlock the reading realm!',
    location: 'Alphabet Tower',
    npcGuide: 'Professor Letters',
    questGiver: 'Tower Guardian Alpha',
    chapter: 1,
    chapterTitles: [
      'Ground Floor - A to E',
      'Second Floor - F to J',
      'Third Floor - K to O',
      'Fourth Floor - P to T',
      'Fifth Floor - U to Z',
      'Capital Letters',
      'Lowercase Letters',
      'Midpoint - Letter Recognition',
      'Letter Sounds Begin',
      'Phonics Foundation',
      'Beginning Sounds',
      'Ending Sounds',
      'Middle Sounds',
      'ABC Order',
      'Tower Climb Challenge',
      'The Alphabet Dragon',
    ],
  },
  
  'L1-UR-Q2': {
    questId: 'L1-UR-Q2',
    title: 'The Phonics Forest',
    story: 'Deep in the Phonics Forest, magical trees grow words from seeds of sound. Learn to blend letter sounds together to harvest your first words and become a reading warrior!',
    location: 'Phonics Forest',
    npcGuide: 'Soundra the Sage',
    questGiver: 'Forest Keeper Blend',
    chapter: 1,
    chapterTitles: [
      'Forest Entrance',
      'CVC Words - Short A',
      'CVC Words - Short E',
      'CVC Words - Short I',
      'CVC Words - Short O',
      'CVC Words - Short U',
      'Blending Practice',
      'Midpoint - Reading CVC',
      'Consonant Blends',
      'Digraphs Begin',
      'Simple Sentences',
      'Sight Words',
      'Word Families',
      'Reading Fluency',
      'Forest Exploration',
      'The Word Wizard',
    ],
  },
  
  // ========== LEVEL 2 - MATH ==========
  'L2-UM-Q1': {
    questId: 'L2-UM-Q1',
    title: 'The Multiplication Mountains',
    story: 'Twelve treacherous peaks rise before you—the Multiplication Mountains! Each peak represents a times table. Conquer all twelve summits to earn the legendary Multiplier Medal and unlock exponential power!',
    location: 'Multiplier Mountains',
    npcGuide: 'Multi the Mountaineer',
    questGiver: 'Peak Commander Times',
    chapter: 1,
    chapterTitles: [
      'Mountain Base - What is Multiplication?',
      'Peak One - The Ones Table',
      'Peak Two - Doubles',
      'Peak Three - Triples',
      'Peak Four - Fours',
      'Peak Five - High Five',
      'Peak Six - The Sixes',
      'Midpoint Summit - Times Tables 1-6',
      'Peak Seven - Lucky Seven',
      'Peak Eight - The Eights',
      'Peak Nine - Cloud Nine',
      'Peak Ten - Perfect Ten',
      'Peak Eleven - Eleven',
      'Peak Twelve - The Dozen',
      'Mixed Practice Ascent',
      'The Multiplication Master',
    ],
  },
  
  'L2-UM-Q2': {
    questId: 'L2-UM-Q2',
    title: 'The Division Dungeon',
    story: 'Descend into the Division Dungeon where treasure must be shared fairly among warriors. Master the art of splitting and sharing to escape with the loot!',
    location: 'Division Dungeon',
    npcGuide: 'Divida the Fair',
    questGiver: 'Dungeon Master Share',
    chapter: 1,
    chapterTitles: [
      'Dungeon Entrance',
      'What is Division?',
      'Sharing Equally',
      'Division as Grouping',
      'Division by 2',
      'Division by 3',
      'Division by 4',
      'Midpoint - Division Facts 1-4',
      'Division by 5',
      'Division by 10',
      'Remainders Appear',
      'Fact Families',
      'Word Problems',
      'Mixed Practice',
      'Dungeon Escape',
      'The Division Dragon',
    ],
  },
  
  'L2-UM-Q3': {
    questId: 'L2-UM-Q3',
    title: 'The Fraction Fortress',
    story: 'The Fraction Fortress holds treasures divided into parts. Learn to work with halves, thirds, and quarters to unlock doors that only open to those who understand parts of a whole!',
    location: 'Fraction Fortress',
    npcGuide: 'Frac the Divider',
    questGiver: 'Fortress Commander Part',
    chapter: 1,
    chapterTitles: [
      'Fortress Gates',
      'What are Fractions?',
      'Halves - 1/2',
      'Quarters - 1/4',
      'Thirds - 1/3',
      'Comparing Parts',
      'Equivalent Fractions',
      'Midpoint - Fraction Basics',
      'Adding Fractions',
      'Subtracting Fractions',
      'Fractions of Groups',
      'Mixed Numbers',
      'Pizza Problems',
      'Real World Fractions',
      'Fortress Defense',
      'The Fraction Guardian',
    ],
  },
  
  // ========== LEVEL 2 - READING ==========
  'L2-UR-Q1': {
    questId: 'L2-UR-Q1',
    title: 'The Comprehension Caves',
    story: 'The Comprehension Caves hide ancient stories carved into their walls. Warriors must not only read the words but understand their meaning to navigate safely through!',
    location: 'Comprehension Caves',
    npcGuide: 'Professor Understand',
    questGiver: 'Cave Guardian Meaning',
    chapter: 1,
    chapterTitles: [
      'Cave Entrance',
      'Main Idea',
      'Supporting Details',
      'Who, What, When, Where',
      'Story Elements',
      'Characters',
      'Setting',
      'Midpoint - Understanding Stories',
      'Plot and Events',
      'Problem and Solution',
      'Cause and Effect',
      'Making Predictions',
      'Drawing Conclusions',
      'Summarizing',
      'Cave Navigation',
      'The Story Dragon',
    ],
  },
  
  // ========== LEVEL 2 - WRITING ==========
  'L2-UW-Q1': {
    questId: 'L2-UW-Q1',
    title: 'The Sentence Smithy',
    story: 'In the ancient Sentence Smithy, warriors forge powerful sentences from words like a blacksmith forges swords from metal. Master the craft to create your own written magic!',
    location: 'Sentence Smithy',
    npcGuide: 'Smith Syntax',
    questGiver: 'Master Wordsmith',
    chapter: 1,
    chapterTitles: [
      'Smithy Entrance',
      'What is a Sentence?',
      'Capital Letters',
      'End Punctuation',
      'Complete Thoughts',
      'Subjects',
      'Predicates',
      'Midpoint - Sentence Basics',
      'Describing Words',
      'Action Words',
      'Expanding Sentences',
      'Compound Sentences',
      'Questions',
      'Exclamations',
      'Smithy Challenge',
      'The Grammar Guardian',
    ],
  },
};

// ============================================================================
// BOSS CHALLENGE DEFINITIONS
// ============================================================================

export const BOSS_CHALLENGES: Record<string, BossChallenge> = {
  // Level 1 Math Bosses
  'L1-UM-Q1-C8': {
    challengeId: 'L1-UM-Q1-C8',
    bossName: 'The Number Sentinel',
    bossType: 'Midpoint',
    difficulty: 2,
    lives: 3,
    timeLimit: 600, // 10 minutes
    requiredAccuracy: 70,
    xpReward: 150,
    badgeReward: 'counting-champion',
  },
  'L1-UM-Q1-C16': {
    challengeId: 'L1-UM-Q1-C16',
    bossName: 'The Treasure Guardian',
    bossType: 'Final',
    difficulty: 3,
    lives: 3,
    requiredAccuracy: 80,
    xpReward: 250,
    badgeReward: 'counting-master',
    cosmeticReward: 'golden-counter-badge',
  },
  
  // Level 2 Math Bosses
  'L2-UM-Q1-C8': {
    challengeId: 'L2-UM-Q1-C8',
    bossName: 'The Multiplication Titan',
    bossType: 'Midpoint',
    difficulty: 3,
    lives: 3,
    timeLimit: 900, // 15 minutes
    requiredAccuracy: 75,
    xpReward: 200,
    badgeReward: 'times-tables-warrior',
  },
  'L2-UM-Q1-C16': {
    challengeId: 'L2-UM-Q1-C16',
    bossName: 'The Multiplication Master',
    bossType: 'Final',
    difficulty: 4,
    lives: 3,
    requiredAccuracy: 85,
    xpReward: 350,
    badgeReward: 'multiplication-master',
    cosmeticReward: 'multiplier-medal',
  },
  
  'L2-UM-Q3-C16': {
    challengeId: 'L2-UM-Q3-C16',
    bossName: 'The Fraction Dragon',
    bossType: 'Final',
    difficulty: 4,
    lives: 3,
    requiredAccuracy: 80,
    xpReward: 350,
    badgeReward: 'fraction-slayer',
    cosmeticReward: 'fraction-crown',
  },
};

// ============================================================================
// CHALLENGE TYPE DETERMINATION
// ============================================================================

export function getChallengeType(challengeNumber: number, isCheckpoint: boolean): ChallengeType {
  if (isCheckpoint) {
    if (challengeNumber === 1) return 'Battle'; // Assessment
    if (challengeNumber === 8) return 'Boss'; // Midpoint Boss
    if (challengeNumber === 16) return 'Boss'; // Final Boss
  }
  
  // Vary challenge types for engagement
  const pattern = challengeNumber % 5;
  
  switch (pattern) {
    case 1: return 'Battle'; // Most common
    case 2: return 'Puzzle';
    case 3: return 'Build';
    case 4: return 'Explore';
    default: return 'Battle';
  }
}

// ============================================================================
// CHALLENGE STORY GENERATION
// ============================================================================

const BATTLE_TEMPLATES = [
  'Defeat the ${enemy} blocking your path!',
  'Battle the ${enemy} to prove your strength!',
  'Vanquish the ${enemy} guardian!',
  'Face the mighty ${enemy} in combat!',
  'Conquer the ${enemy} challenge!',
];

const PUZZLE_TEMPLATES = [
  'Solve the ${puzzle} to unlock the door!',
  'Decipher the ${puzzle} mystery!',
  'Crack the ${puzzle} code!',
  'Unravel the ${puzzle} enigma!',
  'Master the ${puzzle} riddle!',
];

const BUILD_TEMPLATES = [
  'Construct a ${item} to proceed!',
  'Create a ${item} using your skills!',
  'Build a ${item} to demonstrate mastery!',
  'Forge a ${item} in the smithy!',
  'Craft a ${item} from your knowledge!',
];

const EXPLORE_TEMPLATES = [
  'Discover the secrets of ${location}!',
  'Investigate the mysterious ${location}!',
  'Explore the hidden ${location}!',
  'Navigate through the ${location}!',
  'Journey to the ${location}!',
];

const BOSS_TEMPLATES = [
  'Face the mighty ${boss} in epic battle!',
  'Challenge the legendary ${boss}!',
  'Conquer the fearsome ${boss}!',
  'Defeat the powerful ${boss}!',
  'Vanquish ${boss} to claim victory!',
];

export function generateChallengeStory(
  questStory: QuestStory,
  challengeNumber: number,
  type: ChallengeType
): ChallengeStory {
  const chapterTitle = questStory.chapterTitles[challengeNumber - 1] || `Challenge ${challengeNumber}`;
  
  let templates: string[];
  let variables: Record<string, string> = {};
  
  switch (type) {
    case 'Battle':
      templates = BATTLE_TEMPLATES;
      variables = { enemy: `${questStory.location} Guardian` };
      break;
    case 'Puzzle':
      templates = PUZZLE_TEMPLATES;
      variables = { puzzle: chapterTitle };
      break;
    case 'Build':
      templates = BUILD_TEMPLATES;
      variables = { item: 'proof of mastery' };
      break;
    case 'Explore':
      templates = EXPLORE_TEMPLATES;
      variables = { location: questStory.location };
      break;
    case 'Boss':
      templates = BOSS_TEMPLATES;
      const boss = BOSS_CHALLENGES[`${questStory.questId}-C${challengeNumber}`];
      variables = { boss: boss?.bossName || 'the Boss' };
      break;
  }
  
  const template = templates[challengeNumber % templates.length];
  let story = template;
  
  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    story = story.replace(`\${${key}}`, value);
  });
  
  return {
    challengeId: `${questStory.questId}-C${challengeNumber}`,
    type,
    title: `Chapter ${challengeNumber}: ${chapterTitle}`,
    story: `You've reached ${questStory.location}. ${story}`,
    task: type === 'Boss' 
      ? 'Complete the boss challenge to prove your mastery!'
      : 'Complete this challenge to earn XP and progress on your quest!',
    successCriteria: type === 'Boss'
      ? `Achieve ${BOSS_CHALLENGES[`${questStory.questId}-C${challengeNumber}`]?.requiredAccuracy || 80}% accuracy to defeat the boss`
      : 'Submit evidence and receive tutor approval',
    hints: generateHints(type, challengeNumber),
    wowlSupportAvailable: true,
    peerHelpAllowed: challengeNumber > 1 && type !== 'Boss',
  };
}

function generateHints(type: ChallengeType, challengeNumber: number): string[] {
  const hints: string[] = [];
  
  switch (type) {
    case 'Battle':
      hints.push('Review the concept before attempting');
      hints.push('Break the problem into smaller steps');
      hints.push('Ask Wowl for help if you\'re stuck');
      break;
    case 'Puzzle':
      hints.push('Look for patterns in the problem');
      hints.push('Try working backwards');
      hints.push('Draw a picture or diagram');
      break;
    case 'Build':
      hints.push('Plan before you build');
      hints.push('Use examples as inspiration');
      hints.push('Show your work step by step');
      break;
    case 'Explore':
      hints.push('Read carefully and take notes');
      hints.push('Look for key information');
      hints.push('Connect to what you already know');
      break;
    case 'Boss':
      hints.push('Review all previous challenges first');
      hints.push('Take your time - accuracy matters');
      hints.push('You can retry if needed - warriors never give up!');
      break;
  }
  
  return hints;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getQuestStory(questId: string): QuestStory | undefined {
  return QUEST_NARRATIVES[questId];
}

export function getBossChallenge(challengeId: string): BossChallenge | undefined {
  return BOSS_CHALLENGES[challengeId];
}

export function isBossChallenge(challengeNumber: number): boolean {
  return challengeNumber === 8 || challengeNumber === 16;
}

export function getQuestProgress(completedChallenges: number, totalChallenges: number = 16): number {
  return Math.round((completedChallenges / totalChallenges) * 100);
}