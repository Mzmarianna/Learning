/**
 * Student Dashboard Hook
 */

import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/supabase/auth';
import {
  getStudentDashboardData,
  getQuestProgress,
  getChallengeProgress,
  getEarnedBadges,
  getRecentSubmissions,
  startChallenge,
  completeChallenge,
  createSubmission,
  awardXP,
  getWeeklyLearningHours,
  startLearningSession,
  endLearningSession,
} from '../lib/api/student-service';
import type { StudentDashboardView, Submission, BadgeEarned } from '../lib/database.types';

// ============================================================================
// STUDENT PROFILE
// ============================================================================

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentDashboardView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getStudentDashboardData(user.id);
        setProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getStudentDashboardData(user.id);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refresh };
}

// ============================================================================
// QUEST PROGRESS
// ============================================================================

export function useQuestProgress(questId?: string) {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getQuestProgress(user.id, questId);
        setProgress(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [questId]);

  return { progress, loading, error };
}

// ============================================================================
// CHALLENGE OPERATIONS
// ============================================================================

export function useChallengeOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const start = async (challengeId: string, questId: string) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await startChallenge(user.id, challengeId, questId);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const complete = async (
    challengeId: string,
    masteryLevel: any,
    xpEarned: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await completeChallenge(user.id, challengeId, masteryLevel, xpEarned);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { start, complete, loading, error };
}

// ============================================================================
// SUBMISSIONS
// ============================================================================

export function useSubmissions(challengeId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getRecentSubmissions(user.id, challengeId ? 999 : 5);
        const filtered = challengeId
          ? data.filter((s) => s.challenge_id === challengeId)
          : data;

        setSubmissions(filtered);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, [challengeId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getRecentSubmissions(user.id, challengeId ? 999 : 5);
      const filtered = challengeId
        ? data.filter((s) => s.challenge_id === challengeId)
        : data;

      setSubmissions(filtered);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { submissions, loading, error, refresh };
}

export function useCreateSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (submissionData: any) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const submission = await createSubmission({
        ...submissionData,
        student_id: user.id,
      });

      return submission;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}

// ============================================================================
// BADGES
// ============================================================================

export function useBadges() {
  const [badges, setBadges] = useState<BadgeEarned[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadBadges() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getEarnedBadges(user.id);
        setBadges(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadBadges();
  }, []);

  return { badges, loading, error };
}

// ============================================================================
// LEARNING SESSION
// ============================================================================

export function useLearningSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const session = await startLearningSession(user.id);
      setSessionId(session.id);
      
      // Store in localStorage for recovery
      localStorage.setItem('learningSessionId', session.id);
      
      return session.id;
    } catch (err) {
      console.error('Error starting session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const end = async (challengesWorkedOn: string[], xpEarned: number) => {
    if (!sessionId) return;

    setLoading(true);

    try {
      await endLearningSession(sessionId, challengesWorkedOn, xpEarned);
      setSessionId(null);
      localStorage.removeItem('learningSessionId');
    } catch (err) {
      console.error('Error ending session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-start session on component mount if not already started
  useEffect(() => {
    const storedSessionId = localStorage.getItem('learningSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      start();
    }
  }, []);

  return { sessionId, start, end, loading };
}

// ============================================================================
// WEEKLY STATS
// ============================================================================

export function useWeeklyStats() {
  const [hours, setHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const weeklyHours = await getWeeklyLearningHours(user.id);
        setHours(weeklyHours);
      } catch (err) {
        console.error('Error loading weekly stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return { hours, loading };
}

// ============================================================================
// COMBINED DASHBOARD HOOK
// ============================================================================

export function useStudentDashboard() {
  const { profile, loading: profileLoading, refresh: refreshProfile } = useStudentProfile();
  const { badges, loading: badgesLoading } = useBadges();
  const { submissions, loading: submissionsLoading } = useSubmissions();
  const { hours, loading: hoursLoading } = useWeeklyStats();

  const loading = profileLoading || badgesLoading || submissionsLoading || hoursLoading;

  const dashboardData = profile
    ? {
        ...profile,
        earnedBadges: badges.map((b) => b.badge_id),
        recentSubmissions: submissions,
        weeklyHours: hours,
        xpToNextLevel: (profile.current_level + 1) * 500 - profile.total_xp,
      }
    : null;

  return { dashboardData, loading, refresh: refreshProfile };
}