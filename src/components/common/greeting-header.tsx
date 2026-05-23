// components/newsletter/greeting-header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import { Plus, Send } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function GreetingHeader() {
  const { currentUser } = useGetCurrentUser();
  const userName = useMemo(() => currentUser?.name?.trim() || 'User', [currentUser?.name]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Card className="!p-0  bg-transparent">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {greeting}, <span className="capitalize">{userName}!</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            Manage templates, preview content, and send test emails before publishing to your audience.
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" iconPlacement="right" icon={Plus} className="gap-2">
            <Link href="/create-newsletter" target="_blank" className="flex items-center">
              Create Template
            </Link>
          </Button>
          <Button type="button" iconPlacement="right" icon={Send} className="gap-2">
            <Link href="/template/create" className="flex items-center">
              Send Test
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
