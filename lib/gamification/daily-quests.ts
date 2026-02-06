export type QuestTask = {
  id: string;
  label: string;
  minutes: number;
  sensoryBreak?: string;
  complete: boolean;
};

export type DailyQuest = {
  id: string;
  dayLabel: string;
  focusArea: string;
  tasks: QuestTask[];
  communityBoost: boolean;
};

const baseQuests: DailyQuest[] = [
  {
    id: 'monday-spark',
    dayLabel: 'Monday Spark',
    focusArea: 'Executive function + regulation',
    communityBoost: true,
    tasks: [
      { id: 'plan-board', label: 'Arrange visual plan board', minutes: 8, complete: true },
      { id: 'movement', label: 'Movement quest: 3-minute wiggle routine', minutes: 3, complete: true },
      {
        id: 'reflect-note',
        label: 'Voice note one win and one wobble',
        minutes: 4,
        sensoryBreak: 'Chewable necklace + wobble cushion',
        complete: false
      }
    ]
  },
  {
    id: 'tuesday-lab',
    dayLabel: 'Tuesday Maker Lab',
    focusArea: 'STEM + divergent thinking',
    communityBoost: false,
    tasks: [
      { id: 'math-quest', label: 'Solve cooperative fraction quest', minutes: 12, complete: true },
      {
        id: 'build-prototype',
        label: 'Build a sensory-friendly fidget prototype',
        minutes: 15,
        sensoryBreak: 'Weighted lap pad check-in',
        complete: false
      }
    ]
  }
];

export const getDailyQuests = (): DailyQuest[] => baseQuests;

export const toggleTask = (questId: string, taskId: string, complete: boolean): DailyQuest[] =>
  baseQuests.map((quest) => {
    if (quest.id !== questId) {
      return quest;
    }

    return {
      ...quest,
      tasks: quest.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              complete
            }
          : task
      )
    };
  });
