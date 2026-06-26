'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from '@/components/ui/use-toast';
import { CreateUserModel } from '@/models/user.model';
import SignupSchema from '@/schema/userSchema';
import config from '@/config';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import Link from 'next/link';
import { CardDescription } from '../ui/card';
import { Switch } from '../ui/switch';

export default function RegisterModule() {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateUserModel>({
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      isRegisterbyShop: false,
    },
  });

  const { handleSubmit, control } = form;

  const submitData = async (data: CreateUserModel) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();

        setShowLoader(false);
        toast({
          title: 'Success',
          description: 'Registered successfully!',
          variant: 'success',
        });

        form.reset();
        router.push('/login/');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);

      toast({
        variant: 'destructive', // Changed to destructive for error
        description: 'Failed to create account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="">
        {showLoader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16">Loading...</div>
          </div>
        )}
      </div>
      <Form {...form}>
        <form autoComplete="off" onSubmit={handleSubmit(submitData)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@company.com" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 000-0000" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Create a password" {...field} className="h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-primary/25 bg-white/50 dark:bg-slate-900/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isRegisterbyShop"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                <div className="flex-1">
                  <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">Register as Shop Account</FormLabel>
                  <p className="text-[10px] text-slate-400">Establish a store inventory profile rather than standard credentials.</p>
                </div>
                <FormControl>
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            icon={FaArrowUpRightFromSquare}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-extrabold transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 mt-2"
            loading={showLoader}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
          
          <div className="my-5 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?
              <Link href="/login" className="font-extrabold text-primary hover:underline transition-colors ms-1">
                Log in now
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
}
