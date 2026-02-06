/**
 * Learning Kingdom Landing Page
 * Core Methodology: "Every child is a genius"
 * Identity Experience - Not just school, but becoming part of something bigger
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  Star,
  Crown,
  Sparkles,
  Users,
  Zap,
  Heart,
  Play,
  Gift,
  Gamepad2,
  Trophy,
  MessageCircle,
  School,
} from 'lucide-react';
import { Button } from '../ui/button';

interface LearningKingdomLandingProps {
  onJoinKingdom: () => void; // Renamed from onStartQuiz
  onLogin?: () => void;
}

export default function LearningKingdomLanding({ onJoinKingdom, onLogin }: LearningKingdomLandingProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'parents' | 'schools'>('students');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation - Dark with gradient accents */}
      <nav className="relative z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Crown */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  The Learning Kingdom
                </h1>
                <p className="text-xs text-cyan-400">Where Every Child is a Genius</p>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={onLogin}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
            >
              <Crown className="w-4 h-4 mr-2" />
              Enter Kingdom
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO - Identity Experience */}
      <section className="relative overflow-hidden">
        {/* Animated Circuit Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Core Methodology Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Every Child is a Genius
              </span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Don't just{' '}
              <span className="text-gray-400 line-through">do school</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Join the Learning Kingdom
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              Where genius isn't something you have.
            </p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-12">
              It's something we unlock together.
            </p>

            {/* Identity Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {[
                { icon: Gamepad2, text: 'Live inside the content', color: 'cyan' },
                { icon: Users, text: 'Become part of the kingdom', color: 'purple' },
                { icon: Trophy, text: 'Proof that genius works', color: 'pink' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-500/5 border border-${item.color}-500/30 rounded-2xl p-6`}
                >
                  <item.icon className={`w-12 h-12 mx-auto mb-3 text-${item.color}-400`} />
                  <p className="text-white font-semibold">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA - "Join the Kingdom" not "Start Quiz" */}
            <motion.button
              onClick={onJoinKingdom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all mb-4"
            >
              <span className="flex items-center justify-center gap-3">
                <Crown className="w-8 h-8" />
                Claim Your Throne (Free Assessment)
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
            <p className="text-sm text-gray-400">
              5-minute genius assessment • Discover your child's royal tier • Join the kingdom
            </p>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM TABS - Students, Parents, Schools */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                An Ecosystem That Promotes Itself
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              When designed right, everyone wins—and everyone wants in.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            {[
              { id: 'students', label: 'For Students', icon: Gamepad2 },
              { id: 'parents', label: 'For Parents', icon: Heart },
              { id: 'schools', label: 'For Schools', icon: School },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === 'students' && (
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-3xl p-10">
                <h3 className="text-3xl font-bold mb-6 text-cyan-400">
                  🎮 For Students: This is Your Kingdom
                </h3>
                <div className="space-y-4 mb-8">
                  {[
                    'Invite your friends to play together in clan challenges',
                    'Earn XP, level up, collect badges—progress you can SEE and FEEL',
                    'Learn with Wowl, your AI tutor who never gets frustrated',
                    'Build in Minecraft, code games, create art—learning feels like play',
                    'Join live classes with other genius kids like you',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <p className="text-lg text-white">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-black/50 rounded-2xl p-6 border border-cyan-500/20">
                  <p className="text-cyan-300 italic text-lg">
                    "I got my best friend to join so we could be in the same clan. Now we compete to see who can get the most XP each week. My mom says I've never been this excited about learning." - Jayden, Age 10
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'parents' && (
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-3xl p-10">
                <h3 className="text-3xl font-bold mb-6 text-pink-400">
                  💗 For Parents: Watch Them Thrive
                </h3>
                <div className="space-y-4 mb-8">
                  {[
                    'No more homework battles—kids ASK to learn',
                    'See real-time progress across 7 developmental areas',
                    'Your child finally has confidence ("I AM smart!")',
                    'Community of parents who GET IT (ADHD, dyslexia, PDA)',
                    'ESA & microgrants accepted—affordable genius unlocking',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                      <p className="text-lg text-white">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-black/50 rounded-2xl p-6 border border-pink-500/20">
                  <p className="text-pink-300 italic text-lg">
                    "I was ready to give up on homeschool. My ADHD son refused everything. Within 2 weeks of joining, he's completing quests WITHOUT ME ASKING. I tell every parent I meet about this." - Sarah M., Homeschool Mom
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'schools' && (
              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-3xl p-10">
                <h3 className="text-3xl font-bold mb-6 text-purple-400">
                  🏫 For Schools: Professional Development That Works
                </h3>
                <div className="space-y-4 mb-8">
                  {[
                    'Train teachers in neurodivergent-first pedagogy',
                    'Implement gamified learning in your classrooms',
                    'Track student progress with competency-based assessments',
                    'Access Wowl AI for differentiated instruction',
                    'Reduce behavioral issues through engagement',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <School className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                      <p className="text-lg text-white">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-black/50 rounded-2xl p-6 border border-purple-500/20">
                  <p className="text-purple-300 italic text-lg">
                    "We implemented the Learning Kingdom methodology in our SPED classrooms. Engagement is up 78%. Teachers are asking for more PD. This is the future of education." - Dr. Martinez, Principal
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT - Using provided graphic */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto rounded-3xl border-4 border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-10">
            <div className="grid md:grid-cols-2 gap-6 text-left text-gray-200">
              <div>
                <h3 className="text-3xl font-bold text-cyan-200 mb-2">Why We Stand Apart</h3>
                <p className="text-gray-300">
                  Tailored quests, PDA-aware coaching, and neurodivergent-first pacing ensure every learner feels celebrated.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-purple-200 mb-2">Signature Moves</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Live quests with real-time XP boosts</li>
                  <li>• WOWL AI mentor guiding emotional regulation</li>
                  <li>• Family dashboards with actionable insights</li>
                  <li>• Clan-based motivation loops and peer wins</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mt-12 max-w-5xl mx-auto">
            {[
              { icon: '🎮', title: 'GAMES', desc: 'Minecraft builds, coding challenges, Roblox rewards' },
              { icon: '🎁', title: 'REWARDS', desc: 'XP that never decreases, badges, clan points' },
              { icon: '💰', title: 'ROBUX', desc: 'Earn real rewards for completing quests' },
              { icon: '👐', title: 'HANDS-ON', desc: 'Build, create, move—multisensory learning' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Using provided graphic */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                So HERE's How It Works!
              </span>
            </h2>
          </div>

          <div className="w-full max-w-4xl mx-auto rounded-3xl mb-12 border-4 border-purple-500/40 bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-blue-500/20 p-10 text-left">
            <h3 className="text-2xl font-bold text-purple-200 mb-4">Our 3-Step Flow</h3>
            <ol className="space-y-4 text-gray-200">
              <li>
                <span className="font-semibold text-white">1. Discover</span> — A quick assessment uncovers strengths, sensory needs, and executive function supports.
              </li>
              <li>
                <span className="font-semibold text-white">2. Plan</span> — WOWL AI crafts a quest roadmap with live sessions, off-screen adventures, and family prompts.
              </li>
              <li>
                <span className="font-semibold text-white">3. Celebrate</span> — Weekly reflections, Robux-ready rewards, and mentor notes keep motivation high.
              </li>
            </ol>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                num: '1',
                title: 'GET STARTED by clicking "FREE ASSESSMENT" at the top',
                desc: 'Takes 5 minutes. Fun, not scary. Discovers your child\'s genius profile.',
              },
              {
                num: '2',
                title: 'I\'ll assess your child\'s current knowledge and learning style',
                desc: 'Adaptive questions in Math, Reading, Writing. Plus neurodivergent screening to unlock their full potential.',
              },
              {
                num: '3',
                title: 'I\'ll send recommendations + personalized action plan',
                desc: 'Your child gets their Royal Tier, starting quest, and joins their Clan. Learning begins immediately.',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button
              onClick={onJoinKingdom}
              className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white text-2xl px-12 py-8 rounded-2xl font-bold shadow-2xl"
            >
              <Crown className="w-8 h-8 mr-3" />
              Claim Your Throne Now
              <ArrowRight className="w-8 h-8 ml-3" />
            </Button>
            <p className="text-gray-400 mt-4">Join 200+ genius kids already in the kingdom</p>
          </div>
        </div>
      </section>

      {/* WOWL CHARACTER SECTION */}
      <section className="bg-black py-20 border-y border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">
                Meet{' '}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Wowl
                </span>
                <br />
                Your AI Genius Tutor
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Not just software. A <strong>character</strong> your child will love, trust, and want on their t-shirt.
              </p>
              <div className="space-y-4">
                {[
                  'Infinite patience (never gets frustrated)',
                  'Available 24/7 (insomnia learning? Wowl\'s awake!)',
                  'Celebrates every win (big or small)',
                  'Gives hints, not answers (builds confidence)',
                  'YouTube personality teaching genius strategies',
                  'Coming soon: Wowl plushies, hoodies, stickers',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-amber-400" />
                    <p className="text-white text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 flex items-center justify-center">
                <div className="text-9xl">🦉</div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl px-6 py-3">
                <p className="text-white font-bold text-lg">Hoot hoot! Ready to unlock your genius?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - The Kingdom is Growing */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                The Kingdom is Growing
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              When kids thrive, parents spread the word. When systems work, schools take notice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: '200+', label: 'Genius Kids Enrolled', icon: Users },
              { stat: '94%', label: 'Parents Report Less Battles', icon: Heart },
              { stat: '15+', label: 'Schools Using Our Methods', icon: School },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {item.stat}
                </div>
                <p className="text-gray-300 text-lg">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Become Proof */}
      <section className="relative bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Crown className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Become the Proof That Genius Works
          </h2>
          <p className="text-2xl mb-4">
            Your child isn't broken. They don't need fixing.
          </p>
          <p className="text-3xl font-bold mb-12">
            They need a kingdom where their genius can shine.
          </p>

          <Button
            onClick={onJoinKingdom}
            size="lg"
            className="bg-white text-purple-700 hover:bg-gray-100 text-2xl px-16 py-8 rounded-2xl font-bold shadow-2xl"
          >
            <Sparkles className="w-8 h-8 mr-3" />
            Join the Learning Kingdom (Free)
            <ArrowRight className="w-8 h-8 ml-3" />
          </Button>

          <p className="text-white/80 mt-6 text-lg">
            5-minute assessment • Discover your tier • Start your first quest today
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-cyan-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="text-lg mb-2">The Learning Kingdom by Mz. Marianna's Academy</p>
          <p className="text-sm">Where Every Child is a Genius • Neurodivergent-First • ESA Accepted</p>
          <p className="text-xs mt-4">&copy; 2026 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
