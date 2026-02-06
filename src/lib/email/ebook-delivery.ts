/**
 * E-Book Delivery Automation
 * Automatically sends "Stop Homework Battles" e-book via email
 */

import { sendEmail } from '../email-service';
import { getEbookDownloadUrl, getEbookTitle, EBOOK_CONFIG } from '../../config/ebook-config';

export interface EbookDeliveryData {
  email: string;
  firstName?: string;
}

/**
 * Send e-book delivery email immediately upon signup
 */
export async function sendEbookDeliveryEmail(data: EbookDeliveryData) {
  const { email, firstName } = data;
  const name = firstName || 'there';

  return sendEmail({
    to: email,
    subject: '🎁 Your Free Guide: "Stop Homework Battles Forever"',
    html: getEbookDeliveryTemplate(name),
  });
}

/**
 * HTML template for e-book delivery email
 */
function getEbookDeliveryTemplate(name: string): string {
  const ebookUrl = getEbookDownloadUrl();
  const ebookTitle = getEbookTitle();
  const placementQuizUrl = EBOOK_CONFIG.cta.placementQuiz;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Free Guide - Stop Homework Battles</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 16px;">👑</div>
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Your Free Guide is Here!</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Stop Homework Battles Forever</p>
      </div>
      
      <!-- Main Content -->
      <div style="background: white; padding: 40px 30px;">
        <p style="font-size: 18px; color: #ec4899; font-weight: bold;">Hi ${name}! 🎉</p>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.8;">
          Thank you for downloading <strong style="color: #1f2937;">"Stop Homework Battles Forever: How to Get Cooperation Without Yelling, Bribing, or Breaking Your Child's Spirit."</strong>
        </p>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.8;">
          This isn't just another parenting guide. This is the <strong style="color: #1f2937;">exact system</strong> that's helped hundreds of parents transform homework time from a nightmare into... well, not exactly "fun," but at least <em>functional</em>.
        </p>
        
        <!-- Download Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${ebookUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 18px 48px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);">
            📚 Download Your Guide Now
          </a>
          <p style="margin-top: 12px; color: #6b7280; font-size: 14px; font-style: italic;">
            Click above to access your guide instantly!
          </p>
        </div>
        
        <!-- What's Inside -->
        <div style="background: linear-gradient(to right, #fdf2f8, #f0f9ff); padding: 24px; border-radius: 12px; border-left: 4px solid #ec4899; margin: 32px 0;">
          <h2 style="color: #ec4899; font-size: 22px; margin-top: 0; margin-bottom: 16px;">📖 What's Inside:</h2>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; color: #1f2937; font-weight: bold;">Chapter 1: Why Homework Turns Into Battles</p>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Discover the 3 hidden reasons kids avoid homework (hint: it's not laziness)</p>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; color: #1f2937; font-weight: bold;">Chapter 2: The Scaffolding Protocol</p>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">The exact step-by-step system that removes resistance</p>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; color: #1f2937; font-weight: bold;">Chapter 3: Working With Teachers</p>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Communication scripts that work (advocate without sounding difficult)</p>
          </div>
          
          <div>
            <p style="margin: 0; color: #1f2937; font-weight: bold;">Chapter 4: The Long Game</p>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Building actual independence that lasts</p>
          </div>
        </div>
        
        <!-- Value Proposition -->
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.6;">
            <strong style="color: #92400e;">⚡ Quick Read:</strong> 30 minutes to read, a lifetime of peace.<br>
            <strong style="color: #92400e;">✅ Actionable:</strong> Start seeing results tonight.<br>
            <strong style="color: #92400e;">🧠 Science-Based:</strong> Backed by neuroscience and real results.
          </p>
        </div>
        
        <!-- What's Next Section -->
        <div style="margin-top: 40px; padding-top: 32px; border-top: 2px solid #e5e7eb;">
          <h2 style="color: #1f2937; font-size: 22px; margin-top: 0; margin-bottom: 16px;">🚀 What's Next?</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.8;">
            After you read the guide, you might be wondering: <em>"This is great, but what if my child needs MORE support?"</em>
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.8;">
            That's exactly why we created <strong style="color: #ec4899;">Mz. Marianna's Learning Kingdom</strong> — a gamified learning platform specifically designed for neurodivergent learners.
          </p>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: bold;">🎮 Why parents love it:</p>
            <ul style="margin: 0; padding-left: 24px; color: #4b5563; line-height: 1.8;">
              <li>XP never goes down — no punishment, just progress</li>
              <li>Wowl the AI Owl — infinite patience, zero judgment</li>
              <li>Built for ADHD/dyslexic/autistic brains</li>
              <li>Parent dashboard with real-time progress</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${placementQuizUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);">
              🎯 Take Our Free Placement Quiz
            </a>
            <p style="margin-top: 12px; color: #6b7280; font-size: 14px;">
              Find your child's perfect tier in 5 minutes
            </p>
          </div>
        </div>
        
        <!-- Closing -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            You're not alone in this. Hundreds of parents have walked this path before you — and come out the other side with calmer evenings, more confident kids, and way less yelling.
          </p>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Let's do this together. 💪
          </p>
          
          <p style="color: #ec4899; font-size: 16px; font-weight: bold; margin-top: 24px;">
            Marianna Vitale<br>
            <span style="font-size: 14px; font-weight: normal; color: #6b7280;">Founder, Mz. Marianna's Learning Kingdom</span>
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #1f2937; text-align: center; padding: 32px 20px; color: #9ca3af;">
        <p style="margin: 0 0 8px 0; font-size: 14px;">👑 The Learning Kingdom by Mz. Marianna's Academy</p>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">Where Every Child is a Genius</p>
        
        <div style="margin-top: 20px;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            Questions? Email us at <a href="mailto:support@mzmarianna.com" style="color: #ec4899; text-decoration: none;">support@mzmarianna.com</a>
          </p>
        </div>
        
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #374151;">
          <p style="margin: 0; font-size: 11px; color: #6b7280; line-height: 1.6;">
            You're receiving this email because you requested our free guide at mzmarianna.com.<br>
            We respect your inbox. No spam, ever.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send follow-up email after 3 days (to be called by cron job)
 */
export async function sendEbookFollowUpEmail(email: string, firstName?: string) {
  const name = firstName || 'there';

  return sendEmail({
    to: email,
    subject: '📖 Did you finish the guide? Here\'s what\'s next...',
    html: getFollowUpTemplate(name),
  });
}

function getFollowUpTemplate(name: string): string {
  const ebookUrl = getEbookDownloadUrl();
  const placementQuizUrl = EBOOK_CONFIG.cta.placementQuiz;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Follow-Up: Stop Homework Battles</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9fafb;">
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📚 Quick Check-In</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px;">
        <p style="font-size: 18px; color: #8b5cf6;">Hi ${name}! 👋</p>
        
        <p style="color: #4b5563;">
          Three days ago, you downloaded our guide: <strong>"Stop Homework Battles Forever."</strong>
        </p>
        
        <p style="color: #4b5563;">
          I'm curious — did you get a chance to read it?
        </p>
        
        <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <p style="margin: 0; color: #1f2937; font-weight: bold;">💬 Real feedback from parents:</p>
          <p style="margin: 12px 0 0 0; color: #6b7280; font-style: italic;">
            "I implemented the Scaffolding Protocol last night. First time in MONTHS my son finished homework without a meltdown. I'm in tears." — Jennifer M.
          </p>
        </div>
        
        <p style="color: #4b5563;">
          If you haven't read it yet — <strong>no judgment!</strong> Life is chaotic. Here's the link again:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${ebookUrl}" 
             style="display: inline-block; background: #8b5cf6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            📖 Read the Guide
          </a>
        </div>
        
        <p style="color: #4b5563; margin-top: 32px;">
          And if you're ready for the <strong>next level</strong> of support — personalized tutoring that actually works for neurodivergent kids — check out our Learning Kingdom:
        </p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="${placementQuizUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            🎯 Take Placement Quiz
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          Have questions? Just reply to this email — I read every response. 💜
        </p>
      </div>
      
      <div style="background: #1f2937; text-align: center; padding: 24px; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">The Learning Kingdom by Mz. Marianna's Academy</p>
      </div>
    </body>
    </html>
  `;
}
