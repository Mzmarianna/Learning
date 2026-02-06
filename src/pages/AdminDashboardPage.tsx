import AdminDashboard from '../components/dashboard/AdminDashboard';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Optional: Add logout/navigation header */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => {
            // Could implement logout or navigate to settings
            console.log('Admin navigation');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors text-sm font-medium text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </button>
      </div>

      <AdminDashboard
        onNavigateToStudents={() => {
          // TODO: Navigate to students list page
          console.log('Navigate to students');
        }}
        onNavigateToContent={() => {
          // TODO: Navigate to content library
          console.log('Navigate to content');
        }}
      />
    </div>
  );
}