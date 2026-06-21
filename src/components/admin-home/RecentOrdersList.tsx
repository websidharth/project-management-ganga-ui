import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { OrderDto } from '@/dtos/order.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { useGetAllOrders } from '@/hooks/service-hooks/useOrderService';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Package, Receipt, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Pending</Badge>;
    case OrderStatus.Confirmed:
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Confirmed</Badge>;
    case OrderStatus.Shipped:
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">Shipped</Badge>;
    case OrderStatus.Delivered:
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">Delivered</Badge>;
    case OrderStatus.Cancelled:
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Cancelled</Badge>;
    case OrderStatus.Returned:
      return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">Returned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function RecentOrdersList() {
  const { data: response, isLoading, isError } = useGetAllOrders({ page: 1, recordPerPage: 5 });

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-5 w-20 ml-auto" />
                  <Skeleton className="h-6 w-24 ml-auto rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return null;
  }

  const orders: OrderDto[] = response?.data?.data?.data || [];

  return (
    <Card className="shadow-xl shadow-primary/5 border-0 bg-background/80 backdrop-blur-2xl rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-gradient-to-r from-card/80 to-muted/30 px-6 py-5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            Recent Orders
          </CardTitle>
          <Link href="/admin/orders" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p>No recent orders found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {orders.map((order) => (
              <div key={order.id} className="p-4 sm:p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex mt-1 w-10 h-10 rounded-full bg-primary/5 items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold text-foreground hover:text-primary transition-colors block text-base">
                        {order.orderNumber}
                      </Link>
                      {order.store && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground/80 font-medium border-0 transition-colors">
                          Store: {order.store.name || order.store.code}
                        </Badge>
                      )}
                      {order.items && order.items.length > 0 && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-[10px] h-5 px-2 text-muted-foreground border-border/50 font-medium cursor-help transition-colors hover:bg-muted/50">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} Items
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="p-3 max-w-[260px] shadow-xl border-border/50 bg-background/95 backdrop-blur-md">
                              <div className="space-y-2">
                                <p className="font-semibold text-xs text-muted-foreground border-b border-border/50 pb-1.5 mb-1.5">Products in Order</p>
                                <ul className="space-y-1.5 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                  {order.items.map(item => (
                                    <li key={item.id} className="text-xs flex items-center justify-between gap-4 group/item">
                                      <div className="flex flex-col">
                                        <span className="truncate font-medium text-foreground group-hover/item:text-primary transition-colors">{item.product?.name || `Product #${item.productId}`}</span>
                                        <span className="text-[10px] text-muted-foreground/70">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} each</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground whitespace-nowrap bg-muted/50 px-1.5 py-0.5 rounded-md">x{item.quantity}</span>
                                        <span className="font-semibold text-foreground/80">${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                {(order.discount > 0 || order.tax > 0) && (
                                  <div className="border-t border-border/50 pt-1.5 mt-1.5 text-[10px] flex justify-between text-muted-foreground">
                                    <span>Discount: ${order.discount}</span>
                                    <span>Tax: ${order.tax}</span>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground mt-1.5">
                      {order.customer ? (
                        <span className="font-medium text-foreground/70 flex items-center gap-1">
                          <span className="text-muted-foreground/50">Cust:</span> {order.customer.firstName} {order.customer.lastName}
                        </span>
                      ) : order.customerId && (
                        <span className="font-medium text-foreground/70 flex items-center gap-1">
                          <span className="text-muted-foreground/50">Cust:</span> {order.customerId}
                        </span>
                      )}
                      {order.customerId && <span className="w-1 h-1 rounded-full bg-border/80"></span>}
                      <span>{new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1 h-1 rounded-full bg-border/80"></span>
                      <span>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="font-extrabold text-foreground text-lg">
                    ${order.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
