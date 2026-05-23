'use client';

import React from 'react';
import { ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '../common/Logo';

export interface AuthFullPageLayoutProps {
  /** Form component (e.g., SignInForm, SignUpForm) – must accept no props or use a render prop pattern */
  formComponent: React.ReactNode;
  title?: string;
  description?: string;
  /** Optional statistics to display in the left panel */
  stats?: Array<{ value: string; label: string }>;
  className?: string;
}

export default function AuthFullPageLayout({
  formComponent,
  title = 'Welcome back',
  description = 'Login to continue your transcription certification journey.',
  stats = [
    { value: '10+', label: 'Exams' },
    { value: '24/7', label: 'Access' },
    { value: '100%', label: 'Secure' },
  ],
  className,
}: AuthFullPageLayoutProps) {
  return (
    <main className={cn('relative min-h-screen overflow-hidden', className)}>
      {/* Background (decorative, hidden from screen readers) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border)/0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="grid min-h-screen lg:grid-cols-1">
        {/* Left: Branding & Value Props */}
        {/* <section className="hidden flex-col justify-between p-8 lg:flex xl:p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-foreground/80 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Transcription Certification Institute
          </div>

          <div className="space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-card/60 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl font-semibold tracking-tight xl:text-6xl">
              Learn faster.
              <br />
              Certify smarter.
            </h1>

            <p className="max-w-md text-lg leading-8 text-muted-foreground">
              Access your lessons, exams, certificates, course resources, and student dashboard from one secure place.
            </p>

            <div className="grid max-w-md grid-cols-3 gap-3 pt-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Secure login protected with encrypted authentication.
          </div>
        </section> */}

        {/* Right: Authentication Form */}
        <section className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <Card className="w-full max-w-md border-border/50 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <Logo className="mx-auto h-auto w-[150px] md:w-[180px]" />
              <CardTitle className="text-3xl font-semibold tracking-tight">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {formComponent}
              <p className="mt-4 text-center text-xs text-muted-foreground ">By continuing, you agree to our terms and privacy policy.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
