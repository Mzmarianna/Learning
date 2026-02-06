/**
 * Invoice Template Component
 * Professional invoice/receipt for payments
 * Optimized for printing and email
 */

import crownLogo from '../../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  planName: string;
  planDescription: string;
  amount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  billingPeriod: string;
}

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export default function InvoiceTemplate({ data }: InvoiceTemplateProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 print:p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <img src={crownLogo} alt="Crown Logo" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mz. Marianna's Academy</h1>
            <p className="text-gray-600">Teaching differently. Built different.</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-purple-600 mb-2">INVOICE</div>
          <div className="text-gray-600">
            <p className="font-semibold">{data.invoiceNumber}</p>
            <p>{data.date}</p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">From</h3>
          <div className="text-gray-800">
            <p className="font-bold text-lg">Mz. Marianna's Academy</p>
            <p className="mt-2">Marianna Vitale</p>
            <p>San Francisco, CA</p>
            <p className="mt-2">mariannav920@gmail.com</p>
            <p>www.MzMarianna.com</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Bill To</h3>
          <div className="text-gray-800">
            <p className="font-bold text-lg">{data.customerName}</p>
            <p className="mt-2">{data.customerEmail}</p>
            <p className="mt-2 whitespace-pre-line">{data.customerAddress}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-sm">
                Description
              </th>
              <th className="text-right py-4 px-4 font-bold text-gray-700 uppercase text-sm">
                Billing Period
              </th>
              <th className="text-right py-4 px-4 font-bold text-gray-700 uppercase text-sm">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4">
                <p className="font-bold text-gray-900 text-lg">{data.planName} Subscription</p>
                <p className="text-gray-600 text-sm">{data.planDescription}</p>
              </td>
              <td className="text-right py-4 px-4 text-gray-700">
                {data.billingPeriod}
              </td>
              <td className="text-right py-4 px-4 font-semibold text-gray-900">
                ${data.amount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-80">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">${data.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="font-semibold text-gray-900">${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 border-t-2 border-gray-300">
            <span className="text-xl font-bold text-gray-900">Total Paid</span>
            <span className="text-2xl font-bold text-green-600">${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Payment Method</h3>
        <p className="text-gray-800 font-semibold">{data.paymentMethod}</p>
        <p className="text-sm text-gray-600 mt-2">
          Payment processed securely via Stripe on {data.date}
        </p>
      </div>

      {/* Important Notes */}
      <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-6 mb-12">
        <h3 className="font-bold text-gray-900 mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Your subscription will automatically renew at the end of the billing period.</li>
          <li>• To manage your subscription or update payment methods, visit your account dashboard.</li>
          <li>• For billing questions, contact us at mariannav920@gmail.com</li>
          <li>• 30-day money-back guarantee applies to all new subscriptions.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t-2 border-gray-200">
        <p className="text-gray-600 mb-2">
          Thank you for trusting us with your child's education! 💜
        </p>
        <p className="text-sm text-gray-500">
          © 2026 Mz. Marianna's Academy. All rights reserved.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Questions? Email us at{' '}
          <a href="mailto:mariannav920@gmail.com" className="text-purple-600 font-semibold">
            mariannav920@gmail.com
          </a>
        </p>
      </div>

      {/* Print-only footer */}
      <div className="print:block hidden mt-8 text-xs text-gray-400 text-center">
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
}
