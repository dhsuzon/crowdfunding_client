'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    apiFetch(`/campaigns?${params}`)
      .then(res => setCampaigns(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Campaigns</h1>
          <p className="text-gray-500 mb-8">Discover innovative projects and causes that need your support.</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns..." className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Community">Community</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Environment">Environment</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div></div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No campaigns found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map(c => (
                <div key={c._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                    {c.imageURL ? <img src={c.imageURL} alt={c.title} className="w-full h-full object-cover" /> : <span className="text-3xl">🎯</span>}
                  </div>
                  <div className="p-5">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{c.category}</span>
                    <h3 className="font-semibold text-gray-900 mt-2 mb-1">{c.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">by {c.creatorName}</p>
                    <p className="text-sm text-gray-500">Deadline: {format(new Date(c.deadline), 'MMM dd, yyyy')}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-indigo-600 font-bold">${c.amountRaised} raised</span>
                      <span className="text-sm text-gray-500">Goal: ${c.fundingGoal}</span>
                    </div>
                    <Link href={`/campaigns/${c._id}`} className="mt-3 block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
