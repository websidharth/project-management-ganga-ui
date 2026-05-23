'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDashboardSummary } from '@/hooks/service-hooks/useDashboardService';
import { Package, FileText, Layers, Tags, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type StatCardProps = {
  icon: React.ElementType;
  title: string;
  total: number;
  recentCount: number;
  iconColor: string;
};

const StatCard = ({ icon: Icon, title, total, recentCount, iconColor }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{total}</div>
      <p className="text-xs text-muted-foreground">
        {recentCount} recent {recentCount === 1 ? 'entry' : 'entries'}
      </p>
    </CardContent>
  </Card>
);

const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-5 rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

export default function DashboardSummary() {
  const { data, isLoading, isError, error } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your store statistics</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your store statistics</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Failed to load dashboard data. {error instanceof Error ? error.message : 'Please try again later.'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summaryData = data?.data?.data;

  if (!summaryData) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">No dashboard data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your store statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          title="Products"
          total={summaryData.products.total}
          recentCount={summaryData.products.recent.length}
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Tags}
          title="Attributes"
          total={summaryData.attributes.total}
          recentCount={summaryData.attributes.recent.length}
          iconColor="text-green-600"
        />
        <StatCard
          icon={Layers}
          title="Product Variants"
          total={summaryData.productVariants.total}
          recentCount={summaryData.productVariants.recent.length}
          iconColor="text-purple-600"
        />
        <StatCard
          icon={FileText}
          title="Product Attributes"
          total={summaryData.productAttributes.total}
          recentCount={summaryData.productAttributes.recent.length}
          iconColor="text-orange-600"
        />
      </div>

      {/* Recent Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData.products.recent.length > 0 ? (
            <div className="space-y-4">
              {summaryData.products.recent.map((product) => (
                <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.price}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent products</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Attributes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData.attributes.recent.length > 0 ? (
            <div className="space-y-3">
              {summaryData.attributes.recent.map((attribute) => (
                <div key={attribute.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{attribute.name}</p>
                    <p className="text-sm text-muted-foreground">Unit: {attribute.unit}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      attribute.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {attribute.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent attributes</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
