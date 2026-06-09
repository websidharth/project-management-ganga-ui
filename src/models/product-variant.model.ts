export interface CreateProductVariantModel {
  name: string;
  slug?: string;
  productId: number; 
  productAttributeId?: number; 
  attributeId?: number;
  cost?: string | null;
  Price?: string | null;
  stock?: string | null;
  lowStockThreshold?: string | null;
  status : string;
}