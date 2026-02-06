import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Mail, Lock, User, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { TierLevel } from '../../lib/database.types';
import { signUpStudent } from '../../lib/supabase/auth';
import { toast } from 'sonner';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentId: string) => void;
}

export default function CreateStudentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateStudentModalProps) {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    age: 10,
    tier: 'explorers' as TierLevel,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create student account (bypasses any payment requirements)
      const result = await signUpStudent({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        age: formData.age,
        tier: formData.tier,
      });

      toast.success(`Student account created successfully for ${formData.displayName}!`);
      
      // Reset form
      setFormData({
        displayName: '',
        email: '',
        password: '',
        age: 10,
        tier: 'explorers',
      });

      onSuccess(result.user?.id || '');
    } catch (err: any) {
      console.error('Error creating student:', err);
      setError(err.message || 'Failed to create student account');
      toast.error(err.message || 'Failed to create student account');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const password = Math.random().toString(36).slice(-10) + 'A1!';
    setFormData({ ...formData, password });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl"
          >
            <Card className="p-8 border-4 border-purple-300 bg-white">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <UserPlus className="w-8 h-8 text-purple-600" />
                    Create Student Account
                  </h2>
                  <p className="text-gray-600">
                    Set up a new student account with no payment required
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Alex Explorer"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="student@academy.com"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used for login credentials
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter password or generate"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      onClick={generateRandomPassword}
                      variant="outline"
                      disabled={loading}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Share this password with the student or parent
                  </p>
                </div>

                {/* Age & Tier */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      min={4}
                      max={18}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Skill Tier
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) =>
                        setFormData({ ...formData, tier: e.target.value as TierLevel })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      disabled={loading}
                    >
                      <option value="early-explorers">
                        Early Explorers (PreK-2nd)
                      </option>
                      <option value="explorers">Explorers (3rd-5th)</option>
                      <option value="warriors">Warriors (6th-8th)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on skill level, not age
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-gradient-to-r from-cyan-50 to-purple-50 border-2 border-cyan-200 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Note:</strong> This account will be created immediately
                    with full access to all challenges in the selected tier. No payment
                    or verification required.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Student Account'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
