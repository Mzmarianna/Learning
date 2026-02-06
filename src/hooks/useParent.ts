/**
 * Parent Dashboard Hook
 */

import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/supabase/auth';
import {
  getParentChildren,
  getChildDetailedProgress,
  getChildrenRecentActivity,
  getChildLearningInsights,
  sendMessageToTutor,
  generateProgressReport,
} from '../lib/api/parent-service';

// ============================================================================
// CHILDREN LIST
// ============================================================================

export function useParentChildren() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadChildren() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getParentChildren(user.id);
        setChildren(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadChildren();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const data = await getParentChildren(user.id);
      setChildren(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { children, loading, error, refresh };
}

// ============================================================================
// CHILD DETAILS
// ============================================================================

export function useChildProgress(studentId: string) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProgress() {
      if (!studentId) return;

      try {
        const data = await getChildDetailedProgress(studentId);
        setProgress(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [studentId]);

  return { progress, loading, error };
}

// ============================================================================
// RECENT ACTIVITY
// ============================================================================

export function useChildrenActivity(limit: number = 20) {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadActivity() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const data = await getChildrenRecentActivity(user.id, limit);
        setActivity(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadActivity();
  }, [limit]);

  return { activity, loading, error };
}

// ============================================================================
// LEARNING INSIGHTS
// ============================================================================

export function useLearningInsights(studentId: string) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadInsights() {
      if (!studentId) return;

      try {
        const data = await getChildLearningInsights(studentId);
        setInsights(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, [studentId]);

  return { insights, loading, error };
}

// ============================================================================
// MESSAGING
// ============================================================================

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = async (
    tutorId: string,
    studentId: string,
    subject: string,
    content: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await sendMessageToTutor(user.id, tutorId, studentId, subject, content);
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
// PROGRESS REPORTS
// ============================================================================

export function useProgressReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = async (
    studentId: string,
    dateRange?: { startDate: string; endDate: string }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const report = await generateProgressReport(studentId, dateRange);
      return report;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
}

// ============================================================================
// COMBINED PARENT DASHBOARD
// ============================================================================

export function useParentDashboard() {
  const { children, loading: childrenLoading, refresh } = useParentChildren();
  const { activity, loading: activityLoading } = useChildrenActivity();

  const loading = childrenLoading || activityLoading;

  const dashboardData = {
    children,
    activity,
  };

  return { dashboardData, loading, refresh };
}