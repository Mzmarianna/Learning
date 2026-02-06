import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Zap, Target, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '../../lib/types';
import { StudentProfile, generateGreeting } from '../../lib/wowl-personality';

interface GentleOnboardingProps {
  user: User;
  onComplete: (profile: StudentProfile) => void;
}

type OnboardingStep = 'welcome' | 'avatar' | 'explore' | 'interests' | 'complete';

const AVATARS = [
  { id: 'phoenix', emoji: '🔥', name: 'Phoenix', color: 'from-orange-500 to-red-500' },
  { id: 'wolf', emoji: '🐺', name: 'Wolf', color: 'from-slate-500 to-gray-600' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon', color: 'from-red-500 to-purple-600' },
  { id: 'owl', emoji: '🦉', name: 'Owl', color: 'from-purple-500 to-cyan-500' },
  { id: 'tiger', emoji: '🐯', name: 'Tiger', color: 'from-orange-500 to-amber-600' },
  { id: 'eagle', emoji: '🦅', name: 'Eagle', color: 'from-blue-500 to-cyan-500' },
];

const ANIMALS = [
  '🐺 Wolf', '🦅 Eagle', '🐯 Tiger', '🐉 Dragon', '🦈 Shark', '🦉 Owl',
  '🐆 Leopard', '🦊 Fox', '🐍 Snake', '🦎 Lizard'
];

const ACTIVITIES = [
  '🎮 Gaming', '📚 Reading', '🎨 Art', '⚽ Sports', '🎵 Music', '🔬 Science',
  '🏗️ Building', '💻 Coding', '🧩 Puzzles', '🚀 Space'
];

export default function GentleOnboarding({ user, onComplete }: GentleOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState('');
  const [favoriteAnimal, setFavoriteAnimal] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [wowlSpeaking, setWowlSpeaking] = useState(false);

  // Speak text using Web Speech API
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setWowlSpeaking(true);
      utterance.onend = () => setWowlSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleComplete = () => {
    const profile: StudentProfile = {
      uid: user.uid,
      name: user.displayName || 'Student',
      age: 14, // Would be from user data
      favoriteAnimal: favoriteAnimal || undefined,
      interests,
      hasADHD: true, // Would be from assessment
      preferredSessionLength: 15,
    };

    // Save to localStorage (demo mode)
    localStorage.setItem(`studentProfile-${user.uid}`, JSON.stringify(profile));
    localStorage.setItem(`selectedAvatar-${user.uid}`, selectedAvatar || 'owl');
    localStorage.setItem(`avatarName-${user.uid}`, avatarName);

    onComplete(profile);
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* STEP 1: WELCOME */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl w-full"
          >
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-12 border border-purple-500/30 relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[3px]"
                >
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-7xl">
                    🦉
                  </div>
                </motion.div>

                <h1 className="text-5xl font-bold mb-4 text-white">
                  Welcome to the System
                </h1>

                <div className="text-xl text-slate-300 mb-8 space-y-3">
                  <p>Hey {user.displayName}.</p>
                  <p>I'm <strong className="text-purple-400">Wowl</strong>, your AI learning companion.</p>
                  <p className="text-lg text-slate-400">Let's set up your profile.</p>
                </div>

                <Button
                  onClick={() => {
                    speak(`Hey ${user.displayName}. I'm Wowl. Let's choose your avatar.`);
                    setStep('avatar');
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xl px-12 py-6"
                >
                  Get Started <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: AVATAR SELECTION */}
        {step === 'avatar' && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-4xl w-full"
          >
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-12 border border-purple-500/30 relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

              {/* Wowl's Instructions */}
              <div className="flex items-start gap-6 mb-8 bg-slate-800/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
                {/* Wowl Avatar */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px] flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-4xl">
                    🦉
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Choose Your Avatar
                  </h2>
                  <p className="text-slate-300">
                    Pick the character that represents you in the system.
                  </p>
                </div>
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {AVATARS.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    onClick={() => {
                      setSelectedAvatar(avatar.id);
                      speak(`${avatar.name} selected.`);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedAvatar === avatar.id
                        ? 'border-purple-500 bg-purple-900/40 shadow-xl'
                        : 'border-slate-600 bg-slate-800/40 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-6xl mb-3">{avatar.emoji}</div>
                    <p className="font-bold text-lg text-white">{avatar.name}</p>
                    {selectedAvatar === avatar.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <Check className="w-6 h-6 text-cyan-400 mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Name Your Avatar */}
              {selectedAvatar && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <label className="block text-lg font-semibold text-white mb-3">
                    Name your avatar (optional)
                  </label>
                  <input
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Custom name..."
                    className="w-full px-6 py-4 border-2 border-slate-600 bg-slate-800/60 rounded-xl focus:border-purple-500 focus:outline-none text-lg text-white placeholder-slate-500"
                  />
                </motion.div>
              )}

              {/* Next Button */}
              <Button
                onClick={() => {
                  speak(`Avatar set. Moving to system overview.`);
                  setStep('explore');
                }}
                disabled={!selectedAvatar}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xl py-6 disabled:opacity-50"
              >
                Continue <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: EXPLORATION */}
        {step === 'explore' && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-4xl w-full"
          >
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-12 border border-purple-500/30 relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

              {/* Wowl's Tour */}
              <div className="flex items-start gap-6 mb-8 bg-slate-800/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px] flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-4xl">
                    🦉
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    System Overview
                  </h2>
                  <p className="text-slate-300">
                    Here are the main features. Explore anytime.
                  </p>
                </div>
              </div>

              {/* Exploration Areas */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    icon: <Target className="w-8 h-8" />,
                    title: 'Quest Map',
                    description: 'Track your learning path and challenges',
                    color: 'from-purple-600 to-purple-700',
                    borderColor: 'border-purple-500/50',
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8" />,
                    title: 'Progress',
                    description: 'View stats, XP, and achievements',
                    color: 'from-cyan-600 to-cyan-700',
                    borderColor: 'border-cyan-500/50',
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    title: 'Projects',
                    description: 'Build and showcase your work',
                    color: 'from-pink-600 to-pink-700',
                    borderColor: 'border-pink-500/50',
                  },
                  {
                    icon: '💬',
                    title: 'Chat with Wowl',
                    description: 'Get help whenever you need it',
                    color: 'from-emerald-600 to-emerald-700',
                    borderColor: 'border-emerald-500/50',
                  },
                ].map((area, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className={`bg-gradient-to-br ${area.color} border ${area.borderColor} text-white rounded-xl p-6 cursor-pointer shadow-lg`}
                  >
                    <div className="text-4xl mb-3">{typeof area.icon === 'string' ? area.icon : area.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{area.title}</h3>
                    <p className="text-sm text-white/80">{area.description}</p>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => {
                  speak(`Let's personalize your profile.`);
                  setStep('interests');
                }}
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xl py-6"
              >
                Continue <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: INTERESTS (Informal Assessment Start) */}
        {step === 'interests' && (
          <motion.div
            key="interests"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-4xl w-full"
          >
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-12 border border-purple-500/30 relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

              {/* Wowl's Gentle Question */}
              <div className="flex items-start gap-6 mb-8 bg-slate-800/60 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px] flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-4xl">
                    🦉
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Personalize Your Experience
                  </h2>
                  <p className="text-slate-300">
                    Select your interests to customize your learning path.
                  </p>
                </div>
              </div>

              {/* Favorite Animal */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Favorite animal (optional)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {ANIMALS.map((animal) => (
                    <motion.button
                      key={animal}
                      onClick={() => {
                        setFavoriteAnimal(animal);
                        speak(`${animal.split(' ')[1]} selected.`);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        favoriteAnimal === animal
                          ? 'border-pink-500 bg-pink-900/40 shadow-lg'
                          : 'border-slate-600 bg-slate-800/40 hover:border-pink-400'
                      }`}
                    >
                      <div className="text-3xl mb-1">{animal.split(' ')[0]}</div>
                      <p className="text-sm font-semibold text-white">{animal.split(' ')[1]}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Your interests (select any)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {ACTIVITIES.map((activity) => (
                    <motion.button
                      key={activity}
                      onClick={() => toggleInterest(activity)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        interests.includes(activity)
                          ? 'border-purple-500 bg-purple-900/40 shadow-lg'
                          : 'border-slate-600 bg-slate-800/40 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-3xl mb-1">{activity.split(' ')[0]}</div>
                      <p className="text-sm font-semibold text-white">{activity.split(' ')[1]}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  speak(`Profile complete. Starting your learning journey.`);
                  handleComplete();
                }}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:opacity-90 text-white text-xl py-6"
              >
                Start Learning <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wowl Speaking Indicator */}
      {wowlSpeaking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 bg-purple-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-3xl"
          >
            🦉
          </motion.span>
          <span className="font-bold">Wowl is speaking...</span>
        </motion.div>
      )}
    </div>
  );
}