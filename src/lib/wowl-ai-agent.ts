/**
 * Wowl AI Agent - Intelligent Learning Companion
 * Generates tasks, creates reports, and provides personalized support
 */

import { User, QuestInstance, ChallengeInstance } from './types';

// ==================== TYPES ====================

export interface WowlTask {
  id: string;
  studentId: string;
  type: 'practice' | 'review' | 'challenge' | 'break' | 'celebration';
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed: boolean;
  createdBy: 'wowl' | 'tutor' | 'parent';
  createdAt: Date;
  completedAt?: Date;
  relatedQuestId?: string;
  relatedChallengeId?: string;
  xpReward: number;
}

export interface WowlReport {
  id: string;
  studentId: string;
  reportType: 'daily' | 'weekly' | 'progress' | 'alert' | 'celebration';
  title: string;
  summary: string;
  insights: WowlInsight[];
  recommendations: string[];
  recipients: {
    studentId?: string;
    parentIds?: string[];
    tutorIds?: string[];
  };
  generatedAt: Date;
  sentAt?: Date;
  data: {
    xpEarned?: number;
    challengesCompleted?: number;
    timeSpentMinutes?: number;
    streakDays?: number;
    skillsImproved?: string[];
    nextSteps?: string[];
  };
}

export interface WowlInsight {
  type: 'strength' | 'improvement' | 'pattern' | 'alert' | 'celebration';
  icon: string;
  message: string;
  confidence: number; // 0-100
  actionable: boolean;
  suggestedAction?: string;
}

export interface LearningPattern {
  studentId: string;
  patterns: {
    bestTimeOfDay?: 'morning' | 'afternoon' | 'evening';
    averageSessionMinutes?: number;
    preferredChallengeTypes?: string[];
    struggleAreas?: string[];
    strengthAreas?: string[];
    motivationTriggers?: string[];
    needsBreakAfter?: number; // minutes
  };
  lastAnalyzed: Date;
}

// ==================== WOWL AI AGENT CLASS ====================

export class WowlAIAgent {
  private studentId: string;
  private learningPatterns: Map<string, LearningPattern> = new Map();

  constructor(studentId: string) {
    this.studentId = studentId;
  }

  // ==================== TASK GENERATION ====================

  /**
   * Generate personalized tasks based on student progress and learning patterns
   */
  async generateDailyTasks(
    student: User,
    questInstances: QuestInstance[],
    recentActivity: any[]
  ): Promise<WowlTask[]> {
    const tasks: WowlTask[] = [];
    const now = new Date();

    // Get learning patterns
    const patterns = await this.analyzeLearningPatterns(student.uid, recentActivity);

    // 1. Morning Warm-up (if student learns best in morning)
    if (patterns.patterns.bestTimeOfDay === 'morning') {
      tasks.push({
        id: `task-warmup-${Date.now()}`,
        studentId: student.uid,
        type: 'practice',
        title: '🌅 Morning Warm-up',
        description: 'Start your day with a quick 5-minute review of yesterday\'s lesson!',
        estimatedMinutes: 5,
        priority: 'medium',
        dueDate: new Date(now.setHours(10, 0, 0, 0)),
        completed: false,
        createdBy: 'wowl',
        createdAt: now,
        xpReward: 25,
      });
    }

    // 2. Continue Active Quest
    const activeQuest = questInstances.find(q => q.status === 'in_progress');
    if (activeQuest) {
      const nextChallenge = this.findNextChallenge(activeQuest);
      if (nextChallenge) {
        tasks.push({
          id: `task-quest-${Date.now()}`,
          studentId: student.uid,
          type: 'challenge',
          title: `🎯 Continue: ${activeQuest.templateId}`,
          description: nextChallenge.title,
          estimatedMinutes: 15,
          priority: 'high',
          completed: false,
          createdBy: 'wowl',
          createdAt: now,
          relatedQuestId: activeQuest.instanceId,
          relatedChallengeId: nextChallenge.instanceId,
          xpReward: 50,
        });
      }
    }

    // 3. Practice Weak Areas (if detected)
    if (patterns.patterns.struggleAreas && patterns.patterns.struggleAreas.length > 0) {
      const weakArea = patterns.patterns.struggleAreas[0];
      tasks.push({
        id: `task-practice-${Date.now()}`,
        studentId: student.uid,
        type: 'practice',
        title: `💪 Practice: ${weakArea}`,
        description: 'Let\'s strengthen this skill together! Take it at your own pace.',
        estimatedMinutes: 10,
        priority: 'medium',
        completed: false,
        createdBy: 'wowl',
        createdAt: now,
        xpReward: 30,
      });
    }

    // 4. Celebration Task (if streak or milestone)
    const streakDays = this.calculateStreak(recentActivity);
    if (streakDays > 0 && streakDays % 5 === 0) {
      tasks.push({
        id: `task-celebrate-${Date.now()}`,
        studentId: student.uid,
        type: 'celebration',
        title: `🎉 ${streakDays}-Day Streak Celebration!`,
        description: 'You\'re on fire! Share your progress in your portfolio to earn bonus XP!',
        estimatedMinutes: 5,
        priority: 'low',
        completed: false,
        createdBy: 'wowl',
        createdAt: now,
        xpReward: 100,
      });
    }

    // 5. Brain Break Reminder (based on session length)
    if (patterns.patterns.needsBreakAfter && patterns.patterns.needsBreakAfter < 30) {
      tasks.push({
        id: `task-break-${Date.now()}`,
        studentId: student.uid,
        type: 'break',
        title: '🧘 Take a Brain Break',
        description: 'Time to stretch, get water, or do a quick activity. Your brain needs rest to learn best!',
        estimatedMinutes: 5,
        priority: 'high',
        completed: false,
        createdBy: 'wowl',
        createdAt: now,
        xpReward: 10,
      });
    }

    return tasks;
  }

  /**
   * Generate adaptive tasks based on real-time performance
   */
  async generateAdaptiveTasks(
    challengeResult: {
      success: boolean;
      timeSpent: number;
      difficulty: string;
    }
  ): Promise<WowlTask[]> {
    const tasks: WowlTask[] = [];
    const now = new Date();

    // If student struggled, offer easier task
    if (!challengeResult.success && challengeResult.timeSpent > 20) {
      tasks.push({
        id: `task-support-${Date.now()}`,
        studentId: this.studentId,
        type: 'practice',
        title: '🤝 Let\'s Try Something Easier',
        description: 'No worries! Let\'s practice the basics and build up your confidence.',
        estimatedMinutes: 10,
        priority: 'high',
        completed: false,
        createdBy: 'wowl',
        createdAt: now,
        xpReward: 20,
      });
    }

    // If student excelled, offer harder challenge
    if (challengeResult.success && challengeResult.timeSpent < 10) {
      tasks.push({
        id: `task-advance-${Date.now()}`,
        studentId: this.studentId,
        type: 'challenge',
        title: '🚀 Ready for More?',
        description: 'You crushed that! Want to try something more advanced?',
        estimatedMinutes: 15,
        priority: 'medium',
        completed: false,
        createdBy: 'wowl',
        createdAt: now,
        xpReward: 75,
      });
    }

    return tasks;
  }

  // ==================== REPORT GENERATION ====================

  /**
   * Generate daily progress report
   */
  async generateDailyReport(
    student: User,
    todayActivity: any[]
  ): Promise<WowlReport> {
    const xpEarned = todayActivity.reduce((sum, a) => sum + (a.xpEarned || 0), 0);
    const challengesCompleted = todayActivity.filter(a => a.type === 'challenge').length;
    const timeSpent = todayActivity.reduce((sum, a) => sum + (a.duration || 0), 0);

    const insights = this.generateInsights(student, todayActivity);

    return {
      id: `report-daily-${Date.now()}`,
      studentId: student.uid,
      reportType: 'daily',
      title: `✨ ${student.displayName}'s Day in the Kingdom`,
      summary: this.generateDailySummary(xpEarned, challengesCompleted, timeSpent),
      insights,
      recommendations: this.generateRecommendations(insights),
      recipients: {
        studentId: student.uid,
        parentIds: [], // Would fetch from DB
      },
      generatedAt: new Date(),
      data: {
        xpEarned,
        challengesCompleted,
        timeSpentMinutes: Math.round(timeSpent),
      },
    };
  }

  /**
   * Generate weekly progress report
   */
  async generateWeeklyReport(
    student: User,
    weekActivity: any[]
  ): Promise<WowlReport> {
    const xpEarned = weekActivity.reduce((sum, a) => sum + (a.xpEarned || 0), 0);
    const challengesCompleted = weekActivity.filter(a => a.type === 'challenge').length;
    const timeSpent = weekActivity.reduce((sum, a) => sum + (a.duration || 0), 0);
    const streakDays = this.calculateStreak(weekActivity);
    const skillsImproved = this.identifyImprovedSkills(weekActivity);

    const insights = this.generateWeeklyInsights(student, weekActivity);

    return {
      id: `report-weekly-${Date.now()}`,
      studentId: student.uid,
      reportType: 'weekly',
      title: `🎊 ${student.displayName}'s Week in Review`,
      summary: this.generateWeeklySummary(xpEarned, challengesCompleted, streakDays),
      insights,
      recommendations: this.generateWeeklyRecommendations(insights, skillsImproved),
      recipients: {
        studentId: student.uid,
        parentIds: [],
        tutorIds: [],
      },
      generatedAt: new Date(),
      data: {
        xpEarned,
        challengesCompleted,
        timeSpentMinutes: Math.round(timeSpent),
        streakDays,
        skillsImproved,
      },
    };
  }

  /**
   * Generate alert report (for parent/tutor)
   */
  async generateAlertReport(
    student: User,
    alertType: 'struggling' | 'inactive' | 'achievement',
    context: any
  ): Promise<WowlReport> {
    let title = '';
    let summary = '';
    let insights: WowlInsight[] = [];

    switch (alertType) {
      case 'struggling':
        title = `🤝 ${student.displayName} Needs Support`;
        summary = `I've noticed ${student.displayName} is finding some challenges difficult. Let's work together to help them succeed!`;
        insights = [{
          type: 'alert',
          icon: '⚠️',
          message: `Having trouble with ${context.difficulty}`,
          confidence: 85,
          actionable: true,
          suggestedAction: 'Schedule a 1-on-1 session to review fundamentals',
        }];
        break;

      case 'inactive':
        title = `💤 Missing ${student.displayName}`;
        summary = `${student.displayName} hasn't logged in for ${context.daysInactive} days. A gentle check-in might help!`;
        insights = [{
          type: 'alert',
          icon: '📅',
          message: `${context.daysInactive} days without activity`,
          confidence: 100,
          actionable: true,
          suggestedAction: 'Send a friendly reminder or adjust schedule',
        }];
        break;

      case 'achievement':
        title = `🌟 ${student.displayName} is Crushing It!`;
        summary = `Amazing news! ${student.displayName} just ${context.achievement}!`;
        insights = [{
          type: 'celebration',
          icon: '🎉',
          message: context.achievement,
          confidence: 100,
          actionable: true,
          suggestedAction: 'Celebrate with them! Recognition boosts motivation.',
        }];
        break;
    }

    return {
      id: `report-alert-${Date.now()}`,
      studentId: student.uid,
      reportType: 'alert',
      title,
      summary,
      insights,
      recommendations: insights.map(i => i.suggestedAction || '').filter(Boolean),
      recipients: {
        parentIds: [],
        tutorIds: [],
      },
      generatedAt: new Date(),
      data: context,
    };
  }

  // ==================== SMART SENDING ====================

  /**
   * Determine when to send reports automatically
   */
  async shouldSendReport(
    reportType: WowlReport['reportType'],
    student: User,
    lastSent?: Date
  ): Promise<boolean> {
    const now = new Date();

    switch (reportType) {
      case 'daily':
        // Send at end of learning session or 6 PM
        if (!lastSent) return true;
        const hoursSinceLastDaily = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
        return hoursSinceLastDaily >= 24;

      case 'weekly':
        // Send every Sunday at 5 PM
        if (!lastSent) return false;
        const daysSinceLastWeekly = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastWeekly >= 7 && now.getDay() === 0;

      case 'alert':
        // Send immediately when triggered
        return true;

      case 'celebration':
        // Send immediately for achievements
        return true;

      default:
        return false;
    }
  }

  /**
   * Send report to recipients (email, in-app notification, etc.)
   */
  async sendReport(report: WowlReport): Promise<void> {
    // In production, this would:
    // 1. Send email to parents
    // 2. Create in-app notifications
    // 3. Post to parent dashboard
    // 4. Log to analytics

    console.log('📨 Wowl sending report:', report.title);
    
    // Demo mode: Store in localStorage
    const existingReports = JSON.parse(localStorage.getItem('wowlReports') || '[]');
    existingReports.push({
      ...report,
      sentAt: new Date(),
    });
    localStorage.setItem('wowlReports', JSON.stringify(existingReports));
  }

  // ==================== LEARNING PATTERN ANALYSIS ====================

  private async analyzeLearningPatterns(
    studentId: string,
    recentActivity: any[]
  ): Promise<LearningPattern> {
    // Check cache
    if (this.learningPatterns.has(studentId)) {
      return this.learningPatterns.get(studentId)!;
    }

    // Analyze patterns
    const patterns: LearningPattern = {
      studentId,
      patterns: {
        bestTimeOfDay: this.findBestTimeOfDay(recentActivity),
        averageSessionMinutes: this.calculateAverageSession(recentActivity),
        struggleAreas: this.identifyStruggleAreas(recentActivity),
        strengthAreas: this.identifyStrengthAreas(recentActivity),
        needsBreakAfter: this.estimateBreakNeeds(recentActivity),
      },
      lastAnalyzed: new Date(),
    };

    this.learningPatterns.set(studentId, patterns);
    return patterns;
  }

  // ==================== HELPER METHODS ====================

  private findNextChallenge(quest: QuestInstance): any {
    // Find first incomplete challenge
    return quest.challenges?.find(c => c.status === 'available');
  }

  private calculateStreak(activity: any[]): number {
    // Calculate consecutive days of activity
    const uniqueDays = new Set(activity.map(a => 
      new Date(a.timestamp || Date.now()).toDateString()
    ));
    return uniqueDays.size;
  }

  private findBestTimeOfDay(activity: any[]): 'morning' | 'afternoon' | 'evening' {
    const timeSlots = { morning: 0, afternoon: 0, evening: 0 };
    
    activity.forEach(a => {
      const hour = new Date(a.timestamp || Date.now()).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 17) timeSlots.afternoon++;
      else timeSlots.evening++;
    });

    return Object.entries(timeSlots).reduce((a, b) => a[1] > b[1] ? a : b)[0] as any;
  }

  private calculateAverageSession(activity: any[]): number {
    if (activity.length === 0) return 20; // default
    const total = activity.reduce((sum, a) => sum + (a.duration || 0), 0);
    return Math.round(total / activity.length);
  }

  private identifyStruggleAreas(activity: any[]): string[] {
    // Find challenges with low success rate or long duration
    const struggles: string[] = [];
    // Mock implementation
    if (activity.some(a => a.attempts > 2)) {
      struggles.push('Lua Variables');
    }
    return struggles;
  }

  private identifyStrengthAreas(activity: any[]): string[] {
    // Find challenges completed quickly with high success
    return ['Building', 'Creativity', 'Problem Solving'];
  }

  private identifyImprovedSkills(activity: any[]): string[] {
    return ['Scripting', 'Game Design', 'Testing'];
  }

  private estimateBreakNeeds(activity: any[]): number {
    // ADHD-friendly: Recommend breaks based on patterns
    const avgSession = this.calculateAverageSession(activity);
    if (avgSession < 15) return 20; // Can focus longer
    if (avgSession < 25) return 25;
    return 30; // Needs frequent breaks
  }

  private generateInsights(student: User, activity: any[]): WowlInsight[] {
    const insights: WowlInsight[] = [];

    // XP milestone
    const totalXP = activity.reduce((sum, a) => sum + (a.xpEarned || 0), 0);
    if (totalXP > 100) {
      insights.push({
        type: 'celebration',
        icon: '🌟',
        message: `Earned ${totalXP} XP today! You're on fire!`,
        confidence: 100,
        actionable: false,
      });
    }

    // Consistency pattern
    if (activity.length > 5) {
      insights.push({
        type: 'strength',
        icon: '💪',
        message: 'Great focus today! Multiple challenges completed.',
        confidence: 90,
        actionable: false,
      });
    }

    return insights;
  }

  private generateWeeklyInsights(student: User, activity: any[]): WowlInsight[] {
    return [
      {
        type: 'strength',
        icon: '🎯',
        message: 'Consistent practice every day this week!',
        confidence: 95,
        actionable: false,
      },
      {
        type: 'improvement',
        icon: '📈',
        message: 'Scripting skills improved by 30%',
        confidence: 80,
        actionable: true,
        suggestedAction: 'Try building a more complex game next!',
      },
    ];
  }

  private generateRecommendations(insights: WowlInsight[]): string[] {
    return insights
      .filter(i => i.actionable && i.suggestedAction)
      .map(i => i.suggestedAction!);
  }

  private generateWeeklyRecommendations(insights: WowlInsight[], skills: string[]): string[] {
    const recs = this.generateRecommendations(insights);
    if (skills.length > 0) {
      recs.push(`Continue practicing ${skills.join(', ')} to maintain momentum!`);
    }
    return recs;
  }

  private generateDailySummary(xp: number, challenges: number, minutes: number): string {
    if (challenges === 0) {
      return "Today was a rest day. Remember, learning happens every day, even in small ways!";
    }
    return `Completed ${challenges} challenge${challenges !== 1 ? 's' : ''}, earned ${xp} XP, and spent ${minutes} minutes learning. Great work!`;
  }

  private generateWeeklySummary(xp: number, challenges: number, streak: number): string {
    return `This week: ${challenges} challenges conquered, ${xp} XP earned, and a ${streak}-day streak! You're making amazing progress! 🚀`;
  }
}

// ==================== DEMO DATA ====================

export const generateMockWowlTasks = (studentId: string): WowlTask[] => {
  return [
    {
      id: 'task-1',
      studentId,
      type: 'challenge',
      title: '🎯 Complete Today\'s Challenge',
      description: 'Build a color-changing part in Roblox Studio',
      estimatedMinutes: 15,
      priority: 'high',
      completed: false,
      createdBy: 'wowl',
      createdAt: new Date(),
      xpReward: 50,
    },
    {
      id: 'task-2',
      studentId,
      type: 'practice',
      title: '💪 Practice Lua Variables',
      description: 'Quick review of variables from yesterday\'s lesson',
      estimatedMinutes: 10,
      priority: 'medium',
      completed: false,
      createdBy: 'wowl',
      createdAt: new Date(),
      xpReward: 30,
    },
    {
      id: 'task-3',
      studentId,
      type: 'break',
      title: '🧘 Take a Brain Break',
      description: 'Stretch, hydrate, and reset for 5 minutes',
      estimatedMinutes: 5,
      priority: 'medium',
      completed: false,
      createdBy: 'wowl',
      createdAt: new Date(),
      xpReward: 10,
    },
  ];
};

export const generateMockWowlReport = (studentId: string): WowlReport => {
  return {
    id: 'report-1',
    studentId,
    reportType: 'daily',
    title: '✨ Today\'s Learning Journey',
    summary: 'Completed 3 challenges, earned 150 XP, and spent 45 minutes learning. Excellent focus today!',
    insights: [
      {
        type: 'celebration',
        icon: '🌟',
        message: 'Earned 150 XP today - that\'s a personal best!',
        confidence: 100,
        actionable: false,
      },
      {
        type: 'strength',
        icon: '💪',
        message: 'Completed all challenges on first try',
        confidence: 95,
        actionable: false,
      },
      {
        type: 'improvement',
        icon: '📈',
        message: 'Scripting speed improved by 20%',
        confidence: 85,
        actionable: true,
        suggestedAction: 'Ready for more advanced scripting challenges!',
      },
    ],
    recommendations: [
      'Try building a mini-game tomorrow to apply your new skills',
      'Keep up the excellent focus - you\'re in the zone!',
    ],
    recipients: {
      studentId,
      parentIds: [],
    },
    generatedAt: new Date(),
    data: {
      xpEarned: 150,
      challengesCompleted: 3,
      timeSpentMinutes: 45,
      streakDays: 5,
      skillsImproved: ['Lua Scripting', 'Game Design'],
    },
  };
};
