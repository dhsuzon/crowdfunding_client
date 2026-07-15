'use client';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { HiUserGroup, HiUserAdd, HiCash, HiCreditCard } from 'react-icons/hi';

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('/users').then(res => setUsers(res.data)).catch(() => { });
    axios.get('/payments/admin/all').then(res => setPayments(res.data)).catch(() => { });
  }, []);

  const supporters = users.filter(u => u.role === 'supporter').length;
  const creators = users.filter(u => u.role === 'creator').length;
  const totalCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);
  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Supporters</p>
              <p className="text-3xl font-bold text-gray-900">{supporters}</p>
            </div>
            <HiUserGroup className="text-blue-500 text-4xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Creators</p>
              <p className="text-3xl font-bold text-gray-900">{creators}</p>
            </div>
            <HiUserAdd className="text-purple-500 text-4xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Credits</p>
              <p className="text-3xl font-bold text-green-600">{totalCredits}</p>
            </div>
            <HiCash className="text-green-500 text-4xl" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payments Processed</p>
              <p className="text-3xl font-bold text-indigo-600">${totalPayments.toFixed(2)}</p>
            </div>
            <HiCreditCard className="text-indigo-500 text-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
