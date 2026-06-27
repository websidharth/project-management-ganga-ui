// components/newsletter/greeting-header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import { Activity, Clock, Plus, Send, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Badge } from '../ui/badge';

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
            Welcome back! Here's a quick overview of what's happening with your store today.
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Button icon={Star} variant="default" size="sm" asChild className="gap-2">
            <Link href="/admin/settings/profile">
              Edit Profile
            </Link>
          </Button>

          <Button icon={Clock} variant="outline" size="sm">
            Last 30 days
          </Button>
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
