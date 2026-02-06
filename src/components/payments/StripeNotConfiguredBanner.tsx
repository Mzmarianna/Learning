/**
 * Stripe Not Configured Banner
 * Shows helpful setup instructions when Stripe keys are missing
 */

import { AlertCircle, ExternalLink } from 'lucide-react';

export default function StripeNotConfiguredBanner() {
  const hasStripeKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY;

  if (hasStripeKey) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ⚙️ Stripe Not Configured (Demo Mode)
          </h3>
          <p className="text-gray-700 mb-4">
            Payment processing is in demo mode. To accept real payments, add your Stripe keys:
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm font-mono text-gray-800 mb-2">
              <strong>1.</strong> Create a Stripe account:
            </p>
            <a
              href="https://dashboard.stripe.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold"
            >
              dashboard.stripe.com/register
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-sm font-mono text-gray-800 mb-2 mt-4">
              <strong>2.</strong> Get your API keys from:
            </p>
            <a
              href="https://dashboard.stripe.com/test/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-semibold"
            >
              dashboard.stripe.com/test/apikeys
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-sm font-mono text-gray-800 mb-2 mt-4">
              <strong>3.</strong> Add to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
            </p>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
              VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...{'\n'}
              STRIPE_SECRET_KEY=sk_test_51...
            </pre>

            <p className="text-sm font-mono text-gray-800 mb-2 mt-4">
              <strong>4.</strong> Restart your dev server:
            </p>
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs">
              npm run dev
            </pre>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📚</span>
            <span>
              Need help? Check{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">/QUICK-START-PAYMENTS.md</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
