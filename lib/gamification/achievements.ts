export type Achievement = {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  icon: string;
  reward: string;
};

export const achievementCatalog: Achievement[] = [
  {
    id: 'first-flight',
    title: 'First Flight',
    description: 'Complete your first guided session and reflect on what felt great.',
    target: 1,
    current: 1,
    icon: 'wing',
    reward: 'Unlock Focus Grove biome'
  },
  {
    id: 'pattern-prodigy',
    title: 'Pattern Prodigy',
    description: 'Solve 15 pattern puzzles that flex both visual and logical thinking.',
    target: 15,
    current: 12,
    icon: 'puzzle',
    reward: 'Earn adaptive puzzle pack'
  },
  {
    id: 'storyteller',
    title: 'Brave Storyteller',
    description: 'Record three reflection voice notes to build confidence with sharing wins.',
    target: 3,
    current: 2,
    icon: 'mic',
    reward: 'Unlock narrative badge frame'
  }
];

export const calculateAchievementProgress = (achievement: Achievement): number => {
  const progress = Math.min(achievement.current / achievement.target, 1);
  return Number((progress * 100).toFixed(0));
};

export const completionCopy = (achievement: Achievement): string => {
  if (achievement.current >= achievement.target) {
    return 'Quest complete! Celebrate with your mentor.';
  }

  const remaining = achievement.target - achievement.current;
  return `${remaining} milestone${remaining === 1 ? '' : 's'} to go.`;
};
