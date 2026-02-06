import { useMemo } from 'react';
import type { StreakSnapshot } from '@lib/gamification/streak-tracker';
import { defaultSnapshot, getForecast, getNextMilestone } from '@lib/gamification/streak-tracker';

type StreakDisplayProps = {
  snapshot?: StreakSnapshot;
};

const STATUS_COPY: Record<string, string> = {
  growing: 'Streak growing',
  steady: 'Streak steady',
  'at-risk': 'Streak at risk'
};

const StreakDisplay = ({ snapshot = defaultSnapshot }: StreakDisplayProps): JSX.Element => {
  const forecast = useMemo(() => getForecast(snapshot), [snapshot]);
  const nextMilestone = useMemo(() => getNextMilestone(snapshot), [snapshot]);

  return (
    <section className={`streak-display streak-display--${forecast.status}`}>
      <header>
        <h2>Streak health</h2>
        <p role="status" aria-live="polite">
          {STATUS_COPY[forecast.status]} — {forecast.message}
        </p>
      </header>

      <div className="streak-display__metrics">
        <div>
          <h3>Current streak</h3>
          <p className="streak-display__value">{snapshot.current} days</p>
        </div>
        <div>
          <h3>Best streak</h3>
          <p className="streak-display__value">{snapshot.best} days</p>
        </div>
        <div>
          <h3>Next reward</h3>
          <p className="streak-display__value">
            {nextMilestone === 0 ? 'Reward unlocked' : `${nextMilestone} day jump`}
          </p>
        </div>
      </div>

      <footer>
        <p className="streak-display__note">
          Last reset: {new Date(snapshot.lastResetISO).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </footer>
    </section>
  );
};

export default StreakDisplay;
