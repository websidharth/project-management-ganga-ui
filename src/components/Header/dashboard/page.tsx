'use client';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useLogout from '@/hooks/use-logout';
import { Card } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Logo from '@/components/common/Logo';
import { Separator } from '@/components/ui/separator';
import { BreadCrumb } from '../breadcrumb';
import { ModeToggle } from './sidebar/thememode';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HeaderDashboard() {
  const { data: session } = useSession();
  const logout = useLogout();

  return (
    <>
      <header className="sticky top-0 z-20 w-full bg-background border-b border-b-slate-200/50 shadow-sm">
        <Card className="!p-0 bg-card shadow-none">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="hidden xl:block ">
              <BreadCrumb />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <ModeToggle />
              </div>
              <Separator orientation="vertical" />
              <DropdownMenu>
                <DropdownMenuTrigger className={` flex justify-center  overflow-hidden items-center relative bg-blue size-12 rounded-full`}>
                  <Avatar className=" w-[30px] h-[30px]  ring-1 ring-green-500 ring-offset-[2px] ring-offset-background">
                    {session?.user?.profileImageUrl && (
                      <AvatarImage src={session.user.profileImageUrl} className="object-cover" alt={session.user.name} />
                    )}
                    <AvatarFallback className="uppercase bg-primary text-primary-foreground">{session?.user?.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="p-3 border-b">
                    <div className="flex items-center">
                      <span className="mr-2">👋</span>
                      <span className="font-semibold text-sm">
                        Hey, {session?.user ? `${session.user.name.substring(0, 12)}...` : session?.user?.name}
                      </span>
                    </div>
                  </div>

                  <DropdownMenuLabel>Dashboard</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Separator orientation="vertical" />
              <div className="block xl:hidden">
                <Logo width={100} height={50} className="dark:grayscale w-[100px] h-[50px]" />
              </div>
              <Separator orientation="vertical" />
              <div className="block xl:hidden">
                <SidebarTrigger className="" />
              </div>
            </div>
          </div>
        </Card>
      </header>
    </>
  );
}
