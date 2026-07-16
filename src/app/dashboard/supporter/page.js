'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { Card, CardContent } from '@heroui/react';
import { HiCash, HiClock, HiCheckCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function SupporterHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalContributions: 0, pendingContributions: 0, totalAmountContributed: 0 });
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    Promise.all([
      apiFetch('/contributions/my?limit=1000'),
      apiFetch('/users/me'),
    ])
      .then(([contribRes, userRes]) => {
        const all = contribRes.contributions || [];
        setStats({
          totalContributions: contribRes.total || all.length,
          pendingContributions: all.filter(c => c.status === 'pending').length,
          totalAmountContributed: all.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.contributionAmount, 0),
        });
        setUserProfile(userRes);
      })
      .catch(() => toast.error('Failed to load dashboard data'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Supporter Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-indigo-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Contributions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalContributions}</p>
              </div>
              <HiCash className="text-indigo-500 text-4xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-yellow-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Contributions</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingContributions}</p>
              </div>
              <HiClock className="text-yellow-500 text-4xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-green-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Amount Contributed</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalAmountContributed} Credits</p>
              </div>
              <HiCheckCircle className="text-green-500 text-4xl" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Credits</h2>
          <p className="text-4xl font-bold text-indigo-600">{userProfile?.credits || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Available credits to contribute</p>
        </CardContent>
      </Card>
    </div>
  );
}
