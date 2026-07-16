'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

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

  const columns = [
    { key: 'title', label: 'Title', render: (v) => <span className="truncate block max-w-[200px]">{v}</span> },
    { key: 'creatorName', label: 'Creator' },
    { key: 'category', label: 'Category' },
    { key: 'fundingGoal', label: 'Goal', render: (v) => <span className="font-medium">${v}</span> },
    { key: 'amountRaised', label: 'Raised', render: (v) => <span className="text-indigo-600">${v}</span> },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved' ? 'bg-green-100 text-green-700' : v === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v}</span>
    )},
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex space-x-2">
        {row.status === 'pending' && <>
          <Button onPress={() => handleApprove(row._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">Approve</Button>
          <Button onPress={() => handleReject(row._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Reject</Button>
        </>}
        <Button onPress={() => handleDelete(row._id)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs">Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Campaigns</h1>
      <ResponsiveTable columns={columns} data={campaigns} emptyMessage="No campaigns found" />
    </div>
  );
}
