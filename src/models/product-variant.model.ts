export interface CreateProductVariantModel {
  name: string;
  slug?: string;
  productId: number; 
  productAttributeId?: string | null; 
  attributeId?: string | null;
  cost?: string | null;
  Price?: string | null;
  stock?: string | null;
  lowStockThreshold?: string | null;
  status : string;
}