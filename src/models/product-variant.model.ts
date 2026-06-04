export interface CreateProductVariantModel {
  name: string;
  slug?: string;
  productId: number;
  brandNameId?: number;
  productAttributeId?: number | null; 
  attributeId?: number | null;
  cost?: number;
  Price?: number;
  stock?: number;
  lowStockThreshold?: number | null;
  status : string ;
  displayOrder?: number | null;
  isDefault?: boolean;
}

export interface UpdateProductVariantModel extends Partial<CreateProductVariantModel> { }
