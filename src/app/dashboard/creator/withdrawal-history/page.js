'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import { Button, Card } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';
import Link from 'next/link';

export default function WithdrawalHistory() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (session?.user?.email) {
      apiFetch(`/withdrawals/my/${session.user.email}?page=${page}`)
        .then(res => { setWithdrawals(res.data); setTotalPages(res.totalPages); })
        .catch(() => {});
    }
  }, [session?.user?.email, page]);

  const columns = [
    { key: 'withdrawalCredits', label: 'Credits' },
    { key: 'withdrawalAmount', label: 'Amount ($)', render: (v) => <span className="font-medium text-green-600">${v.toFixed(2)}</span> },
    { key: 'paymentSystem', label: 'Payment' },
    { key: 'accountNumber', label: 'Account' },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved' ? 'bg-green-100 text-green-700' : v === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal History</h1>
        <Link href="/dashboard/creator/withdrawals" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">Request Withdrawal</Link>
      </div>
      <ResponsiveTable columns={columns} data={withdrawals} emptyMessage="No withdrawal history yet" />
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm">Prev</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
