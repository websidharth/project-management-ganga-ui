export interface CreateProductVariantModel {
  name: string;
  slug?: string;
  productId: number;
  brandNameId?: string | null;
  productAttributeId?: string | null; 
  attributeId?: string | null;
  cost?: string | null;
  Price?: string | null;
  stock?: string | null;
  lowStockThreshold?: string | null;
  status : string;
  displayOrder?: number | null;
  isDefault?: boolean;
}

export interface UpdateProductVariantModel extends Partial<CreateProductVariantModel> { }