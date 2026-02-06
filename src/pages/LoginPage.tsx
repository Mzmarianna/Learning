import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../lib/supabase/auth';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      // Navigation will happen automatically via auth state change in App.tsx
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🦉
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to the Learning Kingdom!
          </h1>
          <p className="text-gray-600">
            Sign in to continue your adventure
          </p>
        </div>

        {/* Demo Mode Info - Only show if NOT configured with real Supabase */}
        {!isSupabaseConfigured && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              🎮 Demo Mode Active
            </p>
            <p className="text-sm text-purple-700 mb-2">
              Use these credentials to test the platform:
            </p>
            <div className="bg-white rounded-lg p-3 font-mono text-sm">
              <p className="text-purple-900"><strong>Email:</strong> demo@test.com</p>
              <p className="text-purple-900"><strong>Password:</strong> test123</p>
            </div>
          </div>
        )}

        {/* First Time User Info - Only show if configured with real Supabase */}
        {isSupabaseConfigured && (
          <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-cyan-900 mb-2">
              🌟 First Time Here?
            </p>
            <p className="text-sm text-cyan-700 mb-3">
              Don't have an account yet? Create one to start your learning adventure!
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Create Account →
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}