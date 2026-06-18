'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardSummary } from '@/hooks/service-hooks/useDashboardService';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Clock,
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
  recentCount: number;
  trend?: number;
  iconColor: string;
  bgColor: string;
  href: string;
};

const StatCard = ({
  icon: Icon,
  title,
  total,
  recentCount,
  trend,
  iconColor,
  bgColor,
  href
}: StatCardProps) => (
  <Link href={href} className="block">
    <Card className="group relative overflow-hidden bg-card border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer rounded-2xl p-6 flex flex-col justify-between h-full min-h-[160px]">
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between w-full">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{title}</span>
          <div className="text-4xl font-bold tracking-tight text-foreground transition-all duration-200 group-hover:text-primary">
            {total.toLocaleString()}
          </div>
        </div>

        {/* Animated Icon Wrapper with matching glow/color */}
        <div className={`flex items-center justify-center p-3 rounded-xl ${bgColor} group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/45 w-full">
        {/* Trend Indicator as a Badge */}
        {trend !== undefined ? (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trend >= 0
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
            {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>{trend >= 0 ? '+' : ''}{trend}%</span>
          </div>
        ) : (
          <div />
        )}

        {/* Recent Count Indicator */}
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span><strong className="text-foreground font-semibold">{recentCount}</strong> new</span>
        </div>
      </div>
    </Card>
  </Link>
);

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

  if (isLoading) {
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

  // Calculate trends (example - you can implement actual trend calculation)
  const trends = {
    products: 12,
    attributes: 8,
  };

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
            icon={Package}
            title="Total Products"
            total={summaryData.products.total}
            recentCount={summaryData.products.recent.length}
            trend={trends.products}
            iconColor="text-blue-600"
            bgColor="bg-blue-50 dark:bg-blue-950/30"
            href="/products"
          />
          <StatCard
            icon={Tags}
            title="Total Attributes"
            total={summaryData.attributes.total}
            recentCount={summaryData.attributes.recent.length}
            trend={trends.attributes}
            iconColor="text-green-600"
            bgColor="bg-green-50 dark:bg-green-950/30"
            href="/attributes"
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
