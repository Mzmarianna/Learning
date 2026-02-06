import { useState } from 'react';
import type { DailyQuest } from '@lib/gamification/daily-quests';
import { getDailyQuests, toggleTask } from '@lib/gamification/daily-quests';

type DailyQuestPanelProps = {
  initialQuests?: DailyQuest[];
};

const DailyQuestPanel = ({ initialQuests }: DailyQuestPanelProps): JSX.Element => {
  const [quests, setQuests] = useState<DailyQuest[]>(initialQuests ?? getDailyQuests());

  const handleToggle = (questId: string, taskId: string, complete: boolean) => {
    setQuests(toggleTask(questId, taskId, complete));
  };

  return (
    <section className="daily-quest-panel">
      <header>
        <h2>Daily quest lineup</h2>
        <p>Structured missions that flex strengths and protect energy levels.</p>
      </header>

      {quests.map((quest) => (
        <article key={quest.id} className="daily-quest-card">
          <div className="daily-quest-card__heading">
            <h3>{quest.dayLabel}</h3>
            <span className={`daily-quest-card__badge ${quest.communityBoost ? 'daily-quest-card__badge--boost' : ''}`}>
              {quest.communityBoost ? 'Community boost active' : 'Solo flow'}
            </span>
          </div>
          <p className="daily-quest-card__focus">Focus: {quest.focusArea}</p>

          <ul className="daily-quest-card__tasks">
            {quest.tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.complete}
                    onChange={(event) => handleToggle(quest.id, task.id, event.target.checked)}
                  />
                  <span>
                    <strong>{task.label}</strong>
                    <small>{task.minutes} minute burst</small>
                    {task.sensoryBreak ? <em>Break idea: {task.sensoryBreak}</em> : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};

export default DailyQuestPanel;
