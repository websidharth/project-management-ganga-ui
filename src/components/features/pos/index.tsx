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
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { ProductDto } from '@/dtos/product.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { useCreateOrder } from '@/hooks/service-hooks/useOrderService';
import { useGetAllProducts } from '@/hooks/service-hooks/useProductService';
import { MinusIcon, PlusIcon, ShoppingCart } from 'lucide-react';
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

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-6">
      {/* Products Grid */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Available Products</h2>
        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/20 flex flex-col">
                <div className="aspect-square bg-muted/20 relative">
                  {product.images && product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl">📦</div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[1px]">
                      <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-semibold leading-tight line-clamp-2">{product.name}</CardTitle>
                    <Badge variant={product.stock > (product.lowStockThreshold || 5) ? 'default' : 'destructive'} className="shrink-0">
                      {product.stock} left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0 || (cart[product.id]?.cartQuantity || 0) >= product.stock}
                  >
                    Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Sidebar */}
      <Card className="w-[380px] flex flex-col h-full shadow-lg border-primary/10 bg-gradient-to-b from-background to-muted/10">
        <CardHeader className="border-b bg-card">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Current Order
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
                <ShoppingCart className="w-10 h-10 opacity-20" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-background p-3 rounded-lg border shadow-sm items-center">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden shrink-0">
                      {item.images && item.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-primary font-bold">${(item.price * item.cartQuantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1 border">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm" onClick={() => handleRemoveFromCart(item.id)}>
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.cartQuantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.cartQuantity >= item.stock}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <div className="bg-card">
          <Separator />
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-4" autoComplete="off">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
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
                      <FormItem>
                        <FormLabel>Tax ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
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
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Order notes..." {...field} value={field.value ?? ''} className="min-h-[60px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 border-t mt-4 space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold shadow-md mt-4"
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
