/**
 * Real-time Subscription Hooks
 */

import { useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================================================
// SUBMISSIONS REALTIME
// ============================================================================

/**
 * Listen to submission updates for a student
 */
export function useRealtimeSubmissions(
  studentId: string,
  onUpdate: () => void
) {
  useEffect(() => {
    if (!studentId) return;

    const channel = supabase
      .channel(`submissions-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          console.log('Submission changed:', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, onUpdate]);
}

// ============================================================================
// QUEST PROGRESS REALTIME
// ============================================================================

/**
 * Listen to quest progress updates for a student
 */
export function useRealtimeQuestProgress(
  studentId: string,
  onUpdate: () => void
) {
  useEffect(() => {
    if (!studentId) return;

    const channel = supabase
      .channel(`quest-progress-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quest_progress',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          console.log('Quest progress changed:', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, onUpdate]);
}

// ============================================================================
// BADGES REALTIME
// ============================================================================

/**
 * Listen to badge awards for a student
 */
export function useRealtimeBadges(
  studentId: string,
  onBadgeEarned: (badge: any) => void
) {
  useEffect(() => {
    if (!studentId) return;

    const channel = supabase
      .channel(`badges-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'badges_earned',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          console.log('Badge earned!', payload);
          onBadgeEarned(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, onBadgeEarned]);
}

// ============================================================================
// XP & LEVEL REALTIME
// ============================================================================

/**
 * Listen to XP and level changes for a student
 */
export function useRealtimeXP(
  studentId: string,
  onXPChange: (data: { totalXP: number; currentLevel: number }) => void
) {
  useEffect(() => {
    if (!studentId) return;

    const channel = supabase
      .channel(`xp-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'student_profiles',
          filter: `id=eq.${studentId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          console.log('XP/Level changed:', newData);
          
          onXPChange({
            totalXP: newData.total_xp,
            currentLevel: newData.current_level,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId, onXPChange]);
}

// ============================================================================
// MESSAGES REALTIME
// ============================================================================

/**
 * Listen to new messages for a user
 */
export function useRealtimeMessages(
  userId: string,
  onNewMessage: (message: any) => void
) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNewMessage]);
}

// ============================================================================
// TUTOR ALERTS REALTIME
// ============================================================================

/**
 * Listen to new alerts for a tutor
 */
export function useRealtimeAlerts(
  tutorId: string,
  onNewAlert: (alert: any) => void
) {
  useEffect(() => {
    if (!tutorId) return;

    const channel = supabase
      .channel(`alerts-${tutorId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tutor_alerts',
          filter: `tutor_id=eq.${tutorId}`,
        },
        (payload) => {
          console.log('New alert:', payload);
          onNewAlert(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tutorId, onNewAlert]);
}

// ============================================================================
// PENDING REVIEWS REALTIME (for tutors)
// ============================================================================

/**
 * Listen to submissions needing review
 */
export function useRealtimePendingReviews(
  tutorId: string,
  onNewReview: () => void
) {
  useEffect(() => {
    if (!tutorId) return;

    // Listen to all submissions (filter client-side for assigned students)
    const channel = supabase
      .channel(`pending-reviews-${tutorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'submissions',
        },
        (payload) => {
          const submission = payload.new as any;
          
          // If submission now needs review or is resubmitted
          if (submission.needs_manual_review || submission.status === 'resubmitted') {
            console.log('New review needed:', submission);
            onNewReview();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tutorId, onNewReview]);
}

// ============================================================================
// PRESENCE (for live collaboration)
// ============================================================================

/**
 * Track online presence for students in a quest
 */
export function useQuestPresence(questId: string, userId: string) {
  useEffect(() => {
    if (!questId || !userId) return;

    const channel = supabase.channel(`quest-${questId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Users in quest:', Object.keys(state));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questId, userId]);
}

// ============================================================================
// COMBINED REALTIME DASHBOARD
// ============================================================================

/**
 * Combined realtime subscriptions for student dashboard
 */
export function useRealtimeStudentDashboard(
  studentId: string,
  callbacks: {
    onSubmissionUpdate?: () => void;
    onQuestProgressUpdate?: () => void;
    onBadgeEarned?: (badge: any) => void;
    onXPChange?: (data: { totalXP: number; currentLevel: number }) => void;
    onNewMessage?: (message: any) => void;
  }
) {
  useRealtimeSubmissions(studentId, callbacks.onSubmissionUpdate || (() => {}));
  useRealtimeQuestProgress(studentId, callbacks.onQuestProgressUpdate || (() => {}));
  useRealtimeBadges(studentId, callbacks.onBadgeEarned || (() => {}));
  useRealtimeXP(studentId, callbacks.onXPChange || (() => {}));
  useRealtimeMessages(studentId, callbacks.onNewMessage || (() => {}));
}

/**
 * Combined realtime subscriptions for tutor dashboard
 */
export function useRealtimeTutorDashboard(
  tutorId: string,
  callbacks: {
    onNewAlert?: (alert: any) => void;
    onNewReview?: () => void;
    onNewMessage?: (message: any) => void;
  }
) {
  useRealtimeAlerts(tutorId, callbacks.onNewAlert || (() => {}));
  useRealtimePendingReviews(tutorId, callbacks.onNewReview || (() => {}));
  useRealtimeMessages(tutorId, callbacks.onNewMessage || (() => {}));
}

// ============================================================================
// NOTIFICATION HELPER
// ============================================================================

/**
 * Show browser notification (requires permission)
 */
export function showBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/logo.png',
      badge: '/badge.png',
    });
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}