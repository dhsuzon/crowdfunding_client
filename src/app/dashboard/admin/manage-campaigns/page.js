'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  const fetchCampaigns = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        apiFetch('/campaigns/pending'),
        apiFetch('/campaigns/all')
      ]);
      setCampaigns([...pendingRes, ...allRes.filter(c => c.status !== 'pending')]);
    } catch (err) {}
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}/approve`, { method: 'PATCH' });
      toast.success('Campaign approved');
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}/reject`, { method: 'PATCH' });
      toast.success('Campaign rejected');
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign? Supporters will be refunded.')) return;
    try {
      await apiFetch(`/campaigns/${id}/admin-delete`, { method: 'DELETE' });
      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch (err) { toast.error(err?.message || 'Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Campaigns</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raised</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate">{c.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.creatorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${c.fundingGoal}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600">${c.amountRaised}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    {c.status === 'pending' && <>
                      <button onClick={() => handleApprove(c._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">Approve</button>
                      <button onClick={() => handleReject(c._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Reject</button>
                    </>}
                    <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
