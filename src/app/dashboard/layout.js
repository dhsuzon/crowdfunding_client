'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import NotificationPopover from '@/components/NotificationPopover';
import { HiLogout } from 'react-icons/hi';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
          <Link href="/" className="lg:hidden text-xl font-bold text-indigo-600">CFH</Link>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">{user.credits || 0} Credits</span>
            <NotificationPopover />
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}`} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="hidden sm:inline text-sm text-gray-700">{user.name}</span>
            <button onClick={logout} className="text-red-500 hover:text-red-700"><HiLogout size={20} /></button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
        <footer className="bg-white border-t px-6 py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CrowdFundHub. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
