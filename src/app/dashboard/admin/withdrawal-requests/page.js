'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button, Card, CardContent } from '@heroui/react';

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState([]);

  const fetchData = async () => {
    try {
      const res = await apiFetch('/withdrawals/pending');
      setWithdrawals(res);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      await apiFetch(`/withdrawals/${id}/approve`, { method: 'PATCH' });
      toast.success('Withdrawal approved');
      fetchData();
    } catch (err) {
      toast.error(err?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Requests</h1>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map(w => (
                  <tr key={w._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{w.creatorName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.creatorEmail}</td>
                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">{w.withdrawalCredits}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">${w.withdrawalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.paymentSystem}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.accountNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(w.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">
                      <Button onPress={() => handleApprove(w._id)} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium">Payment Success</Button>
                    </td>
                  </tr>
                ))}
                {withdrawals.length === 0 && <tr><td colSpan="8" className="px-6 py-8 text-center text-gray-500">No pending withdrawal requests</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
