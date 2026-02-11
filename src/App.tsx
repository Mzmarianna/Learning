import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser, getUserProfile, onAuthStateChange } from './lib/supabase/auth';
import type { UserRole } from './lib/database.types';

// Dashboards
import StudentDashboardPage from './pages/StudentDashboardPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import TutorDashboardPage from './pages/TutorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DemoStudentDashboardPage from './pages/DemoStudentDashboardPage';

// Authentication
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// Marketing
import HomePage from './pages/HomePage';
import FreeGuidePage from './pages/FreeGuidePage';
import ThankYouPage from './pages/ThankYouPage';
import AboutPage from './pages/AboutPage';
import WelcomePage from './pages/WelcomePage';
import AssessmentOfferPage from './pages/AssessmentOfferPage';
import ScheduleAssessmentPage from './pages/ScheduleAssessmentPage';

// Payments
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ClassWalletCallbackPage from './pages/ClassWalletCallbackPage';

// Programs
import ProgramsPage from './pages/ProgramsPage';
import ProgramCheckoutPage from './pages/ProgramCheckoutPage';
import HomeschoolEnrollmentPage from './pages/HomeschoolEnrollmentPage';

// Quest System
import QuestsPage from './pages/QuestsPage';
import QuestDetailsPage from './pages/QuestDetailsPage';
import ChallengeDetailsPage from './pages/ChallengeDetailsPage';
import SubmitChallengePage from './pages/SubmitChallengePage';
import RobloxChallengePage from './pages/RobloxChallengePage';

// Placement Quiz
import PlacementQuizPage from './pages/PlacementQuizPage';
import PlacementResultsPage from './pages/PlacementResultsPage';

// Common
import LoadingScreen from './components/common/LoadingScreen';
import DemoModeBanner from './components/common/DemoModeBanner';
import SubscriptionGuard from './components/subscription/SubscriptionGuard';
import { Toaster } from './components/ui/sonner';

// ============================================================================
// PROTECTED ROUTE COMPONENT
// ============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  currentRole?: UserRole | null;
}

function ProtectedRoute({ children, requiredRole, currentRole }: ProtectedRouteProps) {
  if (currentRole === null) {
    // Not loaded yet
    return <LoadingScreen />;
  }

  if (currentRole === undefined) {
    // Not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    // Wrong role - redirect to their dashboard
    const dashboardPaths: Record<UserRole, string> = {
      student: '/dashboard/student',
      parent: '/dashboard/parent',
      tutor: '/dashboard/tutor',
      admin: '/dashboard/admin',
    };
    const dashboardPath = dashboardPaths[currentRole as UserRole];

    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in demo mode (no Supabase needed)
    const isDemoMode = typeof import.meta !== 'undefined' && 
                       import.meta.env && 
                       (import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_SUPABASE_URL);
    
    if (isDemoMode) {
      // Skip auth checks in demo mode
      setUserRole(undefined);
      setLoading(false);
      return;
    }

    // Check initial auth state
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        
        if (user) {
          const profile = await getUserProfile();
          setUserRole(profile?.role || undefined);
        } else {
          setUserRole(undefined);
        }
      } catch (error: any) {
        // Silently handle "Auth session missing" - it's expected when not logged in
        if (error?.message !== 'Auth session missing!' && !error?.message?.includes('session missing')) {
          console.error('Error checking auth:', error);
        }
        setUserRole(undefined);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Listen to auth changes
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getUserProfile();
        setUserRole(profile?.role || undefined);
      } else if (event === 'SIGNED_OUT') {
        setUserRole(undefined);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <DemoModeBanner />
      <Routes>
        {/* Public Routes (no subscription needed) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Marketing & Lead Magnets */}
        <Route path="/free-guide" element={<FreeGuidePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Visitor Workflow */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/get-started" element={<WelcomePage />} />
        <Route path="/assessment-offer" element={<AssessmentOfferPage />} />
        <Route path="/schedule-assessment" element={<ScheduleAssessmentPage />} />
        
        {/* Payment Routes (public access) */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/classwallet-callback" element={<ClassWalletCallbackPage />} />
        
        {/* Program Routes (public access) */}
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/checkout" element={<ProgramCheckoutPage />} />
        <Route path="/enroll/homeschool" element={<HomeschoolEnrollmentPage />} />
        
        {/* Public Placement Quiz (FREE - no login required) */}
        <Route path="/placement-quiz" element={<PlacementQuizPage />} />
        <Route path="/placement-results/:attemptId" element={<PlacementResultsPage />} />

        {/* DEMO ROUTE - Direct access to student dashboard without auth */}
        <Route path="/demo/student" element={<DemoStudentDashboardPage />} />
        <Route path="/demo/quests" element={<QuestsPage />} />

        {/* Protected Routes (wrapped in SubscriptionGuard) */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute requiredRole="student" currentRole={userRole}>
              <SubscriptionGuard>
                <StudentDashboardPage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quests"
          element={
            <ProtectedRoute requiredRole="student" currentRole={userRole}>
              <SubscriptionGuard>
                <QuestsPage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quest/:questId"
          element={
            <ProtectedRoute requiredRole="student" currentRole={userRole}>
              <SubscriptionGuard>
                <QuestDetailsPage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenge/:challengeId"
          element={
            <ProtectedRoute requiredRole="student" currentRole={userRole}>
              <SubscriptionGuard>
                <ChallengeDetailsPage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenge/:challengeId/submit"
          element={
            <ProtectedRoute requiredRole="student" currentRole={userRole}>
              <SubscriptionGuard>
                <SubmitChallengePage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenge/:challengeId/roblox"
          element={
            <ProtectedRoute requiredRole="student" currentRole={userRole}>
              <SubscriptionGuard>
                <RobloxChallengePage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute requiredRole="parent" currentRole={userRole}>
              <SubscriptionGuard>
                <ParentDashboardPage />
              </SubscriptionGuard>
            </ProtectedRoute>
          }
        />

        {/* Tutor Routes (no subscription needed - they're staff) */}
        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute requiredRole="tutor" currentRole={userRole}>
              <TutorDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (no subscription needed - they're staff) */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRole="admin" currentRole={userRole}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            userRole === undefined ? (
              <HomePage />
            ) : userRole === 'student' ? (
              <Navigate to="/dashboard/student" replace />
            ) : userRole === 'parent' ? (
              <Navigate to="/dashboard/parent" replace />
            ) : userRole === 'tutor' ? (
              <Navigate to="/dashboard/tutor" replace />
            ) : userRole === 'admin' ? (
              <Navigate to="/dashboard/admin" replace />
            ) : (
              <HomePage />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}