import { Card } from '@/components/ui/card';
import { Clock, DollarSign, Package, Tags, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type StatCardProps = {
  icon: React.ElementType;
  title: string;
  total: number;
  recentCount?: number;
  trend?: number;
  iconColor: string;
  bgColor: string;
  href: string;
  isCurrency?: boolean;
};

const StatCard = ({
  icon: Icon,
  title,
  total,
  recentCount,
  trend,
  iconColor,
  bgColor,
  href,
  isCurrency
}: StatCardProps) => {
  // Extracting color for the glow effect based on bgColor
  const glowColor = bgColor.includes('emerald') ? 'from-emerald-500/20'
    : bgColor.includes('purple') ? 'from-purple-500/20'
      : bgColor.includes('blue') ? 'from-blue-500/20'
        : bgColor.includes('teal') ? 'from-teal-500/20'
          : bgColor.includes('green') ? 'from-green-500/20'
            : 'from-primary/20';

  const borderGradient = bgColor.includes('emerald') ? 'from-emerald-400 via-emerald-100 to-emerald-500 dark:from-emerald-600 dark:via-emerald-900 dark:to-emerald-600'
    : bgColor.includes('purple') ? 'from-purple-400 via-purple-100 to-purple-500 dark:from-purple-600 dark:via-purple-900 dark:to-purple-600'
      : bgColor.includes('blue') ? 'from-blue-400 via-blue-100 to-blue-500 dark:from-blue-600 dark:via-blue-900 dark:to-blue-600'
        : bgColor.includes('teal') ? 'from-teal-400 via-teal-100 to-teal-500 dark:from-teal-600 dark:via-teal-900 dark:to-teal-600'
          : bgColor.includes('green') ? 'from-green-400 via-green-100 to-green-500 dark:from-green-600 dark:via-green-900 dark:to-green-600'
            : 'from-primary/50 via-primary/20 to-primary/50';

  const hoverBorderGradient = bgColor.includes('emerald') ? 'group-hover:from-emerald-500 group-hover:via-emerald-300 group-hover:to-emerald-600'
    : bgColor.includes('purple') ? 'group-hover:from-purple-500 group-hover:via-purple-300 group-hover:to-purple-600'
      : bgColor.includes('blue') ? 'group-hover:from-blue-500 group-hover:via-blue-300 group-hover:to-blue-600'
        : bgColor.includes('teal') ? 'group-hover:from-teal-500 group-hover:via-teal-300 group-hover:to-teal-600'
          : bgColor.includes('green') ? 'group-hover:from-green-500 group-hover:via-green-300 group-hover:to-green-600'
            : 'group-hover:from-primary group-hover:via-primary/40 group-hover:to-primary';

  const iconBgGradient = bgColor.includes('emerald') ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/40'
    : bgColor.includes('purple') ? 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/40'
      : bgColor.includes('blue') ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/40'
        : bgColor.includes('teal') ? 'bg-gradient-to-br from-teal-400 to-teal-600 shadow-teal-500/40'
          : bgColor.includes('green') ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/40'
            : 'bg-gradient-to-br from-primary/80 to-primary shadow-primary/40';

  return (
    <Link href={href} className="block h-full outline-none group">
      <div className={`relative h-full rounded-3xl bg-gradient-to-br ${borderGradient} ${hoverBorderGradient} p-[2px] transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 cursor-pointer`}>
        <Card className="relative overflow-hidden bg-background border-0 h-full rounded-[calc(1.5rem-2px)] p-6 flex flex-col justify-between min-h-[170px]">

          {/* Animated Background Gradient Blob */}
          <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br ${glowColor} to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700`} />

          {/* Subtle Inner Glow Border */}
          <div className="absolute inset-0 rounded-[calc(1.5rem-2px)] border border-white/20 dark:border-white/5 pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between w-full">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {title}
              </span>
              <div className="text-4xl font-extrabold tracking-tighter text-foreground group-hover:scale-105 origin-left transition-transform duration-500">
                {isCurrency ? `$${total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : total?.toLocaleString()}
              </div>
            </div>

            {/* Premium Icon Container */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg ${iconBgGradient} group-hover:-rotate-6 group-hover:scale-110 transition-all duration-500 ease-out`}>
              {/* Glossy Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />
              <Icon className="h-5 w-5 relative z-10 text-white drop-shadow-md" />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-8 pt-4 border-t border-border/40 w-full">
            {/* Trend Indicator */}
            {trend !== undefined ? (
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trend >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{trend >= 0 ? '+' : ''}{trend}%</span>
              </div>
            ) : (
              <div />
            )}

            {/* Recent Count Indicator */}
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:animate-pulse" />
              {recentCount !== undefined ? (
                <span><strong className="text-foreground font-semibold">{recentCount}</strong> new</span>
              ) : (
                <span>Updated just now</span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
};

interface DashboardStatsProps {
  summaryData: any;
}

export default function DashboardStats({ summaryData }: DashboardStatsProps) {
  if (!summaryData) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={DollarSign}
        title="Today's Sale"
        total={summaryData.todaySale || 0}
        isCurrency={true}
        iconColor="text-emerald-600 dark:text-emerald-400"
        bgColor="bg-emerald-50 dark:bg-emerald-950/40"
        href="/admin/orders"
      />
      <StatCard
        icon={DollarSign}
        title="Total Month Sale"
        total={summaryData.totalMonthSale || 0}
        isCurrency={true}
        iconColor="text-purple-600 dark:text-purple-400"
        bgColor="bg-purple-50 dark:bg-purple-950/40"
        href="/admin/orders"
      />
      <StatCard
        icon={Package}
        title="Total Products"
        total={summaryData.products?.total || 0}
        recentCount={summaryData.products?.recent?.length || 0}
        iconColor="text-blue-600 dark:text-blue-400"
        bgColor="bg-blue-50 dark:bg-blue-950/40"
        href="/admin/products"
      />
      <StatCard
        icon={Tags}
        title="Total Attributes"
        total={summaryData.attributes?.total || 0}
        recentCount={summaryData.attributes?.recent?.length || 0}
        iconColor="text-teal-600 dark:text-teal-400"
        bgColor="bg-teal-50 dark:bg-teal-950/40"
        href="/admin/attributes"
      />
    </div>
  );
}
