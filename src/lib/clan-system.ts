/**
 * CLAN SYSTEM - Team-based Learning & Community
 * 
 * Implements a clan/house system for collaborative learning, peer tutoring,
 * and friendly competition. Inspired by Hogwarts houses but adapted for
 * neurodivergent learners with emphasis on collaboration over competition.
 */

export interface Clan {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  values: string[];
  mascot: string;
  totalPoints: number;
  memberCount: number;
}

export const CLANS: Record<string, Clan> = {
  explorers: {
    id: 'explorers',
    name: 'Curious Explorers',
    description: 'Brave learners who ask questions and seek new discoveries',
    color: 'cyan',
    icon: '🔭',
    mascot: '🦉 Wowl the Wise',
    values: ['Curiosity', 'Discovery', 'Asking Questions', 'Trying New Things'],
    totalPoints: 0,
    memberCount: 0,
  },
  creators: {
    id: 'creators',
    name: 'Creative Makers',
    description: 'Imaginative builders who bring ideas to life',
    color: 'purple',
    icon: '🎨',
    mascot: '🦄 Luna the Creative',
    values: ['Creativity', 'Innovation', 'Problem-Solving', 'Making Things'],
    totalPoints: 0,
    memberCount: 0,
  },
  helpers: {
    id: 'helpers',
    name: 'Kind Helpers',
    description: 'Caring friends who support and teach each other',
    color: 'pink',
    icon: '💝',
    mascot: '🐻 Buddy the Bear',
    values: ['Kindness', 'Teamwork', 'Helping Others', 'Friendship'],
    totalPoints: 0,
    memberCount: 0,
  },
  champions: {
    id: 'champions',
    name: 'Determined Champions',
    description: 'Persistent learners who keep trying and never give up',
    color: 'amber',
    icon: '⭐',
    mascot: '🦁 Leo the Brave',
    values: ['Persistence', 'Growth Mindset', 'Resilience', 'Courage'],
    totalPoints: 0,
    memberCount: 0,
  },
};

export interface ClanActivity {
  id: string;
  clanId: string;
  studentId: string;
  activityType: 'help_peer' | 'complete_challenge' | 'creative_project' | 'persistence' | 'collaboration';
  points: number;
  description: string;
  timestamp: Date;
}

export interface ClanChallenge {
  id: string;
  title: string;
  description: string;
  type: 'collaborative' | 'creative' | 'helpful' | 'persistent';
  requiredMembers: number;
  rewards: {
    clanPoints: number;
    individualXP: number;
    badge?: string;
  };
  deadline?: Date;
  status: 'active' | 'completed' | 'expired';
}

/**
 * Calculate clan points for different activities
 */
export function calculateClanPoints(activityType: ClanActivity['activityType']): number {
  const pointsMap: Record<string, number> = {
    help_peer: 50, // Helping another student (peer tutoring)
    complete_challenge: 25, // Individual achievement
    creative_project: 40, // Creative work shared with clan
    persistence: 30, // Completing after multiple attempts
    collaboration: 60, // Working together on a project
  };
  
  return pointsMap[activityType] || 10;
}

/**
 * Get clan color classes for Tailwind
 */
export function getClanColorClasses(clanId: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    explorers: {
      bg: 'bg-cyan-500',
      text: 'text-cyan-700',
      border: 'border-cyan-500',
      hover: 'hover:bg-cyan-600',
    },
    creators: {
      bg: 'bg-purple-500',
      text: 'text-purple-700',
      border: 'border-purple-500',
      hover: 'hover:bg-purple-600',
    },
    helpers: {
      bg: 'bg-pink-500',
      text: 'text-pink-700',
      border: 'border-pink-500',
      hover: 'hover:bg-pink-600',
    },
    champions: {
      bg: 'bg-amber-500',
      text: 'text-amber-700',
      border: 'border-amber-500',
      hover: 'hover:bg-amber-600',
    },
  };
  
  return colorMap[clanId] || colorMap.explorers;
}

/**
 * Assign student to clan based on their learning style and values
 */
export function assignClanByProfile(studentProfile: {
  strengths: string[];
  interests: string[];
  learningStyle: string;
}): string {
  // Simple algorithm - can be enhanced with more data
  const { strengths, interests, learningStyle } = studentProfile;
  
  // Keywords to clan mapping
  if (strengths.includes('curious') || interests.includes('science')) {
    return 'explorers';
  }
  
  if (strengths.includes('creative') || interests.includes('art')) {
    return 'creators';
  }
  
  if (strengths.includes('helpful') || interests.includes('friends')) {
    return 'helpers';
  }
  
  if (strengths.includes('persistent') || learningStyle === 'practice') {
    return 'champions';
  }
  
  // Default: rotate through clans for balance
  const clans = Object.keys(CLANS);
  return clans[Math.floor(Math.random() * clans.length)];
}

/**
 * Clan-based activities that promote collaboration
 */
export const CLAN_ACTIVITIES = [
  {
    id: 'peer-tutoring',
    title: 'Teach a Friend',
    description: 'Help another clan member learn something new',
    points: 50,
    category: 'help_peer',
  },
  {
    id: 'group-project',
    title: 'Clan Quest',
    description: 'Complete a challenge together with your clan',
    points: 60,
    category: 'collaboration',
  },
  {
    id: 'creative-share',
    title: 'Show & Tell',
    description: 'Share your creative project with your clan',
    points: 40,
    category: 'creative_project',
  },
  {
    id: 'persistence-badge',
    title: 'Never Give Up',
    description: 'Complete a challenge after multiple attempts',
    points: 30,
    category: 'persistence',
  },
] as const;

/**
 * Weekly clan challenges (rotates weekly)
 */
export const WEEKLY_CLAN_CHALLENGES: ClanChallenge[] = [
  {
    id: 'week1-collaboration',
    title: 'Building Together',
    description: 'Work with 3 clan members to create a collaborative project',
    type: 'collaborative',
    requiredMembers: 3,
    rewards: {
      clanPoints: 200,
      individualXP: 100,
      badge: 'Team Builder',
    },
    status: 'active',
  },
  {
    id: 'week2-creative',
    title: 'Clan Creation',
    description: 'Create something that represents your clan values',
    type: 'creative',
    requiredMembers: 1,
    rewards: {
      clanPoints: 150,
      individualXP: 75,
      badge: 'Creative Genius',
    },
    status: 'active',
  },
  {
    id: 'week3-helpful',
    title: 'Peer Tutoring Week',
    description: 'Help 5 different clan members this week',
    type: 'helpful',
    requiredMembers: 1,
    rewards: {
      clanPoints: 250,
      individualXP: 125,
      badge: 'Master Teacher',
    },
    status: 'active',
  },
];
