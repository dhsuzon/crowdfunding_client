'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { format } from 'date-fns';

export default function SupporterPaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get(`/payments/${user?.email}`).then(res => setPayments(res.data)).catch(() => { });
  }, [user?.email]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{p.packageName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${p.amount}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 font-medium">{p.credits}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{p.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(p.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No payment history yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
