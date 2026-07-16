'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { Button, Card, CardContent } from '@heroui/react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/users');
      setUsers(res);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4"><img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.name}`} alt="" className="w-8 h-8 rounded-full object-cover" /></td>
                    <td className="px-6 py-4">
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="px-2 py-1 border rounded text-sm outline-none">
                        <option value="supporter">Supporter</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">{u.credits}</td>
                    <td className="px-6 py-4">
                      <Button onPress={() => handleDelete(u._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
