'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function TopCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/campaigns/top-funded')
      .then(res => setCampaigns(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div></div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Top Funded Campaigns</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Discover the most successful campaigns that have raised the highest amount of credits.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
                {campaign.imageURL ? (
                  <img src={campaign.imageURL} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <span className="text-4xl">🎯</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{campaign.title}</h3>
                <p className="text-sm text-gray-500 mb-2">by {campaign.creatorName}</p>
                <p className="text-indigo-600 font-bold text-xl">${campaign.amountRaised.toLocaleString()} raised</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round((campaign.amountRaised / campaign.fundingGoal) * 100)}% of ${campaign.fundingGoal.toLocaleString()} goal</p>
                <Link href={`/campaigns/${campaign._id}`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
