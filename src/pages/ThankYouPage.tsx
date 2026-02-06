/**
 * Thank You Page After E-book Download
 * Next step: Quiz CTA
 */

import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Check, 
  Mail, 
  ArrowRight, 
  Sparkles,
  Download,
  Play
} from 'lucide-react';

export default function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-6"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Check Your Email! 📧<br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              Your Guide is On Its Way
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            We just sent <strong>"Stop Homework Battles"</strong> to your inbox. It should arrive within the next few minutes.
          </motion.p>

          {/* Download Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <a
              href="https://www.figma.com/make/cdTIfrByI85Fy91l0D4Tvo/Create-Best-Selling-Ebook?fullscreen=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-12 py-5 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              <Download className="w-8 h-8" />
              Download Your Guide Now
            </a>
            <p className="text-sm text-gray-600 mt-4">
              Can't wait? Click above to read it right now!
            </p>
          </motion.div>

          {/* Next Step */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8 border-2 border-purple-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready for Your Next Step?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              While you wait, take our <strong>free 5-minute placement quiz</strong> to discover your child's exact genius profile and starting point.
            </p>
            <button
              onClick={() => navigate('/placement-quiz')}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-5 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Take the Free Quiz Now
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* What Happens Next */}
          <div className="text-left space-y-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              📅 What Happens Over The Next 7 Days:
            </h3>
            <div className="space-y-3">
              {[
                { day: 'Today', text: 'Download your guide & take the quiz' },
                { day: 'Day 2', text: 'Success story: How Maria\'s daughter went from refusal to thriving' },
                { day: 'Day 3', text: 'Deep dive: How Wowl AI works (the "infinite patience" tutor)' },
                { day: 'Day 4', text: 'Curriculum comparison: Why traditional methods fail 2e kids' },
                { day: 'Day 5', text: 'Pricing & ESA funding explained (simple & affordable)' },
                { day: 'Day 6', text: 'FAQ: All your questions answered' },
                { day: 'Day 7', text: 'Special offer: Start your child\'s first quest' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.day}
                  </div>
                  <p className="text-gray-700 pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 mb-4">
              🎉 You've joined <strong className="text-purple-600">5,200+ parents</strong> who are unlocking their child's genius
            </p>
            <p className="text-xs text-gray-500">
              Questions? Reply to any email and I'll personally respond. - Marianna
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 font-semibold underline"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}