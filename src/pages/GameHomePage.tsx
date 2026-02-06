import { useNavigate } from 'react-router';
import { Crown, Sparkles, Gamepad2, Heart, Brain, Zap, Star, Trophy, Rocket, Play, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import StickyCTA from '../components/marketing/StickyCTA';
import TrustSignals from '../components/marketing/TrustSignals';
import ExitIntentPopup from '../components/marketing/ExitIntentPopup';
import wowlAvatar from '../assets/64d5bb1a100e68b30321f1f4e7826d3c45d21e17.png';

export default function GameHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-cyan-50">
      {/* Marketing Components */}
      <StickyCTA />
      <ExitIntentPopup />
      {/* Navigation Bar - Game Style */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Wowl */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={wowlAvatar} alt="Wowl the Owl" className="size-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-title)' }}>
                  Mz. Marianna's Academy
                </h1>
                <p className="text-xs text-purple-600 font-medium">Learning Kingdom</p>
              </div>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/placement-quiz')}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="size-4" />
                  Start Quest
                </span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-white border-2 border-purple-400 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Meet Mz. Marianna */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Floating Elements Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-yellow-400 opacity-30"
          >
            <Star className="size-16" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 text-pink-400 opacity-30"
          >
            <Sparkles className="size-20" fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-1/4 text-cyan-400 opacity-30"
          >
            <Trophy className="size-14" fill="currentColor" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Story & Message */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg">
              <Crown className="size-4" />
              <span>Top EdTech Innovator • Mom • ADHD Champion</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ fontFamily: 'var(--font-title)' }}>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                Where Learning Feels Like
              </span>
              <br />
              <span className="text-purple-900 relative inline-block">
                An Epic Adventure
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300 -z-10 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>

            {/* Story */}
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p className="flex items-start gap-3">
                <Heart className="size-6 text-pink-500 flex-shrink-0 mt-1" fill="currentColor" />
                <span>
                  Hi! I'm <strong className="text-purple-600">Mz. Marianna</strong>, and I know firsthand what it's like when learning feels like a battle. As a mom navigating <strong>ADHD</strong>, I discovered something magical: <em className="text-pink-600">when learning looks like play, everything changes.</em>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Gamepad2 className="size-6 text-cyan-500 flex-shrink-0 mt-1" />
                <span>
                  That's why I built the <strong className="text-cyan-600">Learning Kingdom</strong> — a place where neurodivergent kids don't just learn, they <strong>level up</strong>. Where challenges become quests, mistakes become power-ups, and every child discovers their unique genius.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Sparkles className="size-6 text-yellow-500 flex-shrink-0 mt-1" fill="currentColor" />
                <span>
                  Through gamified Warriors curriculum, personalized AI support, and a whole lot of joy, we help kids <strong className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">find their spark and keep it lit.</strong>
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/placement-quiz')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold rounded-2xl text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  <Rocket className="size-5" />
                  Start Your Adventure
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => navigate('/free-guide')}
                className="px-8 py-4 bg-white border-4 border-purple-400 text-purple-600 font-bold rounded-2xl text-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <Star className="size-5" fill="currentColor" />
                  Get Free Parent Guide
                </span>
              </button>
            </div>
          </motion.div>

          {/* Right: Wowl the Owl - Site Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              type: "spring",
              bounce: 0.4
            }}
            className="relative flex justify-center items-center"
          >
            {/* Wowl Container with Glow Effect */}
            <div className="relative">
              {/* Glow Effect Behind Wowl */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-cyan-400/30 rounded-full blur-3xl scale-110 animate-pulse" />
              
              {/* Wowl Image with Bounce Animation */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative z-10"
              >
                <img 
                  src={wowlAvatar} 
                  alt="Wowl the Owl - Your Learning Companion" 
                  className="w-[400px] h-[400px] object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5, type: "spring" }}
                className="absolute -top-8 -right-12 bg-white rounded-2xl p-4 shadow-2xl border-4 border-purple-300 max-w-[200px]"
              >
                {/* Speech bubble pointer - decorative only */}
                <div aria-hidden="true" className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                <p className="text-purple-900 font-bold text-sm text-center">
                  Hi! I'm Wowl! 🦉
                  <br />
                  <span className="text-pink-600">Let's learn together!</span>
                </p>
              </motion.div>

              {/* Floating Sparkles Around Wowl */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/4 -left-8 text-yellow-400"
              >
                <Sparkles className="size-8" fill="currentColor" />
              </motion.div>

              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-1/4 -right-8 text-pink-400"
              >
                <Star className="size-10" fill="currentColor" />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute top-1/2 -right-12 text-cyan-400"
              >
                <Brain className="size-7" />
              </motion.div>
            </div>

            {/* Floating Stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white"
            >
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-xp)' }}>500+</div>
              <div className="text-sm font-semibold">Happy Learners</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white"
            >
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-xp)' }}>100K+</div>
              <div className="text-sm font-semibold">Quests Completed</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals - Social Proof */}
      <TrustSignals />

      {/* How It Works - Game Interface Style */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                Your Learning Kingdom Awaits
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform learning into an epic adventure with our game-powered approach
            </p>
          </motion.div>

          {/* Feature Cards - Game UI Style */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gamepad2,
                color: 'from-purple-500 to-pink-500',
                title: 'Gamified Quests',
                description: 'Warriors curriculum transformed into epic adventures. Every lesson is a quest, every skill a power to unlock.',
                stats: '50+ Quests'
              },
              {
                icon: Brain,
                color: 'from-cyan-500 to-purple-500',
                title: 'ADHD-Friendly',
                description: 'Designed by a mom who gets it. Bite-sized challenges, instant rewards, and learning that works with your brain, not against it.',
                stats: 'Neurodivergent-First'
              },
              {
                icon: Zap,
                color: 'from-pink-500 to-orange-500',
                title: 'Level Up System',
                description: 'Earn XP, unlock badges, and watch your child transform into a confident learner. Progress is celebrated, always.',
                stats: '100+ Achievements'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200 hover:border-purple-400 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                    <feature.icon className="size-8 text-white" strokeWidth={2.5} />
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                    {feature.stats}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Kingdom - Visual Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome to the Learning Kingdom
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Where every learner becomes a hero
            </p>
          </motion.div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1731480667959-bbef13f52bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwa2luZ2RvbSUyMGNhc3RsZSUyMGNvbG9yZnVsJTIwZ2FtZXxlbnwxfHx8fDE3NzAzMTY5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Learning Kingdom - Magical Learning Environment"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                Your Quest Begins Here
              </h3>
              <p className="text-lg mb-6">
                Join hundreds of learners on an educational journey like no other
              </p>
              <button
                onClick={() => navigate('/placement-quiz')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Play className="size-5" />
                  Begin Your Journey
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <Star className="size-20" fill="white" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Trophy className="size-24" fill="white" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Crown className="size-32" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-title)' }}>
              Ready to Unlock Your Child's Potential?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Take our 2-minute placement quiz and discover their perfect learning path
            </p>
            <button
              onClick={() => navigate('/placement-quiz')}
              className="px-10 py-5 bg-white text-purple-600 font-bold rounded-2xl text-xl shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="size-6" fill="currentColor" />
                Start the Quest
                <ArrowRight className="size-6" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="size-8 text-yellow-400" />
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-title)' }}>
              Mz. Marianna's Academy
            </h3>
          </div>
          <p className="text-purple-200 mb-6">
            Where neurodivergent learners discover their genius through play
          </p>
          <div className="flex justify-center gap-6 text-sm text-purple-300">
            <button onClick={() => navigate('/about')}>About Mz. Marianna</button>
            <button onClick={() => navigate('/pricing')}>Pricing</button>
            <button onClick={() => navigate('/free-guide')}>Free Guide</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
          <p className="text-purple-400 text-sm mt-8">
            © 2026 Mz. Marianna's Academy. Built with 💜 for neurodivergent learners.
          </p>
        </div>
      </footer>
    </div>
  );
}