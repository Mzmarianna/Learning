/**
 * Sticky CTA Component
 * Floats at bottom of screen to capture conversions
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export default function StickyCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Pages where sticky CTA should appear
  const showOnPages = ['/', '/about', '/free-guide'];
  const shouldShow = showOnPages.includes(location.pathname);

  useEffect(() => {
    if (!shouldShow || isDismissed) return;

    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldShow, isDismissed]);

  if (!shouldShow || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none"
        >
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl shadow-2xl border-4 border-white p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                {/* Left: Message */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white rounded-full flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-lg sm:text-xl">
                      🎉 Free Placement Quiz - Find Your Perfect Path!
                    </p>
                    <p className="text-sm sm:text-base text-purple-100">
                      Takes 10 minutes. Get instant results + personalized plan.
                    </p>
                  </div>
                </div>

                {/* Right: CTA Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => navigate('/placement-quiz')}
                    className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Start Free Quiz</span>
                    <span className="sm:hidden">Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsDismissed(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
