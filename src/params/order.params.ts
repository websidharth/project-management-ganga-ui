import { PageFilterParams } from "./page.params";

export interface OrderFilterParams extends PageFilterParams {
  status?: string | null;
  customerId?: string | null;
}

export interface OrderItemFilterParams extends PageFilterParams {
  orderId?: number | null;
}
