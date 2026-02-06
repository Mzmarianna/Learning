/**
 * Parent Portfolio View - View Child's Work
 * TODO: Implement with Supabase queries
 * Currently stubbed - use Supabase to fetch portfolio_items where parent has access
 */

import { Video, Image, FileText } from 'lucide-react';
import PortfolioGallery from '@/components/student/PortfolioGallery';

interface ParentPortfolioViewProps {
  studentId: string;
  studentName: string;
}

export default function ParentPortfolioView({ studentId, studentName }: ParentPortfolioViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">📁 {studentName}'s Portfolio</h2>
        <p className="text-gray-700">
          View your child's submitted work, reflections, and learning evidence.
        </p>
      </div>

      <PortfolioGallery studentId={studentId} />
    </div>
  );
}