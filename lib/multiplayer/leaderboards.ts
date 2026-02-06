export type LeaderboardEntry = {
  id: string;
  learner: string;
  avatarSeed: string;
  points: number;
  wins: number;
  assists: number;
};

export type LeaderboardSlice = {
  title: string;
  description: string;
  entries: LeaderboardEntry[];
};

const cooperativeSprint: LeaderboardEntry[] = [
  { id: 'sky', learner: 'Sky', avatarSeed: 'sky', points: 1480, wins: 9, assists: 22 },
  { id: 'nia', learner: 'Nia', avatarSeed: 'nia', points: 1410, wins: 8, assists: 27 },
  { id: 'asher', learner: 'Asher', avatarSeed: 'asher', points: 1350, wins: 7, assists: 19 }
];

const sensoryStudio: LeaderboardEntry[] = [
  { id: 'kai', learner: 'Kai', avatarSeed: 'kai', points: 920, wins: 6, assists: 14 },
  { id: 'mira', learner: 'Mira', avatarSeed: 'mira', points: 910, wins: 5, assists: 17 },
  { id: 'zen', learner: 'Zen', avatarSeed: 'zen', points: 880, wins: 7, assists: 10 }
];

export const leaderboards: LeaderboardSlice[] = [
  {
    title: 'Cooperative sprint',
    description: 'Weekly creative problem solving sprint with peer-matched squads.',
    entries: cooperativeSprint
  },
  {
    title: 'Sensory studio jam',
    description: 'Regulation routines paired with art prompts to strengthen co-regulation.',
    entries: sensoryStudio
  }
];

export const getPlacement = (entry: LeaderboardEntry, board: LeaderboardEntry[]): number => {
  const sorted = [...board].sort((left, right) => right.points - left.points);
  const position = sorted.findIndex((candidate) => candidate.id === entry.id) + 1;
  return position > 0 ? position : board.length;
};
