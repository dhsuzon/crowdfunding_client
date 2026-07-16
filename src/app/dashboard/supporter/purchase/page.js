'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Card, CardContent } from '@heroui/react';

const packages = [
  { credits: 50, price: 6 },
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 500, price: 40 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
  { credits: 2000, price: 140 },
];

export default function PurchaseCredit() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const credits = searchParams.get('credits');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && credits && sessionId) {
      handled.current = true;
      window.history.replaceState(null, '', '/dashboard/supporter/purchase');
      fetch('/api/stripe/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: Number(credits), sessionId }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && !data.alreadyProcessed) toast.success(`${credits} credits added to your account!`);
          else if (data.alreadyProcessed) toast.info('Payment already processed');
          else toast.error(data.error || 'Confirmation failed');
        })
        .catch(() => toast.error('Failed to confirm payment'));
    }

    if (canceled === 'true') {
      handled.current = true;
      toast.info('Payment was canceled');
      router.replace('/dashboard/supporter/purchase');
    }
  }, []);

  const handlePurchase = async (pkg) => {
    setLoading(pkg.credits);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: pkg.credits, price: pkg.price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (err) {
      toast.error('Payment failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h1>
      <p className="text-gray-500 mb-6">Choose a credit package to support campaigns</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.credits} className="text-center border-2 border-transparent hover:border-indigo-500 transition">
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-indigo-600 mb-2">{pkg.credits}</p>
              <p className="text-sm text-gray-500 mb-1">Credits</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">${pkg.price}</p>
              <p className="text-xs text-gray-400 mb-4">${(pkg.price / pkg.credits).toFixed(2)} per credit</p>
              <Button onPress={() => handlePurchase(pkg)} isDisabled={loading === pkg.credits} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                {loading === pkg.credits ? 'Processing...' : 'Purchase'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
