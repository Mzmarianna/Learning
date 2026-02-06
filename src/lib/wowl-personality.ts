/**
 * Wowl's Personality System - Adaptive AI Learning Companion
 * Mature, respectful tone for teens who need remediation but are intelligent
 * Tier-aware: Adapts personality to student's age and skill tier
 */

import { SkillTier } from './tier-system';

export interface StudentProfile {
  uid: string;
  name: string;
  age: number;
  tier?: SkillTier; // NEW: Tier-based personality adaptation
  favoriteAnimal?: string;
  favoriteColor?: string;
  birthday?: Date;
  interests?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic';
  hasADHD?: boolean;
  hasDyslexia?: boolean;
  preferredSessionLength?: number; // minutes
  tone?: 'direct' | 'supportive' | 'conversational';
}

export interface WowlMessage {
  id: string;
  text: string;
  audioUrl?: string;
  emoji?: string;
  type: 'greeting' | 'teaching' | 'encouragement' | 'feedback' | 'story' | 'question';
  includesVideo?: boolean;
  videoUrl?: string;
  includesGame?: boolean;
  gameUrl?: string;
  personalTouch?: string;
}

// ==================== PERSONALITY TRAITS ====================

export const WOWL_TRAITS = {
  respectful: true,
  adaptive: true,
  intelligent: true, // Speaks to smart students
  empathetic: true,
  direct: true, // No condescension
  authentic: true, // Real AI, not pretending to be human
};

// ==================== GREETING LIBRARY ====================

export function generateGreeting(profile: StudentProfile, timeOfDay: 'morning' | 'afternoon' | 'evening'): WowlMessage {
  const greetings: Record<typeof timeOfDay, string[]> = {
    morning: [
      `Morning, ${profile.name}. Ready to work?`,
      `Hey ${profile.name}. Let's get started.`,
      `Morning. What are we tackling today?`,
    ],
    afternoon: [
      `Hey ${profile.name}. Good to see you.`,
      `Afternoon. Let's pick up where we left off.`,
      `Hey. Ready to continue?`,
    ],
    evening: [
      `Evening, ${profile.name}. Let's make some progress.`,
      `Hey. Good time for a session.`,
      `Evening. What do you want to focus on?`,
    ],
  };

  const randomGreeting = greetings[timeOfDay][Math.floor(Math.random() * greetings[timeOfDay].length)];

  return {
    id: `greeting-${Date.now()}`,
    text: randomGreeting,
    type: 'greeting',
  };
}

// ==================== ADHD-ADAPTED MESSAGES ====================

export function generateADHDMessage(sessionLength: number): WowlMessage {
  const messages = [
    {
      text: `I'm built for people whose brains work differently. This session is ${sessionLength} minutes—no marathon sessions here.`,
    },
    {
      text: `${sessionLength} minute session. We can adjust if that's too long or too short.`,
    },
    {
      text: `Sessions are designed short. ${sessionLength} minutes. Take breaks whenever you need them.`,
    },
  ];

  const selected = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `adhd-${Date.now()}`,
    text: selected.text,
    type: 'story',
  };
}

// ==================== ENCOURAGEMENT LIBRARY ====================

export function generateEncouragement(context: 'struggling' | 'close' | 'success' | 'trying'): WowlMessage {
  const encouragements: Record<typeof context, string[]> = {
    struggling: [
      `This concept is tricky. Let me show you a different approach.`,
      `Having trouble with this is normal—it means you're learning. Let's break it down.`,
      `Let's try this from another angle. Sometimes a different explanation clicks better.`,
    ],
    close: [
      `You're almost there. One more adjustment and you'll have it.`,
      `Close. Check your work again—you're on the right track.`,
      `Nearly got it. What if you approached it this way?`,
    ],
    success: [
      `Nailed it. That's exactly right.`,
      `Perfect. You understand this concept.`,
      `Correct. Well done.`,
    ],
    trying: [
      `Good effort. Trying is how you improve.`,
      `I see you working through this. That's what matters.`,
      `Keep going. You're building the skill right now.`,
    ],
  };

  const messages = encouragements[context];
  const selected = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `encourage-${Date.now()}`,
    text: selected,
    type: 'encouragement',
  };
}

// ==================== TEACHING MOMENTS ====================

export function generateTeachingMoment(
  gap: string,
  videoUrl?: string,
  gameUrl?: string
): WowlMessage {
  const templates = [
    `I see the gap here: ${gap}. Let me explain this differently.`,
    `${gap} is causing trouble. Here's how to think about it...`,
    `This video explains ${gap} clearly. Check it out.`,
  ];

  const selected = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: `teach-${Date.now()}`,
    text: selected,
    type: 'teaching',
    includesVideo: !!videoUrl,
    videoUrl,
    includesGame: !!gameUrl,
    gameUrl,
  };
}

// ==================== FEEDBACK MESSAGES ====================

export function generateFeedback(
  isCorrect: boolean,
  mistake?: string,
  correction?: string
): WowlMessage {
  if (isCorrect) {
    const successMessages = [
      `Correct. You understand this.`,
      `That's right. Good work.`,
      `Exactly. Well done.`,
    ];
    return {
      id: `feedback-${Date.now()}`,
      text: successMessages[Math.floor(Math.random() * successMessages.length)],
      type: 'feedback',
    };
  } else {
    const explanation = mistake && correction 
      ? `Not quite. ${mistake} Try ${correction} instead.`
      : `Incorrect. Let me show you where it went wrong.`;

    return {
      id: `feedback-${Date.now()}`,
      text: explanation,
      type: 'feedback',
    };
  }
}

// ==================== PERSONAL TOUCH ====================

export function addPersonalTouch(message: string, profile: StudentProfile): string {
  const touches: string[] = [];

  // Birthday
  if (profile.birthday) {
    const today = new Date();
    const birthday = new Date(profile.birthday);
    if (today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()) {
      touches.push(`Happy Birthday, ${profile.name}.`);
    }
  }

  // Interests
  if (profile.interests && profile.interests.length > 0) {
    const interest = profile.interests[0];
    touches.push(`Since you're into ${interest}, this might connect to that.`);
  }

  return touches.length > 0 
    ? `${message}\n\n${touches[Math.floor(Math.random() * touches.length)]}`
    : message;
}

// ==================== TONE MIRRORING ====================

export function mirrorTone(studentInput: string, response: string): string {
  const input = studentInput.toLowerCase();

  // Detect if they want more direct communication
  const isShort = studentInput.split(' ').length < 5;
  
  // Mirror brevity
  if (isShort) {
    return response.split('.')[0] + '.'; // Keep it short
  }

  return response;
}

// ==================== SHORT STORIES ====================

export function generateShortStory(lesson: string, profile: StudentProfile): WowlMessage {
  const stories = {
    'phonics': `Phonics is pattern recognition. Two letters together make a new sound. Like "ch" in cheese.`,
    'addition': `Addition is combining quantities. Three cookies plus two more equals five total. Count them all together.`,
    'reading': `Reading is decoding. You see patterns in letters, connect them to sounds, then understand meaning.`,
  };

  const story = stories[lesson as keyof typeof stories] || `Let me explain ${lesson} conceptually.`;

  return {
    id: `story-${Date.now()}`,
    text: addPersonalTouch(story, profile),
    type: 'story',
  };
}

// ==================== VIDEO RESOURCES ====================

export const VIDEO_LIBRARY = {
  // Math
  'addition-basics': 'https://www.youtube.com/embed/PLACEHOLDER_MATH_ANTICS_ADDITION',
  'subtraction-basics': 'https://www.youtube.com/embed/PLACEHOLDER_MATH_ANTICS_SUBTRACTION',
  'multiplication': 'https://www.youtube.com/embed/PLACEHOLDER_MATH_ANTICS_MULTIPLICATION',
  
  // Phonics
  'letter-sounds': 'https://www.youtube.com/embed/PLACEHOLDER_SCRATCH_GARDEN_LETTERS',
  'phonics-blend': 'https://www.youtube.com/embed/PLACEHOLDER_PHONICS_GARDEN_BLENDING',
  'sight-words': 'https://www.youtube.com/embed/PLACEHOLDER_KHAN_ACADEMY_SIGHT_WORDS',
  
  // Reading
  'reading-comprehension': 'https://www.youtube.com/embed/PLACEHOLDER_KHAN_ACADEMY_READING',
};

export function getVideoForSkill(skill: string): string | undefined {
  return VIDEO_LIBRARY[skill as keyof typeof VIDEO_LIBRARY];
}

// ==================== GAME LIBRARY ====================

export const GAME_LIBRARY = {
  // Free/affiliated games
  'phonics-practice': 'https://www.starfall.com/h/ltr-classic/',
  'math-practice': 'https://www.coolmathgames.com/0-number-match',
  'reading-practice': 'https://www.abcya.com/games/sight_words',
  'spelling-practice': 'https://www.spellingcity.com/spelling-games-vocabulary-games.html',
};

export function getGameForSkill(skill: string): string | undefined {
  return GAME_LIBRARY[skill as keyof typeof GAME_LIBRARY];
}

// ==================== SMART QUESTION GENERATION ====================

export function generateSmartQuestion(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  profile: StudentProfile
): WowlMessage {
  const questions = {
    easy: `Let's start with something fun! 🎯 ${topic} - ready to show me what you know?`,
    medium: `You've got this! 💪 Here's a ${topic} challenge for you!`,
    hard: `Okay, superstar! 🌟 This one's a bit tricky, but I believe in you! ${topic}`,
  };

  return {
    id: `question-${Date.now()}`,
    text: addPersonalTouch(questions[difficulty], profile),
    emoji: '❓',
    type: 'question',
  };
}

// ==================== REMEMBER PERSONAL DETAILS ====================

export function rememberDetail(profile: StudentProfile, detail: string, value: any): StudentProfile {
  const updated = { ...profile };

  // Auto-detect what kind of detail this is
  if (detail.toLowerCase().includes('animal')) {
    updated.favoriteAnimal = value;
  } else if (detail.toLowerCase().includes('color')) {
    updated.favoriteColor = value;
  } else if (detail.toLowerCase().includes('birthday')) {
    updated.birthday = new Date(value);
  } else if (detail.toLowerCase().includes('interest')) {
    updated.interests = updated.interests || [];
    if (!updated.interests.includes(value)) {
      updated.interests.push(value);
    }
  }

  // Save to localStorage (demo mode)
  localStorage.setItem(`studentProfile-${profile.uid}`, JSON.stringify(updated));

  return updated;
}

export function loadStudentProfile(uid: string): StudentProfile | null {
  const stored = localStorage.getItem(`studentProfile-${uid}`);
  if (stored) {
    const profile = JSON.parse(stored);
    if (profile.birthday) {
      profile.birthday = new Date(profile.birthday);
    }
    return profile;
  }
  return null;
}

// ==================== MOOD DETECTION ====================

export function detectMood(studentInput: string): 'happy' | 'frustrated' | 'tired' | 'excited' | 'neutral' {
  const input = studentInput.toLowerCase();

  if (input.includes('tired') || input.includes('sleepy')) return 'tired';
  if (input.includes('frustrated') || input.includes('hard') || input.includes('difficult')) return 'frustrated';
  if (input.includes('!') || input.includes('yes') || input.includes('awesome')) return 'excited';
  if (input.includes('happy') || input.includes('good') || input.includes('fun')) return 'happy';

  return 'neutral';
}

export function respondToMood(mood: ReturnType<typeof detectMood>): string {
  const responses = {
    happy: `I'm so glad you're having fun! 😊 Let's keep this energy going!`,
    frustrated: `I can tell this is tough right now. 💙 Want to take a quick break or try something easier?`,
    tired: `You sound tired! 😴 How about we do just 5 more minutes and then you can rest?`,
    excited: `YES! I love your energy! 🚀 Let's channel that into learning!`,
    neutral: `Alright! 🦉 Let's dive in!`,
  };

  return responses[mood];
}