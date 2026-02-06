/**
 * Tutor Review Queue - Review Student Submissions
 * TODO: Implement with Supabase queries
 * Currently stubbed - use Supabase to fetch pending submissions
 */

import { Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TutorReviewQueue() {
  return (
    <div className="bg-calm-surface rounded-2xl border-2 border-calm-border p-6">
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Clock className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Review Queue</h3>
        <p className="text-muted-foreground mb-6">
          Student submissions will appear here for review!<br/>
          Assess mastery and provide feedback.
        </p>
        <p className="text-sm text-gray-500">
          📝 Review system coming soon - database connected!
        </p>
      </div>
    </div>
  );
}
