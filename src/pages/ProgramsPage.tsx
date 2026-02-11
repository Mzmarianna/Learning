/**
 * Programs Page
 * Displays available program offerings for neurodivergent learners
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Gamepad2, Sun, CheckCircle, ArrowRight, Users, Clock, Target } from 'lucide-react';
import { 
  getAvailablePrograms, 
  getProgramsByCategory, 
  formatProgramPrice,
  getProgramPurchaseOptions,
  type ProgramOffering 
} from '../lib/programs/offerings';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

// Import logo
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tutoring' | 'camp'>('all');

  const allPrograms = getAvailablePrograms();
  const displayPrograms = selectedCategory === 'all' 
    ? allPrograms 
    : getProgramsByCategory(selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutoring':
        return <BookOpen className="w-6 h-6" />;
      case 'camp':
        return <Sun className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const handleEnroll = (program: ProgramOffering) => {
    // Navigate to checkout with program selection
    navigate(`/programs/checkout?program=${program.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <img src={crownLogo} alt="Crown Logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">Programs for Neurodivergent Learners</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-2 border-purple-200 hover:border-purple-300"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Programs for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">Neurodivergent Learners</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Specialized programs designed for students with ADHD, Autism, Dyslexia, and unique abilities.
            All services align with Common Core standards and focus on strengthening executive functioning,
            academic achievement, and student confidence.
          </p>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              All Programs
            </button>
            <button
              onClick={() => setSelectedCategory('tutoring')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'tutoring'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Tutoring
            </button>
            <button
              onClick={() => setSelectedCategory('camp')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'camp'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              <Sun className="w-5 h-5 inline mr-2" />
              Summer Camp
            </button>
          </div>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPrograms.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all"
            >
              {/* Program Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                  {getCategoryIcon(program.category)}
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full uppercase">
                  {program.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.name}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span><strong>Grades:</strong> {program.grades}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span><strong>Frequency:</strong> {program.frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span><strong>Format:</strong> {program.format}</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Focus Areas:</p>
                <ul className="space-y-1">
                  {program.focusAreas.slice(0, 3).map((area, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                  {program.focusAreas.length > 3 && (
                    <li className="text-xs text-gray-500 italic ml-5">
                      + {program.focusAreas.length - 3} more areas
                    </li>
                  )}
                </ul>
              </div>

              {/* Pricing */}
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Pricing Options:</p>
                <p className="text-lg font-bold text-purple-900">{formatProgramPrice(program)}</p>
              </div>

              {/* Enroll Button */}
              <Button
                onClick={() => handleEnroll(program)}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Enroll Now
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Educational Benefit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our Programs?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Specialized Support</h3>
              <p className="text-gray-600">Designed specifically for neurodivergent learners with ADHD, Autism, Dyslexia, and unique abilities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Common Core Aligned</h3>
              <p className="text-gray-600">All services align with Common Core standards while supporting IEP/504 goals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Engaging Format</h3>
              <p className="text-gray-600">Multisensory, gamified learning that builds executive functioning and confidence</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
