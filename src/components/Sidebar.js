'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import { HiHome, HiCollection, HiCash, HiCreditCard, HiUserGroup, HiFlag, HiPlusCircle, HiDocumentReport } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  const supporterLinks = [
    { href: '/dashboard/supporter', label: 'Home', icon: HiHome },
    { href: '/dashboard/supporter/explore', label: 'Explore Campaigns', icon: HiCollection },
    { href: '/dashboard/supporter/contributions', label: 'My Contributions', icon: HiCash },
    { href: '/dashboard/supporter/purchase', label: 'Purchase Credit', icon: HiCreditCard },
    { href: '/dashboard/supporter/payment-history', label: 'Payment History', icon: HiDocumentReport },
  ];

  const creatorLinks = [
    { href: '/dashboard/creator', label: 'Home', icon: HiHome },
    { href: '/dashboard/creator/add-campaign', label: 'Add New Campaign', icon: HiPlusCircle },
    { href: '/dashboard/creator/my-campaigns', label: 'My Campaigns', icon: HiCollection },
    { href: '/dashboard/creator/withdrawals', label: 'Withdrawals', icon: HiCash },
    { href: '/dashboard/creator/payment-history', label: 'Payment History', icon: HiDocumentReport },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Home', icon: HiHome },
    { href: '/dashboard/admin/manage-users', label: 'Manage Users', icon: HiUserGroup },
    { href: '/dashboard/admin/manage-campaigns', label: 'Manage Campaigns', icon: HiCollection },
    { href: '/dashboard/admin/withdrawal-requests', label: 'Withdrawal Requests', icon: HiCash },
    { href: '/dashboard/admin/reports', label: 'Reports', icon: HiFlag },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'creator' ? creatorLinks : supporterLinks;

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen hidden lg:block">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-indigo-600">CrowdFundHub</Link>
      </div>
      <div className="px-6 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}`} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-medium text-sm text-gray-900">{user?.name}</p>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>
        <div className="mt-3 bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
          {user?.credits || 0} Credits Available
        </div>
      </div>
      <nav className="mt-4 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button onClick={() => signOut()} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full">
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
