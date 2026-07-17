'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const res = await apiFetch(`/withdrawals/pending?page=${page}`);
      setWithdrawals(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/withdrawals/${id}/approve`, { method: 'PATCH' });
      toast.success('Withdrawal approved');
      fetchData();
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  const columns = [
    { key: 'creatorName', label: 'Creator' },
    { key: 'creatorEmail', label: 'Email' },
    { key: 'withdrawalCredits', label: 'Credits', render: (v) => <span className="font-medium text-indigo-600">{v}</span> },
    { key: 'withdrawalAmount', label: 'Amount', render: (v) => <span className="font-medium text-green-600">${v.toFixed(2)}</span> },
    { key: 'paymentSystem', label: 'Payment' },
    { key: 'accountNumber', label: 'Account' },
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <Button onPress={() => handleApprove(row._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium">Payment Success</Button>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Requests</h1>
      <ResponsiveTable columns={columns} data={withdrawals} emptyMessage="No pending withdrawal requests" emptyColSpan={8}
        totalPages={totalPages} page={page} onPageChange={setPage} totalItems={total} />
    </div>
  );
}
