/**
 * Landing Page for "Genius Child" Parents
 * Target: Parents who know their child is brilliant but feel lost
 * Tone: Validating, empowering, simple, step-by-step
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Sparkles, 
  Heart,
  Brain,
  Lightbulb,
  TrendingUp,
  Shield,
  Clock,
  Gift,
  ChevronDown,
  X,
  Mail,
  Download
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { captureEmailLead } from '../../lib/supabase/leads';

interface GeniusParentLandingProps {
  onStartQuiz: () => void;
  onLogin?: () => void;
}

export default function GeniusParentLanding({ onStartQuiz, onLogin }: GeniusParentLandingProps) {
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [childAge, setChildAge] = useState('');
  const [biggestStruggle, setBiggestStruggle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to Supabase
      await captureEmailLead({
        email,
        child_age: childAge ? parseInt(childAge) : undefined,
        biggest_struggle: biggestStruggle || undefined,
        source: 'popup',
      });

      toast.success('Check your email! Your free guide is on the way. 🎁');
      setShowEmailCapture(false);
      
      // Redirect to thank you page
      // In production: navigate('/thank-you');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">Unlocking Genius, One Student at a Time</p>
              </div>
            </div>
            <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-purple-600 hover:text-purple-700 font-semibold px-4 py-2 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors"
            >
              Login
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-purple-100 border-2 border-purple-300 rounded-full px-6 py-3 mb-6">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-purple-900">
                  For parents who KNOW their child is brilliant
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Child <span className="text-purple-600">IS</span> a Genius.
              </h1>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-700">
                They Just Need the{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  Right Key
                </span>{' '}
                to Unlock It.
              </h2>

              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-6 mb-8">
                <p className="text-xl text-gray-800 leading-relaxed">
                  <strong className="text-purple-700">You're not imagining it.</strong> Your child has incredible potential. 
                  They're curious, creative, and brilliant in ways traditional school can't measure.
                </p>
                <p className="text-lg text-gray-700 mt-4">
                  You just need a system that <em>sees</em> them, <em>celebrates</em> them, and gives you simple steps to help them thrive.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Brain, text: 'Built for twice-exceptional (2e) learners' },
                  { icon: Lightbulb, text: 'Simple 3-step system (no overwhelm)' },
                  { icon: TrendingUp, text: 'Progress you can SEE every week' },
                  { icon: Shield, text: 'You\'re not alone—we guide you' },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-purple-100"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold text-lg">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Primary CTA */}
              <div className="space-y-4">
                <motion.button
                  onClick={() => setShowEmailCapture(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Gift className="w-6 h-6" />
                    Get FREE Guide: "Unlock Your Child's Genius in 5 Simple Steps"
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    FREE 📚
                  </div>
                </motion.button>

                <p className="text-center text-sm text-gray-600">
                  <span className="font-semibold">5,200+ parents</span> have unlocked their child's potential with this guide
                </p>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    From Frustrated to Flourishing
                  </h3>
                  <p className="text-gray-600">
                    Join thousands of families who've unlocked their child's potential
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Take the 5-min quiz', desc: 'Discover your child\'s unique genius profile' },
                    { step: '2', title: 'Get your roadmap', desc: 'Simple, personalized next steps (no overwhelm)' },
                    { step: '3', title: 'Watch them thrive', desc: 'Progress you can SEE in the first week' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + idx * 0.2 }}
                      className="flex items-start gap-4 bg-purple-50 rounded-xl p-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-purple-200">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-700 italic">
                    "Finally, someone who GETS my kid. Within 2 weeks, he went from refusing everything to asking when his next quest is!"
                  </p>
                  <p className="text-center text-xs text-gray-500 mt-2 font-semibold">
                    — Sarah M., Mom of gifted/ADHD 9-year-old
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* You're Not Alone Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              You're Not Alone in This Journey
            </h2>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-95">
              Every parent we work with has said the same thing:
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: '💡', text: '"I KNOW my child is brilliant..."' },
                  { icon: '😓', text: '"...but nothing seems to work."' },
                  { icon: '🤷‍♀️', text: '"I feel completely lost."' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-5xl mb-3">{item.icon}</div>
                    <p className="text-lg font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-2xl font-bold mb-4">
              ✨ What if you had a clear, simple roadmap?
            </p>
            <p className="text-xl opacity-90">
              Step-by-step guidance designed specifically for brilliant, neurodivergent kids (and their exhausted parents).
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Here's What's Really Happening...
            </h2>
            <p className="text-xl text-gray-600">
              (And why traditional approaches fail brilliant kids)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Traditional Systems</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  'Treat all kids the same (your child is NOT average)',
                  'Focus on deficits, not strengths',
                  'Force boring, repetitive work',
                  'Punish "failure" with red marks and shame',
                  'Leave parents to figure it all out alone',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-green-50 border-2 border-green-200 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Genius-First Approach</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  'Meets YOUR child exactly where they are',
                  'Celebrates strengths, supports challenges',
                  'Makes learning feel like play (Roblox, coding, building)',
                  'XP never decreases—only progress, never punishment',
                  'Step-by-step parent guide (you\'re never alone)',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Learning Looks Like Section - WITH GAME SCREENSHOT */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block bg-cyan-100 border-2 border-cyan-300 rounded-full px-6 py-2 mb-4"
            >
              <span className="text-sm font-bold text-cyan-900">SEE IT IN ACTION</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              This Is What Learning Looks Like
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not worksheets. Not boring drills. <strong>Real games, real creativity, real engagement.</strong>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-200 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500">
              <div className="aspect-video flex flex-col items-center justify-center gap-4 text-white p-8">
                <span className="text-6xl">🎮</span>
                <p className="text-2xl font-semibold">Interactive Quest Dashboard</p>
                <p className="max-w-xl text-center text-white/80">
                  Dynamic quests, real-time XP boosts, and collaborative missions keep every learner engaged.
                </p>
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-300 max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">32 Correct!</p>
                  <p className="text-sm text-gray-600">Math mastery in action</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 border-2 border-purple-300 max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Learning = Playing</p>
                  <p className="text-sm text-gray-600">No resistance, pure engagement</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎮',
                title: 'Game-Based Learning',
                desc: 'Math feels like Roblox, not a textbook'
              },
              {
                icon: '🏆',
                title: 'Instant Feedback',
                desc: 'Wowl celebrates every correct answer'
              },
              {
                icon: '✨',
                title: 'Zero Shame',
                desc: 'XP never decreases, only grows'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WOWL AI Section - WITH DIAGRAM */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block bg-orange-100 border-2 border-orange-300 rounded-full px-6 py-2 mb-4"
            >
              <span className="text-sm font-bold text-orange-900">AI-POWERED SUPPORT</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Wowl: Your Child's AI Learning Companion
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Infinite patience. Real-time support. Personalized encouragement. <strong>The tutor who never gets tired.</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Diagram */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-3xl p-8 border-2 border-purple-200">
                <div className="aspect-square rounded-2xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center gap-4 bg-white">
                  <span className="text-5xl">🦉</span>
                  <p className="text-lg font-semibold text-purple-700">Wowl AI System</p>
                  <p className="text-sm text-purple-500 max-w-xs text-center">
                    Adaptive tutoring engine with sensory-aware suggestions and PDA-friendly responses.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  How Wowl Helps Your Child:
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: '🧠', text: '<strong>Intent Analysis:</strong> Understands what your child is trying to do (even if they mess up)' },
                    { icon: '💭', text: '<strong>Context Awareness:</strong> Adapts to their emotional state and energy level' },
                    { icon: '❤️', text: '<strong>Emotion Regulation:</strong> Provides calming support when frustration builds' },
                    { icon: '🎯', text: '<strong>Guided Feedback:</strong> Hints, not answers—builds real understanding' },
                    { icon: '🌟', text: '<strong>Encouragement:</strong> Celebrates effort, not just results' },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <span 
                        className="text-gray-700" 
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 italic mb-3">
                  "Wowl has the patience I lost around week 2 of homeschooling. My kids get personalized help without me having to be the bad guy. <strong>Game changer.</strong>"
                </p>
                <p className="font-bold text-gray-900">— Jennifer L.</p>
                <p className="text-sm text-gray-600">Homeschool mom of 3</p>
              </div>

              <button
                onClick={() => setShowEmailCapture(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Try Wowl With Your Child (FREE) →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Lost to Confident in Weeks
            </h2>
            <p className="text-xl text-gray-600">
              Real parents, real transformations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                parent: 'Maria C.',
                child: 'Mom of gifted/dyslexic 8yo',
                quote: 'I spent YEARS trying different curricula. Nothing worked. Within ONE WEEK of following Marianna\'s system, my daughter was excited to learn again. The step-by-step guide made me feel like I finally knew what to do.',
                stars: 5,
              },
              {
                parent: 'David L.',
                child: 'Dad of 2e twins (age 10)',
                quote: 'As a working parent, I felt so guilty I couldn\'t "unlock" my kids\' potential. This system is SO SIMPLE. They do it themselves with Wowl AI, I get updates, everyone\'s happy. Game changer.',
                stars: 5,
              },
              {
                parent: 'Jennifer M.',
                child: 'Homeschool mom of ADHD 9yo',
                quote: 'I was ready to give up homeschooling. My son is BRILLIANT but refused everything. Marianna\'s approach speaks his language. He\'s now 3 levels ahead in math and ASKS to do quests. I cry happy tears.',
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 mb-4 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-purple-200 pt-4">
                  <p className="font-bold text-gray-900">{testimonial.parent}</p>
                  <p className="text-sm text-gray-600">{testimonial.child}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn in Our Free Guide
            </h2>
            <p className="text-xl text-gray-600">
              "Stop Homework Battles" - A Proven System Used by 5,200+ Parents
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                chapter: 'Chapter 1',
                title: 'Why Homework Turns Into Battles',
                subtitle: 'This isn\'t about effort. It\'s about readiness.',
                bullets: [
                  'The 3 hidden reasons kids avoid homework',
                  'Executive function gap decoded',
                  'Processing speed mismatch explained',
                  'Breaking the shame cycle'
                ]
              },
              {
                chapter: 'Chapter 2',
                title: 'The Scaffolding Protocol',
                subtitle: 'The exact system that removes resistance.',
                bullets: [
                  'Step-by-step scaffolding framework',
                  'How to decode refusal responses',
                  'When they still won\'t cooperate',
                  'Building actual independence'
                ]
              },
              {
                chapter: 'Chapter 3',
                title: 'Working With Teachers',
                subtitle: 'Advocate without sounding difficult.',
                bullets: [
                  'Communication scripts that work',
                  'IEP/504 essentials',
                  'When to push back (and how)',
                  'Building teacher partnerships'
                ]
              },
              {
                chapter: 'Chapter 4',
                title: 'The Long Game',
                subtitle: 'Beyond homework: Building independence.',
                bullets: [
                  'Transition from scaffolding to autonomy',
                  'Age-appropriate expectations',
                  'Handling setbacks gracefully',
                  'Measuring real progress'
                ]
              },
            ].map((chapter, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {chapter.chapter}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {chapter.title}
                  </h3>
                </div>
                <p className="text-gray-600 italic mb-4">{chapter.subtitle}</p>
                <ul className="space-y-2">
                  {chapter.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowEmailCapture(true)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-12 py-5 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Get This Guide FREE Now →
            </button>
            <p className="text-sm text-gray-600 mt-4">
              No fluff. No theory you can't use. Just the shifts that work.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Child's Genius Is Waiting
            </h2>
            <p className="text-2xl mb-8 opacity-95">
              You don't need another curriculum. You need a <strong>clear path forward</strong>.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
              <p className="text-xl mb-6">
                🎁 <strong>Start with our FREE guide:</strong> "Unlock Your Child's Genius in 5 Simple Steps"
              </p>
              <ul className="text-left max-w-md mx-auto space-y-3 mb-6">
                {[
                  '5-minute genius profile quiz',
                  'Personalized roadmap (no overwhelm)',
                  'Step-by-step video walkthrough',
                  'Join 5,200+ parents who\'ve found the way',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowEmailCapture(true)}
              className="bg-white text-purple-600 px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Get Your Free Guide Now →
            </button>
            
            <p className="mt-6 text-sm opacity-75">
              No credit card required. No spam. Just the clarity you've been searching for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEmailCapture(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative"
            >
              <button
                onClick={() => setShowEmailCapture(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Unlock Your Child's Genius
                </h3>
                <p className="text-lg text-gray-600">
                  Get your FREE 5-step guide + personalized quiz results
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Child's Age
                  </label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="e.g., 9"
                    min="4"
                    max="18"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Biggest Struggle Right Now
                  </label>
                  <select
                    value={biggestStruggle}
                    onChange={(e) => setBiggestStruggle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Choose one...</option>
                    <option value="refusal">My child refuses to do any work</option>
                    <option value="confidence">Lack of confidence / "I'm dumb"</option>
                    <option value="focus">Can't focus for more than 5 minutes</option>
                    <option value="reading">Reading struggles</option>
                    <option value="math">Math anxiety</option>
                    <option value="overwhelmed">I feel completely overwhelmed</option>
                    <option value="bored">Brilliant but bored with everything</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Download className="w-5 h-5 inline mr-2" />
                      Send Me The Free Guide
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  We respect your privacy. Unsubscribe anytime. No spam, ever.
                </p>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Instant delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>5,200+ parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>100% free</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}