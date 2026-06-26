import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { OrderDto } from '@/dtos/order.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { useGetAllOrders } from '@/hooks/service-hooks/useOrderService';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Calendar, Clock, Package, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 text-[10px] rounded px-1.5 py-0">Pending</Badge>;
    case OrderStatus.Confirmed:
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 text-[10px] rounded px-1.5 py-0">Confirmed</Badge>;
    case OrderStatus.Shipped:
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 text-[10px] rounded px-1.5 py-0">Shipped</Badge>;
    case OrderStatus.Delivered:
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 text-[10px] rounded px-1.5 py-0">Delivered</Badge>;
    case OrderStatus.Cancelled:
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 text-[10px] rounded px-1.5 py-0">Cancelled</Badge>;
    case OrderStatus.Returned:
      return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 text-[10px] rounded px-1.5 py-0">Returned</Badge>;
    default:
      return <Badge variant="outline" className="text-[10px] rounded px-1.5 py-0">{status}</Badge>;
  }
};

const getStatusIconStyles = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
    case OrderStatus.Confirmed:
      return 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
    case OrderStatus.Shipped:
      return 'bg-purple-50 text-purple-500 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50';
    case OrderStatus.Delivered:
      return 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50';
    case OrderStatus.Cancelled:
      return 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50';
    case OrderStatus.Returned:
      return 'bg-orange-50 text-orange-500 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/50';
    default:
      return 'bg-primary/5 text-primary border-primary/10';
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
    <div>
      {orders.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <CardDescription>No recent orders found.</CardDescription>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-1">
          {orders.map((order) => {
            const customerName = order?.customer
              ? (order.customer.firstName || `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim())
              : null;

            return (
              <div
                key={order.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-2xl gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex w-11 h-11 rounded-2xl items-center justify-center border shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${getStatusIconStyles(order.status)}`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-extrabold text-sm md:text-base text-foreground hover:text-primary transition-colors truncate"
                      >
                        {order.orderNumber}
                      </Link>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        {new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 opacity-60" />
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </span>

                      {customerName && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                          <span className="flex items-center gap-1 font-semibold text-foreground/75 truncate max-w-[150px]">
                            <User className="w-3.5 h-3.5 opacity-60" />
                            {customerName}
                          </span>
                        </>
                      )}

                      {order.items && order.items.length > 0 && (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-[10px] h-5 px-2 text-muted-foreground border-border/50 font-medium cursor-help transition-colors hover:bg-muted/50 rounded flex items-center gap-1">
                                  <Package className="w-3 h-3 opacity-60" />
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
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="bg-muted/50 dark:bg-muted/20 border border-border/40 hover:border-primary/20 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 transition-all duration-300">
                    <span className="text-base font-extrabold text-foreground">
                      ${order.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-6.5 w-6.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
