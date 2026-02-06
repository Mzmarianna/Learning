import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Star, Award, Brain, Heart, Sparkles, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LandingPageProps {
  onStartQuiz: () => void;
  onLogin?: () => void;
}

export default function LandingPage({ onStartQuiz, onLogin }: LandingPageProps) {
  const [hoveringPackage, setHoveringPackage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Navigation Header */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">Learning Kingdom</p>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn className="w-5 h-5" />
              Warrior Login
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Demo Access Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-center">
            <span className="text-2xl">🎮</span>
            <p className="font-bold text-white">
              Want to explore without signing up?
            </p>
            <motion.a
              href="/demo/student"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-900 px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Try Demo Mode →
            </motion.a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-300 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-purple-100 border-2 border-purple-300 rounded-full px-4 py-2 mb-6">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">
                  For parents of bright kids who struggle
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stop the daily{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  learning battles.
                </span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Help your child learn <strong>without constant redirection, tears, or burnout.</strong>
              </p>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-purple-300 pl-4 bg-purple-50 py-3 rounded-r-lg">
                Game-based, neuro-affirming tutoring for kids with ADHD, dyslexia, and learning differences—designed to reduce stress for the whole family.
              </p>

              {/* Key Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  'From resistance to confidence',
                  'Built for kids who learn differently',
                  'Live 1-on-1 classes with expert tutors',
                  'AI tutor that never loses patience (Wowl 🦉)',
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Primary CTA */}
              <motion.button
                onClick={onStartQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                <span className="flex items-center justify-center gap-3">
                  ✨ Start Free Placement Quiz
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity" />
              </motion.button>

              <p className="text-sm text-gray-600 mt-4 text-center sm:text-left">
                📊 Takes 5-10 minutes · 🔊 Read aloud · ✅ Find your perfect starting point
              </p>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Hero Image */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-200 mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1623076189461-f7706b741c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMGxlYXJuaW5nJTIwaGFwcHklMjBjb21wdXRlcnxlbnwxfHx8fDE3NjgyNDk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Happy child learning with computer"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center bg-gradient-to-br from-purple-50 to-cyan-50">
                  <p className="text-sm text-purple-700 mb-2 font-semibold">Real Students, Real Results</p>
                  <p className="text-xs text-gray-600">Personalized AI-powered learning that adapts to your child</p>
                </div>
              </div>

              {/* Wowl Character Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      rotate: [-5, 5, -5],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-9xl mb-4"
                  >
                    🦉
                  </motion.div>
                  <h3 className="text-3xl font-bold text-purple-900 mb-2">
                    Meet Wowl!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Your AI learning companion who speaks, listens, and creates
                    your perfect learning path
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { icon: '🎤', label: 'Speaks Aloud' },
                    { icon: '👂', label: 'Listens to You' },
                    { icon: '🎯', label: 'Personalized' },
                    { icon: '💜', label: 'Always Patient' },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-full px-4 py-2 flex items-center gap-2"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="font-semibold text-purple-900">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-cyan-200"
              >
                <p className="text-3xl font-bold text-cyan-600">98%</p>
                <p className="text-sm text-gray-600">Parent Satisfaction</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-pink-200"
              >
                <p className="text-3xl font-bold text-pink-600">2-3x</p>
                <p className="text-sm text-gray-600">Faster Progress</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-16 border-y-4 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-semibold mb-2">TRUSTED BY FAMILIES</p>
            <h2 className="text-4xl font-bold mb-4">See What Parents Are Saying</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "My son went from struggling with reading to asking for 'homework' every day. Wowl makes learning feel like a game!",
                name: 'Sarah M.',
                role: 'Mom of 2nd grader',
                stars: 5,
              },
              {
                quote: "As a parent of a dyslexic child, finding this platform was life-changing. The speech features are incredible.",
                name: 'Michael T.',
                role: 'Dad of 4th grader',
                stars: 5,
              },
              {
                quote: "We tried 5 other programs. This is the only one my daughter with ADHD actually sticks with. Worth every penny!",
                name: 'Jennifer L.',
                role: 'Mom of 3rd grader',
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-purple-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-semibold mb-2">CHOOSE YOUR PACKAGE</p>
            <h2 className="text-4xl font-bold mb-4">Flexible Plans That Deliver Results</h2>
            <p className="text-xl text-gray-600">
              All plans include: Personalized learning paths · Wowl AI tutor · Progress reports · ESA accepted
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 1x/Week Package */}
            <motion.div
              onHoverStart={() => setHoveringPackage('1x')}
              onHoverEnd={() => setHoveringPackage(null)}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl shadow-xl p-8 border-2 border-cyan-300 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-cyan-600">$30</span>
                  <span className="text-gray-600">/week</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    '1 live class per week',
                    'Full platform access',
                    'Wowl AI tutor 24/7',
                    'Progress tracking',
                    'Parent dashboard',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg py-6">
                  Start with 1x/Week
                </Button>
              </div>
            </motion.div>

            {/* 4x/Week Package - POPULAR */}
            <motion.div
              onHoverStart={() => setHoveringPackage('4x')}
              onHoverEnd={() => setHoveringPackage(null)}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 border-4 border-amber-400 relative overflow-hidden transform scale-105"
            >
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold">
                ⭐ MOST POPULAR
              </div>

              <div className="relative z-10 text-white">
                <h3 className="text-2xl font-bold mb-2">Accelerated</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">$80</span>
                  <span className="text-purple-100">/week</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    '4 live classes per week',
                    'Priority support',
                    'Wowl AI tutor 24/7',
                    'Advanced progress tracking',
                    'Weekly parent reports',
                    'Faster results',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 text-lg py-6 font-bold">
                  Start with 4x/Week
                </Button>
              </div>
            </motion.div>

            {/* VIP Package */}
            <motion.div
              onHoverStart={() => setHoveringPackage('vip')}
              onHoverEnd={() => setHoveringPackage(null)}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-300 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  VIP <Sparkles className="w-6 h-6 text-purple-600" />
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-purple-600">$99</span>
                  <span className="text-gray-600">/week</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    '5 live classes per week',
                    '1-on-1 tutoring sessions',
                    'Wowl AI tutor 24/7',
                    'Dedicated tutor',
                    'Daily parent updates',
                    'Custom learning plans',
                    'Priority scheduling',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-6">
                  Start VIP Access
                </Button>
              </div>
            </motion.div>
          </div>

          {/* ESA Badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-white border-2 border-purple-300 rounded-2xl px-6 py-3 shadow-lg">
              <Award className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-gray-800">
                ESA Direct Vendor · All plans HSA/FSA eligible
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-2">SIMPLE STEPS</p>
            <h2 className="text-4xl font-bold mb-4">Your Journey Starts Here</h2>
            <p className="text-gray-600 text-lg mb-8">
              From quiz to learning in just 4 easy steps
            </p>
            
            {/* Visual Guide Banner */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-300 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1713942590283-59867d5e3f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHJlYWRpbmclMjBib29rJTIwc21pbGluZ3xlbnwxfHx8fDE3NjgyNDk3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Child reading and learning"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <p className="font-semibold text-cyan-900">Reading Excellence</p>
                  <p className="text-xs text-cyan-700">Build confidence & comprehension</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1560785496-3c9d27877182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMG1hdGglMjBsZWFybmluZ3xlbnwxfHx8fDE3NjgyNDk3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Kids learning math"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <p className="font-semibold text-purple-900">Math Mastery</p>
                  <p className="text-xs text-purple-700">Fun, game-based learning</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759143103113-6696d40598bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2ODI0OTc4OXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Interactive classroom learning"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <p className="font-semibold text-pink-900">Live Classes</p>
                  <p className="text-xs text-pink-700">Expert tutors, 1-on-1 support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: '📝',
                title: 'Free Placement Quiz',
                description: 'Takes 5-10 minutes. Speech-enabled for dyslexic students.',
                cta: 'Start Quiz',
              },
              {
                step: 2,
                icon: '📧',
                title: 'Get Your Results',
                description: 'Instant email with your child\'s learning level and next steps.',
                cta: 'Check Email',
              },
              {
                step: 3,
                icon: '📅',
                title: 'Schedule Assessment',
                description: '30-minute video call to create personalized learning path.',
                cta: 'Book Time',
              },
              {
                step: 4,
                icon: '🚀',
                title: 'Start Learning!',
                description: 'Enroll in your plan and meet Wowl. Learning begins today!',
                cta: 'Enroll Now',
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <span className="text-purple-600 font-semibold">→ {step.cta}</span>
                </div>

                {/* Arrow */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-3xl text-purple-300">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Ready to Make Learning Easy?
            </h2>
            <p className="text-2xl mb-8 text-purple-100">
              Join hundreds of families who've discovered the joy of stress-free learning.
            </p>

            <motion.button
              onClick={onStartQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-purple-600 px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all"
            >
              <span className="flex items-center justify-center gap-3">
                ✨ Start Your Free Quiz Now
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>

            <p className="text-purple-100 mt-6">
              No credit card required · Takes 5-10 minutes · Get results instantly
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Mz. Marianna's Academy</h4>
              <p className="text-sm">Making learning easy and fun for every child.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">ESA Information</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">COPPA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Mz. Marianna's Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}