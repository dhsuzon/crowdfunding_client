'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Button } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function Reports() {
  const [reported, setReported] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const res = await apiFetch(`/campaigns/reported?page=${page}`);
      setReported(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [page]);

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

  const columns = [
    { key: 'title', label: 'Campaign' },
    { key: 'reportedBy', label: 'Reported By' },
    { key: 'reportReason', label: 'Reason', render: (v) => <span className="text-red-600 truncate block max-w-[200px]">{v}</span> },
    { key: 'createdAt', label: 'Date', render: (v) => format(new Date(v), 'MMM dd, yyyy') },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex space-x-2">
        <Button onPress={() => handleSuspend(row._id)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">Suspend</Button>
        <Button onPress={() => handleDelete(row._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      <ResponsiveTable columns={columns} data={reported} emptyMessage="No reported campaigns"
        totalPages={totalPages} page={page} onPageChange={setPage} totalItems={total} />
    </div>
  );
}
