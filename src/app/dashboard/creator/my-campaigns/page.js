'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', story: '', rewardInfo: '' });

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch('/campaigns/my');
      setCampaigns(res);
    } catch (err) {}
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Campaigns</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raised</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate">{c.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.category}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 font-medium">${c.fundingGoal}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">${c.amountRaised}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(c.deadline), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => startEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No campaigns yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditing(null)}>
          <div className="bg-white p-6 rounded-xl max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Update Campaign</h3>
            <div className="space-y-3">
              <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Title" />
              <textarea rows={4} value={editForm.story} onChange={(e) => setEditForm({ ...editForm, story: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Story" />
              <textarea rows={2} value={editForm.rewardInfo} onChange={(e) => setEditForm({ ...editForm, rewardInfo: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Reward Info" />
            </div>
            <div className="flex space-x-3 mt-4">
              <button onClick={() => handleUpdate(editing)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Save</button>
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
