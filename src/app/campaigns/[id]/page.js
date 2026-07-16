'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@heroui/react';

export default function CampaignDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);

  useEffect(() => {
    apiFetch(`/campaigns/${id}`)
      .then(res => setCampaign(res))
      .catch(() => toast.error('Failed to load campaign'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!session) { toast.error('Please login to contribute'); return; }
    if (!amount || Number(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    if (Number(amount) < campaign.minimumContribution) { toast.error(`Minimum contribution is ${campaign.minimumContribution} credits`); return; }
    setContributing(true);
    try {
      await apiFetch('/contributions', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: campaign._id, campaignTitle: campaign.title,
          contributionAmount: Number(amount), message,
          creatorName: campaign.creatorName, creatorEmail: campaign.creatorEmail
        }),
      });
      toast.success('Contribution submitted! Pending approval.');
      setAmount('');
      setMessage('');
      router.push('/dashboard/supporter/contributions');
    } catch (err) {
      toast.error(err?.message || 'Contribution failed');
    } finally {
      setContributing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-600"></div></div>;
  if (!campaign) return <div className="min-h-screen flex items-center justify-center text-gray-500">Campaign not found</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              {campaign.imageURL ? <img src={campaign.imageURL} alt={campaign.title} className="w-full h-full object-cover" /> : <span className="text-6xl">🎯</span>}
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">{campaign.category}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${campaign.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{campaign.status}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <p className="text-gray-500 mb-2">by {campaign.creatorName}</p>
              <p className="text-gray-700 mb-6 leading-relaxed">{campaign.story}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gray-50 p-4 text-center shadow-none">
                  <p className="text-2xl font-bold text-indigo-600">${campaign.amountRaised}</p>
                  <p className="text-sm text-gray-500">Raised</p>
                </Card>
                <Card className="bg-gray-50 p-4 text-center shadow-none">
                  <p className="text-2xl font-bold text-gray-900">${campaign.fundingGoal}</p>
                  <p className="text-sm text-gray-500">Goal</p>
                </Card>
                <Card className="bg-gray-50 p-4 text-center shadow-none">
                  <p className="text-2xl font-bold text-gray-900">{campaign.minimumContribution}</p>
                  <p className="text-sm text-gray-500">Min Contribution</p>
                </Card>
                <Card className="bg-gray-50 p-4 text-center shadow-none">
                  <p className="text-sm font-bold text-gray-900">{format(new Date(campaign.deadline), 'MMM dd, yyyy')}</p>
                  <p className="text-sm text-gray-500">Deadline</p>
                </Card>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100)}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 mb-6">{Math.round((campaign.amountRaised / campaign.fundingGoal) * 100)}% funded</p>
              {campaign.rewardInfo && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-yellow-800 mb-1">Rewards</h3>
                  <p className="text-yellow-700 text-sm">{campaign.rewardInfo}</p>
                </div>
              )}
              {campaign.status === 'approved' && new Date(campaign.deadline) > new Date() && (
                <form onSubmit={handleContribute} className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Make a Contribution</h3>
                  <div className="space-y-4 max-w-md">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Contribution amount (min ${campaign.minimumContribution})`}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave a message (optional)" rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <Button type="submit" isDisabled={contributing} className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                      {contributing ? 'Processing...' : 'Contribute Credits'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
