import { QuestInstance } from '../../lib/types';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

interface CurrentQuestCardProps {
  questInstance: QuestInstance;
  onUpdate: () => void;
}

export default function CurrentQuestCard({ questInstance, onUpdate }: CurrentQuestCardProps) {
  return (
    <div className="bg-calm-surface border-2 border-calm-border rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">{questInstance.templateId}</h2>
        <p className="text-muted-foreground">
          Progress: {questInstance.progress} / 16 challenges completed
        </p>
      </div>

      {/* Challenge List */}
      <div className="space-y-3">
        {questInstance.challenges.map((challenge) => {
          const isCompleted = challenge.status === 'approved';
          const isLocked = challenge.status === 'locked';
          const isCurrent = !isCompleted && !isLocked;

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                isCompleted
                  ? 'bg-success-light border-success'
                  : isCurrent
                  ? 'bg-calm-bg border-calm-primary cursor-pointer hover:shadow-lg'
                  : 'bg-calm-bg border-calm-border opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                ) : isLocked ? (
                  <Lock className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-calm-primary flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  <h3 className="font-medium">Challenge {challenge.challengeNumber}</h3>
                  {challenge.templateId && (
                    <p className="text-sm text-muted-foreground">{challenge.templateId}</p>
                  )}
                </div>

                {isCurrent && (
                  <button className="px-4 py-2 bg-calm-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                    Start
                  </button>
                )}
                {isCompleted && (
                  <span className="text-sm text-success">✓ Complete</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
