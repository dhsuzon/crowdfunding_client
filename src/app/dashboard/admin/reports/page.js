'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export default function Reports() {
  const [reported, setReported] = useState([]);

  const fetchData = async () => {
    try {
      const res = await apiFetch('/campaigns/reported');
      setReported(res);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleSuspend = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}/reject`, { method: 'PATCH' });
      toast.success('Campaign suspended');
      fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this reported campaign?')) return;
    try {
      await apiFetch(`/campaigns/${id}/admin-delete`, { method: 'DELETE' });
      toast.success('Campaign deleted');
      fetchData();
    } catch (err) { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reported.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{c.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.reportedBy}</td>
                  <td className="px-6 py-4 text-sm text-red-600 max-w-[200px] truncate">{c.reportReason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(c.createdAt), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleSuspend(c._id)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">Suspend</button>
                    <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {reported.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No reported campaigns</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
