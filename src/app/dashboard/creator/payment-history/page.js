'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function CreatorPaymentHistory() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      apiFetch(`/withdrawals/my/${session.user.email}`).then(res => setWithdrawals(res)).catch(() => {});
    }
  }, [session?.user?.email]);

  const columns = [
    { key: 'withdrawalAmount', label: 'Amount ($)', render: (v) => <span className="font-medium text-green-600">${v.toFixed(2)}</span> },
    { key: 'withdrawalCredits', label: 'Credits' },
    { key: 'paymentSystem', label: 'Payment System' },
    { key: 'accountNumber', label: 'Account' },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved' ? 'bg-green-100 text-green-700' : v === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>
      <ResponsiveTable columns={columns} data={withdrawals} emptyMessage="No payment history yet" />
    </div>
  );
}
