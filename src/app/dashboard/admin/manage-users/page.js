'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { Button } from '@heroui/react';
import ResponsiveTable from '@/components/ResponsiveTable';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch(`/users?page=${page}`);
      setUsers(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleRoleChange = async (id, role) => {
    try {
      await apiFetch(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete user');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'photo', label: 'Photo', render: (_, row) => <img src={row.photoURL || `https://ui-avatars.com/api/?name=${row.name}`} alt="" className="w-8 h-8 rounded-full object-cover" /> },
    { key: 'role', label: 'Role', render: (v, row) => (
      <select value={v} onChange={(e) => handleRoleChange(row._id, e.target.value)} className="px-2 py-1 border rounded text-sm outline-none">
        <option value="supporter">Supporter</option>
        <option value="creator">Creator</option>
        <option value="admin">Admin</option>
      </select>
    )},
    { key: 'credits', label: 'Credits', render: (v) => <span className="font-medium text-indigo-600">{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <Button onPress={() => handleDelete(row._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Remove</Button>
    )},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <ResponsiveTable columns={columns} data={users} emptyMessage="No users found" />
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
