import type { Metadata } from 'next';
import LoginModule from '@/components/account/login';
import AuthStaticLayout from '@/components/layout/authSimpleSlider';
import Component from '@/components/account/giigle';

export const metadata: Metadata = {
  title: 'Login - Admin Dashboard',
  description: 'Login to access the admin dashboard and manage your products, categories, and more.',
};

export default function Page() {
  return (
    <>
      <AuthStaticLayout formComponent={<LoginModule />} title="Welcome back" description="Use your credentials to sign in." />
    </>
  );
}
