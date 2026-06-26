'use client';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginModel } from '@/models/login.model';
import LoginSchema from '@/schema/LoginSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRoleRedirect } from '@/hooks/use-role-base-redirection';
import { UserDto } from '@/dtos/UserDto';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { CardDescription } from '../ui/card';

export default function LoginModule() {
  const { data: session, status } = useSession();
  const { redirectToRoleBasedDashboard } = useRoleRedirect();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const form = useForm<LoginModel>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = form;

  // Redirect to role-based dashboard if user is already logged in
  useEffect(() => {
    if (session && session?.user?.role) {
      const roles = session?.user?.role ? [session?.user?.role] : [];
      redirectToRoleBasedDashboard(roles);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (typeof window !== 'undefined') {
        const user: UserDto = session?.user as UserDto;
        localStorage.setItem('at', user.token || '');
        localStorage.setItem('fullName', user.name || '');
        localStorage.setItem('profilePicture', user.profileImageUrl || '');
      }
    }
  }, [status, session]);

  const submitData = async (model: LoginModel) => {
    setShowLoader(true);

    const loginStatus = await signIn('credentials', {
      email: model.email,
      password: model.password,
      redirect: false,
      callbackUrl: '/',
    });

    if (loginStatus && loginStatus.ok && !loginStatus.error) {
      toast({
        variant: 'success',
        title: 'Login successful',
        description: <span>Redirecting to your dashboard...</span>,
      });

      const checkSessionAndRedirect = async () => {
        const maxRetries = 10;
        let retries = 0;

        while (retries < maxRetries) {
          const currentSession = await getSession();
          const user = currentSession?.user as UserDto;

          if (user && user.role) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('at', user.token || '');
              localStorage.setItem('fullName', user.name || '');
              localStorage.setItem('profilePicture', user.profileImageUrl || (session?.user as any)?.image || '');
            }

            redirectToRoleBasedDashboard([user.role]);
            return;
          }

          retries++;
          await new Promise((res) => setTimeout(res, 200));
        }

        // Fallback
        setShowLoader(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: <span>Failed to retrieve user session</span>,
        });
      };

      await checkSessionAndRedirect();
      return;
    }
    setShowLoader(false);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: <span>Invalid username or password</span>,
    });
  };

  return (
    <div className="">
      <Form {...form}>
        <form autoComplete="off" onSubmit={handleSubmit(submitData)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center justify-between">
            <Link href="/recover-password" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
              Forgot Password?
            </Link>
          </div> */}

          <Button
            type="submit"
            icon={FaArrowUpRightFromSquare}
            iconPlacement="right"
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-extrabold transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95"
            loading={showLoader}
          >
            {showLoader ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className="my-5 text-center">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?
          <Link href="/sign-up" className="font-extrabold text-primary hover:underline transition-colors ms-1">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
