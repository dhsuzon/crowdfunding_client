'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { format } from 'date-fns';

export default function MyContributions() {
  const { user } = useAuth();
  const [data, setData] = useState({ contributions: [], total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    axios.get(`/contributions/my?page=${data.page}&limit=10`)
      .then(res => setData(res.data))
      .catch(() => { });
  }, [data.page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Contributions</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.contributions.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{c.campaignTitle}</td>
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">{c.contributionAmount} Credits</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.creatorName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(c.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 p-4">
            <button disabled={data.page <= 1} onClick={() => setData(prev => ({ ...prev, page: prev.page - 1 }))} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">Prev</button>
            <span className="text-sm text-gray-600">Page {data.page} of {data.totalPages}</span>
            <button disabled={data.page >= data.totalPages} onClick={() => setData(prev => ({ ...prev, page: prev.page + 1 }))} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
