/**
 * Math-Focused Email Nurture Sequence
 * For students showing interest in math subjects
 * Includes book upsells and personalized content
 */

import { sendEmail } from '../email-service';
import { BOOK_PRICING, formatBookPrice, getDiscountText } from './config';

export interface MathSequenceData {
  studentName: string;
  parentEmail: string;
  mathLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
}

/**
 * Math-focused nurture sequence schedule
 */
export const MATH_SEQUENCE = [
  { day: 0, template: 'math-welcome' },
  { day: 2, template: 'math-resources' },
  { day: 5, template: 'math-book-upsell' },
  { day: 8, template: 'math-challenge' },
  { day: 12, template: 'math-success-stories' },
  { day: 15, template: 'math-book-reminder' },
];

/**
 * Send math sequence email
 */
export async function sendMathSequenceEmail(
  data: MathSequenceData,
  dayNumber: number
): Promise<boolean> {
  const sequence = MATH_SEQUENCE.find(s => s.day === dayNumber);
  if (!sequence) return false;

  const template = getMathTemplate(sequence.template, data);
  
  return sendEmail({
    to: data.parentEmail,
    subject: template.subject,
    html: template.html,
  }).then(result => result.success);
}

/**
 * Get math email template
 */
function getMathTemplate(templateName: string, data: MathSequenceData): { subject: string; html: string } {
  const templates: Record<string, { subject: string; html: string }> = {
    'math-welcome': {
      subject: `🔢 ${data.studentName} is on a Math Adventure!`,
      html: getMathWelcomeTemplate(data),
    },
    'math-resources': {
      subject: `📐 Free Math Resources for ${data.studentName}`,
      html: getMathResourcesTemplate(data),
    },
    'math-book-upsell': {
      subject: `📚 The Math Book ${data.studentName} Will Love`,
      html: getMathBookUpsellTemplate(data),
    },
    'math-challenge': {
      subject: `🎯 Special Math Challenge for ${data.studentName}`,
      html: getMathChallengeTemplate(data),
    },
    'math-success-stories': {
      subject: `💫 Kids Like ${data.studentName} Are Thriving with Math`,
      html: getMathSuccessTemplate(data),
    },
    'math-book-reminder': {
      subject: `🎁 Last Chance: Math Book Discount for ${data.studentName}`,
      html: getMathBookReminderTemplate(data),
    },
  };

  return templates[templateName] || templates['math-welcome'];
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

function getMathWelcomeTemplate(data: MathSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Math Adventure Begins!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 32px;">🔢 Math Adventure Begins!</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Hi! We noticed ${data.studentName} is showing great interest in math! 🎉</p>
        
        <p>That's amazing! Math isn't just about numbers—it's about problem-solving, patterns, and seeing the world in new ways.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="margin-top: 0; color: #0369a1;">🎯 What's Coming Next?</h3>
          <ul style="margin-bottom: 0; padding-left: 20px;">
            <li><strong>Day 2:</strong> Free math resources tailored to ${data.studentName}</li>
            <li><strong>Day 5:</strong> A special math book recommendation</li>
            <li><strong>Day 8:</strong> An exclusive math challenge</li>
            <li><strong>Day 12:</strong> Success stories from other math-loving kids</li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <p style="margin: 0;"><strong>💡 Quick Win:</strong> Ask ${data.studentName} to find shapes in your house today. Circles, rectangles, triangles—how many can they spot?</p>
        </div>
        
        <p style="margin-top: 32px; color: #666; font-size: 14px; text-align: center;">
          Every child is a genius. We're here to help ${data.studentName} shine! ✨
        </p>
      </div>
    </body>
    </html>
  `;
}

function getMathResourcesTemplate(data: MathSequenceData): string {
  const resources = {
    beginner: [
      'Counting games with everyday objects',
      'Simple addition and subtraction puzzles',
      'Pattern recognition activities',
    ],
    intermediate: [
      'Multiplication table challenges',
      'Fraction visualization tools',
      'Geometry exploration projects',
    ],
    advanced: [
      'Algebra problem-solving techniques',
      'Advanced geometry proofs',
      'Math competition preparation',
    ],
  };

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0;">📐 Free Math Resources for ${data.studentName}</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p>Here are some amazing (and free!) math resources perfect for ${data.studentName}'s level:</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #059669;">🎯 Recommended Activities:</h3>
          <ul>
            ${resources[data.mathLevel].map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
        
        <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #ec4899;">🌟 Pro Tip:</h3>
          <p style="margin: 0;">The best math learning happens when it's fun! Turn everyday activities into math games—cooking, shopping, building with blocks.</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/math-resources" style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Get More Math Resources
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getMathBookUpsellTemplate(data: MathSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <div style="font-size: 64px; margin-bottom: 16px;">📚</div>
        <h1 style="margin: 0;">The Math Book ${data.studentName} Will LOVE</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">We have the perfect book recommendation for ${data.studentName}!</p>
        
        <div style="background: #fef3f5; padding: 24px; border-radius: 12px; margin: 24px 0; border: 2px solid #ec4899;">
          <h3 style="margin-top: 0; color: #ec4899;">📖 "Math Doesn't Suck" by Danica McKellar</h3>
          <p>This book makes math fun and accessible. Perfect for kids who love math OR who need a confidence boost!</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;"><strong>What parents are saying:</strong></p>
            <p style="margin: 8px 0 0 0; font-style: italic; color: #666;">"My daughter went from hating math to asking for extra problems. This book changed everything!" - Sarah M.</p>
          </div>
          
          <div style="background: #10b981; color: white; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">${memberPrice}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px;">(Reg. ${regularPrice}) - ${getDiscountText("math")} as a Learning Kingdom member!</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/shop/math-book" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            📚 Get the Book for ${data.studentName}
          </a>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 24px;">
          💯 30-Day Money-Back Guarantee • 📦 Free Shipping on Orders $25+
        </p>
      </div>
    </body>
    </html>
  `;
}

function getMathChallengeTemplate(data: MathSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0;">🎯 Special Math Challenge!</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Hey ${data.studentName}! Ready for a challenge? 🚀</p>
        
        <div style="background: #fef3c7; padding: 24px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #d97706;">📝 This Week's Math Challenge:</h3>
          <p><strong>The Number Pattern Mystery</strong></p>
          <p>Can you figure out the next number in this sequence?</p>
          <p style="font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0; color: #d97706;">2, 5, 11, 23, 47, ___</p>
          <p style="font-size: 14px; color: #666;">Hint: Look at how much each number grows by...</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/math-challenge" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Submit Your Answer
          </a>
        </div>
        
        <p style="text-align: center; color: #666;">🏆 Complete the challenge and earn 500 XP!</p>
      </div>
    </body>
    </html>
  `;
}

function getMathSuccessTemplate(data: MathSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0;">💫 Math Success Stories</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p>Kids just like ${data.studentName} are discovering their math genius:</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0; font-style: italic; color: #334155;">"My son went from failing math to getting an A. The game-based approach made all the difference!" - Maria T.</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0; font-style: italic; color: #334155;">"She actually asks to do math now. I never thought I'd see the day!" - James R.</p>
        </div>
        
        <div style="background: #fef3f5; padding: 20px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 0; font-style: italic; color: #334155;">"The confidence boost has been incredible. Math is now his favorite subject." - Keisha W.</p>
        </div>
        
        <p style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 32px;">
          ${data.studentName} could be our next success story! 🌟
        </p>
      </div>
    </body>
    </html>
  `;
}

function getMathBookReminderTemplate(data: MathSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0;">🎁 Last Chance: 25% Off Math Book</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 18px;">Your 25% discount expires tomorrow! ⏰</p>
        
        <p>We don't want ${data.studentName} to miss out on "Math Doesn't Suck" - the book that's helped thousands of kids fall in love with math.</p>
        
        <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin: 24px 0; border: 2px solid #ef4444;">
          <p style="margin: 0; text-align: center;">
            <strong style="font-size: 24px; color: #ef4444;">${memberPrice}</strong>
            <span style="text-decoration: line-through; color: #666; margin-left: 8px;">${regularPrice}</span>
          </p>
          <p style="margin: 8px 0 0 0; text-align: center; color: #666; font-size: 14px;">Discount ends in 24 hours</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/shop/math-book" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            📚 Claim Your Discount Now
          </a>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px;">
          Free shipping • 30-day guarantee • Limited time offer
        </p>
      </div>
    </body>
    </html>
  `;
}
