'use client';
import { useState, useEffect, useRef } from 'react';
import { HiBell } from 'react-icons/hi';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationPopover() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (session?.user?.email) {
      apiFetch(`/notifications/${session.user.email}`).then(res => setNotifications(res)).catch(() => {});
    }
  }, [session?.user?.email]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative text-gray-600 hover:text-indigo-600">
        <HiBell size={22} />
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold text-gray-900">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No notifications yet</div>
          ) : (
            notifications.slice(0, 20).map(n => (
              <Link key={n._id} href={n.actionRoute || '#'} className={`block p-3 border-b hover:bg-gray-50 ${n.isRead ? '' : 'bg-indigo-50'}`} onClick={() => setOpen(false)}>
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
