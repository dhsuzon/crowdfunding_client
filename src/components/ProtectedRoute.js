'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function ProtectedRoute({ children, roles }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login');
      } else if (roles && !roles.includes(session.user.role)) {
        router.push('/dashboard');
      }
    }
  }, [session, isPending, router, roles]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;
  if (roles && !roles.includes(session.user.role)) return null;

  return children;
}
