import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

/**
 * SEO Component for Mz. Marianna's Academy
 * Optimized for: Parents of neurodivergent children, homeschoolers, ADHD/dyslexic learners
 */
export function SEOHead({
  title = "Mz. Marianna's Academy - Neurodivergent-First Learning Platform for ADHD & Dyslexic Children",
  description = "Gamified learning platform designed specifically for ADHD and dyslexic students. Play-based education through Roblox, coding, and creative building. XP never decreases. ESA accepted. Weekly live classes with AI-guided support.",
  keywords = "ADHD learning, dyslexic education, neurodivergent learning platform, homeschool ADHD, ESA education, gamified learning, play-based learning, Roblox education, coding for ADHD kids, homeschool curriculum ADHD, special needs education, executive functioning skills, microschool, online tutoring ADHD, neurodivergent friendly school",
  ogImage = "https://mzmarianna.com/og-image.jpg",
  canonical = "https://mzmarianna.com"
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, property);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic SEO tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    // Open Graph tags (Facebook, LinkedIn)
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', "Mz. Marianna's Academy", true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Additional meta tags for better SEO
    setMetaTag('author', "Mz. Marianna's Academy");
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    setMetaTag('theme-color', '#06B6D4'); // Cyan brand color

    // Canonical URL
    let linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.rel = 'canonical';
      document.head.appendChild(linkTag);
    }
    linkTag.href = canonical;

    // Structured data for Google (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Mz. Marianna's Academy",
      "description": description,
      "url": canonical,
      "logo": ogImage,
      "sameAs": [
        // Add social media links when available
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "areaServed": "United States",
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "audienceType": "Neurodivergent children, ADHD learners, Dyslexic students, Homeschool students"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "1x Weekly Classes",
          "price": "30",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "30",
            "priceCurrency": "USD",
            "unitText": "WEEK"
          }
        },
        {
          "@type": "Offer",
          "name": "4x Weekly Classes",
          "price": "80",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "80",
            "priceCurrency": "USD",
            "unitText": "WEEK"
          }
        },
        {
          "@type": "Offer",
          "name": "VIP Weekly Classes",
          "price": "99",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "99",
            "priceCurrency": "USD",
            "unitText": "WEEK"
          }
        }
      ],
      "paymentAccepted": "ESA, Microgrants, Credit Card",
      "priceRange": "$30-$99 per week"
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, ogImage, canonical]);

  return null; // This component doesn't render anything
}

// Preset SEO configurations for different pages
export const SEO_PRESETS = {
  home: {
    title: "Mz. Marianna's Academy - ADHD & Dyslexic Learning Platform | Gamified Homeschool",
    description: "End homework battles! Neurodivergent-first learning platform for ADHD & dyslexic children. Play-based education through Roblox & coding. XP never decreases. ESA accepted. $30-$99/week.",
    keywords: "ADHD learning platform, dyslexic homeschool, neurodivergent education, gamified learning ADHD, ESA homeschool, play-based learning, Roblox education ADHD, executive functioning ADHD, homeschool ADHD curriculum"
  },
  
  landing: {
    title: "Stop Homework Battles - ADHD-Friendly Learning That Works | Mz. Marianna's Academy",
    description: "Designed for ADHD & dyslexic brains. Play-based learning through Roblox, coding, and building. No red marks, no shame. XP never goes down. Weekly live classes. ESA & microgrants accepted.",
    keywords: "ADHD friendly education, dyslexic learning program, homework battles ADHD, neurodivergent homeschool, ADHD without tears, positive reinforcement learning, ESA curriculum ADHD"
  },
  
  quiz: {
    title: "Free ADHD Learning Assessment - Find Your Child's Perfect Starting Point",
    description: "Quick 10-question placement quiz designed for neurodivergent learners. Discover your child's strengths and get personalized learning recommendations. No judgment, just progress.",
    keywords: "ADHD assessment, dyslexic placement test, learning evaluation ADHD, homeschool placement, neurodivergent assessment, math placement ADHD"
  },
  
  pricing: {
    title: "Affordable Weekly Pricing - ESA & Microgrants Accepted | Mz. Marianna's Academy",
    description: "Simple weekly pricing: $30, $80, or $99/week. No scary commitments. Includes Math, Reading, Writing, STEAM, and Executive Functioning. Direct ESA vendor. Cancel anytime.",
    keywords: "ESA education vendor, homeschool ESA accepted, affordable ADHD tutoring, weekly homeschool pricing, microgrants education, ADHD tutoring cost"
  },
  
  studentDashboard: {
    title: "My Learning Adventure - Student Dashboard | Mz. Marianna's Academy",
    description: "Track your quests, earn XP and badges, customize your avatar, and showcase your work. Every step forward is celebrated!",
    keywords: "student dashboard gamified, learning progress tracker, XP rewards, educational badges"
  },
  
  parentDashboard: {
    title: "Parent Dashboard - Track Your Child's Progress | Mz. Marianna's Academy",
    description: "View your child's learning progress, portfolio submissions, earned badges, and communicate with tutors. Transparent progress tracking for peace of mind.",
    keywords: "parent dashboard homeschool, track child progress, homeschool monitoring, ADHD progress tracking"
  },
  
  tutorDashboard: {
    title: "Tutor Dashboard - Student Management | Mz. Marianna's Academy",
    description: "Review student work, provide encouraging feedback, track progress, and celebrate achievements. Built for meaningful student connections.",
    keywords: "online tutoring platform, student management system, educational feedback tools"
  }
};
