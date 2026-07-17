'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button, Card } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';
import { HiCash, HiCheckCircle, HiEye, HiCurrencyDollar, HiBadgeCheck } from 'react-icons/hi';

export default function CreatorHome() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [userRes, campRes, contribRes, withdrawRes] = await Promise.all([
        apiFetch('/users/me'),
        apiFetch('/campaigns/my?limit=10000'),
        apiFetch(`/contributions/pending/${session?.user?.email}?limit=10000`),
        apiFetch(`/withdrawals/my/${session?.user?.email}?limit=10000`)
      ]);
      setUserData(userRes);
      setCampaigns(campRes.data);
      setPendingContributions(contribRes.data);
      setWithdrawals(withdrawRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session?.user) fetchData(); }, [session?.user]);

  const activeCampaigns = campaigns.filter(c => new Date(c.deadline) > new Date()).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + c.amountRaised, 0);
  const netRaisedCredits = userData?.totalRaisedCredits || 0;
  const withdrawalAmount = (netRaisedCredits / 20).toFixed(2);
  const paymentTotal = withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + (w.withdrawalAmount || 0), 0)
    .toFixed(2);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/contributions/${id}/approve`, { method: 'PATCH' });
      toast.success('Contribution approved!');
      fetchData();
    } catch (err) {
      toast.error(err?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiFetch(`/contributions/${id}/reject`, { method: 'PATCH' });
      toast.success('Contribution rejected. Refunded.');
      fetchData();
    } catch (err) {
      toast.error(err?.message || 'Failed to reject');
    }
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Creator Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-indigo-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
              <HiCash className="text-indigo-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-green-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Campaigns</p>
                <p className="text-3xl font-bold text-green-600">{activeCampaigns}</p>
              </div>
              <HiCheckCircle className="text-green-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-purple-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-3xl font-bold text-purple-600">{totalRaised} Credits</p>
              </div>
              <HiCash className="text-purple-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-orange-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Raised Credits</p>
                <p className="text-3xl font-bold text-orange-600">{netRaisedCredits}</p>
              </div>
              <HiCash className="text-orange-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-teal-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Withdrawal Amount ($)</p>
                <p className="text-3xl font-bold text-teal-600">${withdrawalAmount}</p>
              </div>
              <HiCurrencyDollar className="text-teal-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-rose-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Payment Total ($)</p>
                <p className="text-3xl font-bold text-rose-600">${paymentTotal}</p>
              </div>
              <HiBadgeCheck className="text-rose-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
      </div>
      <Card className="shadow-sm mb-8">
        <Card.Content className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contributions To Review ({pendingContributions.length})</h2>
          {(() => {
            const contribColumns = [
              { key: 'supporterName', label: 'Supporter' },
              { key: 'campaignTitle', label: 'Campaign' },
              { key: 'contributionAmount', label: 'Amount', render: (v) => <span className="font-medium text-indigo-600">{v} Credits</span> },
              { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
              { key: 'actions', label: 'Actions', render: (_, row) => (
                <div className="flex space-x-2">
                  <Button onPress={() => setSelectedContribution(row)} className="p-1 text-blue-600 bg-transparent min-w-0 h-auto"><HiEye size={18} /></Button>
                  <Button onPress={() => handleApprove(row._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">Approve</Button>
                  <Button onPress={() => handleReject(row._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Reject</Button>
                </div>
              )},
            ];
            return <ResponsiveTable columns={contribColumns} data={pendingContributions} emptyMessage="No pending contributions" />;
          })()}
        </Card.Content>
      </Card>
      {selectedContribution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedContribution(null)}>
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Contribution Details</h3>
            <p className="text-sm text-gray-500 mb-1"><strong>Supporter:</strong> {selectedContribution.supporterName}</p>
            <p className="text-sm text-gray-500 mb-1"><strong>Email:</strong> {selectedContribution.supporterEmail}</p>
            <p className="text-sm text-gray-500 mb-1"><strong>Campaign:</strong> {selectedContribution.campaignTitle}</p>
            <p className="text-sm text-gray-500 mb-1"><strong>Amount:</strong> {selectedContribution.contributionAmount} Credits</p>
            {selectedContribution.message && <p className="text-sm text-gray-500 mb-1"><strong>Message:</strong> {selectedContribution.message}</p>}
            <p className="text-sm text-gray-500 mb-4"><strong>Date:</strong> {format(new Date(selectedContribution.createdAt), 'MMM dd, yyyy h:mm a')}</p>
            <Button onPress={() => setSelectedContribution(null)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
