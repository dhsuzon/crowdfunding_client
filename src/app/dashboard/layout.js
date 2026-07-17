'use client';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import NotificationPopover from '@/components/NotificationPopover';
import { HiLogout, HiMenu } from 'react-icons/hi';
import { signOut } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const handleLogout = () => { localStorage.removeItem('better-auth-token'); signOut(); router.push('/login'); };

  useEffect(() => {
    if (session?.user) {
      apiFetch('/users/me').then(u => setCredits(u.credits)).catch(() => {});
    }
  }, [session?.user]);

  useEffect(() => {
    if (!isPending && !session) router.push('/login');
  }, [session, isPending, router]);

  if (isPending || !session) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between lg:justify-end">
          <div className="flex items-center space-x-3 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900"><HiMenu size={24} /></button>
            <Link href="/" className="text-xl font-bold text-indigo-600">CFH</Link>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full font-medium">{credits !== null ? credits : session.user?.credits || 0} Credits</span>
            <NotificationPopover />
            <img src={session.user?.photoURL || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt="" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover" />
            <span className="hidden md:inline text-sm text-gray-700">{session.user?.name}</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700"><HiLogout size={18} className="md:size-5" /></button>
          </div>
        </header>
        <main className="flex-1 p-3 md:p-8 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
