'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function SupporterPaymentHistory() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      apiFetch(`/payments/${session.user.email}`).then(res => setPayments(res.data)).catch(() => {});
    }
  }, [session?.user?.email]);

  const columns = [
    { key: 'packageName', label: 'Package' },
    { key: 'amount', label: 'Amount', render: (v) => <span className="font-medium">${v}</span> },
    { key: 'credits', label: 'Credits', render: (v) => <span className="font-medium text-indigo-600">{v}</span> },
    { key: 'status', label: 'Status', render: (v) => <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{v}</span> },
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>
      <ResponsiveTable columns={columns} data={payments} emptyMessage="No payment history yet" />
    </div>
  );
}
