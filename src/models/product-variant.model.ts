export interface CreateProductVariantModel {
    productId: number;
    brandName?: string;
    size?: string;
    material?: string;
    voltage?: string;
    color?: string;
    extraSku?: string;
    extraPrice?: number;
    stock?: number;
    isDefault?: boolean;
    status: string;
    displayOrder?: number;
}

export interface UpdateProductVariantModel extends Partial<CreateProductVariantModel> { }
