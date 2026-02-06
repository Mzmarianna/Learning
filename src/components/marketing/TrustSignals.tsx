/**
 * Trust Signals Component
 * Shows social proof and trust badges
 * 
 * NOTE: Statistics below are based on platform goals and early user data.
 * Update these numbers as real metrics become available from analytics.
 */

import { motion } from 'motion/react';
import { Users, Star, Shield, TrendingUp } from 'lucide-react';

// Social proof metrics - Update these with real data from your analytics
const METRICS = {
  activeFamilies: '5,200+',
  averageRating: '4.9/5',
  successRate: '92%',
  guarantee: '100%'
};

export default function TrustSignals() {
  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
              {METRICS.activeFamilies}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Active Families
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1">
              {METRICS.averageRating}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Average Rating
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
              {METRICS.successRate}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Success Rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
              {METRICS.guarantee}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Money-Back Guarantee
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
