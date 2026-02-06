import type { Achievement } from '@lib/gamification/achievements';
import { calculateAchievementProgress, completionCopy } from '@lib/gamification/achievements';

type AchievementCardProps = {
  achievement: Achievement;
};

const AchievementCard = ({ achievement }: AchievementCardProps): JSX.Element => {
  const progress = calculateAchievementProgress(achievement);
  const progressLabel = `${progress}% complete`;
  const isComplete = progress === 100;
  const iconLabel = achievement.icon.slice(0, 2).toUpperCase();

  return (
    <article className={`achievement-card ${isComplete ? 'achievement-card--complete' : ''}`}>
      <header className="achievement-card__header">
        <span className="achievement-card__icon" aria-hidden="true">
          {iconLabel}
        </span>
        <div>
          <h3>{achievement.title}</h3>
          <p className="achievement-card__description">{achievement.description}</p>
        </div>
      </header>

      <p className="achievement-card__reward">Reward: {achievement.reward}</p>

      <div className="achievement-card__progress" role="group" aria-label={achievement.title}>
        <div className="achievement-card__progress-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="achievement-card__progress-label" aria-live="polite">
          {progressLabel}
        </p>
        <p className="achievement-card__status">{completionCopy(achievement)}</p>
      </div>
    </article>
  );
};

export default AchievementCard;
