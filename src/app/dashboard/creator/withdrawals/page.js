'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Withdrawals() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState([]);
  const [form, setForm] = useState({ withdrawalCredits: '', paymentSystem: 'Stripe', accountNumber: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      apiFetch(`/withdrawals/my/${session.user.email}`)
        .then(res => setWithdrawals(res))
        .catch(() => {});
    }
  }, [session?.user?.email]);

  const withdrawalAmount = form.withdrawalCredits ? Number(form.withdrawalCredits) / 20 : 0;
  const canWithdraw = Number(form.withdrawalCredits) >= 200 && Number(form.withdrawalCredits) <= (session?.user?.totalRaisedCredits || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canWithdraw) { toast.error('Invalid withdrawal amount'); return; }
    setLoading(true);
    try {
      await apiFetch('/withdrawals', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      toast.success('Withdrawal request submitted!');
      setForm({ withdrawalCredits: '', paymentSystem: 'Stripe', accountNumber: '' });
      const res = await apiFetch(`/withdrawals/my/${session?.user?.email}`);
      setWithdrawals(res);
    } catch (err) {
      toast.error(err?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdrawals</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Earnings</h2>
          <p className="text-3xl font-bold text-indigo-600">{session?.user?.totalRaisedCredits || 0}</p>
          <p className="text-sm text-gray-500">Total Raised Credits</p>
          <p className="text-2xl font-bold text-green-600 mt-2">${((session?.user?.totalRaisedCredits || 0) / 20).toFixed(2)}</p>
          <p className="text-sm text-gray-500">Withdrawal Amount (20 credits = $1)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits To Withdraw</label>
              <input type="number" value={form.withdrawalCredits} onChange={(e) => setForm({ ...form, withdrawalCredits: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Minimum 200 credits" />
              <p className="text-sm text-gray-500 mt-1">Withdrawal amount: ${withdrawalAmount.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment System</label>
              <select value={form.paymentSystem} onChange={(e) => setForm({ ...form, paymentSystem: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none">
                <option value="Stripe">Stripe</option>
                <option value="Bkash">Bkash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input type="text" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="Enter account number" />
            </div>
            {canWithdraw ? (
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                {loading ? 'Processing...' : 'Withdraw'}
              </button>
            ) : (
              <p className="text-center text-red-500 text-sm font-medium">Insufficient credit. Minimum 200 credits required.</p>
            )}
          </form>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-900 p-6 pb-0">Withdrawal History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map(w => (
                <tr key={w._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{w.withdrawalCredits}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">${w.withdrawalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.paymentSystem}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{w.accountNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${w.status === 'approved' ? 'bg-green-100 text-green-700' : w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{w.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(w.createdAt), 'MMM dd, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
