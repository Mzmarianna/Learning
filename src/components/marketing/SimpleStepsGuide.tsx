/**
 * Simple Step-by-Step Getting Started Guide
 * Shows parents exactly what to do next (no overwhelm)
 */

import { motion } from 'motion/react';
import { 
  ClipboardCheck,
  ArrowRight,
  Star,
  Sparkles,
  Heart,
  TrendingUp,
  Check,
  Clock,
  Play
} from 'lucide-react';

interface SimpleStepsGuideProps {
  onStartQuiz: () => void;
  onCreateAccount?: () => void;
}

export default function SimpleStepsGuide({ onStartQuiz, onCreateAccount }: SimpleStepsGuideProps) {
  const steps = [
    {
      number: 1,
      title: 'Take the 5-Minute Quiz',
      subtitle: 'Discover Your Child\'s Genius Profile',
      description: 'Quick, fun quiz that reveals your child\'s unique strengths, learning style, and perfect starting point.',
      time: '5 minutes',
      action: 'Start Quiz',
      icon: ClipboardCheck,
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'No judgment, just understanding',
        'Find out their tier: Early Explorers, Explorers, or Warriors',
        'Get personalized recommendations',
      ],
      onAction: onStartQuiz,
    },
    {
      number: 2,
      title: 'Review Your Personalized Roadmap',
      subtitle: 'See Exactly What to Do Next',
      description: 'Get a simple, clear plan tailored to YOUR child. No overwhelm. Just: "Do this, then this, then this."',
      time: '3 minutes',
      action: 'See Example',
      icon: ArrowRight,
      color: 'from-pink-500 to-pink-600',
      benefits: [
        'Custom quest recommendations',
        'Clear next 3 steps',
        'Video explanation from Marianna',
      ],
    },
    {
      number: 3,
      title: 'Create Your Free Account',
      subtitle: 'Set Up in Under 2 Minutes',
      description: 'Simple signup. Choose your plan (or start with 7-day free trial). Add your child\'s profile.',
      time: '2 minutes',
      action: 'Create Account',
      icon: Star,
      color: 'from-cyan-500 to-cyan-600',
      benefits: [
        'No credit card for free trial',
        'Cancel anytime (no scary commitment)',
        'ESA and microgrants accepted',
      ],
      onAction: onCreateAccount,
    },
    {
      number: 4,
      title: 'Start First Quest Together',
      subtitle: 'One Tiny Win = Momentum',
      description: 'Your child picks their first quest (15 minutes). You sit nearby. They complete it. Wowl celebrates. Magic happens.',
      time: '15 minutes',
      action: 'Preview Quests',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Feels like a game, not school',
        'Instant feedback from Wowl AI',
        'XP and rewards unlock',
      ],
    },
    {
      number: 5,
      title: 'Watch Progress Unfold',
      subtitle: 'See Results in Your Dashboard',
      description: 'Check your parent dashboard. See completed quests, XP earned, skills mastered. Share wins with family.',
      time: 'Ongoing',
      action: 'See Dashboard Demo',
      icon: TrendingUp,
      color: 'from-pink-500 to-purple-500',
      benefits: [
        'Real-time progress tracking',
        'Weekly parent emails',
        'Celebrate every milestone',
      ],
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block bg-purple-100 border-2 border-purple-300 rounded-full px-6 py-2 mb-4"
          >
            <span className="text-sm font-bold text-purple-900">SIMPLE & CLEAR</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Your 5-Step Roadmap to Success
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            No overwhelm. No guessing. Just simple steps that actually work.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-8 top-24 w-0.5 h-full bg-gradient-to-b from-purple-300 to-transparent hidden md:block" />
              )}

              <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:border-purple-300 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Icon & Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg mb-2`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                        Step {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-purple-600 font-semibold">
                          {step.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4" />
                        {step.time}
                      </div>
                    </div>

                    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-2 mb-6">
                      {step.benefits.map((benefit, benefitIdx) => (
                        <li key={benefitIdx} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    {step.onAction && (
                      <button
                        onClick={step.onAction}
                        className={`group bg-gradient-to-r ${step.color} text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
                      >
                        <Play className="w-5 h-5" />
                        {step.action}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl p-8 border-2 border-green-200 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            That's It. Really.
          </h3>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
            Five simple steps. No overwhelm. No 47-page curriculum guide. Just clear, actionable steps that lead to real progress.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Most parents finish setup in under 15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>First progress visible in the first week</span>
            </div>
          </div>
        </motion.div>

        {/* FAQ Callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-purple-50 rounded-2xl p-8 border border-purple-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Common Questions:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'What if my child refuses?',
                a: 'Start with Step 1 (the quiz). It feels like a game, not a test. 94% of kids engage within the first session.',
              },
              {
                q: 'Do I need to be there the whole time?',
                a: 'Only for the first quest. After that, Wowl AI guides them. You get updates in your dashboard.',
              },
              {
                q: 'What if we need to go slower?',
                a: 'Perfect! There\'s no timeline. Your child moves at THEIR pace. XP never decreases.',
              },
              {
                q: 'Can we stop anytime?',
                a: 'Yes. Cancel anytime, no questions asked. We want happy families, not trapped customers.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-purple-100">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
