'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { HiCash, HiCheckCircle, HiClock, HiEye } from 'react-icons/hi';

export default function CreatorHome() {
  const { data: session } = useSession();
  const [campaigns, setCampaigns] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [campRes, contribRes] = await Promise.all([
        apiFetch('/campaigns/my'),
        apiFetch(`/contributions/pending/${session?.user?.email}`)
      ]);
      setCampaigns(campRes);
      setPendingContributions(contribRes);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session?.user) fetchData(); }, [session?.user]);

  const activeCampaigns = campaigns.filter(c => new Date(c.deadline) > new Date()).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + c.amountRaised, 0);

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
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <HiCash className="text-indigo-500 text-4xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-3xl font-bold text-green-600">{activeCampaigns}</p>
            </div>
            <HiCheckCircle className="text-green-500 text-4xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-3xl font-bold text-purple-600">{totalRaised} Credits</p>
            </div>
            <HiCash className="text-purple-500 text-4xl" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Contributions To Review ({pendingContributions.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supporter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingContributions.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">{c.supporterName}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{c.campaignTitle}</td>
                  <td className="px-4 py-4 text-sm font-medium text-indigo-600">{c.contributionAmount} Credits</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{format(new Date(c.createdAt), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-4 flex space-x-2">
                    <button onClick={() => setSelectedContribution(c)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><HiEye size={18} /></button>
                    <button onClick={() => handleApprove(c._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">Approve</button>
                    <button onClick={() => handleReject(c._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Reject</button>
                  </td>
                </tr>
              ))}
              {pendingContributions.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No pending contributions</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
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
            <button onClick={() => setSelectedContribution(null)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
