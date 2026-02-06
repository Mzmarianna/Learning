/**
 * Wowl Voice System
 * Configures speech synthesis for Wowl the Owl - a friendly, kid-animated character
 */

export interface WowlVoiceSettings {
  voiceName?: string;
  rate: number;
  pitch: number;
  volume: number;
}

// Voice presets for different Wowl moods/contexts
export const WOWL_VOICE_PRESETS = {
  // Default friendly young owl voice
  friendly: {
    rate: 1.1,      // Slightly faster = more energetic
    pitch: 1.3,     // Higher pitch = younger, friendlier
    volume: 1.0,
  },
  
  // Excited (celebrating achievements)
  excited: {
    rate: 1.2,
    pitch: 1.4,
    volume: 1.0,
  },
  
  // Calm (teaching/explaining)
  teaching: {
    rate: 0.95,
    pitch: 1.2,
    volume: 0.9,
  },
  
  // Encouraging (when student is struggling)
  encouraging: {
    rate: 1.0,
    pitch: 1.25,
    volume: 0.95,
  },
  
  // Whisper (hints/secrets)
  whisper: {
    rate: 0.9,
    pitch: 1.15,
    volume: 0.7,
  },
} as const;

export type WowlMood = keyof typeof WOWL_VOICE_PRESETS;

/**
 * Get the best kid-friendly voice available on this device
 */
export function getBestKidVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  
  // Priority list of kid-friendly voices (by platform)
  const preferredVoices = [
    // Google voices (most kid-friendly)
    'Google UK English Female',   // Young British accent
    'Google US English Female',    // Young American accent
    'Google Australian Female',    // Young Australian accent
    
    // Apple voices (iOS/Mac)
    'Samantha',                    // Young female (Mac/iOS)
    'Victoria',                    // Young British female (Mac)
    'Flo',                         // Young female (iOS)
    'Zoe',                         // Young female (iOS)
    
    // Microsoft voices (Windows)
    'Microsoft Zira Desktop',      // Young female (Windows)
    'Microsoft Hazel Desktop',     // Young female UK (Windows)
    
    // Android voices
    'en-US-SMTf00',               // Young female (Android)
    'en-GB-SMTf00',               // Young female UK (Android)
  ];

  // Try to find preferred voice
  for (const preferredName of preferredVoices) {
    const voice = voices.find(v => v.name === preferredName);
    if (voice) return voice;
  }

  // Fallback: Find any female English voice (usually sounds younger)
  const femaleEnglishVoice = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.toLowerCase().includes('female') || 
     v.name.toLowerCase().includes('woman') ||
     v.name.toLowerCase().includes('samantha') ||
     v.name.toLowerCase().includes('victoria'))
  );
  
  if (femaleEnglishVoice) return femaleEnglishVoice;

  // Last resort: Any English voice
  return voices.find(v => v.lang.startsWith('en')) || null;
}

/**
 * Make Wowl speak with appropriate voice settings
 */
export function speakAsWowl(
  text: string,
  mood: WowlMood = 'friendly',
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Wait for voices to load (some browsers need this)
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const settings = WOWL_VOICE_PRESETS[mood];
    
    // Apply voice settings
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    // Try to use kid-friendly voice
    const kidVoice = getBestKidVoice();
    if (kidVoice) {
      utterance.voice = kidVoice;
    }
    
    // Set up callbacks
    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    
    // Speak!
    window.speechSynthesis.speak(utterance);
  };

  // Check if voices are loaded
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    speak();
  } else {
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      speak();
    };
  }
}

/**
 * Stop Wowl from speaking
 */
export function stopWowlSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Get list of all available voices for debugging/settings
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Test Wowl's voice with different moods
 */
export function testWowlVoice(mood: WowlMood = 'friendly'): void {
  const testMessages: Record<WowlMood, string> = {
    friendly: "Hey there! I'm Wowl, your learning buddy. Ready to start an adventure?",
    excited: "Awesome work! You just earned a new badge! You're crushing it!",
    teaching: "Let me explain how this works. Pay attention to the pattern here.",
    encouraging: "You've got this. Everyone makes mistakes. Let's try it one more time.",
    whisper: "Psst... here's a hint. Look at the example more carefully.",
  };

  speakAsWowl(testMessages[mood], mood);
}

/**
 * Wowl personality phrases for different situations
 */
export const WOWL_PHRASES = {
  greeting: [
    "Hey there! Ready to learn something new?",
    "Welcome back! I've been waiting for you.",
    "Alright, let's do this!",
    "Time to level up your skills!",
  ],
  
  celebration: [
    "YES! That's what I'm talking about!",
    "You nailed it! Amazing work!",
    "Whoa! You're on fire today!",
    "Boom! Another one mastered!",
  ],
  
  encouragement: [
    "Almost there! One more try.",
    "You're getting closer! Keep going.",
    "That's okay. Mistakes help us learn.",
    "Try thinking about it this way...",
  ],
  
  hint: [
    "Want a hint? Here's what I'd try...",
    "Psst... check out this example.",
    "Think about what we learned earlier.",
    "Remember that pattern we saw?",
  ],
  
  teaching: [
    "Here's how this works...",
    "Let me break this down for you.",
    "Watch what happens when...",
    "The key thing to remember is...",
  ],
  
  projectOffer: [
    "I've got a cool project for you!",
    "Ready to build something awesome?",
    "Time to apply what you've learned!",
    "Let's create something together!",
  ],
};

/**
 * Get a random Wowl phrase for a situation
 */
export function getRandomWowlPhrase(situation: keyof typeof WOWL_PHRASES): string {
  const phrases = WOWL_PHRASES[situation];
  return phrases[Math.floor(Math.random() * phrases.length)];
}
