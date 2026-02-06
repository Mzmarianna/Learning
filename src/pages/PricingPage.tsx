/**
 * Pricing Page
 * Displays all subscription tiers and handles checkout
 */

import { motion } from 'motion/react';
import { Crown, ArrowLeft } from 'lucide-react';
import PricingTable from '../components/payments/PricingTable';
import StripeNotConfiguredBanner from '../components/payments/StripeNotConfiguredBanner';
import { useNavigate } from 'react-router-dom';

// Import logo
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <img src={crownLogo} alt="Crown Logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">Unlocking Genius, One Student at a Time</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold px-4 py-2 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-purple-100 border-2 border-purple-300 rounded-full px-6 py-2 mb-6"
          >
            <span className="text-sm font-bold text-purple-900">CHOOSE YOUR TIER</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Invest in Your Child's{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              Genius
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-12"
          >
            Join 5,200+ families who've unlocked their child's potential. Start free, upgrade anytime.
          </motion.p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <StripeNotConfiguredBanner />
          <PricingTable />
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: '5,200+', label: 'Active Families' },
              { number: '98%', label: 'Satisfaction Rate' },
              { number: '4.9/5', label: 'Average Rating' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-2 border-purple-200"
          >
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Crown key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xl text-gray-800 italic mb-6 leading-relaxed">
              "We tried THREE different online programs before finding Mz. Marianna's Academy. My son went from
              refusing to do any work to completing 20 quests in his first week. The Warrior tier gave us everything
              we needed. Worth every penny."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div>
                <p className="font-bold text-gray-900">Sarah Martinez</p>
                <p className="text-sm text-gray-600">Mom of 2e 9-year-old, Warrior Member</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Mz. Marianna's Academy. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Questions?{' '}
            <a href="mailto:mariannav920@gmail.com" className="text-purple-400 hover:underline">
              mariannav920@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}