'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { format } from 'date-fns';
import { Card, CardContent } from '@heroui/react';

export default function CreatorPaymentHistory() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      apiFetch(`/withdrawals/my/${session.user.email}`).then(res => setWithdrawals(res)).catch(() => {});
    }
  }, [session?.user?.email]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map(w => (
                  <tr key={w._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-green-600">${w.withdrawalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{w.withdrawalCredits}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.paymentSystem}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{w.accountNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.status === 'approved' ? 'bg-green-100 text-green-700' : w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{w.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(w.createdAt), 'MMM dd, yyyy')}</td>
                  </tr>
                ))}
                {withdrawals.length === 0 && <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No payment history yet</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
