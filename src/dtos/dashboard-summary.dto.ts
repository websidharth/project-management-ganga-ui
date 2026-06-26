export interface DashboardProductDto {
  id: number;
  name: string;
  brandNameId: number;
  slug: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  categoryId: number;
  images: string[];
  storeId: number | null;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  updatedById: number | null;
}

export interface DashboardAttributeDto {
  id: number;
  name: string;
  unit: string;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardProductVariantDto {
  id: number;
  productId: number;
  brandName: string;
  varient: string | null;
  size: string;
  material: string;
  voltage: string;
  color: string;
  extraSku: string;
  extraPrice: number;
  stock: number;
  isDefault: boolean;
  status: string;
  displayOrder: number;
}

export interface DashboardProductAttributeDto {
  id: number;
  productId: number;
  attributeId: number;
  value: string;
  status: string;
  displayOrder: number;
}

export interface CategoryDistributionDto {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardSummaryDto {
  products: {
    total: number;
    recent: DashboardProductDto[];
  };
  attributes: {
    total: number;
    recent: DashboardAttributeDto[];
  };
  todaySale: number;
  totalMonthSale: number;
  categoryDistribution?: CategoryDistributionDto[];
}
