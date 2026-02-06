/**
 * THEME-BASED CURRICULUM SYSTEM
 * 
 * Implements flexible, theme-based learning that:
 * - Integrates multiple developmental areas
 * - Follows subject rotation (Mon-Math, Tue-Reading, Wed-Writing, Thu-STEAM)
 * - Supports differentiation and scaffolding
 * - Emphasizes child-centered, play-based learning
 * - Incorporates multiple pedagogical approaches
 */

import type { DevelopmentalArea } from './ib-competencies';

export interface WeeklyTheme {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  duration: 'week' | 'two-weeks';
  bigIdea: string;
  essentialQuestions: string[];
  developmentalAreas: DevelopmentalArea[];
  pedagogicalApproaches: PedagogicalApproach[];
  dailyActivities: DailyActivity[];
  materials: string[];
  vocabulary: string[];
  learningCenters: LearningCenter[];
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type SubjectFocus = 'math' | 'reading' | 'writing' | 'steam' | 'flexible';

export type PedagogicalApproach =
  | 'high-scope'
  | 'reggio-emilia'
  | 'montessori'
  | 'orton-gillingham'
  | 'anji-play'
  | 'project-based'
  | 'play-to-learn';

export interface DailyActivity {
  day: DayOfWeek;
  subjectFocus: SubjectFocus;
  title: string;
  description: string;
  type: 'structured-play' | 'exploration' | 'teacher-guided' | 'peer-tutoring' | 'small-group';
  duration: string;
  developmentalAreas: DevelopmentalArea[];
  multisensory: {
    visual?: string;
    auditory?: string;
    kinesthetic?: string;
    tactile?: string;
  };
  materials: string[];
  teacherRole: string;
  childLeadership: string;
  differentiation: {
    emerging: string;
    developing: string;
    proficient: string;
  };
}

export interface LearningCenter {
  id: string;
  name: string;
  type: 'exploration' | 'activity' | 'project' | 'quiet' | 'movement';
  description: string;
  materials: string[];
  suggestedActivities: string[];
  developmentalAreas: DevelopmentalArea[];
  setup: string;
}

/**
 * Weekly Subject Schedule (flexible framework)
 */
export const WEEKLY_SCHEDULE: Record<DayOfWeek, { focus: SubjectFocus; guidingPrinciple: string }> = {
  monday: {
    focus: 'math',
    guidingPrinciple: 'Mathematical thinking through hands-on exploration and games',
  },
  tuesday: {
    focus: 'reading',
    guidingPrinciple: 'Literacy development through stories, phonics, and multisensory activities',
  },
  wednesday: {
    focus: 'writing',
    guidingPrinciple: 'Expression through writing, drawing, and creative communication',
  },
  thursday: {
    focus: 'steam',
    guidingPrinciple: 'Science, Technology, Engineering, Art, Math through projects and exploration',
  },
  friday: {
    focus: 'flexible',
    guidingPrinciple: 'Flexible day for project completion, review, or child-led exploration',
  },
};

/**
 * Example Theme: "Plants & Growing Things"
 */
export const EXAMPLE_THEME_PLANTS: WeeklyTheme = {
  id: 'theme-plants-1',
  title: 'The Great Garden Adventure',
  description: 'Explore the magical world of plants through hands-on investigation, creative projects, and outdoor exploration',
  ageRange: '4-7',
  duration: 'two-weeks',
  bigIdea: 'All living things grow and change, and we can observe and support this growth',
  essentialQuestions: [
    'What do plants need to grow?',
    'How do seeds become plants?',
    'Why are plants important to us?',
    'What can we learn by observing nature?',
  ],
  developmentalAreas: [
    'numeracy_cognitive',
    'language_literacy',
    'creative_thinking',
    'health_physical',
    'play_exploration',
  ],
  pedagogicalApproaches: ['reggio-emilia', 'project-based', 'anji-play', 'play-to-learn'],
  vocabulary: [
    'seed', 'soil', 'roots', 'stem', 'leaves', 'flower', 'grow', 'sprout', 
    'water', 'sunlight', 'observe', 'measure', 'compare',
  ],
  materials: [
    'Various seeds (bean, sunflower, etc.)',
    'Small pots or cups',
    'Soil',
    'Watering cans',
    'Magnifying glasses',
    'Rulers and tape measures',
    'Art supplies (paper, paint, clay)',
    'Books about plants',
    'Camera for documentation',
  ],
  dailyActivities: [
    // MONDAY - MATH FOCUS
    {
      day: 'monday',
      subjectFocus: 'math',
      title: 'Measuring Plant Growth',
      description: 'Children measure and compare different plants, creating graphs to track growth over time',
      type: 'small-group',
      duration: '45 minutes',
      developmentalAreas: ['numeracy_cognitive', 'language_literacy'],
      multisensory: {
        visual: 'Charts and graphs with colorful markers',
        kinesthetic: 'Using rulers and tape measures to measure plants',
        tactile: 'Handling plants and measuring tools',
      },
      materials: ['Rulers', 'Graph paper', 'Markers', 'Live plants at different growth stages'],
      teacherRole: 'Sets up measurement stations; asks questions like "Which plant is taller? How much taller?"',
      childLeadership: 'Children choose which plants to measure, predict growth, and create their own graphs',
      differentiation: {
        emerging: 'Compare sizes using non-standard units (hand spans, blocks)',
        developing: 'Measure with rulers to nearest inch, record numbers',
        proficient: 'Create detailed growth charts, calculate differences, make predictions',
      },
    },

    // TUESDAY - READING FOCUS
    {
      day: 'tuesday',
      subjectFocus: 'reading',
      title: 'Plant Stories & Vocabulary Building',
      description: 'Read books about plants, label plant parts, and create a vocabulary garden',
      type: 'teacher-guided',
      duration: '40 minutes',
      developmentalAreas: ['language_literacy', 'creative_thinking'],
      multisensory: {
        visual: 'Picture books with vibrant plant illustrations',
        auditory: 'Story reading with sound effects and songs',
        kinesthetic: 'Acting out plant growth (curled up like seed, stretching like sprout)',
      },
      materials: ['Plant-themed books', 'Word cards', 'Real plants for labeling'],
      teacherRole: 'Reads engaging stories; introduces vocabulary in context; facilitates discussion',
      childLeadership: 'Children ask questions, predict what happens next, create own plant stories',
      differentiation: {
        emerging: 'Picture-based vocabulary cards, oral retelling',
        developing: 'Match words to pictures, write simple labels',
        proficient: 'Read simple plant texts independently, write plant facts',
      },
    },

    // WEDNESDAY - WRITING FOCUS
    {
      day: 'wednesday',
      subjectFocus: 'writing',
      title: 'Plant Growth Journals',
      description: 'Children document plant observations through drawings, labels, and emerging writing',
      type: 'exploration',
      duration: '50 minutes',
      developmentalAreas: ['language_literacy', 'creative_thinking', 'numeracy_cognitive'],
      multisensory: {
        visual: 'Observing real plants with magnifying glasses',
        tactile: 'Touching different plant parts (soft petals, rough bark)',
        kinesthetic: 'Drawing and writing in journals',
      },
      materials: ['Journals', 'Pencils/crayons', 'Magnifying glasses', 'Plants to observe'],
      teacherRole: 'Provides guiding questions; models observation and documentation; celebrates all forms of expression',
      childLeadership: 'Children choose what to observe, how to document (drawing, writing, labels), and what questions to explore',
      differentiation: {
        emerging: 'Drawing with teacher scribe for labels',
        developing: 'Drawing plus invented spelling',
        proficient: 'Detailed observations with conventional spelling and descriptions',
      },
    },

    // THURSDAY - STEAM FOCUS
    {
      day: 'thursday',
      subjectFocus: 'steam',
      title: 'Plant Science Experiments',
      description: 'Hands-on investigations: What do plants need? Experimenting with water, light, and soil',
      type: 'project-based',
      duration: '60 minutes',
      developmentalAreas: ['numeracy_cognitive', 'creative_thinking', 'play_exploration'],
      multisensory: {
        visual: 'Observing plants in different conditions',
        tactile: 'Planting seeds, handling soil and water',
        kinesthetic: 'Setting up experiments, watering plants',
      },
      materials: ['Seeds', 'Pots', 'Soil', 'Water', 'Plastic wrap', 'Labels', 'Hypothesis cards'],
      teacherRole: 'Sets up investigation stations; asks open-ended questions; supports scientific thinking',
      childLeadership: 'Children make predictions, design experiments, test variables, draw conclusions',
      differentiation: {
        emerging: 'Simple observations with teacher support',
        developing: 'Make predictions and test one variable',
        proficient: 'Design multi-variable experiments, record detailed observations',
      },
    },

    // FRIDAY - FLEXIBLE
    {
      day: 'friday',
      subjectFocus: 'flexible',
      title: 'Garden Creation Day',
      description: 'Culminating project: Create a classroom or outdoor garden based on week\'s learning',
      type: 'project-based',
      duration: 'Full morning',
      developmentalAreas: ['creative_thinking', 'social_emotional', 'life_skills', 'health_physical'],
      multisensory: {
        visual: 'Garden design drawings and plans',
        tactile: 'Digging, planting, arranging',
        kinesthetic: 'Physical work of creating garden',
        auditory: 'Music and songs about growing',
      },
      materials: ['All materials from week', 'Additional garden supplies', 'Signs and decorations'],
      teacherRole: 'Facilitates planning; ensures safety; documents process; celebrates achievements',
      childLeadership: 'Children plan layout, divide tasks, problem-solve challenges, lead the project',
      differentiation: {
        emerging: 'Participates in hands-on planting with peer support',
        developing: 'Takes on specific roles, follows multi-step plans',
        proficient: 'Leads portions of project, helps peers, reflects on process',
      },
    },
  ],
  learningCenters: [
    {
      id: 'plant-exploration',
      name: 'Plant Investigation Station',
      type: 'exploration',
      description: 'Hands-on exploration of real plants, seeds, and natural materials',
      materials: [
        'Magnifying glasses',
        'Various seeds and plants',
        'Tweezers and droppers',
        'Observation journals',
        'Nature specimens',
      ],
      suggestedActivities: [
        'Dissect flowers to see parts',
        'Sort seeds by size, color, shape',
        'Use magnifiers to observe details',
        'Document findings with drawings',
      ],
      developmentalAreas: ['numeracy_cognitive', 'language_literacy', 'play_exploration'],
      setup: 'Low table with materials in clear containers; journals and pencils nearby; rotating plant specimens',
    },
    {
      id: 'garden-dramatic-play',
      name: 'Garden Shop & Farmer\'s Market',
      type: 'activity',
      description: 'Dramatic play area where children role-play as gardeners, farmers, and shoppers',
      materials: [
        'Play vegetables and fruits',
        'Baskets and bags',
        'Play money and cash register',
        'Garden tools (child-sized)',
        'Signs and price tags',
      ],
      suggestedActivities: [
        'Set up a farmers market',
        'Buy and sell produce',
        'Plant pretend garden',
        'Create signs and advertisements',
      ],
      developmentalAreas: ['social_emotional', 'language_literacy', 'numeracy_cognitive', 'life_skills'],
      setup: 'Corner area with shelves for produce; tables for market stall; dress-up clothes (aprons, hats)',
    },
    {
      id: 'art-creation',
      name: 'Plant Art Studio',
      type: 'activity',
      description: 'Creative expression through plant-inspired art using various mediums',
      materials: [
        'Paint and brushes',
        'Natural materials (leaves, flowers, twigs)',
        'Clay and playdough',
        'Collage materials',
        'Printing materials',
      ],
      suggestedActivities: [
        'Print with leaves and flowers',
        'Paint botanical illustrations',
        'Create 3D plants with clay',
        'Collage with natural materials',
      ],
      developmentalAreas: ['creative_thinking', 'health_physical'],
      setup: 'Art table with smocks; materials organized in bins; display area for finished work; natural inspiration wall',
    },
    {
      id: 'reading-cozy-corner',
      name: 'Garden Reading Nook',
      type: 'quiet',
      description: 'Comfortable space with plant-themed books for independent and shared reading',
      materials: [
        'Variety of plant books',
        'Stuffed animals (garden creatures)',
        'Cushions and blankets',
        'Puppets for storytelling',
      ],
      suggestedActivities: [
        'Independent book exploration',
        'Buddy reading',
        'Retell stories with puppets',
        'Create oral stories',
      ],
      developmentalAreas: ['language_literacy', 'social_emotional'],
      setup: 'Cozy corner with pillows; low bookshelf with organized books; green decorations to create garden atmosphere',
    },
  ],
};

/**
 * Pedagogical approach descriptions
 */
export const PEDAGOGICAL_APPROACHES: Record<PedagogicalApproach, {
  name: string;
  description: string;
  keyPrinciples: string[];
}> = {
  'high-scope': {
    name: 'High Scope',
    description: 'Active participatory learning where children make choices and engage in hands-on activities',
    keyPrinciples: [
      'Plan-Do-Review sequence',
      'Active learning experiences',
      'Supportive adult-child interactions',
      'Learning environment that supports independence',
    ],
  },
  'reggio-emilia': {
    name: 'Reggio Emilia',
    description: 'Child-led inquiry-based learning with emphasis on documentation and the environment as third teacher',
    keyPrinciples: [
      'Emergent curriculum based on child interests',
      'Project-based long-term investigations',
      'Documentation of learning processes',
      'Environment as third teacher',
    ],
  },
  'montessori': {
    name: 'Montessori',
    description: 'Self-directed learning with specially designed materials and prepared environment',
    keyPrinciples: [
      'Prepared environment with specific materials',
      'Self-directed activity within limits',
      'Hands-on sensorial materials',
      'Mixed-age classrooms when possible',
    ],
  },
  'orton-gillingham': {
    name: 'Orton-Gillingham',
    description: 'Multisensory, structured approach to reading and language skills',
    keyPrinciples: [
      'Multisensory instruction (visual, auditory, kinesthetic)',
      'Structured, sequential, and cumulative',
      'Explicit phonics instruction',
      'Individualized and diagnostic',
    ],
  },
  'anji-play': {
    name: 'Anji Play',
    description: 'Child-directed outdoor play with open-ended materials and minimal adult intervention',
    keyPrinciples: [
      'True play: self-directed and open-ended',
      'Physical risk-taking encouraged',
      'Teacher observes rather than directs',
      'Children reflect on their play experiences',
    ],
  },
  'project-based': {
    name: 'Project-Based Learning',
    description: 'In-depth investigation of real-world topics driven by student questions',
    keyPrinciples: [
      'Sustained investigation over time',
      'Authentic questions and problems',
      'Student voice and choice',
      'Reflection and revision',
    ],
  },
  'play-to-learn': {
    name: 'Play to Learn',
    description: 'Learning through play with teacher facilitation to support development',
    keyPrinciples: [
      'Play as primary learning medium',
      'Teacher as facilitator and co-player',
      'Intentional play experiences',
      'Balance of child-led and teacher-guided',
    ],
  },
};

/**
 * Generate theme ideas for different time periods
 */
export const THEME_IDEAS = [
  'Plants & Growing Things',
  'Animals in Our World',
  'Transportation & Movement',
  'Weather & Seasons',
  'Our Community Helpers',
  'Families & Friendships',
  'Food & Nutrition',
  'Space & Stars',
  'Ocean Exploration',
  'Building & Construction',
  'Art & Artists',
  'Music & Sound',
  'Stories & Fairy Tales',
  'Insects & Bugs',
  'Colors & Shapes',
];
