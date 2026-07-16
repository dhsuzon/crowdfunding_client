'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX, HiBell, HiLogout } from 'react-icons/hi';
import { apiFetch } from '@/lib/api';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    if (session?.user) {
      apiFetch('/users/me').then(u => setCredits(u.credits)).catch(() => {});
    }
  }, [session?.user]);

  const displayCredits = credits !== null ? credits : session?.user?.credits || 0;

  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDashboard ? 'hidden' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            CrowdFundHub
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
            <Link href="/campaigns" className="text-gray-700 hover:text-indigo-600 transition">Explore Campaigns</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition">Dashboard</Link>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {displayCredits} Credits
                </span>
                <div className="relative">
                  <button className="text-gray-600 hover:text-indigo-600">
                    <HiBell size={22} />
                  </button>
                </div>
                <div className="relative">
                  <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2">
                    <img src={session.user?.photoURL || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm text-gray-700">{session.user?.name}</span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border" onClick={() => setShowDropdown(false)}>
                      <button onClick={() => { localStorage.removeItem('better-auth-token'); signOut(); router.push('/login'); }} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <HiLogout className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition">Login</Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Register</Link>
              </>
            )}
            <a href="https://github.com/dhsuzon/crowdfunding_client" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 text-sm border px-3 py-1 rounded-full">
              Join as Developer
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t pb-4 px-4">
          <Link href="/" className="block py-2 text-gray-700">Home</Link>
          <Link href="/campaigns" className="block py-2 text-gray-700">Explore Campaigns</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block py-2 text-gray-700">Dashboard</Link>
              <span className="block py-2 text-sm text-green-700">{displayCredits} Credits</span>
              <button onClick={() => { localStorage.removeItem('better-auth-token'); signOut(); router.push('/login'); }} className="block py-2 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-700">Login</Link>
              <Link href="/register" className="block py-2 text-indigo-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
