'use client';

import React from 'react'; 
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '../common/Logo';
import { ShoppingBag, ShieldCheck, BarChart3, TrendingUp } from 'lucide-react';

export interface AuthFullPageLayoutProps {
  formComponent: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function AuthFullPageLayout({
  formComponent,
  title = 'Welcome back',
  description = 'Login to continue to your dashboard.', 
  className,
}: AuthFullPageLayoutProps) {
  return (
    <main className={cn('relative min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col justify-between overflow-hidden', className)}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 w-full">
        {/* Left Side: Modern Promotional Banner (Hidden on Mobile) */}
        <section className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-slate-950 flex-col justify-between p-12 text-white border-r border-slate-900">
          {/* Animated Glowing Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-gradient-to-tr from-primary/30 to-indigo-500/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[50%] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/20 blur-[130px] pointer-events-none" />
          
          {/* Mesh Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* Logo & Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Logo className="h-7 w-auto filter invert brightness-200" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">PMS Enterprise</span>
          </div>

          {/* Core Content */}
          <div className="relative z-10 space-y-8 my-auto pr-4">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                V2.4 Active Update
              </span>
              <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Simplify POS & Inventory Management
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Experience a streamlined workspace designed to speed up checkout lines, manage live products, and scale your storefront operations effortlessly.
              </p>
            </div>

            {/* Micro Feature List */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-white/5 text-primary shrink-0 mt-0.5 border border-white/10">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Intuitive POS Terminal</h4>
                  <p className="text-xs text-slate-400">Add products to your cart, apply custom discounts or taxes, and checkout in clicks.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-white/5 text-emerald-400 shrink-0 mt-0.5 border border-white/10">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Smart Inventory Analytics</h4>
                  <p className="text-xs text-slate-400">Monitor stock levels, track recent changes, and view active category shares.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-white/5 text-purple-400 shrink-0 mt-0.5 border border-white/10">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Secure Auditing Roles</h4>
                  <p className="text-xs text-slate-400">Comprehensive logging and user restrictions protect sensitive store reports.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer stats */}
          <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/5 text-center sm:text-left">
            <div>
              <p className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-1">
                99.9%
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Uptime SLA</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">1.2M+</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Orders Synced</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">&lt; 85ms</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">API Latency</p>
            </div>
          </div>
        </section>

        {/* Right Side: Form workspace */}
        <section className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
          {/* Subtle decoration orbs for background depth */}
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />

          <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Header branding on mobile */}
            <div className="flex flex-col items-center text-center lg:hidden space-y-4 mb-6">
              <Logo className="h-10 w-auto" />
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
            </div>

            {/* Desktop header titles */}
            <div className="hidden lg:block space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>

            <Card className="border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                {formComponent}
              </CardContent>
            </Card>

            <p className="text-center text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              By accessing this dashboard, you accept our standard <a href="#" className="underline hover:text-slate-600 transition-colors">Terms of Service</a> & <a href="#" className="underline hover:text-slate-600 transition-colors">Privacy Shield</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
