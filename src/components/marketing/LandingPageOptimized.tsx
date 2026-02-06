/**
 * Optimized Landing Page - Conversion-Focused
 * High-converting landing page with testimonials, social proof, and strong CTAs
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  Star,
  Award,
  Brain,
  Heart,
  Sparkles,
  LogIn,
  Play,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import { Button } from '../ui/button';

interface LandingPageOptimizedProps {
  onStartQuiz: () => void;
  onLogin?: () => void;
}

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Parent of 8-year-old with ADHD',
    image: '👩',
    quote: 'For the first time in years, homework doesn\'t end in tears. My son actually ASKS to do his learning challenges. The XP system is genius—he sees progress instead of failure.',
    rating: 5,
    highlight: 'No more tears',
  },
  {
    name: 'David K.',
    role: 'Father of dyslexic 10-year-old',
    image: '👨',
    quote: 'The Orton-Gillingham approach combined with gaming? Brilliant. My daughter went from hating reading to finishing 5 books in a month. Her confidence is through the roof.',
    rating: 5,
    highlight: '5 books in 1 month',
  },
  {
    name: 'Jennifer L.',
    role: 'Homeschool mom of 3',
    image: '👩‍🦰',
    quote: 'Wowl the AI tutor has infinite patience—something I lost around week 2 of homeschooling. My kids get personalized help without me having to be the bad guy. Game changer.',
    rating: 5,
    highlight: 'Infinite patience',
  },
];

const STATS = [
  { number: '94%', label: 'Reduce homework battles', icon: TrendingUp },
  { number: '3x', label: 'Faster skill mastery', icon: Award },
  { number: '100%', label: 'Neurodivergent-first design', icon: Brain },
  { number: '15min', label: 'Average session length', icon: Clock },
];

const FAQ_ITEMS = [
  {
    question: 'Will this actually work for my ADHD/dyslexic child?',
    answer: 'Yes. Our entire platform is designed ADHD-first. XP never decreases (no punishment), short 15-min sessions with built-in movement breaks, and instant feedback. We use Orton-Gillingham for dyslexia, proven multisensory methods, and let kids move while learning. Over 94% of parents report reduced learning battles.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Simple weekly pricing: $30/week (1 session), $80/week (3 sessions), or $99/week (unlimited). Includes all subjects (Math, Reading, Writing, STEAM). We accept ESA funds and microgrants. No contracts—cancel anytime.',
  },
  {
    question: 'What if my child refuses to engage?',
    answer: 'We built this for refusers. Start with the placement quiz (feels like a game, not a test). Wowl the AI Owl meets them where they are—no judgment. Kids choose their avatar, join a clan, and earn XP. It feels like Roblox, not school. Most resistant kids engage within the first session.',
  },
  {
    question: 'Is this replacing my child\'s education or supplementing it?',
    answer: 'Either! Use it as your complete homeschool curriculum OR as after-school support. Our tiers (Early Explorers, Explorers, Warriors) progress based on SKILL, not age, so your child is always challenged at the right level.',
  },
  {
    question: 'What about screen time?',
    answer: 'We know the concern. Our approach: ACTIVE screen time (building in Minecraft, coding games, creating) vs. PASSIVE (YouTube). Sessions are short (15 min average), multisensory (they draw, move, build), and progress-tracking is visual. You see exactly what they accomplish.',
  },
];

export default function LandingPageOptimized({ onStartQuiz, onLogin }: LandingPageOptimizedProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="relative z-50 bg-white border-b border-purple-100 sticky top-0 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">For Neurodivergent Learners</p>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={onLogin}
              variant="outline"
              className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Above the Fold */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline + CTA */}
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-full px-4 py-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  Trusted by 200+ neurodivergent families
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                Stop the daily{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  homework battles
                </span>
              </h1>

              <p className="text-2xl text-gray-700 mb-6 font-medium">
                Learning designed for ADHD & dyslexic kids who refuse traditional school
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Game-based tutoring where <strong>XP never decreases</strong>, progress is visual, and kids actually WANT to learn. No red marks. No shame. No burnout.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  '✅ 15-min focused sessions',
                  '✅ Built-in movement breaks',
                  '✅ AI tutor (infinite patience)',
                  '✅ ESA & microgrants accepted',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-800">
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Primary CTA */}
              <div className="space-y-4">
                <Button
                  onClick={onStartQuiz}
                  size="lg"
                  className="w-full sm:w-auto text-xl px-10 py-7 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Free Placement Quiz
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  5-minute quiz • No credit card • See your child's learning profile
                </p>
              </div>
            </div>

            {/* Right: Video/Image Placeholder */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Video Thumbnail */}
                <div className="text-center p-8">
                  <Play className="w-24 h-24 mx-auto text-purple-600 mb-4" />
                  <p className="text-xl font-bold text-purple-900">
                    See How It Works
                  </p>
                  <p className="text-purple-700">Watch 2-min parent tour</p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">Parent rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Stats */}
      <section className="bg-white py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Parents Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from families like yours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-lg border-2 border-purple-200 relative"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-12 h-12 text-purple-200" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Highlight */}
                <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
                  <span className="text-sm font-bold text-purple-900">
                    "{testimonial.highlight}"
                  </span>
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Take Placement Quiz',
                description: 'Fun 5-minute quiz to find your child\'s tier (Early Explorers, Explorers, or Warriors) based on skill, not age.',
                icon: Brain,
                color: 'purple',
              },
              {
                step: '2',
                title: 'Meet Wowl & Join Clan',
                description: 'Your child chooses their avatar and joins a team (Curious Explorers, Creative Makers, Caring Helpers, or Brave Champions).',
                icon: Heart,
                color: 'pink',
              },
              {
                step: '3',
                title: 'Start Learning!',
                description: 'Complete quests, earn XP, unlock badges. Live tutoring sessions + AI support 24/7. Progress updates for parents.',
                icon: Sparkles,
                color: 'cyan',
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 flex items-center justify-center text-white text-3xl font-bold`}>
                  {step.step}
                </div>
                <step.icon className="w-12 h-12 mx-auto text-gray-700 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              onClick={onStartQuiz}
              size="lg"
              className="text-xl px-10 py-7 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Your Free Placement Quiz
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-gradient-to-br from-cyan-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full text-left px-8 py-6 flex items-center justify-between"
                >
                  <span className="text-lg font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ArrowRight
                    className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform ${
                      expandedFAQ === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedFAQ === idx && (
                  <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to End the Learning Battles?
          </h2>
          <p className="text-2xl mb-8 text-purple-100">
            Join 200+ families who've transformed homework from tears to triumph
          </p>

          <Button
            onClick={onStartQuiz}
            size="lg"
            className="bg-white text-purple-700 hover:bg-gray-100 text-xl px-12 py-8 rounded-2xl font-bold shadow-2xl"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Start Free Placement Quiz
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>

          <p className="text-purple-100 mt-6">
            No credit card • 5-minute quiz • See results instantly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Mz. Marianna's Academy. All rights reserved.</p>
          <p className="mt-2 text-sm">Neurodivergent-First Learning • ESA Accepted • No Shame, Just Progress</p>
        </div>
      </footer>
    </div>
  );
}
