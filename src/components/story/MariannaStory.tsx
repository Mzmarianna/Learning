import { motion } from 'motion/react';
import { Heart, Sparkles, Crown, Brain, Zap, Star } from 'lucide-react';

interface MariannaStoryProps {
  variant?: 'full' | 'compact' | 'quote';
  className?: string;
}

export function MariannaStory({ variant = 'full', className = '' }: MariannaStoryProps) {
  if (variant === 'quote') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-purple-300 shadow-xl ${className}`}
      >
        <div className="flex items-start gap-4">
          <Crown className="size-12 text-purple-600 flex-shrink-0" />
          <div>
            <blockquote className="text-2xl font-bold text-purple-900 mb-3 leading-relaxed" style={{ fontFamily: 'var(--font-title)' }}>
              "Every child is a genius waiting to be discovered. Sometimes they just need to find their kingdom."
            </blockquote>
            <p className="text-purple-600 font-semibold">
              — Mz. Marianna, Founder & Learning Architect
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 ${className}`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
            <Crown className="size-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
              Mz. Marianna's Vision
            </h3>
            <p className="text-sm text-purple-600">Learning Kingdom Architect</p>
          </div>
        </div>
        
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-2">
            <Heart className="size-5 text-pink-500 flex-shrink-0 mt-0.5" fill="currentColor" />
            <span><strong>Mom & ADHD Champion:</strong> I understand the struggle and the magic of neurodivergent minds.</span>
          </p>
          <p className="flex items-start gap-2">
            <Sparkles className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" />
            <span><strong>Innovation in Action:</strong> When learning feels like play, barriers disappear.</span>
          </p>
          <p className="flex items-start gap-2">
            <Zap className="size-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="currentColor" />
            <span><strong>Joy-Centered:</strong> Kids don't need fixing — they need a kingdom where they can thrive.</span>
          </p>
        </div>
      </motion.div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mb-4 shadow-lg">
          <Crown className="size-6" fill="currentColor" />
          <span className="font-bold text-lg">Meet the Founder</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
            Mz. Marianna's Story
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From struggling mom to top EdTech innovator — the journey that built the Learning Kingdom
        </p>
      </motion.div>

      {/* Story Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-xl border-4 border-pink-200"
        >
          <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-4 rounded-2xl inline-flex mb-4">
            <Heart className="size-8 text-white" fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-3" style={{ fontFamily: 'var(--font-title)' }}>
            The Mom Journey
          </h3>
          <p className="text-gray-700 leading-relaxed">
            As a mom navigating ADHD with my own child, I lived the frustration of watching bright kids struggle in systems not built for them. <em>I knew there had to be a better way.</em>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-xl border-4 border-cyan-200"
        >
          <div className="bg-gradient-to-br from-cyan-500 to-purple-500 p-4 rounded-2xl inline-flex mb-4">
            <Brain className="size-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-3" style={{ fontFamily: 'var(--font-title)' }}>
            The Discovery
          </h3>
          <p className="text-gray-700 leading-relaxed">
            I discovered something magical: when learning looks like Roblox, Minecraft, or their favorite game, <strong className="text-cyan-600">neurodivergent minds don't just learn — they thrive.</strong>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200"
        >
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl inline-flex mb-4">
            <Sparkles className="size-8 text-white" fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-purple-900 mb-3" style={{ fontFamily: 'var(--font-title)' }}>
            The Kingdom
          </h3>
          <p className="text-gray-700 leading-relaxed">
            That's how the Learning Kingdom was born — a place where <strong className="text-purple-600">every neurodivergent learner becomes the hero of their own educational adventure.</strong>
          </p>
        </motion.div>
      </div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h3 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-title)' }}>
          What I Believe
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Star className="size-6" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Joy-Centered Learning</h4>
              <p className="text-white/90">When kids are having fun, they're not just learning — they're discovering who they are.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Heart className="size-6" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Neurodivergent-First</h4>
              <p className="text-white/90">ADHD, autism, dyslexia aren't obstacles — they're superpowers waiting to be unlocked.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="size-6" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Game-Powered Growth</h4>
              <p className="text-white/90">Levels, quests, XP — not gimmicks, but the language neurodivergent brains speak fluently.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Crown className="size-6" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Every Child is Royalty</h4>
              <p className="text-white/90">In the Learning Kingdom, there are no failures — only quests in progress.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center shadow-2xl border-4 border-white"
      >
        <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-title)' }}>
          Join the Kingdom
        </h3>
        <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
          Let's help your child discover their genius, one epic quest at a time.
        </p>
        <div className="text-4xl mb-4">🏰✨👑</div>
      </motion.div>
    </div>
  );
}

// Quick reference component for small spaces
export function MariannaQuickBio({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
        <Crown className="size-6 text-white" />
      </div>
      <div>
        <div className="font-bold text-purple-900">Mz. Marianna</div>
        <div className="text-sm text-gray-600">Mom • ADHD Champion • EdTech Innovator</div>
      </div>
    </div>
  );
}

// Tooltip-style mini bio
export function MariannaMiniTooltip() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-purple-200 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <Crown className="size-5 text-purple-600" />
        <span className="font-bold text-purple-900">About Mz. Marianna</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        Top EdTech tutor, mom, and ADHD champion who transformed her struggle into the Learning Kingdom — where neurodivergent kids discover joy in learning through gamified adventures.
      </p>
    </div>
  );
}
