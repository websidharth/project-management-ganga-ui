"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetOrderById } from "@/hooks/service-hooks/useOrderService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Store, 
  DollarSign, 
  ShoppingBag, 
  FileText,
  BadgeAlert,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsViewProps {
  id: number;
  onEdit?: (id: number) => void;
}

export default function OrderDetailsView({ id, onEdit }: OrderDetailsViewProps) {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { data: response, isLoading, isError } = useGetOrderById(id);
  const order = response?.data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 max-w-2xl mx-auto p-6 text-center">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive w-fit mx-auto mb-4">
          <BadgeAlert className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-lg text-destructive">Failed to Load Order</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          The requested order ID may be invalid or you do not have permission to view it.
        </p>
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
        </Button>
      </Card>
    );
  }

  const datePlaced = order.createdAt 
    ? unitOfService.DateTimeService.convertToLocalDate(order.createdAt, true) 
    : "—";

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    SHIPPED: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    CANCELLED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    RETURNED: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  };

  const appliedColor = statusColors[order.status?.toUpperCase()] || "bg-slate-500/10 text-slate-600 border-slate-500/20";

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
              #{order.orderNumber}
            </span>
            <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${appliedColor}`}>
              {order.status}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Date Placed: {datePlaced}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {onEdit && (
            <Button size="sm" onClick={() => onEdit(order.id)}>
              <Edit2 className="h-4 w-4 mr-2" /> Edit Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Products List */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/50 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-muted/40 border-b border-border/40 py-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Ordered Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/20 text-muted-foreground font-medium text-xs uppercase">
                      <th className="p-4 w-[100px]">Product ID</th>
                      <th className="p-4">Unit Price</th>
                      <th className="p-4 text-center">Quantity</th>
                      <th className="p-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(order.items || []).map((item: any) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-mono text-xs font-semibold">
                          ID: {item.productId}
                        </td>
                        <td className="p-4 text-foreground font-medium">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="p-4 text-center text-foreground font-medium">
                          {item.quantity}
                        </td>
                        <td className="p-4 text-right text-foreground font-semibold">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {(!order.items || order.items.length === 0) && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No items in this order
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          {order.notes && (
            <Card className="border border-border/50 shadow-sm rounded-xl">
              <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground bg-muted/25 p-3 rounded-lg border">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card className="border border-border/50 shadow-sm rounded-xl">
            <CardHeader className="py-4 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block">
                  Customer ID
                </span>
                <span className="text-sm font-semibold text-foreground break-all select-all">
                  {order.customerId}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Store Info Card */}
          <Card className="border border-border/50 shadow-sm rounded-xl">
            <CardHeader className="py-4 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                Store details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium block">
                  Store Code
                </span>
                <span className="text-sm font-semibold text-foreground uppercase">
                  {order.storeCode}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Card */}
          <Card className="border border-border/50 shadow-sm rounded-xl bg-muted/10">
            <CardHeader className="py-4 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-rose-500">-${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">Grand Total</span>
                <span className="text-lg font-bold text-primary">${order.grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
