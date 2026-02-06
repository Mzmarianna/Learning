import { Calendar } from 'lucide-react';

interface WeeklyRhythmProps {
  studentId: string;
}

export default function WeeklyRhythm({ studentId }: WeeklyRhythmProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-calm-surface border-2 border-calm-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-calm-primary" />
        <div>
          <h2 className="text-2xl">Weekly Rhythm</h2>
          <p className="text-sm text-muted-foreground">
            Your predictable weekly schedule reduces anxiety
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day}
            className="bg-calm-bg border-2 border-calm-border rounded-xl p-4"
          >
            <h3 className="font-semibold mb-2">{day}</h3>
            <p className="text-sm text-muted-foreground">
              No tasks scheduled yet. Your tutor will help you create your rhythm.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-reward-purple-light border border-reward-purple rounded-xl p-4">
        <p className="text-sm text-center">
          💡 <strong>Tip:</strong> A consistent weekly rhythm helps reduce stress and build habits!
        </p>
      </div>
    </div>
  );
}
