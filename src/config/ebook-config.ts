/**
 * E-Book Configuration
 * Centralized configuration for e-books and lead magnets
 */

export const EBOOK_CONFIG = {
  // Main e-book
  stopHomeworkBattles: {
    title: "Stop Homework Battles Forever",
    subtitle: "How to Get Cooperation Without Yelling, Bribing, or Breaking Your Child's Spirit",
    author: "Marianna Vitale",
    downloadUrl: "https://www.figma.com/make/cdTIfrByI85Fy91l0D4Tvo/Create-Best-Selling-Ebook?fullscreen=1",
    chapters: [
      {
        number: 1,
        title: "Why Homework Turns Into Battles",
        tagline: "This isn't about effort. It's about readiness.",
        description: "Discover the 3 hidden reasons kids avoid homework (hint: it's not laziness)",
      },
      {
        number: 2,
        title: "The Scaffolding Protocol",
        tagline: "The exact system that removes resistance.",
        description: "The exact step-by-step system that removes resistance",
      },
      {
        number: 3,
        title: "Working With Teachers",
        tagline: "Advocate without sounding difficult.",
        description: "Communication scripts that work (advocate without sounding difficult)",
      },
      {
        number: 4,
        title: "The Long Game",
        tagline: "Beyond homework: Building independence.",
        description: "Building actual independence that lasts",
      },
    ],
  },
  
  // Email settings
  email: {
    fromName: "Mz. Marianna's Academy",
    fromEmail: "noreply@resend.dev", // Update after domain verification
    replyTo: "support@mzmarianna.com",
  },
  
  // Call to action URLs
  cta: {
    placementQuiz: "https://mzmarianna.com/placement-quiz",
    homepage: "https://mzmarianna.com",
    parentDashboard: "https://mzmarianna.com/parent-dashboard",
    studentDashboard: "https://mzmarianna.com/student-dashboard",
  },
  
  // Follow-up sequence timing (in days)
  followUp: {
    dayThree: 3,
    daySevenQuizReminder: 7,
    dayFourteenCheckIn: 14,
  },
};

// Helper function to get e-book download URL
export function getEbookDownloadUrl(ebookId: keyof typeof EBOOK_CONFIG = 'stopHomeworkBattles'): string {
  const ebook = EBOOK_CONFIG[ebookId];
  if (!ebook || typeof ebook === 'string' || !('downloadUrl' in ebook)) {
    return EBOOK_CONFIG.stopHomeworkBattles.downloadUrl;
  }
  return ebook.downloadUrl;
}

// Helper function to get e-book title
export function getEbookTitle(ebookId: keyof typeof EBOOK_CONFIG = 'stopHomeworkBattles'): string {
  const ebook = EBOOK_CONFIG[ebookId];
  if (!ebook || typeof ebook === 'string' || !('title' in ebook)) {
    return EBOOK_CONFIG.stopHomeworkBattles.title;
  }
  return ebook.title;
}
