'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import { Button } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function MyContributions() {
  const { data: session } = useSession();
  const [data, setData] = useState({ contributions: [], total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    apiFetch(`/contributions/my?page=${data.page}&limit=8`)
      .then(res => setData(res))
      .catch(() => {});
  }, [data.page]);

  const columns = [
    { key: 'campaignTitle', label: 'Campaign' },
    { key: 'contributionAmount', label: 'Amount', render: (v) => <span className="font-medium text-indigo-600">{v} Credits</span> },
    { key: 'creatorName', label: 'Creator' },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved' ? 'bg-green-100 text-green-700' : v === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Contributions</h1>
      <ResponsiveTable columns={columns} data={data.contributions} emptyMessage="No contributions yet"
        totalPages={data.totalPages} page={data.page} onPageChange={(p) => setData(prev => ({ ...prev, page: p }))} totalItems={data.total} />
    </div>
  );
}
