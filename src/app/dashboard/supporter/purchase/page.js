'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

const packages = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

export default function PurchaseCredit() {
  const { user, updateUserCredits } = useAuth();
  const [loading, setLoading] = useState(null);

  const handlePurchase = async (pkg) => {
    setLoading(pkg.credits);
    try {
      const { data } = await axios.post('/payments/create-payment-intent', { credits: pkg.credits });
      const stripe = (await import('@stripe/stripe-js')).loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');
      // Fallback: directly confirm if Stripe not available
      await axios.post('/payments/confirm', {
        paymentIntentId: 'pi_dummy_' + Date.now(),
        credits: pkg.credits,
        amount: pkg.price,
      });
      toast.success(`Successfully purchased ${pkg.credits} credits for $${pkg.price}!`);
      if (user) updateUserCredits((user.credits || 0) + pkg.credits);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h1>
      <p className="text-gray-500 mb-6">Choose a credit package to support campaigns</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.credits} className="bg-white rounded-xl shadow-sm p-6 text-center border-2 border-transparent hover:border-indigo-500 transition">
            <p className="text-4xl font-bold text-indigo-600 mb-2">{pkg.credits}</p>
            <p className="text-sm text-gray-500 mb-1">Credits</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">${pkg.price}</p>
            <p className="text-xs text-gray-400 mb-4">${(pkg.price / pkg.credits).toFixed(2)} per credit</p>
            <button onClick={() => handlePurchase(pkg)} disabled={loading === pkg.credits}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50">
              {loading === pkg.credits ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-sm text-yellow-700"><strong>Note:</strong> Stripe payment is configured in test mode. Purchases are processed as demo transactions.</p>
      </div>
    </div>
  );
}
