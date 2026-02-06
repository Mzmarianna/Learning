export type StreakSnapshot = {
  learnerName: string;
  current: number;
  best: number;
  lastResetISO: string;
};

export type StreakForecast = {
  status: 'growing' | 'steady' | 'at-risk';
  message: string;
};

export const defaultSnapshot: StreakSnapshot = {
  learnerName: 'Sky',
  current: 9,
  best: 14,
  lastResetISO: new Date().toISOString()
};

export const getForecast = (snapshot: StreakSnapshot): StreakForecast => {
  if (snapshot.current >= snapshot.best) {
    return {
      status: 'growing',
      message: 'New personal best unlocked. Queue the confetti!'
    };
  }

  if (snapshot.current >= snapshot.best * 0.6) {
    return {
      status: 'steady',
      message: 'Momentum is steady. Consider a co-play session to push higher.'
    };
  }

  return {
    status: 'at-risk',
    message: 'Streak cooldown triggered. Offer a sensory-friendly reset routine.'
  };
};

export const getNextMilestone = (snapshot: StreakSnapshot): number => {
  const nextHeroTarget = Math.max(snapshot.best + 1, snapshot.current + 1);
  const distance = nextHeroTarget - snapshot.current;
  return distance <= 0 ? 0 : distance;
};
