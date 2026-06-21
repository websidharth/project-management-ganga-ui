'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetDashboardSummary } from '@/hooks/service-hooks/useDashboardService';
import { useGetLowStockProducts } from '@/hooks/service-hooks/useProductService';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  DollarSign,
  Layers,
  Package,
  ShoppingBag,
  Star,
  Tags,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import OrderList from '../features/orders';

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
                {isCurrency ? `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : total.toLocaleString()}
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

const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-10 rounded-lg" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

const RecentItemSkeleton = () => (
  <div className="flex items-center justify-between border-b pb-3">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-8 w-16" />
  </div>
);

export default function DashboardHome() {
  const { data, isLoading, isError, error } = useGetDashboardSummary();
  const { data: lowStockData, isLoading: isLowStockLoading } = useGetLowStockProducts();

  if (isLoading || isLowStockLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="space-y-8 p-4 md:p-8">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Charts and Recent Activity Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 md:p-8">
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Failed to Load Dashboard</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {error instanceof Error ? error.message : 'Please try again later.'}
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summaryData = data?.data?.data;
  const lowStockProducts = lowStockData?.data?.data?.data || [];

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 md:p-8">
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">No Data Available</h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  Start adding products and attributes to see your dashboard statistics.
                </p>
              </div>
              <Link href="/products/create">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="min-h-screen ">
      <div className="space-y-8 p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="">
              Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={DollarSign}
            title="Today's Sale"
            total={summaryData?.todaySale}
            isCurrency={true}
            iconColor="text-emerald-600 dark:text-emerald-400"
            bgColor="bg-emerald-50 dark:bg-emerald-950/40"
            href="/admin/orders"
          />
          <StatCard
            icon={DollarSign}
            title="Total Month Sale"
            total={summaryData.totalMonthSale}
            isCurrency={true}
            iconColor="text-purple-600 dark:text-purple-400"
            bgColor="bg-purple-50 dark:bg-purple-950/40"
            href="/admin/orders"
          />
          <StatCard
            icon={Package}
            title="Total Products"
            total={summaryData.products.total}
            recentCount={summaryData.products.recent.length}
            iconColor="text-blue-600 dark:text-blue-400"
            bgColor="bg-blue-50 dark:bg-blue-950/40"
            href="/admin/products"
          />
          <StatCard
            icon={Tags}
            title="Total Attributes"
            total={summaryData.attributes.total}
            recentCount={summaryData.attributes.recent.length}
            iconColor="text-teal-600 dark:text-teal-400"
            bgColor="bg-teal-50 dark:bg-teal-950/40"
            href="/admin/attributes"
          />
        </div>

        <Card>
          <OrderList />
        </Card>

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl overflow-hidden bg-background/60 backdrop-blur-xl">
          <Tabs defaultValue="products" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 px-6 py-4 bg-gradient-to-r from-card/80 to-muted/30">
              <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex flex-wrap gap-1">
                <TabsTrigger value="products" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all gap-2">
                  <Package className="h-4 w-4" />
                  Recent Products
                </TabsTrigger>
                <TabsTrigger value="attributes" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all gap-2">
                  <Tags className="h-4 w-4" />
                  Recent Attributes
                </TabsTrigger>
                <TabsTrigger value="low-stock" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600 dark:data-[state=active]:bg-rose-500/15 dark:data-[state=active]:text-rose-400 transition-all gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Low Stock Alerts
                  {lowStockProducts.length > 0 && (
                    <span className="bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                      {lowStockProducts.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="m-0 p-0 sm:mt-0 mt-4">
                <Link href="/admin/products">
                  <Button variant="ghost" size="sm" className="h-9 text-sm gap-2 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    View All Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </TabsContent>
              <TabsContent value="attributes" className="m-0 p-0 sm:mt-0 mt-4">
                <Link href="/admin/attributes">
                  <Button variant="ghost" size="sm" className="h-9 text-sm gap-2 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                    View All Attributes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </TabsContent>
              <TabsContent value="low-stock" className="m-0 p-0 sm:mt-0 mt-4">
                <Link href="/admin/products">
                  <Button variant="ghost" size="sm" className="h-9 text-sm gap-2 px-4 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    Manage Inventory
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </TabsContent>
            </div>

            <div className="p-2">
              <TabsContent value="products" className="m-0 p-4 pt-2 focus-visible:outline-none">
                {summaryData.products.recent.length > 0 ? (
                  <div className="grid gap-3">
                    {summaryData.products.recent.map((product, index) => (
                      <div
                        key={product.id}
                        className="group flex items-center justify-between p-4 bg-background border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-2xl"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-sm md:text-base text-foreground truncate">{product.name}</h4>
                              {index === 0 && (
                                <Badge className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-sm">
                                  New
                                </Badge>
                              )}
                              {product.stock < 10 && (
                                <Badge variant="destructive" className="text-[10px] uppercase tracking-wider px-2 py-0.5 border-none shadow-sm">
                                  Low Stock
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" /> {product.sku}</span>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Stock: <strong className="text-foreground">{product.stock}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pl-4 border-l border-border/40">
                          <div className="text-right">
                            <p className="text-sm md:text-base font-bold text-foreground">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No recent products</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">You haven't added any products recently. Start building your catalog.</p>
                    <Link href="/admin/products/create">
                      <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">
                        Create Product
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="attributes" className="m-0 p-4 pt-2 focus-visible:outline-none">
                {summaryData.attributes.recent.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {summaryData.attributes.recent.map((attribute) => (
                      <div
                        key={attribute.id}
                        className="group flex flex-col p-4 bg-background border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/attributes/${attribute.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm shadow-sm hover:bg-background">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                              <Star className="h-4 w-4" />
                            </div>
                            <h4 className="font-semibold text-base text-foreground truncate">{attribute.name}</h4>
                          </div>
                          <Badge
                            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border-none shadow-sm ${attribute.status === 'Published'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              : 'bg-muted text-muted-foreground'
                              }`}
                          >
                            {attribute.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Unit:</span>
                          <span className="bg-muted px-2 py-0.5 rounded-md text-xs">{attribute.unit || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Star className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No recent attributes</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">Enhance your products by creating custom attributes.</p>
                    <Link href="/admin/attributes/create">
                      <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-shadow">
                        Create Attribute
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="low-stock" className="m-0 p-4 pt-2 focus-visible:outline-none">
                {lowStockProducts.length > 0 ? (
                  <div className="grid gap-3">
                    {lowStockProducts.map((product: any) => (
                      <div
                        key={product.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-rose-50/30 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/40 hover:shadow-md transition-all duration-300 rounded-2xl relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                        
                        <div className="flex items-start md:items-center gap-4 flex-1 min-w-0 pl-2">
                          <div className="h-12 w-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-inner">
                            <AlertTriangle className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                              <h4 className="font-bold text-base text-foreground truncate">{product.name}</h4>
                              <Badge variant="destructive" className="text-[10px] uppercase tracking-wider px-2 py-0.5 border-none shadow-sm animate-pulse">
                                {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" /> SKU: {product.slug}</span>
                              <div className="flex items-center gap-4 bg-background/50 rounded-lg px-3 py-1 border border-border/50">
                                <span className="flex items-center gap-1.5">
                                  Current Stock: <strong className="text-rose-600 dark:text-rose-400 text-base">{product.stock}</strong>
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="flex items-center gap-1.5">
                                  Threshold: <strong className="text-foreground">{product.lowStockThreshold}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 pl-4 border-l border-rose-200 dark:border-rose-900/50 mt-4 md:mt-0">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-0.5">Price</p>
                            <p className="text-lg font-bold text-foreground">
                              ${product.price?.toFixed(2)}
                            </p>
                          </div>
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/50 dark:hover:bg-rose-900/80 dark:text-rose-300 transition-all shadow-sm group-hover:scale-110">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center mb-6 relative border border-emerald-200 dark:border-emerald-800/50 shadow-lg">
                        <Package className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Inventory looks great!</h3>
                    <p className="text-base text-muted-foreground mb-6 max-w-sm">All your products are well-stocked. You're ready to fulfill incoming orders.</p>
                    <Link href="/admin/products">
                      <Button variant="outline" className="rounded-full px-6 border-emerald-200 hover:bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-900/30 dark:text-emerald-400 transition-all">
                        View All Inventory
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Quick Stats Footer */}
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="group relative overflow-hidden bg-card border border-border/50 hover:border-blue-500/20 shadow-sm transition-all duration-300 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Inventory Health</p>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">Stock Coverage</span>
                  <span className="text-sm font-bold text-foreground">78%</span>
                </div>
              </div>
            </div>
            <Progress value={78} className="h-1.5 mt-3.5 bg-blue-500/10 [&>div]:bg-blue-500" />
          </Card>

          <Card className="group relative overflow-hidden bg-card border border-border/50 hover:border-emerald-500/20 shadow-sm transition-all duration-300 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Tags className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Attribute Usage</p>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">Products with Attributes</span>
                  <span className="text-sm font-bold text-foreground">92%</span>
                </div>
              </div>
            </div>
            <Progress value={92} className="h-1.5 mt-3.5 bg-emerald-500/10 [&>div]:bg-emerald-500" />
          </Card>

          <Card className="group relative overflow-hidden bg-card border border-border/50 hover:border-indigo-500/20 shadow-sm transition-all duration-300 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                <Layers className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">Variant Coverage</p>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">Products with Variants</span>
                  <span className="text-sm font-bold text-foreground">64%</span>
                </div>
              </div>
            </div>
            <Progress value={64} className="h-1.5 mt-3.5 bg-indigo-500/10 [&>div]:bg-indigo-500" />
          </Card>
        </div>
      </div>
    </div>
  );
}
