'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  <Link href={href}>
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{total.toLocaleString()}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recentCount} new this month
          </p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardContent>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="space-y-8 p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
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

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Products Section */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Products</CardTitle>
                </div>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {summaryData.products.recent.length > 0 ? (
                <div className="space-y-4">
                  {summaryData.products.recent.map((product, index) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 transition-colors rounded-lg p-2 -mx-2"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{product.name}</p>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                          {product.stock < 10 && (
                            <Badge variant="destructive" className="text-xs">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </p>
                        <Link href={`/products/${product.id}`}>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No recent products</p>
                  <Link href="/products/create">
                    <Button variant="link" size="sm" className="mt-2">
                      Create your first product
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attributes Section */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Attributes</CardTitle>
                </div>
                <Link href="/attributes">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {summaryData.attributes.recent.length > 0 ? (
                <div className="space-y-3">
                  {summaryData.attributes.recent.map((attribute) => (
                    <div
                      key={attribute.id}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{attribute.name}</p>
                          <Badge
                            variant={attribute.status === 'Published' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {attribute.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Unit: {attribute.unit || 'N/A'}</p>
                      </div>
                      <Link href={`/attributes/${attribute.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No recent attributes</p>
                  <Link href="/attributes/create">
                    <Button variant="link" size="sm" className="mt-2">
                      Create your first attribute
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Inventory Health</p>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Coverage</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Attribute Usage</p>
                <Tags className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Products with Attributes</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">Variant Coverage</p>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Products with Variants</span>
                  <span className="font-medium">64%</span>
                </div>
                <Progress value={64} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
