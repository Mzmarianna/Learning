/**
 * SKOOL Integration for Calendar & Classroom Management
 * Until platform can handle live classes & assignments natively
 */

export interface SkoolClass {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  googleMeetLink?: string;
  tutorId: string;
  tutorName: string;
  studentIds: string[];
  maxStudents: number;
  category: 'reading' | 'math' | 'spelling' | 'general';
}

export interface SkoolAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  classId: string;
  attachments?: string[];
  points: number;
  submitted: boolean;
  submittedAt?: Date;
  grade?: number;
  feedback?: string;
}

// ==================== GOOGLE CALENDAR INTEGRATION ====================

export async function syncGoogleCalendar(userId: string): Promise<SkoolClass[]> {
  // PLACEHOLDER: Integration with Google Calendar API
  // This would be called via Firebase Function to avoid exposing credentials
  
  console.log('📅 Syncing Google Calendar for user:', userId);
  
  // Demo mode: Return mock classes
  return getMockUpcomingClasses(userId);
}

export function getMockUpcomingClasses(studentId: string): SkoolClass[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: 'class-1',
      title: '📖 Reading Adventures with Ms. Sarah',
      description: 'We\'ll explore phonics blending and read a fun story together!',
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(10, 45, 0, 0)),
      googleMeetLink: 'PLACEHOLDER_GOOGLE_MEET_LINK_1',
      tutorId: 'tutor-1',
      tutorName: 'Ms. Sarah',
      studentIds: [studentId],
      maxStudents: 4,
      category: 'reading',
    },
    {
      id: 'class-2',
      title: '🔢 Math Magic with Mr. James',
      description: 'Let\'s learn addition with fun games and challenges!',
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(14, 45, 0, 0)),
      googleMeetLink: 'PLACEHOLDER_GOOGLE_MEET_LINK_2',
      tutorId: 'tutor-2',
      tutorName: 'Mr. James',
      studentIds: [studentId],
      maxStudents: 4,
      category: 'math',
    },
  ];
}

// ==================== SKOOL CLASSROOM INTEGRATION ====================

export async function getSkoolAssignments(studentId: string): Promise<SkoolAssignment[]> {
  // PLACEHOLDER: Integration with SKOOL API
  // This would fetch assignments from SKOOL platform
  
  console.log('📚 Fetching SKOOL assignments for student:', studentId);
  
  // Demo mode: Return mock assignments
  return getMockAssignments(studentId);
}

export function getMockAssignments(studentId: string): SkoolAssignment[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return [
    {
      id: 'assign-1',
      title: '✏️ Practice: CVC Words',
      description: 'Read and spell 10 CVC words (cat, dog, run, etc.)',
      dueDate: tomorrow,
      classId: 'class-1',
      points: 50,
      submitted: false,
    },
    {
      id: 'assign-2',
      title: '🔢 Math Worksheet: Addition to 10',
      description: 'Complete the addition practice problems (10 questions)',
      dueDate: tomorrow,
      classId: 'class-2',
      points: 50,
      submitted: false,
    },
  ];
}

export async function submitAssignment(
  assignmentId: string,
  studentId: string,
  submission: {
    answers?: any;
    attachments?: File[];
    notes?: string;
  }
): Promise<void> {
  // PLACEHOLDER: Submit to SKOOL platform
  console.log('📤 Submitting assignment:', assignmentId, submission);
  
  // Demo mode: Store in localStorage
  const assignments = getMockAssignments(studentId);
  const assignment = assignments.find(a => a.id === assignmentId);
  
  if (assignment) {
    assignment.submitted = true;
    assignment.submittedAt = new Date();
    localStorage.setItem(`assignment-${assignmentId}`, JSON.stringify(assignment));
  }
}

// ==================== CALENDAR UTILITIES ====================

export function getUpcomingClasses(classes: SkoolClass[], daysAhead: number = 7): SkoolClass[] {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  
  return classes.filter(c => {
    const startTime = new Date(c.startTime);
    return startTime >= now && startTime <= future;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export function getTodayClasses(classes: SkoolClass[]): SkoolClass[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return classes.filter(c => {
    const startTime = new Date(c.startTime);
    return startTime >= today && startTime < tomorrow;
  });
}

export function formatClassTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getTimeUntilClass(classTime: Date): string {
  const now = new Date();
  const diff = classTime.getTime() - now.getTime();
  
  if (diff < 0) return 'Started';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `In ${days} day${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `In ${hours}h ${minutes}m`;
  }
  
  return `In ${minutes} minutes`;
}

// ==================== GOOGLE MEET INTEGRATION ====================

export function joinGoogleMeet(meetLink: string): void {
  // Open Google Meet in new tab
  window.open(meetLink, '_blank');
}

export function generateGoogleCalendarLink(classInfo: SkoolClass): string {
  // Generate "Add to Google Calendar" link
  const startTime = new Date(classInfo.startTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endTime = new Date(classInfo.endTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: classInfo.title,
    details: classInfo.description + (classInfo.googleMeetLink ? `\n\nJoin: ${classInfo.googleMeetLink}` : ''),
    dates: `${startTime}/${endTime}`,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ==================== MIGRATION PLAN ====================

/**
 * MIGRATION ROADMAP: SKOOL → Native Platform
 * 
 * Phase 1 (Current): Use SKOOL for classes & assignments
 * - Calendar sync via Google Calendar API
 * - Assignments delivered through SKOOL
 * - Video calls via Google Meet
 * 
 * Phase 2 (3-6 months): Hybrid approach
 * - Calendar integrated into platform (display only)
 * - Assignments start migrating to platform
 * - Still use Google Meet for video
 * 
 * Phase 3 (6-12 months): Full native solution
 * - Built-in scheduling system
 * - Native assignment submission
 * - Consider: Integrate ClassIn OR build native video
 * 
 * FUTURE: ClassIn Integration
 * - Professional virtual classroom
 * - Whiteboard, screen sharing, breakout rooms
 * - Recording capabilities
 * - Better than Google Meet for education
 */

export const INTEGRATION_STATUS = {
  calendar: 'SKOOL via Google Calendar',
  assignments: 'SKOOL',
  videoClasses: 'Google Meet',
  future: 'Migrate to ClassIn or native solution',
};

// ==================== CLASSIN PLACEHOLDER ====================

export interface ClassInSession {
  sessionId: string;
  roomId: string;
  teacherId: string;
  studentIds: string[];
  startTime: Date;
  duration: number; // minutes
  recordingUrl?: string;
}

export async function createClassInSession(classInfo: SkoolClass): Promise<ClassInSession> {
  // PLACEHOLDER: When ready to migrate to ClassIn
  console.log('🎓 Creating ClassIn session for:', classInfo.title);
  
  return {
    sessionId: `classin-${Date.now()}`,
    roomId: `room-${classInfo.id}`,
    teacherId: classInfo.tutorId,
    studentIds: classInfo.studentIds,
    startTime: classInfo.startTime,
    duration: 45,
  };
}

export function joinClassInRoom(sessionId: string): void {
  // PLACEHOLDER: Open ClassIn app or web interface
  console.log('🎓 Joining ClassIn room:', sessionId);
  window.open(`PLACEHOLDER_CLASSIN_URL/${sessionId}`, '_blank');
}
