// export interface CreateProductModel {
//     name: string;
//     slug: string;
//     description?: string;
//     sku: string;
//     price: number;
//     cost?: number;
//     stock?: number;
//     lowStockThreshold?: number;
//     categoryId: number;
//     images?: string[];
//     status?: boolean;
// }

export interface CreateProductModel {
    name: string;
    brandNameId?: number | null;
    slug: string;
    description?: string | null;
    sku: string;
    price: number;
    cost?: number | null;
    stock?: number;
    lowStockThreshold?: number | null;
    categoryId: number;
    images?: string[];
    storeId?: number | null;
    status?: string;
    displayOrder?: number | null;
    createdById?: number;
    updatedAt?: Date | null;
    updatedById?: number | null;
}

export interface UpdateProductModel extends Partial<CreateProductModel> { }
