/**
 * Free Guide Landing Page
 * E-book: "Unlock Your Child's Genius in 5 Simple Steps"
 * Purpose: Lead magnet + email capture
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  Download, 
  Check, 
  Gift, 
  Star,
  Sparkles,
  ArrowRight,
  Mail,
  FileText,
  Video,
  ClipboardCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { captureEmailLead } from '../lib/supabase/leads';

// HD Images
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function FreeGuidePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [childAge, setChildAge] = useState('');
  const [struggle, setStruggle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to Supabase
      await captureEmailLead({
        email,
        child_age: childAge ? parseInt(childAge) : undefined,
        biggest_struggle: struggle || undefined,
        source: 'free-guide-page',
      });
      
      toast.success('Check your email! Your guide is on the way. 🎁');
      
      // Redirect to thank you page
      navigate('/thank-you');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <img src={crownLogo} alt="Crown Logo" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
              <p className="text-xs text-purple-600">Unlocking Genius, One Student at a Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-full px-6 py-2 mb-6"
            >
              <span className="text-sm font-bold text-yellow-900">🎁 FREE DOWNLOAD</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Stop Homework Battles<br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                Forever
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              How to Get Cooperation Without Yelling, Bribing, or Breaking Your Child's Spirit
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-1 mb-8"
            >
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-3 text-gray-700 font-semibold">
                Trusted by 5,200+ parents
              </span>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your Free Guide
                </h2>
                <p className="text-gray-600">
                  Instant download. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Child's Age (optional)
                  </label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="e.g., 9"
                    min="4"
                    max="18"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Biggest Challenge Right Now (optional)
                  </label>
                  <select
                    value={struggle}
                    onChange={(e) => setStruggle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-lg"
                  >
                    <option value="">Choose one...</option>
                    <option value="refusal">My child refuses to do any work</option>
                    <option value="confidence">Lack of confidence / "I'm dumb"</option>
                    <option value="focus">Can't focus for more than 5 minutes</option>
                    <option value="reading">Reading struggles despite being bright</option>
                    <option value="math">Math anxiety or shutdown</option>
                    <option value="overwhelmed">I feel completely overwhelmed</option>
                    <option value="bored">Brilliant but bored with everything</option>
                    <option value="2e">Twice exceptional (gifted + LD)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-5 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Send Me The Free Guide
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Instant delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>100% free</span>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </motion.div>

            {/* Right: What's Inside */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  What's Inside Your Free Guide:
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      icon: ClipboardCheck,
                      title: 'Step 1: Discover Their Genius Profile',
                      desc: '5-minute quiz to understand your child\'s unique strengths and learning style',
                    },
                    {
                      icon: ArrowRight,
                      title: 'Step 2: Get Your Personalized Roadmap',
                      desc: 'Simple next steps tailored to YOUR child (no overwhelm)',
                    },
                    {
                      icon: Star,
                      title: 'Step 3: Create One Tiny Win',
                      desc: 'How to build momentum with a 15-minute success',
                    },
                    {
                      icon: Sparkles,
                      title: 'Step 4: Build Unstoppable Confidence',
                      desc: 'The psychology of progress (without pressure)',
                    },
                    {
                      icon: Gift,
                      title: 'Step 5: Celebrate & Scale',
                      desc: 'Turn one win into consistent, joyful learning',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 bg-purple-50 rounded-xl p-5 border border-purple-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonuses */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🎁 BONUS: You Also Get...
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: FileText, text: 'Printable "Genius Profile" worksheet' },
                    { icon: Video, text: 'Video walkthrough (10 minutes)' },
                    { icon: ClipboardCheck, text: 'Free placement quiz access' },
                    { icon: Mail, text: '7-day email course with daily tips' },
                  ].map((bonus, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <bonus.icon className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-800 font-medium">{bonus.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 mb-4 italic">
                  "This guide changed EVERYTHING. I finally had a clear path instead of just guessing. My daughter went from 'I hate learning' to asking when her next quest is. Worth way more than free!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-2xl">👩</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah Martinez</p>
                    <p className="text-sm text-gray-600">Mom of gifted/ADHD 9-year-old</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">5,200+</div>
              <div className="text-purple-100">Parents transformed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-purple-100">Average rating</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">92%</div>
              <div className="text-purple-100">See progress in week 1</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Quick Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Is this really free?',
                a: 'Yes! 100% free, no credit card, no catch. We believe every parent deserves access to this information.',
              },
              {
                q: 'What if my child is really resistant?',
                a: 'Perfect! This guide was designed specifically for kids who refuse traditional learning. Step 1 addresses resistance head-on.',
              },
              {
                q: 'Will this work for my child\'s specific diagnosis?',
                a: 'This system works for ADHD, dyslexia, autism, twice-exceptional, and other learning differences. It\'s based on neurodivergent-affirming principles.',
              },
              {
                q: 'How long does it take to see results?',
                a: 'Most parents report a shift in mindset (theirs and their child\'s) within the first week. Real progress typically shows in 2-3 weeks.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-purple-50 rounded-xl p-6 border border-purple-100"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Child's Breakthrough Starts Here
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Download your free guide and take the first step toward unlocking their genius.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-purple-600 px-12 py-5 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
          >
            Get My Free Guide Now →
          </button>
        </div>
      </section>
    </div>
  );
}