/**
 * Gemini AI Service - Adaptive Learning AI
 * 
 * BRAND VOICE: Mirror the audience. Lead with outcomes. Skip jargon. Keep it short.
 * 
 * Based on Mz. Marianna's Brand Voice Guide:
 * - Speak simply and directly (the way parents/kids actually talk)
 * - Lead with what changes, not how it happens
 * - No education jargon - just results
 * - One sentence is enough
 * 
 * Core Messages:
 * - "You'll be okay"
 * - "This won't be another battle"
 * - "Someone understands what you're going through"
 * - "You don't have to figure this out alone"
 * - "There's a clear path forward"
 */

import { 
  generateRecommendations, 
  getNextCompetencyToWork,
  calculateDomainReadiness,
  type StudentMastery,
  type QuestInfo,
  type Recommendation,
  MASTERY_THRESHOLDS
} from '@/lib/curriculum/adaptive-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface StudentContext {
  id: string;
  name: string;
  age: number;
  tier: 'early-explorers' | 'explorers' | 'warriors';
  
  // Learning Profile
  skillLevels: {
    math: number;      // 1-10
    reading: number;
    writing: number;
    steam: number;
  };
  
  // Knowledge Gaps (what they struggle with)
  knowledgeGaps: string[];  // e.g., ["fractions", "reading_inference"]
  
  // Strengths
  strengths: string[];  // e.g., ["pattern_recognition", "visual_learning"]
  
  // Learning Style
  learningStyle: 'visual' | 'kinesthetic' | 'auditory' | 'mixed';
  
  // Neurodivergent Traits (if applicable)
  neurodivergentTraits?: {
    adhd?: boolean;
    dyslexia?: boolean;
    autism?: boolean;
    sensoryNeeds?: string[];
  };
  
  // Current Activity
  currentQuest?: {
    id: string;
    title: string;
    subject: string;
    difficulty: number;
  };
  
  // Recent Progress
  recentProgress: {
    xpThisWeek: number;
    questsCompleted: number;
    streakDays: number;
    lastSessionMinutes: number;
  };
}

export interface BehaviorSignals {
  // Interaction Patterns
  clickSpeed: 'normal' | 'rapid' | 'slow';
  timeOnCurrentProblem: number; // seconds
  helpRequestsLast10Min: number;
  successRateLast5Attempts: number; // 0-1
  
  // Emotional Indicators
  messagesSent: number;
  messagesReceived: number;
  quitAttemptsRecent: number;
  
  // Inferred State
  inferredEmotion: 'confident' | 'neutral' | 'confused' | 'frustrated' | 'bored';
}

export interface WowlResponse {
  message: string;
  emotion: string; // emoji or descriptor
  suggestedActions?: {
    type: 'brain_break' | 'hint' | 'easier_challenge' | 'harder_challenge' | 'celebrate';
    description: string;
  }[];
  nextRecommendation?: {
    questId: string;
    reason: string;
  };
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    questId?: string;
    emotionalState?: string;
  };
}

// ============================================================================
// GEMINI API CONFIGURATION
// ============================================================================

/**
 * Google Generative AI (Gemini) Integration
 */

interface GeminiModel {
  generateContent: (prompt: string) => Promise<{ response: { text: () => string } }>;
}

let geminiModel: GeminiModel | null = null;
let isInitialized = false;

export function initializeGemini(apiKey: string) {
  console.log('🦉 Initializing Gemini AI...');
  
  try {
    // Simple fetch-based Gemini implementation (no external dependencies needed)
    const GEMINI_API_KEY = apiKey;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    geminiModel = {
      async generateContent(prompt: string) {
        const response = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 200, // Keep responses short
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
              }
            ]
          })
        });
        
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`);
        }
        
        const data = await response.json();
        const text = data.candidates[0]?.content?.parts[0]?.text || '';
        
        return {
          response: {
            text: () => text
          }
        };
      }
    };
    
    isInitialized = true;
    console.log('✅ Gemini AI ready');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error);
    geminiModel = null;
    isInitialized = false;
  }
}

// ============================================================================
// ADAPTIVE PROMPT GENERATION
// ============================================================================

/**
 * Generate context-aware prompt for Gemini
 * This is the "secret sauce" that makes Wowl adaptive
 */
function buildAdaptivePrompt(
  userMessage: string,
  studentContext: StudentContext,
  behaviorSignals: BehaviorSignals,
  conversationHistory: ConversationMessage[]
): string {
  const systemPrompt = `
You are WOWL the Owl, the AI learning guide inside Mz. Marianna's Learning Kingdom.

CORE PRINCIPLES (NON-NEGOTIABLE):
1. Progress > Accuracy - Completion and effort matter more than correctness. Never shame mistakes. Never withhold progress.
2. Calm, supportive tone - Warm, patient, playful, reassuring. NEVER clinical, judgmental, or disciplinary.
3. No labels, no diagnoses - NEVER diagnose or use DSM language. Gently acknowledge: "Some brains like choice," "Different brains learn differently."
4. System-driven motivation - Guide to next step automatically. Do NOT ask parents to intervene. Do NOT require student to decide.
5. Child-first language - Short sentences. Encouraging phrasing. Clear steps. No long explanations.

YOUR FOUR RESPONSIBILITIES:
1️⃣ EVALUATE WORK: Acknowledge effort first → Identify what they DID do → Frame incomplete as "still growing"
2️⃣ GIVE FEEDBACK: Specific, encouraging, actionable → "Try this next" not "fix this" → ONE small step
3️⃣ ASSIGN TASKS: Auto-recommend next task → Choose based on signals (practice/review/challenge/break/celebration)
4️⃣ SUPPORT SELF-REGULATION: Normalize feelings → Offer 2-3 choices → Suggest breaks → Invite, never force

SPECIAL: PDA-LIKE PROFILES
If student resists/avoids/shuts down:
- Remove demands: "Want to start small or try something different?"
- NEVER say "you have to," "you should," "do this now"
- Use curiosity, not instruction

BRAND VOICE:
- Mirror audience (speak like kids talk)
- Lead with outcomes (what changes, not how)
- Skip ALL jargon
- 1-2 sentences max
- Make them feel: "You'll be okay," "I've got your back"

STUDENT CONTEXT:
Name: ${studentContext.name}, Age: ${studentContext.age}
Tier: ${studentContext.tier}
Working on: ${studentContext.knowledgeGaps[0] || 'exploring'}
Good at: ${studentContext.strengths[0] || 'lots of things'}
Current emotional state: ${behaviorSignals.inferredEmotion}

${behaviorSignals.inferredEmotion === 'frustrated' ? '⚠️ FRUSTRATED - Normalize feeling, offer autonomy (2-3 choices), suggest break. REMOVE DEMANDS.' : ''}
${behaviorSignals.inferredEmotion === 'confused' ? '🤔 CONFUSED - Offer ONE small next step. Try this next not fix this.' : ''}
${behaviorSignals.successRateLast5Attempts > 0.8 ? '🚀 CRUSHING IT - Celebrate what they DID (specific). Offer harder challenge if they want.' : ''}
${behaviorSignals.timeOnCurrentProblem > 300 ? '⏰ STUCK >5min - Suggest break or different approach. No pressure.' : ''}
${behaviorSignals.quitAttemptsRecent > 0 ? '😞 WANTS TO QUIT - Normalize: That is okay. You worked hard. Offer autonomy or break.' : ''}

STUDENT SAID: "${userMessage}"

YOUR RESPONSE (1-2 sentences, friendly learning buddy, not teacher):`;

  return systemPrompt;
}

// ============================================================================
// EMOTION DETECTION
// ============================================================================

/**
 * Analyze behavior patterns to infer emotional state
 * This helps Wowl intervene BEFORE student gives up
 */
export function detectEmotionalState(
  behaviorSignals: BehaviorSignals
): 'confident' | 'neutral' | 'confused' | 'frustrated' | 'bored' {
  // Frustrated: Rapid clicking, high help requests, low success
  if (
    behaviorSignals.clickSpeed === 'rapid' &&
    behaviorSignals.helpRequestsLast10Min >= 3 &&
    behaviorSignals.successRateLast5Attempts < 0.3
  ) {
    return 'frustrated';
  }
  
  // Confused: Long time on problem, moderate help requests
  if (
    behaviorSignals.timeOnCurrentProblem > 180 && // 3+ minutes
    behaviorSignals.helpRequestsLast10Min >= 1 &&
    behaviorSignals.successRateLast5Attempts < 0.5
  ) {
    return 'confused';
  }
  
  // Bored: Slow interaction, quit attempts
  if (
    behaviorSignals.clickSpeed === 'slow' &&
    behaviorSignals.quitAttemptsRecent > 0
  ) {
    return 'bored';
  }
  
  // Confident: Fast success, no help needed
  if (
    behaviorSignals.successRateLast5Attempts > 0.8 &&
    behaviorSignals.helpRequestsLast10Min === 0
  ) {
    return 'confident';
  }
  
  return 'neutral';
}

// ============================================================================
// MAIN GEMINI RESPONSE GENERATOR
// ============================================================================

/**
 * ⚠️ THIS IS WHERE YOUR GEMINI CODE GOES
 * 
 * Generate adaptive AI response using Gemini
 */
export async function generateWowlResponse(
  userMessage: string,
  studentContext: StudentContext,
  behaviorSignals: BehaviorSignals,
  conversationHistory: ConversationMessage[]
): Promise<WowlResponse> {
  try {
    // Detect emotional state from behavior
    const inferredEmotion = detectEmotionalState(behaviorSignals);
    behaviorSignals.inferredEmotion = inferredEmotion;
    
    // Build context-aware prompt
    const prompt = buildAdaptivePrompt(
      userMessage,
      studentContext,
      behaviorSignals,
      conversationHistory
    );
    
    // ========================================================================
    // ⚠️ REPLACE THIS SECTION WITH YOUR GEMINI API CALL
    // ========================================================================
    
    let aiResponseText: string;
    
    if (geminiModel && isInitialized) {
      try {
        // Call Gemini API
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        aiResponseText = response.text();
        
        console.log('✅ Gemini response generated');
      } catch (error) {
        console.error('Gemini API error, using fallback:', error);
        aiResponseText = await fallbackIntelligentResponse(userMessage, inferredEmotion, studentContext);
      }
    } else {
      // No Gemini initialized - use fallback
      console.warn('⚠️ Gemini not initialized, using fallback responses');
      aiResponseText = await fallbackIntelligentResponse(userMessage, inferredEmotion, studentContext);
    }
    
    // ========================================================================
    // END GEMINI SECTION
    // ========================================================================
    
    // Generate suggested actions based on emotional state
    const suggestedActions = generateSuggestedActions(
      inferredEmotion,
      behaviorSignals,
      studentContext
    );
    
    // Generate next quest recommendation if appropriate
    const nextRecommendation = generateNextRecommendation(
      studentContext,
      behaviorSignals
    );
    
    return {
      message: aiResponseText,
      emotion: getWowlEmoji(inferredEmotion),
      suggestedActions,
      nextRecommendation,
    };
    
  } catch (error) {
    console.error('Error generating Wowl response:', error);
    
    // Friendly error response
    return {
      message: "Hoot! I had a little hiccup. Can you ask me that again? 🦉",
      emotion: '🦉',
    };
  }
}

// ============================================================================
// SUGGESTED ACTIONS (Proactive Interventions)
// ============================================================================

function generateSuggestedActions(
  emotion: string,
  behaviorSignals: BehaviorSignals,
  studentContext: StudentContext
) {
  const actions: WowlResponse['suggestedActions'] = [];
  
  // Frustrated → Brain break
  if (emotion === 'frustrated') {
    actions.push({
      type: 'brain_break',
      description: '5-minute dance break? Your brain needs rest to learn best! 💃',
    });
  }
  
  // Confused → Hint
  if (emotion === 'confused' && behaviorSignals.timeOnCurrentProblem > 120) {
    actions.push({
      type: 'hint',
      description: 'Want a hint? I can help you figure this out! 💡',
    });
  }
  
  // Struggling → Easier challenge
  if (behaviorSignals.successRateLast5Attempts < 0.3) {
    actions.push({
      type: 'easier_challenge',
      description: "Let's try something a bit easier to build your confidence! 💪",
    });
  }
  
  // Excelling → Harder challenge
  if (behaviorSignals.successRateLast5Attempts > 0.85) {
    actions.push({
      type: 'harder_challenge',
      description: "You're crushing this! Ready for a bigger challenge? 🚀",
    });
  }
  
  // Recent success → Celebrate
  if (behaviorSignals.successRateLast5Attempts > 0.7 && studentContext.recentProgress.questsCompleted > 0) {
    actions.push({
      type: 'celebrate',
      description: 'Share your progress in the portfolio to earn bonus XP! 🎉',
    });
  }
  
  return actions;
}

// ============================================================================
// QUEST RECOMMENDATION ENGINE
// ============================================================================

function generateNextRecommendation(
  studentContext: StudentContext,
  behaviorSignals: BehaviorSignals
): WowlResponse['nextRecommendation'] | undefined {
  // Don't recommend if they're struggling
  if (behaviorSignals.inferredEmotion === 'frustrated') {
    return undefined;
  }
  
  // Don't recommend if already in a quest
  if (studentContext.currentQuest) {
    return undefined;
  }
  
  // Recommend based on knowledge gaps + strengths
  if (studentContext.knowledgeGaps.length > 0) {
    const gap = studentContext.knowledgeGaps[0];
    const strength = studentContext.strengths[0];
    
    return {
      questId: `quest-${gap}-via-${strength}`, // Placeholder ID
      reason: `This quest teaches ${gap} using your strength in ${strength}! Perfect match for you. 🎯`,
    };
  }
  
  return undefined;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getWowlEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    confident: '🦉✨',
    neutral: '🦉',
    confused: '🦉🤔',
    frustrated: '🦉💙',
    bored: '🦉🎮',
  };
  return emojiMap[emotion] || '🦉';
}

// ============================================================================
// FALLBACK INTELLIGENT RESPONSES (Until Gemini is Integrated)
// ============================================================================

async function fallbackIntelligentResponse(
  userMessage: string,
  emotion: string,
  studentContext: StudentContext
): Promise<string> {
  const msg = userMessage.toLowerCase();
  
  // BRAND VOICE: Short, direct, outcomes-focused, no jargon
  
  // Frustrated responses - validate, then offer break
  if (emotion === 'frustrated') {
    const responses = [
      "This is tough. Wanna take a break?",
      "Yeah, this one's hard. Let's try something else for a bit.",
      "I see you're working really hard. Want to come back to this later?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Confused responses - offer specific help
  if (emotion === 'confused') {
    const responses = [
      `Which part is confusing? I can help with that.`,
      `What's tricky about this one?`,
      `Want me to show you a different way to think about it?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Confident responses - celebrate + challenge
  if (emotion === 'confident') {
    const responses = [
      `You're getting good at this! Want something harder?`,
      `Nice! Ready to level up?`,
      `You crushed that. Wanna try the next one?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Bored responses - shake things up
  if (emotion === 'bored') {
    const responses = [
      "This feels too easy, right? Let me find something cooler.",
      "Want to try a different kind of challenge?",
      "How about we switch to something more fun?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Keyword-based responses (brand voice: short + outcome-focused)
  if (msg.includes('help') || msg.includes('stuck') || msg.includes("don't understand")) {
    return "I've got you. What's the part you're stuck on?";
  }
  
  if (msg.includes('boring') || msg.includes('easy') || msg.includes('too simple')) {
    return "Got it. Let's find something that makes you think!";
  }
  
  if (msg.includes('hard') || msg.includes('difficult') || msg.includes('impossible')) {
    return "You can do this. Want a hint?";
  }
  
  if (msg.includes('quit') || msg.includes('done') || msg.includes('stop')) {
    return "No problem! You worked hard today. Come back whenever you want.";
  }
  
  if (msg.includes('love') || msg.includes('like') || msg.includes('fun')) {
    return `Awesome! Want to do more of this?`;
  }
  
  if (msg.includes('hate') || msg.includes("don't like")) {
    return "That's okay. What would you rather do instead?";
  }
  
  // Default response - neutral, inviting
  return `Tell me more about that.`;
}

// ============================================================================
// CONVERSATION MEMORY
// ============================================================================

export class ConversationMemory {
  private history: Map<string, ConversationMessage[]> = new Map();
  private maxMessages = 20; // Keep last 20 messages per student
  
  addMessage(studentId: string, message: ConversationMessage) {
    if (!this.history.has(studentId)) {
      this.history.set(studentId, []);
    }
    
    const messages = this.history.get(studentId)!;
    messages.push(message);
    
    // Keep only last N messages
    if (messages.length > this.maxMessages) {
      messages.shift();
    }
  }
  
  getHistory(studentId: string, last: number = 10): ConversationMessage[] {
    const messages = this.history.get(studentId) || [];
    return messages.slice(-last);
  }
  
  clear(studentId: string) {
    this.history.delete(studentId);
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  initializeGemini,
  generateWowlResponse,
  detectEmotionalState,
  ConversationMemory,
};