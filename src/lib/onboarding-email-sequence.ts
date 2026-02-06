/**
 * Onboarding Email Sequence
 * Automated drip campaign for new users
 */

import { sendEmail } from './email-service';

export interface OnboardingEmailSchedule {
  day: number;
  templateName: string;
  subject: string;
}

export const ONBOARDING_SEQUENCE: OnboardingEmailSchedule[] = [
  { day: 0, templateName: 'welcome', subject: '🎉 Welcome to Your Learning Kingdom!' },
  { day: 1, templateName: 'navigation', subject: '🗺️ How to Navigate Your Dashboard' },
  { day: 3, templateName: 'meet-wowl', subject: '🦉 Meet Wowl, Your AI Learning Buddy' },
  { day: 7, templateName: 'first-quest', subject: '🎯 Ready for Your First Quest?' },
  { day: 14, templateName: 'check-in', subject: '📊 Your 2-Week Progress Report' },
];

/**
 * Send onboarding email sequence (call from cron or worker)
 */
export async function sendOnboardingEmail(
  recipientEmail: string,
  recipientName: string,
  dayNumber: number,
  role: 'student' | 'parent' | 'tutor'
) {
  const email = ONBOARDING_SEQUENCE.find(e => e.day === dayNumber);
  if (!email) return;

  const template = getOnboardingTemplate(email.templateName, recipientName, role);
  
  return sendEmail({
    to: recipientEmail,
    subject: email.subject,
    html: template,
  });
}

/**
 * Get email template by name
 */
function getOnboardingTemplate(
  templateName: string,
  recipientName: string,
  role: 'student' | 'parent' | 'tutor'
): string {
  const templates = {
    navigation: getNavigationTemplate(recipientName, role),
    'meet-wowl': getMeetWowlTemplate(recipientName, role),
    'first-quest': getFirstQuestTemplate(recipientName, role),
    'check-in': getCheckInTemplate(recipientName, role),
  };

  return templates[templateName] || '';
}

// ============================================================================
// DAY 1: NAVIGATION GUIDE
// ============================================================================

function getNavigationTemplate(name: string, role: 'student' | 'parent' | 'tutor'): string {
  if (role === 'student') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>How to Navigate Your Dashboard</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🗺️ Your Learning Kingdom Tour!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px;">Hey ${name}! 👋</p>
          
          <p>Yesterday you joined the Learning Kingdom! Today, let me show you around so you know where everything is.</p>
          
          <h3 style="color: #667eea; margin-top: 24px;">🎮 Your Dashboard Has:</h3>
          
          <div style="background: #f0f9ff; padding: 16px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #0ea5e9;">
            <strong style="color: #0369a1;">⭐ XP Bar</strong>
            <p style="margin: 8px 0 0 0;">Watch your XP grow! Remember: it NEVER goes down. Every challenge you try adds points.</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #10b981;">
            <strong style="color: #047857;">🎯 Quest Map</strong>
            <p style="margin: 8px 0 0 0;">See all your quests here. Each quest has challenges in Math, Reading, Writing, and STEAM!</p>
          </div>
          
          <div style="background: #fef3f5; padding: 16px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #ec4899;">
            <strong style="color: #be185d;">🦉 Wowl's Corner</strong>
            <p style="margin: 8px 0 0 0;">Click the owl icon anytime you need help. Wowl is always there!</p>
          </div>
          
          <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #f59e0b;">
            <strong style="color: #d97706;">🏆 Badge Collection</strong>
            <p style="margin: 8px 0 0 0;">All the badges you earn show up here. Try to collect them all!</p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://mzmarianna.com/student-dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Explore Your Dashboard
            </a>
          </div>
          
          <p style="margin-top: 24px;">Tomorrow, I'll introduce you to someone special... 🦉</p>
        </div>
      </body>
      </html>
    `;
  } else {
    return getParentNavigationTemplate(name);
  }
}

function getParentNavigationTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Parent Dashboard Guide</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">📊 Parent Dashboard Tour</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Hi ${name}! 👋</p>
        
        <p>Your parent dashboard gives you a complete view of your child's progress—without having to hover or micromanage.</p>
        
        <h3 style="color: #ec4899;">📈 What You Can See:</h3>
        
        <div style="background: #e0f2fe; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>Real-Time Progress</strong>
          <p style="margin: 8px 0 0 0;">XP earned, challenges completed, current level—updated live as they learn.</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>Competency Tracking</strong>
          <p style="margin: 8px 0 0 0;">See developmental progress across 7 areas (Health/Physical, Language/Literacy, etc.)</p>
        </div>
        
        <div style="background: #fef3f5; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>Tutor Notes</strong>
          <p style="margin: 8px 0 0 0;">Read what tutors observe in live sessions—strengths, recommendations, next steps.</p>
        </div>
        
        <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>Weekly Reports</strong>
          <p style="margin: 8px 0 0 0;">Every Monday, get a summary email with highlights from the week.</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/parent-dashboard" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Your Dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// DAY 3: MEET WOWL
// ============================================================================

function getMeetWowlTemplate(name: string, role: 'student' | 'parent' | 'tutor'): string {
  if (role === 'student') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Meet Wowl the Owl!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
          <div style="font-size: 80px; margin-bottom: 16px;">🦉</div>
          <h1 style="margin: 0; font-size: 28px;">Meet Wowl, Your AI Learning Buddy!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px;">Hoot hoot, ${name}! 🦉</p>
          
          <p>I'm <strong>Wowl</strong>, and I'm SO excited to be your learning buddy!</p>
          
          <h3 style="color: #f59e0b;">✨ What Makes Me Special?</h3>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0;"><strong>🤝 Infinite Patience</strong><br>I never get frustrated. Ask me the same question 100 times—I'm happy to help!</p>
          </div>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0;"><strong>🎯 Always Available</strong><br>Stuck on a challenge at 2am? I'm awake! (Owls are night birds, you know.)</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0;"><strong>🎨 Fun Hints</strong><br>I don't just give you answers. I give you hints, examples, and help you discover!</p>
          </div>
          
          <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 0;"><strong>🦉 Your Cheerleader</strong><br>I celebrate every win with you—big or small!</p>
          </div>
          
          <h3 style="color: #f59e0b; margin-top: 32px;">💬 How to Talk to Me:</h3>
          <ol style="line-height: 1.8;">
            <li>Click the owl icon in the corner</li>
            <li>Type or speak your question</li>
            <li>I'll respond in seconds!</li>
          </ol>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://mzmarianna.com/student-dashboard" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Chat with Wowl Now!
            </a>
          </div>
          
          <p style="margin-top: 24px; text-align: center; font-style: italic; color: #666;">
            "Every question makes you smarter!" - Wowl 🦉
          </p>
        </div>
      </body>
      </html>
    `;
  } else {
    return getParentWowlTemplate(name);
  }
}

function getParentWowlTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <div style="font-size: 64px;">🦉</div>
        <h1 style="margin: 0;">Why Wowl Works (The Parent Version)</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p>Hi ${name},</p>
        
        <p>You've probably noticed your child talking about "Wowl." Here's why this AI tutor is a game-changer for ADHD/dyslexic kids:</p>
        
        <h3 style="color: #f59e0b;">🧠 The Science:</h3>
        
        <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>No Judgment Anxiety</strong>
          <p style="margin: 8px 0 0 0;">Kids with ADHD/autism often fear judgment. Wowl removes that completely—it's just a friendly owl who wants to help.</p>
        </div>
        
        <div style="background: #e0f2fe; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>Instant Feedback Loop</strong>
          <p style="margin: 8px 0 0 0;">ADHD brains crave immediate dopamine. Wowl responds instantly, keeping engagement high.</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <strong>Infinite Patience</strong>
          <p style="margin: 8px 0 0 0;">Let's be honest: we all lose patience sometimes. Wowl never does. Your child can ask 100 times without shame.</p>
        </div>
        
        <p><strong>You're Still Essential!</strong> Wowl supplements your support—it doesn't replace your encouragement and love. Think of it as an extra team member who never sleeps.</p>
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// DAY 7: FIRST QUEST GUIDE
// ============================================================================

function getFirstQuestTemplate(name: string, role: 'student' | 'parent' | 'tutor'): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 32px;">🎯 Ready for Your First Quest?</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Hey ${name}! 🚀</p>
        
        <p>You've been exploring for a week—time to start your first official quest!</p>
        
        <h3 style="color: #667eea;">📚 What's in a Quest?</h3>
        
        <p>Each quest is a week-long adventure with challenges in:</p>
        <ul style="line-height: 1.8;">
          <li>📐 <strong>Math</strong> (Monday)</li>
          <li>📖 <strong>Reading</strong> (Tuesday)</li>
          <li>✍️ <strong>Writing</strong> (Wednesday)</li>
          <li>🔬 <strong>STEAM</strong> (Thursday)</li>
        </ul>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #0ea5e9;">
          <strong style="color: #0369a1;">💡 Pro Tip:</strong>
          <p style="margin: 8px 0 0 0;">You don't have to do them in order! Feel like doing STEAM first? Go for it!</p>
        </div>
        
        <h3 style="color: #667eea;">🏆 What You'll Earn:</h3>
        <ul style="line-height: 1.8;">
          <li>⭐ XP for every challenge you try</li>
          <li>🎖️ Badges when you complete the quest</li>
          <li>🎯 Clan points to help your team</li>
          <li>📈 Progress toward your next level!</li>
        </ul>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/quests" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            🎮 Start First Quest
          </a>
        </div>
        
        <p style="text-align: center; color: #666; font-style: italic;">
          "The journey of a thousand quests begins with a single challenge!" - Wowl 🦉
        </p>
      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// DAY 14: TWO-WEEK CHECK-IN
// ============================================================================

function getCheckInTemplate(name: string, role: 'student' | 'parent' | 'tutor'): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 32px;">🎉 Two Weeks In!</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Hey ${name}! 🌟</p>
        
        <p>You've been learning with us for 2 weeks! Let's check in.</p>
        
        <h3 style="color: #10b981;">How's It Going?</h3>
        
        <p>We'd love to hear from you:</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0;"><strong>What's working well?</strong></p>
          <p style="margin: 8px 0 0 0; color: #666;">Tell us what you love!</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0;"><strong>What could be better?</strong></p>
          <p style="margin: 8px 0 0 0; color: #666;">We're always improving!</p>
        </div>
        
        <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Any questions?</strong></p>
          <p style="margin: 8px 0 0 0; color: #666;">We're here to help!</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/feedback" style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Share Feedback
          </a>
        </div>
        
        <p style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #666;">
          Need to talk? Email us at <a href="mailto:support@mzmarianna.com" style="color: #10b981;">support@mzmarianna.com</a>
        </p>
      </div>
    </body>
    </html>
  `;
}
