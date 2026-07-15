'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';

export default function AddCampaign() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', story: '', category: 'Technology', fundingGoal: '', minimumContribution: '', deadline: '', rewardInfo: '', imageURL: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.story || !form.fundingGoal || !form.minimumContribution || !form.deadline) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/campaigns', {
        method: 'POST',
        body: JSON.stringify({ ...form, fundingGoal: Number(form.fundingGoal), minimumContribution: Number(form.minimumContribution) }),
      });
      toast.success('Campaign created! Waiting for admin approval.');
      router.push('/dashboard/creator/my-campaigns');
    } catch (err) {
      toast.error(err?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Campaign</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Help us build a solar-powered water pump" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Story *</label>
          <textarea rows={5} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Tell your story in detail..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Community">Community</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Environment">Environment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal (credits) *</label>
            <input type="number" value={form.fundingGoal} onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Contribution *</label>
            <input type="number" value={form.minimumContribution} onChange={(e) => setForm({ ...form, minimumContribution: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reward Info</label>
            <textarea rows={2} value={form.rewardInfo} onChange={(e) => setForm({ ...form, rewardInfo: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What supporters receive for pledging" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image URL</label>
            <input type="url" value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://example.com/campaign-image.jpg" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50">
          {loading ? 'Creating Campaign...' : 'Add Campaign'}
        </button>
      </form>
    </div>
  );
}
