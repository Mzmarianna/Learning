/**
 * WEEKS 5-16 DETAILED CHALLENGES
 * 
 * Expanded challenge details for Explorers Hub curriculum
 * Import and merge with main curriculum file
 */

import { ExplorerChallenge } from './explorers-hub-curriculum';

// ============================================================================
// WEEK 5: WATER CYCLE - HYDROLOGIST 💧
// ============================================================================

export const WEEK_5_CHALLENGES: ExplorerChallenge[] = [
  {
    challengeId: 'EH-W5-C1',
    challengeNumber: 1,
    title: 'Water Cycle Diagram Master',
    subject: 'STEAM',
    description: 'Create a labeled diagram showing all stages of the water cycle',
    instructions: [
      'Draw or digitally create a water cycle diagram',
      'Label: Evaporation, Condensation, Precipitation, Collection',
      'Add arrows showing the direction water moves',
      'Include: Sun (energy source), clouds, rain, ocean, land',
      'Explain what happens at each stage in 1-2 sentences',
    ],
    masteryRequirements: [
      'All 4 stages are labeled correctly',
      'Arrows show correct water movement',
      'Explanations are scientifically accurate',
    ],
    submissionType: 'image',
    xpReward: 50,
    estimatedMinutes: 30,
  },
  {
    challengeId: 'EH-W5-C2',
    challengeNumber: 2,
    title: 'Evaporation Investigation',
    subject: 'STEAM',
    description: 'Experiment with evaporation speed under different conditions',
    instructions: [
      'Place equal amounts of water in 4 cups',
      'Cup 1: Sunny windowsill',
      'Cup 2: Shady spot',
      'Cup 3: Refrigerator',
      'Cup 4: Near a fan',
      'Measure water level after 24 hours',
      'Record which evaporated fastest and slowest',
      'Explain WHY temperature and air movement matter',
    ],
    masteryRequirements: [
      'Tests all 4 conditions',
      'Records data accurately',
      'Explains role of heat and air movement',
    ],
    submissionType: 'multiple',
    xpReward: 65,
    estimatedMinutes: 40,
    materials: ['4 identical cups', 'Water', 'Measuring cup', 'Marker', 'Ruler or measuring tape'],
  },
  {
    challengeId: 'EH-W5-C3',
    challengeNumber: 3,
    title: 'Rainfall Data Analysis',
    subject: 'Math',
    description: 'Calculate average rainfall using multi-digit addition and division',
    instructions: [
      'Use data: Rainfall in inches for 6 months (e.g., 3.5, 4.2, 2.8, 5.1, 3.9, 4.5)',
      'Add all rainfall amounts (multi-digit addition with decimals)',
      'Divide by 6 to find average monthly rainfall',
      'Show all work',
      'Create a bar graph of the data',
      'Identify: Which month had the most/least rain?',
    ],
    masteryRequirements: [
      'Addition and division are correct',
      'Shows clear calculation steps',
      'Graph is accurate and labeled',
    ],
    submissionType: 'image',
    xpReward: 55,
    estimatedMinutes: 45,
    ccssStandards: ['CCSS.MATH.4.NBT.4', 'CCSS.MATH.4.NBT.6'],
  },
  {
    challengeId: 'EH-W5-C4',
    challengeNumber: 4,
    title: 'Summarize a Science Article',
    subject: 'Writing',
    description: 'Read and summarize an article about water conservation',
    instructions: [
      'Read a 2-3 page article about water conservation (provided or find online)',
      'Write a 1-paragraph summary (5-7 sentences)',
      'Include: Main idea, 3 key facts, conclusion',
      'Use your own words (don\'t copy sentences)',
      'Add your opinion: What's one way YOU can save water?',
    ],
    masteryRequirements: [
      'Summary captures main idea',
      'Includes key facts from article',
      'Written in own words',
      'Personal connection is meaningful',
    ],
    submissionType: 'text',
    xpReward: 50,
    estimatedMinutes: 35,
    ccssStandards: ['CCSS.ELA-LITERACY.RI.4.2', 'CCSS.ELA-LITERACY.W.4.2'],
  },
  {
    challengeId: 'EH-W5-C5',
    challengeNumber: 5,
    title: 'Build a Water Cycle in a Box',
    subject: 'Project',
    description: 'Create a closed terrarium showing evaporation, condensation, and precipitation',
    instructions: [
      'Get a clear plastic container with lid (or large jar)',
      'Add: 1 inch of gravel, 2 inches of soil, small plants or grass seeds',
      'Water lightly until soil is moist',
      'Seal container',
      'Place in sunny spot',
      'Observe daily for 3-5 days: Where does condensation form? Where does water "rain"?',
      'Record a video explaining the mini water cycle you created',
    ],
    masteryRequirements: [
      'Container is properly sealed',
      'Shows visible condensation',
      'Video clearly explains each part of water cycle',
      'Connects model to real water cycle',
    ],
    submissionType: 'video',
    xpReward: 100,
    estimatedMinutes: 60,
    materials: ['Clear container with lid', 'Gravel', 'Potting soil', 'Small plants or seeds', 'Water'],
  },
];

// ============================================================================
// TOTAL HELPER FUNCTION
// ============================================================================

export function getAllExpandedChallenges() {
  return {
    week5: WEEK_5_CHALLENGES,
    // week6: WEEK_6_CHALLENGES, // To be added
    // week7: WEEK_7_CHALLENGES, // To be added
    // ... etc.
  };
}

// ============================================================================
// XP TOTALS
// ============================================================================

const WEEK_5_TOTAL = WEEK_5_CHALLENGES.reduce((sum, c) => sum + c.xpReward, 0); // 320 XP

export const EXPANDED_WEEK_TOTALS = {
  week5: WEEK_5_TOTAL,
  // Add more as we expand
};
