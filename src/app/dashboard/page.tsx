'use client';

import GreetingHeader from '@/components/common/greeting-header';
import PurchasePage from '@/components/features/pos';
import { CardDescription } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status === 'loading') {
    return <CardDescription className="p-6 text-sm text-muted-foreground">Loading dashboard...</CardDescription>;
  }

  if (status === 'unauthenticated') {
    return <CardDescription className="p-6 text-sm text-muted-foreground">Redirecting...</CardDescription>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <GreetingHeader />
      <PurchasePage />
    </div>
  );
}
