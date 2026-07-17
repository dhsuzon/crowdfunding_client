'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Button, Card } from '@heroui/react';
import PaginationBar from '@/components/PaginationBar';

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    params.set('page', page);
    apiFetch(`/campaigns?${params}`)
      .then(res => { setCampaigns(res.data); setTotalPages(res.totalPages); setTotal(res.total); })
      .catch(() => toast.error('Failed to load campaigns'))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Explore Campaigns</h1>
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
            <Card key={c._id} className="overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                {c.imageURL ? <img src={c.imageURL} alt={c.title} className="w-full h-full object-cover" /> : <span className="text-3xl">🎯</span>}
              </div>
              <Card.Content className="p-5">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{c.category}</span>
                <h3 className="font-semibold text-gray-900 mt-2 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-2">by {c.creatorName}</p>
                <p className="text-sm text-gray-500">Deadline: {format(new Date(c.deadline), 'MMM dd, yyyy')}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-indigo-600 font-bold">${c.amountRaised} raised</span>
                  <span className="text-sm text-gray-500">Goal: ${c.fundingGoal}</span>
                </div>
                <Link href={`/campaigns/${c._id}`} className="mt-3 block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm">View Details</Link>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
      <PaginationBar total={totalPages} page={page} onChange={setPage} totalItems={total} />
    </div>
  );
}
