/**
 * Warriors Email Nurture Sequence
 * For middle school students (ages 11-18)
 * Includes Warriors program recommendations and book upsells
 */

import { sendEmail } from '../email-service';
import { BOOK_PRICING, formatBookPrice, getDiscountText } from './config';

export interface WarriorsSequenceData {
  studentName: string;
  parentEmail: string;
  age: number;
  interests: string[];
  currentTier: 'explorers' | 'warriors';
}

/**
 * Warriors-focused nurture sequence schedule
 */
export const WARRIORS_SEQUENCE = [
  { day: 0, template: 'warriors-welcome' },
  { day: 3, template: 'warriors-program-intro' },
  { day: 6, template: 'warriors-book-upsell' },
  { day: 10, template: 'warriors-challenges' },
  { day: 14, template: 'warriors-success-stories' },
  { day: 17, template: 'warriors-book-reminder' },
];

/**
 * Send Warriors sequence email
 */
export async function sendWarriorsSequenceEmail(
  data: WarriorsSequenceData,
  dayNumber: number
): Promise<boolean> {
  const sequence = WARRIORS_SEQUENCE.find(s => s.day === dayNumber);
  if (!sequence) return false;

  const template = getWarriorsTemplate(sequence.template, data);
  
  return sendEmail({
    to: data.parentEmail,
    subject: template.subject,
    html: template.html,
  }).then(result => result.success);
}

/**
 * Get Warriors email template
 */
function getWarriorsTemplate(templateName: string, data: WarriorsSequenceData): { subject: string; html: string } {
  const templates: Record<string, { subject: string; html: string }> = {
    'warriors-welcome': {
      subject: `⚔️ Welcome to the Warriors Path, ${data.studentName}!`,
      html: getWarriorsWelcomeTemplate(data),
    },
    'warriors-program-intro': {
      subject: `🎯 What Makes Warriors Different`,
      html: getWarriorsProgramTemplate(data),
    },
    'warriors-book-upsell': {
      subject: `📚 The Book Every Warrior Needs`,
      html: getWarriorsBookUpsellTemplate(data),
    },
    'warriors-challenges': {
      subject: `🏆 This Week's Warrior Challenge`,
      html: getWarriorsChallengeTemplate(data),
    },
    'warriors-success-stories': {
      subject: `💫 Warriors Making Their Mark`,
      html: getWarriorsSuccessTemplate(data),
    },
    'warriors-book-reminder': {
      subject: `🎁 Last Call: Warriors Book Discount`,
      html: getWarriorsBookReminderTemplate(data),
    },
  };

  return templates[templateName] || templates['warriors-welcome'];
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

function getWarriorsWelcomeTemplate(data: WarriorsSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 16px;">⚔️</div>
        <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to the Warriors Path</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #fff;">
        <p style="font-size: 18px; color: #f59e0b;">Hey ${data.studentName}! ⚔️</p>
        
        <p style="color: #d1d5db;">You're not an Explorer anymore. You're ready for something bigger. Something <strong style="color: #fff;">legendary</strong>.</p>
        
        <p style="color: #d1d5db;">Welcome to <strong style="color: #f59e0b;">Warriors</strong> - where middle schoolers become unstoppable.</p>
        
        <div style="background: rgba(245,158,11,0.1); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #f59e0b;">🎯 What Makes Warriors Different?</h3>
          <ul style="color: #d1d5db; margin-bottom: 0; line-height: 1.8;">
            <li><strong style="color: #fff;">Real-World Projects</strong> - Build apps, write code, create content</li>
            <li><strong style="color: #fff;">Advanced Challenges</strong> - Math, science, writing at competition level</li>
            <li><strong style="color: #fff;">Leadership Training</strong> - Lead clans, mentor younger students</li>
            <li><strong style="color: #fff;">1-on-1 Sessions</strong> - Work directly with Mz. Marianna</li>
          </ul>
        </div>
        
        <div style="background: rgba(220,38,38,0.1); padding: 20px; border-radius: 12px; margin: 24px 0;">
          <p style="margin: 0; color: #d1d5db;"><strong style="color: #dc2626;">🔥 Truth Bomb:</strong> The Warriors path isn't easy. But easy doesn't build legends.</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/warriors" style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            ⚔️ Start Your Warriors Journey
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getWarriorsProgramTemplate(data: WarriorsSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center; color: white;">
        <h1 style="margin: 0;">🎯 What Makes Warriors Different</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #fff;">
        <p style="color: #d1d5db;">Most tutoring = memorize facts, pass tests, forget everything.</p>
        <p style="color: #d1d5db;"><strong style="color: #fff;">Warriors = Build real skills that matter.</strong></p>
        
        <div style="background: rgba(220,38,38,0.1); padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">🎮 Game-Based Projects</h3>
          <p style="color: #d1d5db; margin: 0;">Build Roblox games, code Discord bots, design websites. Learn by creating.</p>
        </div>
        
        <div style="background: rgba(245,158,11,0.1); padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #f59e0b;">🏆 Competition Prep</h3>
          <p style="color: #d1d5db; margin: 0;">Math leagues, coding competitions, writing contests. We prep you to WIN.</p>
        </div>
        
        <div style="background: rgba(139,92,246,0.1); padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #8b5cf6;">👥 Leadership Development</h3>
          <p style="color: #d1d5db; margin: 0;">Lead your clan, mentor younger students, develop real leadership skills.</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/warriors-program" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Learn More About Warriors
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getWarriorsBookUpsellTemplate(data: WarriorsSequenceData): string {
  const book = BOOK_PRICING.warriors;
  const regularPrice = formatBookPrice(book.regularPrice);
  const memberPrice = formatBookPrice(book.memberPrice);
  
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 16px;">📚</div>
        <h1 style="color: white; margin: 0;">The Book Every Warrior Needs</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #fff;">
        <p style="font-size: 18px; color: #d1d5db;">Perfect for ${data.studentName}:</p>
        
        <div style="background: rgba(139,92,246,0.1); padding: 24px; border-radius: 12px; margin: 24px 0; border: 2px solid #8b5cf6;">
          <h3 style="margin-top: 0; color: #8b5cf6;">📖 "Mindset: The New Psychology of Success"</h3>
          <p style="color: #d1d5db;">by Carol Dweck - The science behind why some kids thrive and others give up.</p>
          
          <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #9ca3af;"><strong>What Warriors are saying:</strong></p>
            <p style="margin: 8px 0 0 0; font-style: italic; color: #d1d5db;">"This book changed how I think about challenges. Now I actually WANT the hard problems." - Marcus, Age 13</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">${memberPrice}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px;">(Reg. ${regularPrice}) - ${getDiscountText("warriors")} as a Warrior!</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/shop/mindset-book" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            📚 Get the Book
          </a>
        </div>
        
        <p style="text-align: center; color: #9ca3af; font-size: 14px;">
          30-day guarantee • Free shipping • Digital + Physical bundle available
        </p>
      </div>
    </body>
    </html>
  `;
}

function getWarriorsChallengeTemplate(data: WarriorsSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🏆 This Week's Warrior Challenge</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #fff;">
        <p style="font-size: 18px; color: #d1d5db;">Ready to prove yourself, ${data.studentName}? 🔥</p>
        
        <div style="background: rgba(245,158,11,0.1); padding: 24px; border-radius: 12px; margin: 24px 0; border: 2px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #f59e0b;">🎯 The Code-Breaking Challenge</h3>
          <p style="color: #d1d5db;"><strong>Mission:</strong> Crack this cipher and reveal the hidden message.</p>
          <p style="font-size: 20px; font-family: monospace; text-align: center; margin: 20px 0; color: #f59e0b; background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px;">
            VGhlIGJlc3Qgd2F5IHRvIHByZWRpY3QgdGhlIGZ1dHVyZSBpcyB0byBjcmVhdGUgaXQ=
          </p>
          <p style="font-size: 14px; color: #9ca3af;">Hint: It's a Base64 encoded message...</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/warriors-challenge" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Submit Your Solution
          </a>
        </div>
        
        <p style="text-align: center; color: #d1d5db;">🎖️ Complete the challenge: Earn 1,000 XP + Warrior Badge</p>
      </div>
    </body>
    </html>
  `;
}

function getWarriorsSuccessTemplate(data: WarriorsSequenceData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">💫 Warriors Making Their Mark</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #fff;">
        <p style="color: #d1d5db;">Real Warriors. Real Results:</p>
        
        <div style="background: rgba(220,38,38,0.1); padding: 20px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #d1d5db;"><strong style="color: #dc2626;">Marcus, 13:</strong> "Built my first mobile app and got 500 downloads. Now I'm teaching my friends to code."</p>
        </div>
        
        <div style="background: rgba(245,158,11,0.1); padding: 20px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #d1d5db;"><strong style="color: #f59e0b;">Aisha, 14:</strong> "Won 2nd place in the state math competition. Never thought I'd even compete."</p>
        </div>
        
        <div style="background: rgba(139,92,246,0.1); padding: 20px; border-radius: 12px; margin: 16px 0; border-left: 4px solid #8b5cf6;">
          <p style="margin: 0; color: #d1d5db;"><strong style="color: #8b5cf6;">Jamal, 12:</strong> "Started with Fs in math. Now I tutor other kids. Seriously."</p>
        </div>
        
        <p style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 32px; color: #f59e0b;">
          ${data.studentName}'s story starts now. ⚔️
        </p>
      </div>
    </body>
    </html>
  `;
}

function getWarriorsBookReminderTemplate(data: WarriorsSequenceData): string {
  const book = BOOK_PRICING.warriors;
  const regularPrice = formatBookPrice(book.regularPrice);
  const memberPrice = formatBookPrice(book.memberPrice);
  
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🎁 Last Call: Warrior Book Discount</h1>
      </div>
      
      <div style="background: #111; padding: 40px 30px; border-radius: 0 0 16px 16px; color: #fff;">
        <p style="font-size: 18px; color: #d1d5db;">Your ${book.discountPercent}% discount expires in 24 hours! ⏰</p>
        
        <p style="color: #d1d5db;">Don't let ${data.studentName} miss "Mindset" - the book that helps Warriors level up their thinking.</p>
        
        <div style="background: rgba(239,68,68,0.1); padding: 20px; border-radius: 12px; margin: 24px 0; border: 2px solid #ef4444;">
          <p style="margin: 0; text-align: center;">
            <strong style="font-size: 24px; color: #ef4444;">${memberPrice}</strong>
            <span style="text-decoration: line-through; color: #9ca3af; margin-left: 8px;">${regularPrice}</span>
          </p>
          <p style="margin: 8px 0 0 0; text-align: center; color: #9ca3af; font-size: 14px;">Warrior discount ends tomorrow</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://mzmarianna.com/shop/mindset-book" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 18px;">
            📚 Claim Discount Now
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
}
