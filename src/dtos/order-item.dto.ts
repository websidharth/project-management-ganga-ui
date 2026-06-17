export interface OrderItemDto {
  id: number;
  orderId: number;
  orderNumber: string;
  productId: number;
  storeCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}
