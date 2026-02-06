/**
 * Email Service - Frontend interface for sending emails
 * Calls Supabase Edge Function which uses Resend
 */

import { supabase } from './supabase';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send email via Supabase Edge Function
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: options,
    });

    if (error) throw error;

    return { success: true, emailId: data?.emailId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userEmail: string, userName: string, role: 'student' | 'parent' | 'tutor') {
  const templates = {
    student: {
      subject: '🎮 Welcome to Your Learning Kingdom!',
      html: getStudentWelcomeTemplate(userName),
    },
    parent: {
      subject: '🌟 Welcome to Mz. Marianna\'s Academy - Let\'s Get Started!',
      html: getParentWelcomeTemplate(userName),
    },
    tutor: {
      subject: '📚 Welcome to the Teaching Team!',
      html: getTutorWelcomeTemplate(userName),
    },
  };

  const template = templates[role];

  return sendEmail({
    to: userEmail,
    subject: template.subject,
    html: template.html,
  });
}

/**
 * Send enrollment confirmation email
 */
export async function sendEnrollmentConfirmation(
  parentEmail: string,
  studentName: string,
  tier: string,
  startDate: string
) {
  return sendEmail({
    to: parentEmail,
    subject: `🎉 ${studentName} is Enrolled - Let's Begin!`,
    html: getEnrollmentTemplate(studentName, tier, startDate),
  });
}

/**
 * Send placement quiz results
 */
export async function sendPlacementResults(
  parentEmail: string,
  studentName: string,
  tier: string,
  strengths: string[],
  recommendations: string[]
) {
  return sendEmail({
    to: parentEmail,
    subject: `📊 ${studentName}'s Learning Profile & Placement`,
    html: getPlacementResultsTemplate(studentName, tier, strengths, recommendations),
  });
}

/**
 * Send weekly progress report to parent
 */
export async function sendWeeklyProgressReport(
  parentEmail: string,
  studentName: string,
  weekData: {
    xpEarned: number;
    challengesCompleted: number;
    badgesEarned: number;
    timeSpent: number;
    highlights: string[];
  }
) {
  return sendEmail({
    to: parentEmail,
    subject: `📈 ${studentName}'s Weekly Progress - Week of ${new Date().toLocaleDateString()}`,
    html: getWeeklyProgressTemplate(studentName, weekData),
  });
}

// ============================================================================
// EMAIL TEMPLATES (HTML)
// ============================================================================

function getStudentWelcomeTemplate(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Learning Kingdom!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 0; background-color: #000;">
      <div style="background: linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%); padding: 40px 20px; text-align: center;">
        <div style="font-size: 80px; margin-bottom: 16px;">👑</div>
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to the Learning Kingdom!</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-top: 8px;">Where Every Child is a Genius</p>
      </div>
      
      <div style="background: #111; padding: 40px 30px;">
        <p style="font-size: 20px; color: #22d3ee; font-weight: bold;">Hey ${userName}! 👋</p>
        
        <p style="color: #d1d5db;">You didn't just sign up for tutoring. You <strong style="color: #fff;">joined a kingdom</strong>.</p>
        
        <p style="color: #d1d5db;">Here in the Learning Kingdom, <strong style="color: #22d3ee;">every child is a genius</strong>. Not "will be" someday. Not "if you try hard enough." You already ARE.</p>
        
        <p style="color: #d1d5db;">Our job? <strong style="color: #a855f7;">Unlock it.</strong></p>
        
        <div style="background: linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(168,85,247,0.1) 100%); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #22d3ee;">
          <h3 style="margin-top: 0; color: #22d3ee;">🎮 What Makes This Different?</h3>
          <ul style="color: #d1d5db; margin-bottom: 0; line-height: 1.8;">
            <li><strong style="color: #fff;">XP Never Goes Down</strong> - No punishment, just progress</li>
            <li><strong style="color: #fff;">Wowl the Owl</strong> - Your AI tutor with infinite patience</li>
            <li><strong style="color: #fff;">Join a Clan</strong> - Team up with other genius kids</li>
            <li><strong style="color: #fff;">Earn Real Rewards</strong> - Robux, badges, and more</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/student-dashboard" style="background: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            👑 Enter Your Kingdom
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #333; text-align: center;">
          You're not broken. You don't need fixing.<br>
          <strong style="color: #22d3ee;">You need a kingdom where your genius can shine.</strong>
        </p>
      </div>
      
      <div style="background: #000; text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>The Learning Kingdom by Mz. Marianna's Academy</p>
        <p style="margin-top: 4px;">Where Every Child is a Genius</p>
      </div>
    </body>
    </html>
  `;
}

function getParentWelcomeTemplate(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Learning Kingdom</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 0; background-color: #000;">
      <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 40px 20px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 16px;">👑</div>
        <h1 style="color: white; margin: 0; font-size: 28px;">Your Child Just Joined the Kingdom</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px;">
        <p style="font-size: 20px; color: #ec4899; font-weight: bold;">Hi ${userName}! 🌟</p>
        
        <p style="color: #d1d5db;">You just made a decision that will change everything.</p>
        
        <p style="color: #d1d5db;">Not because we're magic. But because of one simple truth:</p>
        
        <p style="font-size: 24px; font-weight: bold; text-align: center; background: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 24px 0;">
          Every child is a genius.
        </p>
        
        <p style="color: #d1d5db;">Your child isn't broken. They don't need "fixing." They need an environment where their genius can BLOOM.</p>
        
        <div style="background: linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.1) 100%); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #ec4899;">
          <h3 style="margin-top: 0; color: #ec4899;">💗 What Happens Next?</h3>
          <ol style="color: #d1d5db; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Your child takes their <strong style="color: #fff;">Genius Assessment</strong> (not a test—a throne-claiming)</li>
            <li>They discover their <strong style="color: #fff;">Royal Tier</strong> based on skill, not age</li>
            <li>They meet <strong style="color: #fff;">Wowl the Owl</strong>, their AI learning buddy</li>
            <li>They join a <strong style="color: #fff;">Clan</strong> and start their first quest</li>
            <li>You watch them <strong style="color: #fff;">thrive</strong> for the first time in years</li>
          </ol>
        </div>
        
        <div style="background: rgba(34,211,238,0.1); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #22d3ee;">
          <h3 style="margin-top: 0; color: #22d3ee;">📊 Your Parent Dashboard</h3>
          <p style="color: #d1d5db; margin-bottom: 8px;">You'll be able to see:</p>
          <ul style="color: #d1d5db; margin: 0; padding-left: 20px;">
            <li>Real-time XP and progress</li>
            <li>Competency tracking across 7 developmental areas</li>
            <li>Tutor notes and recommendations</li>
            <li>Weekly progress reports (no more guessing!)</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/parent-dashboard" style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            📊 View Dashboard
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #333;">
          Questions? We're here! Email <a href="mailto:support@mzmarianna.com" style="color: #ec4899; text-decoration: none;">support@mzmarianna.com</a>
        </p>
      </div>
      
      <div style="background: #000; text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>The Learning Kingdom by Mz. Marianna's Academy</p>
        <p style="margin-top: 4px;">Where Every Child is a Genius • Neurodivergent-First</p>
      </div>
    </body>
    </html>
  `;
}

function getTutorWelcomeTemplate(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Teaching Team</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0fdf4;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to the Team!</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #10b981; font-weight: bold;">Hi ${userName}! 📚</p>
        
        <p>Welcome to Mz. Marianna's Academy! We're excited to have you on the teaching team.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #10b981;">🎯 Your Tutor Dashboard</h3>
          <p>Access all your tools:</p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Student roster and progress</li>
            <li>Competency assessment tools</li>
            <li>Communication with parents</li>
            <li>Theme and activity planning</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/tutor-dashboard" style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            📊 Open Dashboard
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
          Questions? Contact admin at <a href="mailto:admin@mzmarianna.com" style="color: #10b981;">admin@mzmarianna.com</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

function getEnrollmentTemplate(studentName: string, tier: string, startDate: string): string {
  const tierNames = {
    'early-explorers': 'Early Explorers (Ages 4-6)',
    'explorers': 'Explorers (Ages 7-10)',
    'warriors': 'Warriors (Ages 11-18)',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enrollment Confirmed!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef3f5;">
      <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Enrollment Confirmed!</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Great news! ${studentName} is officially enrolled!</p>
        
        <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #ec4899;">📋 Enrollment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Student:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${studentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tier:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${tierNames[tier]}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Start Date:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${startDate}</td>
            </tr>
          </table>
        </div>
        
        <p><strong>What's Next?</strong></p>
        <ol>
          <li>Log in to the parent dashboard</li>
          <li>Help ${studentName} complete their profile</li>
          <li>Explore the first quest together</li>
          <li>Join our parent community (optional)</li>
        </ol>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/login" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Get Started
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getPlacementResultsTemplate(
  studentName: string,
  tier: string,
  strengths: string[],
  recommendations: string[]
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Learning Profile & Placement</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #667eea;">📊 ${studentName}'s Learning Profile</h1>
        
        <div style="background: #e0f2fe; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #0ea5e9;">Tier Placement: ${tier}</h3>
          <p>Based on the assessment, ${studentName} has been placed in the ${tier} tier, where they'll be challenged at just the right level!</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #10b981;">💪 Strengths</h3>
          <ul>
            ${strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        
        <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #ec4899;">🎯 Recommendations</h3>
          <ul>
            ${recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
          View full details in your <a href="https://mzmarianna.com/parent-dashboard" style="color: #667eea;">Parent Dashboard</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

function getWeeklyProgressTemplate(studentName: string, weekData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Progress Report</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; padding: 40px 30px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #667eea;">📈 ${studentName}'s Weekly Progress</h1>
        <p style="color: #888; font-size: 14px;">Week of ${new Date().toLocaleDateString()}</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0;">
          <div style="background: #e0f2fe; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #0ea5e9;">${weekData.xpEarned}</div>
            <div style="font-size: 14px; color: #666;">XP Earned</div>
          </div>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #10b981;">${weekData.challengesCompleted}</div>
            <div style="font-size: 14px; color: #666;">Challenges</div>
          </div>
          <div style="background: #fef3f5; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #ec4899;">${weekData.badgesEarned}</div>
            <div style="font-size: 14px; color: #666;">Badges</div>
          </div>
          <div style="background: #fef3c7; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #f59e0b;">${weekData.timeSpent}h</div>
            <div style="font-size: 14px; color: #666;">Learning Time</div>
          </div>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #667eea;">✨ This Week's Highlights</h3>
          <ul>
            ${weekData.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/parent-dashboard" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Full Dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}