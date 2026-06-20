'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { ProductDto } from '@/dtos/product.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { useCreateOrder } from '@/hooks/service-hooks/useOrderService';
import { useGetAllProducts } from '@/hooks/service-hooks/useProductService';
import { Minus, Plus, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const CheckoutSchema = yup.object().shape({
  discount: yup.number().min(0, 'Must be >= 0').typeError('Must be a number').optional().default(0),
  tax: yup.number().min(0, 'Must be >= 0').typeError('Must be a number').optional().default(0),
  shippingCost: yup.number().min(0, 'Must be >= 0').typeError('Must be a number').optional().default(0),
  notes: yup.string().optional(),
});

type CheckoutFormValues = yup.InferType<typeof CheckoutSchema>;

interface CartItem extends ProductDto {
  cartQuantity: number;
}

export default function PurchasePage() {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const { data: session } = useSession();
  const customerId = '7659f57e-e2d1-465e-9f9b-4aa946d227e3';
  const { data: productsResponse, isLoading } = useGetAllProducts();
  const createOrderMutation = useCreateOrder();
  const [cart, setCart] = useState<Record<number, CartItem>>({});

  const form = useForm<CheckoutFormValues>({
    resolver: yupResolver(CheckoutSchema),
    defaultValues: { discount: 0, tax: 0, shippingCost: 0, notes: '' },
  });

  const products: ProductDto[] = productsResponse?.data?.data?.data || [];

  const handleAddToCart = (product: ProductDto) => {
    setCart((prev) => {
      const current = prev[product.id];
      const newQuantity = current ? current.cartQuantity + 1 : 1;

      if (newQuantity > product.stock) {
        toast({ variant: 'destructive', title: 'Out of stock', description: `Cannot add more than ${product.stock} items.` });
        return prev;
      }

      return {
        ...prev,
        [product.id]: { ...product, cartQuantity: newQuantity },
      };
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => {
      const current = prev[productId];
      if (!current) return prev;

      if (current.cartQuantity <= 1) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }

      return {
        ...prev,
        [productId]: { ...current, cartQuantity: current.cartQuantity - 1 },
      };
    });
  };

  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

  const { discount, tax, shippingCost } = form.watch();
  const grandTotal = totalAmount + (tax || 0) + (shippingCost || 0) - (discount || 0);

  const handleCheckout = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) return;

    if (!customerId) {
      toast({ variant: 'destructive', title: 'Checkout Failed', description: 'Customer ID is required. Please login or select a customer.' });
      return;
    }

    try {
      const orderPayload = {
        customerId,
        totalAmount,
        discount: data.discount || 0,
        tax: data.tax || 0,
        shippingCost: data.shippingCost || 0,
        grandTotal: grandTotal,
        status: OrderStatus.Pending,
        notes: data.notes,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.cartQuantity,
          unitPrice: item.price,
          totalPrice: item.price * item.cartQuantity,
        })),
      };

      const response = await createOrderMutation.mutateAsync(orderPayload);
      console.log('Order creation response:', orderPayload);
      if (response && (response.status === 201 || response.status === 200)) {
        toast({ variant: 'success', title: 'Order placed successfully' });
        setCart({});
      } else {
        const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast({ variant: 'destructive', title: 'Checkout Failed', description: <span>{error}</span> });
      }
    } catch (error: any) {
      const errorMessage = unitOfService.ErrorHandlerService.getErrorMessage(error);
      toast({ variant: 'destructive', title: 'Error', description: <span>{errorMessage || error.message || 'Unknown error occurred'}</span> });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground font-medium animate-pulse">Loading products...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 p-6 bg-slate-50/50">
      {/* Products Grid */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Available Products</h2>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none font-semibold px-3 py-1">
            {products.length} Products
          </Badge>
        </div>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-6">
            {products.map((product) => {
              const inCartQty = cart[product.id]?.cartQuantity || 0;
              const isLowStock = product.stock <= (product.lowStockThreshold || 5);

              return (
                <Card key={product.id} className="group relative overflow-hidden bg-card border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col h-full justify-between">
                  <div className="aspect-[4/3] bg-slate-100/60 relative overflow-hidden flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">📦</span>
                    )}

                    {/* Low stock badge */}
                    {product.stock > 0 && isLowStock && (
                      <Badge className="absolute top-3 left-3 border-none bg-rose-500 text-white font-medium text-[10px] shadow-sm">
                        Low Stock
                      </Badge>
                    )}

                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[2px]">
                        <Badge className="bg-rose-500 text-white font-semibold text-xs border-none shadow-sm px-2.5 py-1">Out of Stock</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className={`text-xs font-semibold ${product.stock <= 0 ? 'text-rose-500' : 'text-slate-600'}`}>
                          {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <span className="text-lg font-bold text-slate-800">${product.price.toFixed(2)}</span>
                      {inCartQty > 0 ? (
                        <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg p-0.5 border border-border/60">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleRemoveFromCart(product.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 text-center text-xs font-bold text-slate-800">{inCartQty}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md"
                            onClick={() => handleAddToCart(product)}
                            disabled={inCartQty >= product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className="h-8 rounded-lg font-medium px-4 shadow-sm hover:shadow"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Sidebar */}
      <Card className="w-[380px] flex flex-col h-full shadow-xl border-border/40 overflow-hidden rounded-2xl bg-card">
        <CardHeader className="border-b px-4 py-3 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <div className="p-1 rounded-md bg-primary/10 text-primary">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
            Current Order
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50/10">
          <ScrollArea className="h-full">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2.5">
                <div className="p-3.5 rounded-full bg-slate-100 text-muted-foreground/35">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-400">Your cart is empty</p>
              </div>
            ) : (
              <div className="p-3.5 space-y-2.5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-2.5 bg-card p-2.5 rounded-xl border border-border/45 shadow-sm items-center hover:border-primary/15 transition-all">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-border/30">
                      {item.images && item.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-base">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-semibold text-slate-700 truncate">{item.name}</h4>
                      <p className="text-xs text-primary font-bold mt-0.5">${(item.price * item.cartQuantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100/80 rounded-lg p-0.5 border border-border/40">
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md" onClick={() => handleRemoveFromCart(item.id)}>
                        <Minus className="h-2.5 w-2.5" />
                      </Button>
                      <span className="w-4 text-center text-[10px] font-bold text-slate-700">{item.cartQuantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-md"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.cartQuantity >= item.stock}
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <div className="bg-card border-t border-border/40">
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-3" autoComplete="off">
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-8 rounded-lg text-xs"
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tax ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-8 rounded-lg text-xs"
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add special instructions..." {...field} value={field.value ?? ''} className="min-h-[45px] h-[45px] rounded-lg text-xs py-1.5 px-2.5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2.5 border-t border-border/40 space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-0.5">
                    <span className="text-xs font-bold text-slate-700">Grand Total</span>
                    <span className="text-base font-black text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-9 text-xs font-bold shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] rounded-lg transition-all mt-2.5"
                  disabled={cartItems.length === 0 || createOrderMutation.isPending}
                  type="submit"
                  loading={createOrderMutation.isPending}
                >
                  Complete Purchase
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}
