import { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { useLocation } from 'react-router';
import { AlertCircle, X } from 'lucide-react';

export default function DemoModeBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();
  
  // Only show if Supabase is NOT configured
  if (isSupabaseConfigured || isDismissed) {
    return null;
  }

  // Show login credentials on login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <strong className="font-semibold">🎮 Demo Mode:</strong>{' '}
            {isLoginPage ? (
              <>
                Use <code className="bg-white/20 px-2 py-0.5 rounded font-mono">demo@test.com</code>
                {' / '}
                <code className="bg-white/20 px-2 py-0.5 rounded font-mono">test123</code>
                {' '}to login and test the platform!
              </>
            ) : (
              <>
                Running with mock data. Data will not persist.{' '}
                <span className="font-medium">
                  Edit <code className="bg-white/20 px-1 rounded">/config.ts</code> to connect Supabase
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}