'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button, Card, CardContent } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', story: '', rewardInfo: '' });

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch('/campaigns/my');
      setCampaigns(res);
    } catch (err) {
      toast.error('Failed to load campaigns');
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign? Approved supporters will be refunded.')) return;
    try {
      await apiFetch(`/campaigns/${id}`, { method: 'DELETE' });
      toast.success('Campaign deleted. Supporters refunded.');
      fetchCampaigns();
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      toast.success('Campaign updated');
      setEditing(null);
      fetchCampaigns();
    } catch (err) {
      toast.error(err?.message || 'Update failed');
    }
  };

  const startEdit = (campaign) => {
    setEditing(campaign._id);
    setEditForm({ title: campaign.title, story: campaign.story, rewardInfo: campaign.rewardInfo || '' });
  };

  const columns = [
    { key: 'title', label: 'Title', render: (v) => <span className="truncate block max-w-[200px]">{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'fundingGoal', label: 'Goal', render: (v) => <span className="font-medium text-indigo-600">${v}</span> },
    { key: 'amountRaised', label: 'Raised', render: (v) => <span className="font-medium text-green-600">${v}</span> },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved' ? 'bg-green-100 text-green-700' : v === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v}</span>
    )},
    { key: 'deadline', label: 'Deadline', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex space-x-2">
        <Button onPress={() => startEdit(row)} className="p-2 text-blue-600 bg-transparent min-w-0 h-auto"><FaEdit /></Button>
        <Button onPress={() => handleDelete(row._id)} className="p-2 text-red-600 bg-transparent min-w-0 h-auto"><FaTrash /></Button>
      </div>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Campaigns</h1>
      <ResponsiveTable columns={columns} data={campaigns} emptyMessage="No campaigns yet" />
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditing(null)}>
          <Card className="max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Update Campaign</h3>
              <div className="space-y-3">
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Title" />
                <textarea rows={4} value={editForm.story} onChange={(e) => setEditForm({ ...editForm, story: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Story" />
                <textarea rows={2} value={editForm.rewardInfo} onChange={(e) => setEditForm({ ...editForm, rewardInfo: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Reward Info" />
              </div>
              <div className="flex space-x-3 mt-4">
                <Button onPress={() => handleUpdate(editing)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Save</Button>
                <Button onPress={() => setEditing(null)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
