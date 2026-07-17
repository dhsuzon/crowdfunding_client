'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'react-toastify';
import { Card } from '@heroui/react';
import { HiUserGroup, HiUserAdd, HiCash, HiCreditCard, HiClock, HiCheckCircle, HiXCircle, HiFlag } from 'react-icons/hi';

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [reportedTotal, setReportedTotal] = useState(0);

  useEffect(() => {
    apiFetch('/users?limit=10000').then(res => setUsers(res.data)).catch(() => toast.error('Failed to load users'));
    apiFetch('/payments/admin/all?limit=10000').then(res => setPayments(res.data)).catch(() => toast.error('Failed to load payments'));
    apiFetch('/campaigns/all?limit=10000').then(res => setCampaigns(res.data)).catch(() => toast.error('Failed to load campaigns'));
    apiFetch('/campaigns/reported?page=1').then(res => setReportedTotal(res.total)).catch(() => toast.error('Failed to load reports'));
  }, []);

  const supporters = users.filter(u => u.role === 'supporter').length;
  const creators = users.filter(u => u.role === 'creator').length;
  const totalCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);
  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
  const approvedCampaigns = campaigns.filter(c => c.status === 'approved').length;
  const rejectedCampaigns = campaigns.filter(c => c.status === 'rejected').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Supporters</p>
                <p className="text-3xl font-bold text-gray-900">{supporters}</p>
              </div>
              <HiUserGroup className="text-blue-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-purple-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Creators</p>
                <p className="text-3xl font-bold text-gray-900">{creators}</p>
              </div>
              <HiUserAdd className="text-purple-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-green-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Credits</p>
                <p className="text-3xl font-bold text-green-600">{totalCredits}</p>
              </div>
              <HiCash className="text-green-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-indigo-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Payments Processed</p>
                <p className="text-3xl font-bold text-indigo-600">${totalPayments.toFixed(2)}</p>
              </div>
              <HiCreditCard className="text-indigo-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-yellow-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Campaigns</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCampaigns}</p>
              </div>
              <HiClock className="text-yellow-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-green-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved Campaigns</p>
                <p className="text-3xl font-bold text-green-600">{approvedCampaigns}</p>
              </div>
              <HiCheckCircle className="text-green-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-red-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected Campaigns</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCampaigns}</p>
              </div>
              <HiXCircle className="text-red-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
        <Card className="border-l-4 border-orange-500 shadow-sm">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reported Campaigns</p>
                <p className="text-3xl font-bold text-orange-600">{reportedTotal}</p>
              </div>
              <HiFlag className="text-orange-500 text-4xl" />
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
