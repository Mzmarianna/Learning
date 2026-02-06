/**
 * Tutor Dashboard Hook
 */

import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/supabase/auth';
import {
  getTutorStudents,
  getStudentDetails,
  getPendingReviews,
  getTutorAlerts,
  resolveAlert,
  updateSubmissionAfterReview,
  getTutorLessons,
  createLesson,
  sendMessageToParent,
  getTutorDashboardStats,
} from '../lib/api/tutor-service';

// ============================================================================
// STUDENTS
// ============================================================================

export function useTutorStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getTutorStudents(user.id);
        setStudents(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getTutorStudents(user.id);
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, refresh };
}

export function useStudentDetails(studentId: string) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadStudent() {
      if (!studentId) return;

      try {
        const data = await getStudentDetails(studentId);
        setStudent(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [studentId]);

  return { student, loading, error };
}

// ============================================================================
// PENDING REVIEWS
// ============================================================================

export function usePendingReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getPendingReviews(user.id);
        setReviews(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getPendingReviews(user.id);
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, refresh };
}

export function useReviewSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const review = async (submissionId: string, updates: any) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await updateSubmissionAfterReview(submissionId, user.id, updates);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { review, loading, error };
}

// ============================================================================
// ALERTS
// ============================================================================

export function useTutorAlerts(includeResolved: boolean = false) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getTutorAlerts(user.id, includeResolved);
        setAlerts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, [includeResolved]);

  const resolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getTutorAlerts(user.id, includeResolved);
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { alerts, resolve, loading, error, refresh };
}

// ============================================================================
// LESSONS
// ============================================================================

export function useTutorLessons(futureOnly: boolean = false) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadLessons() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getTutorLessons(user.id, futureOnly);
        setLessons(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [futureOnly]);

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getTutorLessons(user.id, futureOnly);
      setLessons(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { lessons, loading, error, refresh };
}

export function useCreateLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (lessonData: any, studentIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const lesson = await createLesson(user.id, lessonData, studentIds);
      return lesson;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

// ============================================================================
// MESSAGING
// ============================================================================

export function useSendMessageToParent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = async (
    parentId: string,
    studentId: string,
    subject: string,
    content: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await sendMessageToParent(user.id, parentId, studentId, subject, content);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export function useTutorDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getTutorDashboardStats(user.id);
        setStats(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return { stats, loading, error };
}

// ============================================================================
// COMBINED TUTOR DASHBOARD
// ============================================================================

export function useTutorDashboard() {
  const { students, loading: studentsLoading, refresh: refreshStudents } = useTutorStudents();
  const { reviews, loading: reviewsLoading, refresh: refreshReviews } = usePendingReviews();
  const { alerts, loading: alertsLoading, refresh: refreshAlerts } = useTutorAlerts();
  const { stats, loading: statsLoading } = useTutorDashboardStats();

  const loading = studentsLoading || reviewsLoading || alertsLoading || statsLoading;

  const dashboardData = {
    students,
    reviews,
    alerts,
    stats,
  };

  const refresh = async () => {
    await Promise.all([refreshStudents(), refreshReviews(), refreshAlerts()]);
  };

  return { dashboardData, loading, refresh };
}