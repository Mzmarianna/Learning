import type { LeaderboardSlice } from '@lib/multiplayer/leaderboards';
import { getPlacement, leaderboards } from '@lib/multiplayer/leaderboards';

const placementLabel = (placement: number): string => {
  if (placement === 1) return '1st';
  if (placement === 2) return '2nd';
  if (placement === 3) return '3rd';
  return `${placement}th`;
};

type LeaderboardPanelProps = {
  boards?: LeaderboardSlice[];
};

const LeaderboardPanel = ({ boards = leaderboards }: LeaderboardPanelProps): JSX.Element => (
  <section className="leaderboard-panel">
    <header>
      <h2>Co-play leaderboards</h2>
      <p>Momentum snapshots that celebrate collaboration and peer boosts.</p>
    </header>

    <div className="leaderboard-panel__grid">
      {boards.map((board) => (
        <article key={board.title} className="leaderboard-card">
          <h3>{board.title}</h3>
          <p className="leaderboard-card__description">{board.description}</p>

          <ul>
            {board.entries.map((entry) => {
              const placement = getPlacement(entry, board.entries);
              const initials = entry.learner.slice(0, 2).toUpperCase();

              return (
                <li key={entry.id}>
                  <span className={`leaderboard-card__placement placement-${placement}`}>
                    {placementLabel(placement)}
                  </span>
                  <div className="leaderboard-card__avatar" aria-hidden="true">
                    {initials}
                  </div>
                  <div className="leaderboard-card__meta">
                    <strong>{entry.learner}</strong>
                    <small>{entry.points} pts • {entry.wins} wins • {entry.assists} assists</small>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

export default LeaderboardPanel;
