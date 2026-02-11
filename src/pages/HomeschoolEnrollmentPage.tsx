/**
 * Homeschool Enrollment Page
 * Dedicated enrollment page for the Complete Homeschool Program
 * Direct link for prospects: www.mzmarianna.com/enroll/homeschool
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Users, Gamepad2, FileText, Calendar, CheckCircle, ArrowRight, Clock, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function HomeschoolEnrollmentPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: '4 Live Sessions Daily',
      description: 'Expert-led instruction covering all core subjects'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: '1 Hour Social Hour',
      description: 'Daily peer interaction and community building'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Self-Paced Lessons',
      description: 'Work at your own pace with adaptive content'
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: 'Gamified Apps',
      description: 'Engaging educational games and activities'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Printable Workbooks',
      description: 'Comprehensive materials for offline learning'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Complete Curriculum',
      description: 'Everything you need for successful homeschooling'
    }
  ];

  const handleEnroll = () => {
    navigate('/programs/checkout?program=homeschool-program');
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
                <p className="text-xs text-purple-600">Complete Homeschool Solution</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/programs')}
              variant="outline"
              className="border-2 border-purple-200 hover:border-purple-300"
            >
              View All Programs
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
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold mb-4">
            ✨ Complete Homeschool Solution
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">Homeschool Successfully</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            $120 per week
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Daily live sessions, self-paced learning, gamified apps, printable workbooks, and social hours - 
            a comprehensive program designed for K-8th grade homeschooling families.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleEnroll}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/programs')}
              size="lg"
              variant="outline"
              className="border-2 border-purple-300 px-8 py-6 text-lg font-semibold"
            >
              View Other Programs
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-purple-200 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Included Every Week</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Daily Schedule
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>4 Live Sessions</strong> - Core subjects with expert teachers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>1 Social Hour</strong> - Peer interaction and community building</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Self-Paced Work</strong> - Flexible learning on your schedule</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Learning Materials
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Gamified Apps</strong> - Engaging educational games</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Printable Workbooks</strong> - Hands-on activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Progress Tracking</strong> - Monitor your child's growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Parent Resources</strong> - Coaching and support</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 border-2 border-purple-300 mb-16"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Simple, Transparent Pricing</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-purple-900">$120</span>
              <span className="text-2xl text-gray-600">/week</span>
            </div>
            <p className="text-gray-600 mt-2">or $480/month (4 weeks)</p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Everything Included:</p>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>20 live sessions/week</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>5 social hours/week</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Unlimited self-paced content</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>All printable materials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Gamified learning apps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Parent support</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleEnroll}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-6 text-lg font-bold shadow-xl hover:shadow-2xl"
          >
            Enroll Your Child Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ✨ Pay securely with ClassWallet - Scholarships accepted
          </p>
        </motion.div>

        {/* FAQ / Support */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Questions about our homeschool program?
          </p>
          <a 
            href="mailto:mariannav920@gmail.com" 
            className="text-purple-600 font-semibold hover:underline text-lg"
          >
            Contact us: mariannav920@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
