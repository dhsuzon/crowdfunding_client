'use client';
import { useSession } from '@/lib/auth-client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push(`/dashboard/${session.user.role}`);
    }
  }, [session, router]);

  return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div></div>;
}
