export interface ProductVariantDto {
id: number;
  name: string;
  slug?: string | null;
  productId: number;
  brandNameId?: number | null;
  productAttributeId?: number | null;
  storeCode: string
  attributeId?: number | null;
  cost: number;
  Price: number;
  stock: number;
  lowStockThreshold?: number | null;
  images: string[];
  status: string;
  displayOrder?: number | null;
  createdAt: Date;
  updatedAt?: Date | null;
  isDefault: boolean;
  extraPrice?: number | null;
  varient?: string | null;
  size?: string | null;
  material?: string | null;
  voltage?: string | null;
  color?: string | null;
  extraSku?: string | null;
}
