'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardSummary } from '@/hooks/service-hooks/useDashboardService';
import { useGetLowStockProducts } from '@/hooks/service-hooks/useProductService';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  Package,
  Receipt,
  ShoppingBag,
  Star,
  Tags
} from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';
import DashboardStats from './DashboardStats';
import RecentOrdersList from './RecentOrdersList';


const PROGRESS_COLORS = [
  'bg-gradient-to-r from-amber-400 to-amber-500',
  'bg-gradient-to-r from-emerald-400 to-emerald-500',
  'bg-gradient-to-r from-violet-400 to-violet-500',
  'bg-gradient-to-r from-blue-400 to-blue-500',
  'bg-gradient-to-r from-sky-400 to-sky-500',
  'bg-gradient-to-r from-rose-400 to-rose-500',
  'bg-gradient-to-r from-teal-400 to-teal-500',
  'bg-gradient-to-r from-pink-400 to-pink-500',
];

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
  const { currentUser } = useGetCurrentUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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
      <div className="space-y-6 p-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
              {getGreeting()} {currentUser?.name!}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base ">
              Welcome back! Here's a quick overview of what's happening with your store today.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/settings/profile">
              <Button variant="default" size="sm" className="gap-2">
                <Star className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
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

        <DashboardStats summaryData={summaryData} />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="col-span-4">
            <Card className="p-0">
              <CardHeader className="p-0 flex-row justify-between items-center border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1 bg-primary/10 rounded-sm">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  Recent Orders
                </CardTitle>
                <Link href="/admin/orders" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors">
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-72 overflow-y-auto pe-2 block">
                  <RecentOrdersList />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2">
            <Card className="p-0">
              <CardHeader className="p-0 flex-row justify-between items-center border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1 bg-primary/10 rounded-sm">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  Products Orders
                </CardTitle>

              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-72 overflow-y-auto pe-2 block">
                  {summaryData.categoryDistribution && summaryData.categoryDistribution.length > 0 ? (
                    <div className="space-y-4 w-full">
                      {summaryData.categoryDistribution.slice(0, 6).map((cat: any, index: number) => (
                        <div key={cat.name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-muted-foreground">{cat.name}</span>
                            <span className="font-bold text-foreground">
                              {cat.count} ({cat.percentage}%)
                            </span>
                          </div>
                          <Progress
                            value={cat.percentage}
                            color={PROGRESS_COLORS[index % PROGRESS_COLORS.length]}
                            className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Layers className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm text-muted-foreground">No category data available</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>


          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Low Stock Alerts */}
          <Card className="p-4 rounded-2xl border border-border/50 bg-background/50 shadow-sm flex flex-col gap-4">
            <CardHeader className="p-0 flex-row justify-between items-center pb-2 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-foreground">Low Stock Alerts</span>
                {lowStockProducts.length > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                    {lowStockProducts.length}
                  </span>
                )}
              </CardTitle>
              <Link href="/admin/products" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors">
                View All
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 pt-1 flex-1">
              <ScrollArea className="max-h-72 overflow-y-auto pe-2 block">
                {lowStockProducts.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {lowStockProducts.map((product: any) => (
                      <div
                        key={product.id}
                        className="group flex flex-col p-3 bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/80 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700/50 transition-all duration-300 rounded-xl relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                        
                        <div className="flex items-center justify-between gap-2 mb-1.5 pl-1.5">
                          <h4 className="font-bold text-sm text-foreground truncate max-w-[130px]">{product.name}</h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="destructive" className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-rose-500 text-white rounded-md">
                              {product.stock === 0 ? 'Out' : `${product.stock} left`}
                            </Badge>
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 transition-transform hover:scale-105">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pl-1.5">
                          <span className="truncate">SKU: {product.slug}</span>
                          <span className="font-semibold text-foreground">${product.price?.toFixed(2)}</span>
                        </div>

                        <div className="mt-2 px-1.5 py-1 bg-background/50 dark:bg-card/50 rounded-lg flex items-center justify-between text-[11px]">
                          <span>Stock: <strong className="text-rose-600 dark:text-rose-400 font-bold">{product.stock}</strong> / {product.lowStockThreshold || 5}</span>
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-rose-500 h-full transition-all" 
                              style={{ width: `${Math.min((product.stock / (product.lowStockThreshold || 5)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center mb-4 relative border border-emerald-200 dark:border-emerald-800/50 shadow-lg">
                        <Package className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center shadow-sm">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Inventory looks great!</h3>
                    <p className="text-xs text-muted-foreground mb-4 max-w-sm">All products are well-stocked.</p>
                    <Link href="/admin/products">
                      <Button variant="outline" size="sm" className="rounded-full border-emerald-200 hover:bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-900/30 dark:text-emerald-400 transition-all">
                        View All Inventory
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Card 2: Recent Products */}
          <Card className="p-4 rounded-2xl border border-border/50 bg-background/50 shadow-sm flex flex-col gap-4">
            <CardHeader className="p-0 flex-row justify-between items-center pb-2 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-foreground">Recent Products</span>
              </CardTitle>
              <Link href="/admin/products" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors">
                View All
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 pt-1 flex-1">
              <ScrollArea className="max-h-72 overflow-y-auto pe-2 block">
                {summaryData.products.recent.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {summaryData.products.recent.map((product, index) => (
                      <div
                        key={product.id}
                        className="group flex items-center justify-between p-3 bg-background border border-border/40 hover:border-primary/20 hover:shadow-sm transition-all duration-300 rounded-xl"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                            <Package className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-semibold text-xs md:text-sm text-foreground truncate">{product.name}</h4>
                              {index === 0 && (
                                <Badge className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-sm rounded">
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="truncate">SKU: {product.sku}</span>
                              <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                              <span>Stock: <strong className="text-foreground">{product.stock}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pl-3 border-l border-border/40 shrink-0">
                          <span className="text-xs md:text-sm font-bold text-foreground">
                            ${product.price.toFixed(2)}
                          </span>
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">No recent products</h3>
                    <Link href="/admin/products/create">
                      <Button size="sm" className="rounded-full px-4 shadow-md hover:shadow-lg transition-shadow">
                        Create Product
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Card 3: Recent Attributes */}
          <Card className="p-4 rounded-2xl border border-border/50 bg-background/50 shadow-sm flex flex-col gap-4">
            <CardHeader className="p-0 flex-row justify-between items-center pb-2 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-600 dark:text-teal-400">
                  <Tags className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-foreground">Recent Attributes</span>
              </CardTitle>
              <Link href="/admin/attributes" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors">
                View All
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 pt-1 flex-1">
              <ScrollArea className="max-h-72 overflow-y-auto pe-2 block">
                {summaryData.attributes.recent.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {summaryData.attributes.recent.map((attribute) => (
                      <div
                        key={attribute.id}
                        className="group flex items-center justify-between p-3 bg-background border border-border/40 hover:border-primary/20 hover:shadow-sm transition-all duration-300 rounded-xl"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Star className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-semibold text-xs md:text-sm text-foreground truncate">{attribute.name}</h4>
                              <Badge
                                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border-none rounded ${
                                  attribute.status === 'Published'
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {attribute.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Unit: <strong className="text-foreground">{attribute.unit || 'N/A'}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pl-3 border-l border-border/40 shrink-0">
                          <Link href={`/admin/attributes/${attribute.id}`}>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">No recent attributes</h3>
                    <Link href="/admin/attributes/create">
                      <Button size="sm" className="rounded-full px-4 shadow-md hover:shadow-lg transition-shadow">
                        Create Attribute
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">


          <div className="lg:col-span-4">
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

                  </TabsContent>

                  <TabsContent value="attributes" className="m-0 p-4 pt-2 focus-visible:outline-none">

                  </TabsContent>


                </div>
              </Tabs>
            </Card>
          </div>
        </div> */}

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
