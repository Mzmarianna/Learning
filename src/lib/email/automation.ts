/**
 * Email Automation Service
 * Handles automated email sequences for leads and customers
 */

import { supabase } from '../supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send quiz results email with personalized recommendations
 */
export async function sendQuizResultsEmail(
  email: string,
  studentName: string,
  tier: string,
  scores: {
    reading: number;
    math: number;
    criticalThinking: number;
    overall: number;
  }
) {
  const tierNames = {
    early_explorers: 'Early Explorers',
    explorers: 'Explorers',
    warriors: 'Warriors'
  };

  const tierName = tierNames[tier as keyof typeof tierNames] || 'Explorers';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .features { list-style: none; padding: 0; }
        .features li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .features li:before { content: "✓ "; color: #10b981; font-weight: bold; margin-right: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ${studentName}'s Results Are In!</h1>
          <p>Congratulations on completing the placement quiz!</p>
        </div>
        
        <div class="content">
          <h2>Recommended Tier: ${tierName}</h2>
          
          <div class="score-card">
            <h3>Quiz Performance:</h3>
            <p>📚 <strong>Reading:</strong> ${Math.round(scores.reading)}%</p>
            <p>🔢 <strong>Math:</strong> ${Math.round(scores.math)}%</p>
            <p>🧠 <strong>Critical Thinking:</strong> ${Math.round(scores.criticalThinking)}%</p>
            <p><strong>Overall:</strong> ${Math.round(scores.overall)}%</p>
          </div>

          <h3>What This Means:</h3>
          <p>${studentName} is ready for ${tierName} level content! This tier offers:</p>
          
          <ul class="features">
            <li>Personalized learning paths adapted to their skill level</li>
            <li>Gamified quests that make learning fun</li>
            <li>Progress tracking and parent dashboard</li>
            <li>Wowl AI tutor for instant help</li>
          </ul>

          <center>
            <a href="${import.meta?.env?.VITE_APP_URL || 'https://mzmariannas-academy.com'}/pricing?tier=${tier}" class="cta-button">
              🚀 Start Learning Now - First Month 50% Off!
            </a>
          </center>

          <div class="score-card" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
            <h3>🎁 Special Offer for ${studentName}:</h3>
            <p><strong>Limited Time:</strong> Get 50% off your first month when you enroll within 48 hours!</p>
            <p>Just $14.50 to start (normally $29/month)</p>
          </div>

          <h3>Next Steps:</h3>
          <ol>
            <li><strong>Choose Your Plan:</strong> We recommend starting with our Warrior tier</li>
            <li><strong>Create Account:</strong> Set up your parent dashboard</li>
            <li><strong>Start First Quest:</strong> ${studentName} can begin learning immediately!</li>
          </ol>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <strong>Questions?</strong> Reply to this email or contact us at mariannav920@gmail.com
          </p>

          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
            This is an automated email from Mz. Marianna's Academy. You're receiving this because you completed our placement quiz.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Call Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: `🎉 ${studentName}'s Learning Path: ${tierName} - Results Inside!`,
        html: emailHtml,
        from: 'Mz. Marianna <mariannav920@gmail.com>'
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending quiz results email:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email for new free guide downloads
 */
export async function sendFreeGuideEmail(email: string, childAge?: number, struggle?: string) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .tip-box { background: #dbeafe; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 Your Free Guide is Here!</h1>
          <p>5 Simple Steps to Unlock Your Child's Genius</p>
        </div>
        
        <div class="content">
          <p>Hi there,</p>
          
          <p>Thank you for downloading our guide! I'm so excited to share these strategies with you.</p>

          <center>
            <a href="${import.meta?.env?.VITE_APP_URL || 'https://mzmariannas-academy.com'}/downloads/genius-guide.pdf" class="cta-button">
              📥 Download Your Free Guide
            </a>
          </center>

          <h3>What's Inside:</h3>
          <ul>
            <li>✅ Discover your child's unique "Genius Profile"</li>
            <li>✅ Create one tiny win in 15 minutes</li>
            <li>✅ Build unstoppable confidence without pressure</li>
            <li>✅ Turn one win into consistent, joyful learning</li>
          </ul>

          <div class="tip-box">
            <strong>💡 Quick Win:</strong> Before reading the full guide, try this: Ask your child to teach YOU something they love (Minecraft, art, etc.). Watch their confidence soar!
          </div>

          <h3>Next: Take the Free Placement Quiz</h3>
          <p>Want to discover exactly where your child is at? Our 10-minute quiz gives you:</p>
          <ul>
            <li>Personalized tier recommendation</li>
            <li>Detailed skill breakdown</li>
            <li>Custom action plan</li>
          </ul>

          <center>
            <a href="${import.meta?.env?.VITE_APP_URL || 'https://mzmariannas-academy.com'}/placement-quiz" class="cta-button">
              🎯 Take Free Quiz Now
            </a>
          </center>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <strong>Over the next 7 days</strong>, I'll email you daily tips to help you implement these strategies. Each email is short (2-3 minutes) and actionable.
          </p>

          <p><strong>Day 1 arrives tomorrow!</strong></p>

          <p style="margin-top: 30px;">
            Cheering you on,<br>
            <strong>Mz. Marianna</strong><br>
            Founder, Mz. Marianna's Academy
          </p>

          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            P.S. Reply to this email anytime - I read every message! ❤️
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: '🎁 Your Free Guide: 5 Steps to Unlock Your Child\'s Genius',
        html: emailHtml,
        from: 'Mz. Marianna <mariannav920@gmail.com>'
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending free guide email:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email after purchase
 */
export async function sendWelcomeEmail(email: string, studentName: string, tier: string) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .step-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to the Kingdom!</h1>
          <p>Let's get ${studentName} started on their learning adventure</p>
        </div>
        
        <div class="content">
          <p>Congratulations on taking this amazing step for ${studentName}!</p>

          <p>You're now part of a community of 5,200+ families who've discovered that learning can be joyful, engaging, and actually work for neurodivergent kids.</p>

          <h3>🚀 Quick Start (takes 5 minutes):</h3>

          <div class="step-box">
            <strong>Step 1: Log In</strong>
            <p>Create your parent account and set up ${studentName}'s profile</p>
            <center>
              <a href="${import.meta?.env?.VITE_APP_URL || 'https://mzmariannas-academy.com'}/login" class="cta-button">
                Log In Now
              </a>
            </center>
          </div>

          <div class="step-box">
            <strong>Step 2: Choose First Quest</strong>
            <p>Let ${studentName} pick a quest that matches their interests (Roblox, Minecraft, art, etc.)</p>
          </div>

          <div class="step-box">
            <strong>Step 3: Celebrate!</strong>
            <p>Watch as they complete their first quest and earn XP. You'll see why this works differently.</p>
          </div>

          <h3>What You Get with ${tier}:</h3>
          <ul>
            <li>✅ Unlimited quests and challenges</li>
            <li>✅ Wowl AI tutor available 24/7</li>
            <li>✅ Parent dashboard with progress tracking</li>
            <li>✅ Weekly progress reports</li>
            <li>✅ Priority email support</li>
          </ul>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <strong>Need help?</strong> I'm here! Reply to this email or book a free 15-min onboarding call: [calendar link]
          </p>

          <p style="margin-top: 20px;">
            So proud of you for investing in ${studentName}'s future!<br>
            <strong>Mz. Marianna</strong>
          </p>

          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            P.S. Most families see a noticeable shift in their child's attitude toward learning within the first week. Can't wait to hear your success story! ❤️
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: `🎉 Welcome ${studentName} to the Learning Kingdom!`,
        html: emailHtml,
        from: 'Mz. Marianna <mariannav920@gmail.com>'
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}
