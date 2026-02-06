/**
 * IB (INTERNATIONAL BACCALAUREATE) COMPETENCY FRAMEWORK
 * 
 * Adapted for Mz. Marianna's Academy with focus on:
 * - Holistic development
 * - Multiple developmental areas
 * - Play-based learning
 * - Child-centered approach
 */

export interface IBCompetency {
  id: string;
  area: DevelopmentalArea;
  competency: string;
  description: string;
  ageRange: string;
  examples: string[];
  assessmentCriteria: string[];
}

export type DevelopmentalArea =
  | 'health_physical'
  | 'language_literacy'
  | 'numeracy_cognitive'
  | 'social_emotional'
  | 'life_skills'
  | 'creative_thinking'
  | 'play_exploration';

export interface CompetencyProgress {
  competencyId: string;
  studentId: string;
  status: 'not_started' | 'emerging' | 'developing' | 'proficient' | 'mastered';
  evidenceNotes: string[];
  lastAssessed: Date;
  nextSteps: string;
}

/**
 * IB-inspired competencies organized by developmental area
 */
export const IB_COMPETENCIES: Record<DevelopmentalArea, IBCompetency[]> = {
  health_physical: [
    {
      id: 'hp-1',
      area: 'health_physical',
      competency: 'Gross Motor Development',
      description: 'Demonstrates coordination, balance, and body awareness through movement',
      ageRange: '4-7',
      examples: [
        'Runs, jumps, and climbs confidently',
        'Participates in active play and games',
        'Shows body control during movement activities',
      ],
      assessmentCriteria: [
        'Can hop on one foot for 5 seconds',
        'Catches a ball with two hands',
        'Navigates obstacles during play',
      ],
    },
    {
      id: 'hp-2',
      area: 'health_physical',
      competency: 'Fine Motor Skills',
      description: 'Uses hands and fingers with increasing precision and control',
      ageRange: '4-7',
      examples: [
        'Holds pencil with proper grip',
        'Cuts with scissors along lines',
        'Manipulates small objects (buttons, beads)',
      ],
      assessmentCriteria: [
        'Can draw basic shapes and letters',
        'Builds with blocks showing control',
        'Uses tools (scissors, glue) appropriately',
      ],
    },
    {
      id: 'hp-3',
      area: 'health_physical',
      competency: 'Health & Wellness Awareness',
      description: 'Understands and practices healthy habits for body and mind',
      ageRange: '4-7',
      examples: [
        'Recognizes when body needs rest or movement',
        'Makes healthy food choices when given options',
        'Practices basic hygiene independently',
      ],
      assessmentCriteria: [
        'Identifies healthy vs. less healthy foods',
        'Washes hands without reminders',
        'Recognizes feelings in body (tired, hungry, energetic)',
      ],
    },
  ],

  language_literacy: [
    {
      id: 'll-1',
      area: 'language_literacy',
      competency: 'Oral Communication',
      description: 'Expresses ideas, thoughts, and feelings through spoken language',
      ageRange: '4-7',
      examples: [
        'Shares stories and experiences with others',
        'Asks questions to learn more',
        'Participates in conversations and discussions',
      ],
      assessmentCriteria: [
        'Speaks in complete sentences',
        'Vocabulary appropriate for age',
        'Listens and responds to others',
      ],
    },
    {
      id: 'll-2',
      area: 'language_literacy',
      competency: 'Early Reading Skills',
      description: 'Develops phonemic awareness and beginning reading skills',
      ageRange: '4-7',
      examples: [
        'Recognizes letters and letter sounds',
        'Shows interest in books and stories',
        'Begins to decode simple words',
      ],
      assessmentCriteria: [
        'Identifies most letter names and sounds',
        'Recognizes high-frequency words',
        'Reads simple sentences with support',
      ],
    },
    {
      id: 'll-3',
      area: 'language_literacy',
      competency: 'Early Writing Skills',
      description: 'Communicates through drawing, symbols, and emerging writing',
      ageRange: '4-7',
      examples: [
        'Draws pictures to tell stories',
        'Forms letters with increasing accuracy',
        'Writes own name and simple words',
      ],
      assessmentCriteria: [
        'Writes first and last name independently',
        'Uses invented spelling to write words',
        'Writes for different purposes (lists, labels, stories)',
      ],
    },
  ],

  numeracy_cognitive: [
    {
      id: 'nc-1',
      area: 'numeracy_cognitive',
      competency: 'Number Sense',
      description: 'Understands quantity, counting, and basic number concepts',
      ageRange: '4-7',
      examples: [
        'Counts objects accurately to 20+',
        'Understands more, less, and equal',
        'Recognizes and writes numbers',
      ],
      assessmentCriteria: [
        'One-to-one correspondence when counting',
        'Compares quantities and explains reasoning',
        'Skip counts by 2s, 5s, or 10s',
      ],
    },
    {
      id: 'nc-2',
      area: 'numeracy_cognitive',
      competency: 'Mathematical Thinking',
      description: 'Solves problems using mathematical reasoning and strategies',
      ageRange: '4-7',
      examples: [
        'Solves simple addition and subtraction problems',
        'Uses manipulatives to model math concepts',
        'Recognizes patterns and relationships',
      ],
      assessmentCriteria: [
        'Solves word problems with concrete objects',
        'Explains mathematical thinking',
        'Creates and extends patterns',
      ],
    },
    {
      id: 'nc-3',
      area: 'numeracy_cognitive',
      competency: 'Inquiry & Investigation',
      description: 'Asks questions, explores, and investigates to learn',
      ageRange: '4-7',
      examples: [
        'Asks "why" and "how" questions',
        'Tests ideas through exploration',
        'Makes observations and predictions',
      ],
      assessmentCriteria: [
        'Formulates questions about topics of interest',
        'Conducts simple investigations',
        'Shares findings with others',
      ],
    },
  ],

  social_emotional: [
    {
      id: 'se-1',
      area: 'social_emotional',
      competency: 'Self-Awareness',
      description: 'Recognizes and understands own feelings, strengths, and needs',
      ageRange: '4-7',
      examples: [
        'Names and describes feelings',
        'Identifies personal interests and preferences',
        'Recognizes when needing help or break',
      ],
      assessmentCriteria: [
        'Uses feeling words appropriately',
        'Shows awareness of own abilities',
        'Communicates needs to adults',
      ],
    },
    {
      id: 'se-2',
      area: 'social_emotional',
      competency: 'Social Relationships',
      description: 'Builds positive relationships and works cooperatively with others',
      ageRange: '4-7',
      examples: [
        'Plays cooperatively with peers',
        'Shares and takes turns',
        'Shows empathy for others',
      ],
      assessmentCriteria: [
        'Initiates and maintains friendships',
        'Resolves conflicts with peer support',
        'Shows consideration for others feelings',
      ],
    },
    {
      id: 'se-3',
      area: 'social_emotional',
      competency: 'Self-Regulation',
      description: 'Manages emotions and behaviors in different situations',
      ageRange: '4-7',
      examples: [
        'Uses strategies to calm down when upset',
        'Waits for turn without reminders',
        'Follows routines and transitions smoothly',
      ],
      assessmentCriteria: [
        'Uses calming strategies independently',
        'Adapts behavior to different settings',
        'Persists with challenging tasks',
      ],
    },
  ],

  life_skills: [
    {
      id: 'ls-1',
      area: 'life_skills',
      competency: 'Independence & Self-Care',
      description: 'Demonstrates increasing independence in daily activities',
      ageRange: '4-7',
      examples: [
        'Dresses self with minimal help',
        'Manages personal belongings',
        'Follows multi-step directions',
      ],
      assessmentCriteria: [
        'Completes self-care tasks independently',
        'Takes responsibility for belongings',
        'Follows 3-4 step directions',
      ],
    },
    {
      id: 'ls-2',
      area: 'life_skills',
      competency: 'Organization & Planning',
      description: 'Plans, organizes, and follows through on tasks and activities',
      ageRange: '4-7',
      examples: [
        'Gathers materials needed for activities',
        'Plans steps for simple projects',
        'Cleans up after activities',
      ],
      assessmentCriteria: [
        'Organizes materials for tasks',
        'Follows through on simple plans',
        'Completes cleanup independently',
      ],
    },
    {
      id: 'ls-3',
      area: 'life_skills',
      competency: 'Decision Making',
      description: 'Makes choices and understands consequences',
      ageRange: '4-7',
      examples: [
        'Chooses activities during free time',
        'Considers options before deciding',
        'Reflects on outcomes of choices',
      ],
      assessmentCriteria: [
        'Makes age-appropriate choices',
        'Explains reasoning for decisions',
        'Learns from experiences',
      ],
    },
  ],

  creative_thinking: [
    {
      id: 'ct-1',
      area: 'creative_thinking',
      competency: 'Imagination & Innovation',
      description: 'Uses imagination to create, invent, and express ideas',
      ageRange: '4-7',
      examples: [
        'Engages in imaginative play',
        'Creates original artwork and constructions',
        'Generates multiple solutions to problems',
      ],
      assessmentCriteria: [
        'Creates elaborate imaginary scenarios',
        'Uses materials in innovative ways',
        'Offers creative solutions',
      ],
    },
    {
      id: 'ct-2',
      area: 'creative_thinking',
      competency: 'Artistic Expression',
      description: 'Expresses ideas and feelings through various art forms',
      ageRange: '4-7',
      examples: [
        'Uses art materials with purpose',
        'Creates representations of experiences',
        'Experiments with different mediums',
      ],
      assessmentCriteria: [
        'Creates art with intention',
        'Describes own artwork',
        'Tries new artistic techniques',
      ],
    },
    {
      id: 'ct-3',
      area: 'creative_thinking',
      competency: 'Critical Thinking',
      description: 'Analyzes, evaluates, and thinks flexibly about ideas',
      ageRange: '4-7',
      examples: [
        'Asks thoughtful questions',
        'Considers different perspectives',
        'Adjusts thinking based on new information',
      ],
      assessmentCriteria: [
        'Questions assumptions',
        'Considers multiple viewpoints',
        'Revises ideas based on feedback',
      ],
    },
  ],

  play_exploration: [
    {
      id: 'pe-1',
      area: 'play_exploration',
      competency: 'Exploratory Play',
      description: 'Engages in open-ended play and exploration',
      ageRange: '4-7',
      examples: [
        'Investigates materials and objects',
        'Tries new activities willingly',
        'Explores environment with curiosity',
      ],
      assessmentCriteria: [
        'Engages deeply in play activities',
        'Experiments with materials',
        'Shows sustained curiosity',
      ],
    },
    {
      id: 'pe-2',
      area: 'play_exploration',
      competency: 'Collaborative Play',
      description: 'Engages in cooperative play and shared exploration',
      ageRange: '4-7',
      examples: [
        'Works with peers on projects',
        'Shares ideas during play',
        'Builds on others ideas',
      ],
      assessmentCriteria: [
        'Participates in group play',
        'Contributes to shared goals',
        'Negotiates roles and rules',
      ],
    },
    {
      id: 'pe-3',
      area: 'play_exploration',
      competency: 'Persistence & Risk-Taking',
      description: 'Perseveres with challenges and tries new experiences',
      ageRange: '4-7',
      examples: [
        'Continues trying when tasks are difficult',
        'Willing to make mistakes and learn',
        'Takes appropriate risks during play',
      ],
      assessmentCriteria: [
        'Attempts challenging activities',
        'Learns from mistakes',
        'Shows resilience when frustrated',
      ],
    },
  ],
};

/**
 * Get competencies for a specific developmental area
 */
export function getCompetenciesByArea(area: DevelopmentalArea): IBCompetency[] {
  return IB_COMPETENCIES[area] || [];
}

/**
 * Get all competencies as flat array
 */
export function getAllCompetencies(): IBCompetency[] {
  return Object.values(IB_COMPETENCIES).flat();
}

/**
 * Get developmental area information
 */
export const DEVELOPMENTAL_AREAS: Record<
  DevelopmentalArea,
  { name: string; icon: string; color: string; description: string }
> = {
  health_physical: {
    name: 'Health & Physical Development',
    icon: '🏃',
    color: 'green',
    description: 'Building strong, healthy bodies and minds through movement and wellness',
  },
  language_literacy: {
    name: 'Language & Literacy',
    icon: '📚',
    color: 'blue',
    description: 'Developing communication skills through reading, writing, and speaking',
  },
  numeracy_cognitive: {
    name: 'Numeracy & Cognitive Exploration',
    icon: '🔢',
    color: 'purple',
    description: 'Building mathematical thinking and problem-solving skills',
  },
  social_emotional: {
    name: 'Social & Emotional Skills',
    icon: '❤️',
    color: 'pink',
    description: 'Understanding emotions and building positive relationships',
  },
  life_skills: {
    name: 'Life Skills',
    icon: '🛠️',
    color: 'amber',
    description: 'Developing independence and practical everyday skills',
  },
  creative_thinking: {
    name: 'Creative Thinking',
    icon: '🎨',
    color: 'orange',
    description: 'Expressing ideas through imagination, art, and innovation',
  },
  play_exploration: {
    name: 'Play & Exploration',
    icon: '🎮',
    color: 'cyan',
    description: 'Learning through play-based discovery and hands-on experiences',
  },
};
