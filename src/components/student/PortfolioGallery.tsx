/**
 * Portfolio Gallery - Student Work Display
 * TODO: Implement with Supabase queries
 * Currently stubbed - use Supabase to fetch portfolio_items table
 */

import { Video, Image, FileText, Calendar } from 'lucide-react';

interface PortfolioGalleryProps {
  studentId: string;
}

export default function PortfolioGallery({ studentId }: PortfolioGalleryProps) {
  return (
    <div className="bg-calm-surface rounded-2xl border-2 border-calm-border p-6">
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Image className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Your Portfolio</h3>
        <p className="text-muted-foreground mb-6">
          Your submitted work will appear here!<br/>
          Complete challenges and share your learning.
        </p>
        <p className="text-sm text-gray-500">
          📝 Portfolio system coming soon - database connected!
        </p>
      </div>
    </div>
  );
}
