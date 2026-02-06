/**
 * Email Progress Report System
 * Sends automated weekly digests and milestone notifications to parents
 */

import { supabase } from '../supabase/client';
import type { MasteryLevel } from '../wowl-mastery-engine';

export interface WeeklyDigest {
  studentName: string;
  studentAge: number;
  weekStart: Date;
  weekEnd: Date;
  stats: {
    challengesCompleted: number;
    totalXPEarned: number;
    hoursLearned: number;
    currentStreak: number;
    badgesEarned: number;
  };
  masteryProgress: {
    subject: string;
    current: MasteryLevel;
    previous: MasteryLevel;
    improved: boolean;
  }[];
  highlights: string[];
  areasOfFocus: string[];
  nextWeekGoals: string[];
}

export interface MilestoneNotification {
  type: 'quest_completed' | 'badge_earned' | 'level_up' | 'streak_milestone' | 'mastery_achieved';
  title: string;
  description: string;
  studentName: string;
  timestamp: Date;
  celebrationMessage: string;
}

/**
 * Generate weekly digest for a student
 */
export async function generateWeeklyDigest(studentId: string): Promise<WeeklyDigest | null> {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekEnd = new Date();

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, age')
      .eq('id', studentId)
      .single();

    if (profileError || !profile) {
      throw new Error('Student not found');
    }

    // Get week's submissions
    const { data: submissions } = await supabase
      .from('submissions')
      .select('*, challenges(title, subject)')
      .eq('student_id', studentId)
      .gte('submitted_at', weekStart.toISOString())
      .lte('submitted_at', weekEnd.toISOString());

    // Get learning sessions
    const { data: sessions } = await supabase
      .from('learning_sessions')
      .select('duration_minutes')
      .eq('student_id', studentId)
      .gte('started_at', weekStart.toISOString())
      .lte('started_at', weekEnd.toISOString());

    // Get badges earned this week
    const { data: badges } = await supabase
      .from('student_badges')
      .select('*')
      .eq('student_id', studentId)
      .gte('earned_at', weekStart.toISOString())
      .lte('earned_at', weekEnd.toISOString());

    // Get current streak
    const { data: streakData } = await supabase
      .from('student_stats')
      .select('current_streak')
      .eq('student_id', studentId)
      .single();

    // Calculate stats
    const challengesCompleted = submissions?.length || 0;
    const totalXPEarned = submissions?.reduce((sum, s) => sum + (s.xp_earned || 0), 0) || 0;
    const hoursLearned = sessions?.reduce((sum, s) => sum + s.duration_minutes, 0) / 60 || 0;
    const currentStreak = streakData?.current_streak || 0;
    const badgesEarned = badges?.length || 0;

    // Analyze mastery progress
    const masteryBySubject = new Map<string, MasteryLevel[]>();
    submissions?.forEach(sub => {
      const subject = sub.challenges?.subject || 'General';
      if (!masteryBySubject.has(subject)) {
        masteryBySubject.set(subject, []);
      }
      masteryBySubject.get(subject)!.push(sub.mastery_level);
    });

    const masteryProgress = Array.from(masteryBySubject.entries()).map(([subject, levels]) => {
      const current = levels[levels.length - 1];
      const previous = levels.length > 1 ? levels[0] : current;
      return {
        subject,
        current,
        previous,
        improved: getMasteryScore(current) > getMasteryScore(previous),
      };
    });

    // Generate highlights
    const highlights: string[] = [];
    if (challengesCompleted >= 5) {
      highlights.push(`Completed ${challengesCompleted} challenges this week! 🎯`);
    }
    if (totalXPEarned >= 500) {
      highlights.push(`Earned ${totalXPEarned} XP - fantastic effort! ⭐`);
    }
    if (currentStreak >= 7) {
      highlights.push(`${currentStreak}-day learning streak! 🔥`);
    }
    if (badgesEarned > 0) {
      highlights.push(`Earned ${badgesEarned} new badge${badgesEarned > 1 ? 's' : ''}! 🏆`);
    }

    const improved = masteryProgress.filter(m => m.improved);
    if (improved.length > 0) {
      highlights.push(`Improved mastery in ${improved.map(m => m.subject).join(', ')}! 📈`);
    }

    // Areas of focus
    const areasOfFocus: string[] = [];
    const lowMastery = masteryProgress.filter(m => getMasteryScore(m.current) < 3);
    if (lowMastery.length > 0) {
      areasOfFocus.push(`Continue practicing ${lowMastery.map(m => m.subject).join(' and ')}`);
    }
    if (hoursLearned < 3) {
      areasOfFocus.push('Try to increase learning time to at least 3 hours per week');
    }
    if (currentStreak === 0) {
      areasOfFocus.push('Build a consistent learning habit by practicing daily');
    }

    // Next week goals
    const nextWeekGoals: string[] = [
      `Complete at least ${Math.max(challengesCompleted, 5)} challenges`,
      `Maintain or improve your learning streak`,
      `Focus on mastering ${lowMastery.length > 0 ? lowMastery[0].subject : 'new skills'}`,
    ];

    return {
      studentName: profile.display_name,
      studentAge: profile.age,
      weekStart,
      weekEnd,
      stats: {
        challengesCompleted,
        totalXPEarned,
        hoursLearned: Math.round(hoursLearned * 10) / 10,
        currentStreak,
        badgesEarned,
      },
      masteryProgress,
      highlights,
      areasOfFocus,
      nextWeekGoals,
    };

  } catch (error) {
    console.error('Error generating weekly digest:', error);
    return null;
  }
}

/**
 * Send weekly digest email to parent
 */
export async function sendWeeklyDigestEmail(
  studentId: string,
  parentEmail: string
): Promise<boolean> {
  try {
    const digest = await generateWeeklyDigest(studentId);
    if (!digest) {
      throw new Error('Failed to generate digest');
    }

    // TODO: Integrate with email service (SendGrid, Resend, AWS SES, etc.)
    // For now, create a record that email should be sent
    const { error } = await supabase.from('email_queue').insert({
      recipient_email: parentEmail,
      subject: `${digest.studentName}'s Weekly Learning Report - Week of ${digest.weekStart.toLocaleDateString()}`,
      template: 'weekly_digest',
      data: digest,
      scheduled_for: new Date().toISOString(),
      status: 'pending',
    });

    if (error) throw error;

    console.log(`📧 Weekly digest queued for ${parentEmail}`);
    return true;

  } catch (error) {
    console.error('Error sending weekly digest:', error);
    return false;
  }
}

/**
 * Send milestone notification email
 */
export async function sendMilestoneEmail(
  studentId: string,
  milestone: MilestoneNotification
): Promise<boolean> {
  try {
    // Get parent email
    const { data: profile } = await supabase
      .from('profiles')
      .select('parent_email')
      .eq('id', studentId)
      .single();

    if (!profile?.parent_email) {
      console.log('No parent email found');
      return false;
    }

    // Queue email
    const { error } = await supabase.from('email_queue').insert({
      recipient_email: profile.parent_email,
      subject: `🎉 ${milestone.studentName} ${milestone.title}!`,
      template: 'milestone_notification',
      data: milestone,
      scheduled_for: new Date().toISOString(),
      status: 'pending',
      priority: 'high',
    });

    if (error) throw error;

    console.log(`📧 Milestone email queued for ${profile.parent_email}`);
    return true;

  } catch (error) {
    console.error('Error sending milestone email:', error);
    return false;
  }
}

/**
 * Schedule weekly digest for all students
 * Should be called by a cron job every Sunday evening
 */
export async function scheduleAllWeeklyDigests(): Promise<number> {
  try {
    // Get all active students with parent emails
    const { data: students, error } = await supabase
      .from('profiles')
      .select('id, parent_email')
      .eq('role', 'student')
      .not('parent_email', 'is', null);

    if (error) throw error;

    let sent = 0;
    for (const student of students || []) {
      const success = await sendWeeklyDigestEmail(student.id, student.parent_email);
      if (success) sent++;
    }

    console.log(`✅ Scheduled ${sent} weekly digests`);
    return sent;

  } catch (error) {
    console.error('Error scheduling weekly digests:', error);
    return 0;
  }
}

/**
 * Helper: Convert mastery level to score
 */
function getMasteryScore(level: MasteryLevel): number {
  const scores = {
    'emerging': 1,
    'developing': 2,
    'proficient': 3,
    'advanced': 4,
    'mastered': 5,
  };
  return scores[level];
}

/**
 * Email Templates (HTML)
 */
export const EMAIL_TEMPLATES = {
  weeklyDigest: (digest: WeeklyDigest) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .stat { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #e9ecef; }
        .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
        .stat-label { font-size: 14px; color: #6c757d; margin-top: 5px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .highlight { background: #d4edda; padding: 10px; border-radius: 5px; margin: 8px 0; border-left: 4px solid #28a745; }
        .focus { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 8px 0; border-left: 4px solid #ffc107; }
        .goal { background: #cce5ff; padding: 10px; border-radius: 5px; margin: 8px 0; border-left: 4px solid #007bff; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦉 Weekly Learning Report</h1>
          <p>${digest.studentName}'s Progress</p>
          <p>${digest.weekStart.toLocaleDateString()} - ${digest.weekEnd.toLocaleDateString()}</p>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-number">${digest.stats.challengesCompleted}</div>
            <div class="stat-label">Challenges Completed</div>
          </div>
          <div class="stat">
            <div class="stat-number">${digest.stats.totalXPEarned}</div>
            <div class="stat-label">XP Earned</div>
          </div>
          <div class="stat">
            <div class="stat-number">${digest.stats.hoursLearned}h</div>
            <div class="stat-label">Learning Time</div>
          </div>
          <div class="stat">
            <div class="stat-number">${digest.stats.currentStreak}</div>
            <div class="stat-label">Day Streak 🔥</div>
          </div>
        </div>

        ${digest.highlights.length > 0 ? `
          <div class="section">
            <div class="section-title">🌟 This Week's Highlights</div>
            ${digest.highlights.map(h => `<div class="highlight">${h}</div>`).join('')}
          </div>
        ` : ''}

        ${digest.areasOfFocus.length > 0 ? `
          <div class="section">
            <div class="section-title">🎯 Areas of Focus</div>
            ${digest.areasOfFocus.map(a => `<div class="focus">${a}</div>`).join('')}
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">📅 Next Week's Goals</div>
          ${digest.nextWeekGoals.map(g => `<div class="goal">✓ ${g}</div>`).join('')}
        </div>

        <div class="footer">
          <p>Keep up the amazing work, ${digest.studentName}! 🎉</p>
          <p>Mz. Marianna's Academy - Where Learning is an Adventure</p>
        </div>
      </div>
    </body>
    </html>
  `,

  milestoneNotification: (milestone: MilestoneNotification) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; border-radius: 10px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .celebration { font-size: 60px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Milestone Achieved!</h1>
          <h2>${milestone.title}</h2>
        </div>
        <div class="celebration">🏆</div>
        <div class="content">
          <h3>${milestone.studentName} just accomplished something amazing!</h3>
          <p>${milestone.description}</p>
          <p><strong>${milestone.celebrationMessage}</strong></p>
        </div>
        <div class="footer">
          <p>Mz. Marianna's Academy</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
