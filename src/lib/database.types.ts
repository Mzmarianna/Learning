/**
 * DATABASE TYPES
 * Auto-generated from Supabase schema
 * Matches /supabase/schema.sql
 */

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'student' | 'parent' | 'tutor' | 'admin';

export type TierLevel = 'early-explorers' | 'explorers' | 'warriors';

export type MasteryLevel = 'emerging' | 'developing' | 'proficient' | 'advanced' | 'mastered';

export type SubmissionType = 'text' | 'image' | 'video' | 'multiple' | 'screenshot' | 'digital';

export type SubmissionStatus = 'pending' | 'assessed' | 'needs-review' | 'resubmitted';

export type MessageType = 'parent-tutor' | 'tutor-parent' | 'system' | 'wowl';

export type LessonType = 'one-on-one' | 'small-group' | 'workshop' | 'assessment';

export type AlertType = 'warning' | 'info' | 'success';

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Profile {
  id: string; // UUID
  role: UserRole;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string; // UUID, references profiles.id
  age: number;
  tier: TierLevel;
  current_level: number;
  total_xp: number;
  gems: number;
  unlocked_characters: string[];
  current_quest_id?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ParentStudent {
  parent_id: string;
  student_id: string;
  relationship: string;
  created_at: string;
}

export interface TutorStudent {
  tutor_id: string;
  student_id: string;
  assigned_at: string;
  notes?: string;
}

export interface QuestProgress {
  id: string;
  student_id: string;
  quest_id: string;
  quest_week: number;
  started_at: string;
  completed_at?: string;
  total_challenges: number;
  completed_challenges: number;
  xp_earned: number;
}

export interface ChallengeProgress {
  id: string;
  student_id: string;
  challenge_id: string;
  quest_id: string;
  started_at: string;
  completed_at?: string;
  mastery_level?: MasteryLevel;
  xp_earned: number;
  attempts: number;
}

export interface BadgeEarned {
  id: string;
  student_id: string;
  badge_id: string;
  quest_id: string;
  earned_at: string;
}

export interface Submission {
  id: string;
  student_id: string;
  challenge_id: string;
  challenge_title: string;
  quest_id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  
  // Content
  text_content?: string;
  image_urls?: string[];
  video_url?: string;
  
  // Assessment
  mastery_level?: MasteryLevel;
  xp_earned: number;
  feedback?: WowlFeedback;
  
  // Metadata
  attempt_number: number;
  is_resubmission: boolean;
  original_submission_id?: string;
  
  // Timestamps
  submitted_at: string;
  assessed_at?: string;
  reviewed_by?: string;
  
  // Flags
  needs_manual_review: boolean;
  flagged_for_tutor: boolean;
}

export interface AssessmentScore {
  id: string;
  submission_id: string;
  criterion_id: string;
  criterion_name: string;
  score: number; // 0.0 to 1.0
  feedback?: string;
  weight: number;
}

export interface ActivityLog {
  id: string;
  student_id: string;
  activity_type: string;
  activity_data?: Record<string, any>;
  created_at: string;
}

export interface LearningSession {
  id: string;
  student_id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  challenges_worked_on?: string[];
  xp_earned_in_session: number;
}

export interface MasteryHistory {
  id: string;
  student_id: string;
  subject: string;
  mastery_level: MasteryLevel;
  recorded_at: string;
}

export interface Message {
  id: string;
  sender_id?: string;
  recipient_id: string;
  student_id?: string;
  type: MessageType;
  subject?: string;
  content: string;
  read_at?: string;
  created_at: string;
}

export interface TutorAlert {
  id: string;
  tutor_id: string;
  student_id: string;
  alert_type: AlertType;
  message: string;
  actionable: boolean;
  resolved: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  tutor_id: string;
  title: string;
  description?: string;
  type: LessonType;
  scheduled_at: string;
  duration_minutes: number;
  notes?: string;
  created_at: string;
}

export interface LessonParticipant {
  lesson_id: string;
  student_id: string;
  attended: boolean;
}

export interface PortfolioItem {
  id: string;
  student_id: string;
  submission_id: string;
  title: string;
  description?: string;
  featured: boolean;
  display_order: number;
  added_at: string;
}

// ============================================================================
// VIEW TYPES
// ============================================================================

export interface StudentDashboardView {
  id: string;
  display_name: string;
  avatar_url?: string;
  age: number;
  tier: TierLevel;
  current_level: number;
  total_xp: number;
  current_quest_id?: string;
  challenges_completed: number;
  badges_earned: number;
  activities_this_week: number;
}

export interface ParentChildView {
  parent_id: string;
  student_id: string;
  display_name: string;
  age: number;
  tier: TierLevel;
  current_level: number;
  total_xp: number;
  current_quest_id?: string;
  challenges_completed: number;
  badges_earned: number;
  last_active?: string;
}

export interface TutorStudentOverview {
  tutor_id: string;
  student_id: string;
  display_name: string;
  age: number;
  tier: TierLevel;
  current_level: number;
  total_xp: number;
  current_quest_id?: string;
  challenges_completed: number;
  last_active?: string;
  needs_attention: boolean;
}

// ============================================================================
// CUSTOM TYPES (for application use)
// ============================================================================

export interface WowlFeedback {
  overallMastery: MasteryLevel;
  criteriaScores: {
    id: string;
    name: string;
    score: number;
    feedback: string;
    weight: number;
  }[];
  openingMessage: string;
  celebrations: string[];
  guidanceAreas: string[];
  closingEncouragement: string;
  resubmissionEncouraged: boolean;
}

export interface StudentProgress {
  studentId: string;
  totalXP: number;
  currentLevel: number;
  completedChallenges: string[];
  earnedBadges: string[];
  currentQuestId?: string;
  recentSubmissions: Submission[];
}

export interface ChildProgressSummary {
  childId: string;
  childName: string;
  childAge: number;
  tier: TierLevel;
  totalXP: number;
  currentLevel: number;
  badgesEarned: number;
  challengesCompleted: number;
  currentQuestName: string;
  currentQuestProgress: number;
  weeklyHoursLearning: number;
  lastActive: Date;
  recentMasteryLevels: {
    subject: string;
    level: MasteryLevel;
  }[];
  parentEmail: string;
}

// ============================================================================
// DATABASE FUNCTIONS
// ============================================================================

export interface DatabaseFunctions {
  calculate_xp_from_mastery: {
    Args: {
      base_xp: number;
      mastery: MasteryLevel;
    };
    Returns: number;
  };
  
  award_xp_to_student: {
    Args: {
      p_student_id: string;
      p_xp_amount: number;
    };
    Returns: void;
  };
  
  check_student_needs_attention: {
    Args: {
      p_student_id: string;
    };
    Returns: boolean;
  };
}

// ============================================================================
// SUPABASE CLIENT TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      student_profiles: {
        Row: StudentProfile;
        Insert: Omit<StudentProfile, 'current_level' | 'total_xp' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StudentProfile, 'id'>>;
      };
      parent_students: {
        Row: ParentStudent;
        Insert: Omit<ParentStudent, 'created_at'>;
        Update: Partial<ParentStudent>;
      };
      tutor_students: {
        Row: TutorStudent;
        Insert: Omit<TutorStudent, 'assigned_at'>;
        Update: Partial<TutorStudent>;
      };
      quest_progress: {
        Row: QuestProgress;
        Insert: Omit<QuestProgress, 'id' | 'started_at' | 'completed_challenges' | 'xp_earned'>;
        Update: Partial<Omit<QuestProgress, 'id'>>;
      };
      challenge_progress: {
        Row: ChallengeProgress;
        Insert: Omit<ChallengeProgress, 'id' | 'started_at' | 'xp_earned' | 'attempts'>;
        Update: Partial<Omit<ChallengeProgress, 'id'>>;
      };
      badges_earned: {
        Row: BadgeEarned;
        Insert: Omit<BadgeEarned, 'id' | 'earned_at'>;
        Update: never;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'xp_earned' | 'attempt_number' | 'is_resubmission' | 'submitted_at' | 'needs_manual_review' | 'flagged_for_tutor'>;
        Update: Partial<Omit<Submission, 'id' | 'student_id' | 'submitted_at'>>;
      };
      assessment_scores: {
        Row: AssessmentScore;
        Insert: Omit<AssessmentScore, 'id'>;
        Update: Partial<Omit<AssessmentScore, 'id'>>;
      };
      activity_log: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'>;
        Update: never;
      };
      learning_sessions: {
        Row: LearningSession;
        Insert: Omit<LearningSession, 'id' | 'started_at' | 'xp_earned_in_session'>;
        Update: Partial<Omit<LearningSession, 'id' | 'student_id'>>;
      };
      mastery_history: {
        Row: MasteryHistory;
        Insert: Omit<MasteryHistory, 'id' | 'recorded_at'>;
        Update: never;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Pick<Message, 'read_at'>>;
      };
      tutor_alerts: {
        Row: TutorAlert;
        Insert: Omit<TutorAlert, 'id' | 'created_at'>;
        Update: Partial<Pick<TutorAlert, 'resolved'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at'>;
        Update: Partial<Omit<Lesson, 'id' | 'tutor_id' | 'created_at'>>;
      };
      lesson_participants: {
        Row: LessonParticipant;
        Insert: Omit<LessonParticipant, 'attended'>;
        Update: Partial<Pick<LessonParticipant, 'attended'>>;
      };
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Omit<PortfolioItem, 'id' | 'added_at'>;
        Update: Partial<Omit<PortfolioItem, 'id' | 'student_id' | 'submission_id'>>;
      };
    };
    Views: {
      student_dashboard_view: {
        Row: StudentDashboardView;
      };
      parent_child_view: {
        Row: ParentChildView;
      };
      tutor_student_overview: {
        Row: TutorStudentOverview;
      };
    };
    Functions: DatabaseFunctions;
  };
}