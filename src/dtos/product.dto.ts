export interface ProductDto {
    id: number;
    name: string;
    slug: string;
    brandNameId?: number | null;
    description?: string | null;
    sku: string;
    price: number;
    cost?: number | null;
    stock: number;
    lowStockThreshold?: number | null;
    categoryId: number;
    images: string[];
    createdById: number;
    updatedById?: number | null;
    createdAt: Date;
    storeId?: number | null;
    displayOrder?: number | null;
    updatedAt: Date | null;
    status?: string;
}
