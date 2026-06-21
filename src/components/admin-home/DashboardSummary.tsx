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

  return (
    <Link href={href} className="block h-full outline-none">
      <Card className="group relative overflow-hidden bg-background/80 backdrop-blur-2xl border border-border/40 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer rounded-3xl p-6 flex flex-col justify-between h-full min-h-[170px]">

        {/* Animated Background Gradient Blob */}
        <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br ${glowColor} to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700`} />

        {/* Subtle Inner Glow Border */}
        <div className="absolute inset-0 rounded-3xl border border-white/20 dark:border-white/5 pointer-events-none" />

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
          <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm ${bgColor} group-hover:-rotate-6 group-hover:scale-110 transition-all duration-500 ease-out`}>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-white/40 dark:via-white/5 dark:to-white/10 pointer-events-none" />
            <Icon className={`h-5 w-5 relative z-10 ${iconColor} drop-shadow-sm`} />
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
  const lowStockProducts = lowStockData?.data?.data || [];

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
        <Card className="border border-border/50 shadow-sm rounded-xl overflow-hidden">
          <Tabs defaultValue="products" className="w-full">
            <div className="flex items-center justify-between border-b px-5 py-3 bg-card">
              <TabsList className="bg-muted/60 h-9 p-0.5">
                <TabsTrigger value="products" className="h-8 px-4 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  Recent Products
                </TabsTrigger>
                <TabsTrigger value="attributes" className="h-8 px-4 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground gap-1.5">
                  <Tags className="h-3.5 w-3.5" />
                  Recent Attributes
                </TabsTrigger>
                <TabsTrigger value="low-stock" className="h-8 px-4 text-xs font-semibold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600 dark:data-[state=active]:bg-rose-500/10 dark:data-[state=active]:text-rose-400 gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Low Stock Alerts
                  {lowStockProducts.length > 0 && (
                    <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {lowStockProducts.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="m-0 p-0">
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2.5">
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </TabsContent>
              <TabsContent value="attributes" className="m-0 p-0">
                <Link href="/attributes">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2.5">
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </TabsContent>
              <TabsContent value="low-stock" className="m-0 p-0">
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2.5">
                    Manage Inventory
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </TabsContent>
            </div>

            <TabsContent value="products" className="m-0 p-4 pt-2">
              {summaryData.products.recent.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {summaryData.products.recent.map((product, index) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between py-2.5 hover:bg-muted/30 transition-colors rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                            {index === 0 && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary hover:bg-primary/10 border-none">
                                New
                              </Badge>
                            )}
                            {product.stock < 10 && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 border-none bg-rose-500/10 text-rose-600 hover:bg-rose-500/10">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>SKU: {product.sku}</span>
                            <span className="text-border/60">•</span>
                            <span>Stock: {product.stock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-2">
                        <p className="text-sm font-semibold text-foreground">
                          ${product.price.toFixed(2)}
                        </p>
                        <Link href={`/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md opacity-40 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No recent products</p>
                  <Link href="/products/create">
                    <Button variant="link" size="sm" className="mt-1 h-auto text-xs p-0">
                      Create first product
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="attributes" className="m-0 p-4 pt-2">
              {summaryData.attributes.recent.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {summaryData.attributes.recent.map((attribute) => (
                    <div
                      key={attribute.id}
                      className="group flex items-center justify-between py-2.5 hover:bg-muted/30 transition-colors rounded-lg px-2 -mx-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-sm text-foreground truncate">{attribute.name}</p>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 border-none ${attribute.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10'
                              : 'bg-muted text-muted-foreground hover:bg-muted'
                              }`}
                          >
                            {attribute.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Unit: {attribute.unit || 'N/A'}</p>
                      </div>
                      <Link href={`/attributes/${attribute.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Star className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No recent attributes</p>
                  <Link href="/attributes/create">
                    <Button variant="link" size="sm" className="mt-1 h-auto text-xs p-0">
                      Create first attribute
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="low-stock" className="m-0 p-4 pt-2">
              {lowStockProducts.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {lowStockProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between py-2.5 hover:bg-rose-50/50 dark:hover:bg-rose-500/5 transition-colors rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 border-none bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 uppercase tracking-widest">
                              {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>SKU: {product.slug}</span>
                            <span className="text-border/60">•</span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">Stock: {product.stock}</span>
                            <span className="text-border/60">•</span>
                            <span>Threshold: {product.lowStockThreshold}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-2">
                        <p className="text-sm font-semibold text-foreground">
                          ${product.price?.toFixed(2)}
                        </p>
                        <Link href={`/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md opacity-40 group-hover:opacity-100 transition-opacity text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/30">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="h-10 w-10 mx-auto text-emerald-500/30 mb-2" />
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Inventory looks good!</p>
                  <p className="text-xs text-muted-foreground mt-1">No products are currently low on stock.</p>
                </div>
              )}
            </TabsContent>
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
