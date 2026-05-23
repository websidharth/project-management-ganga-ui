export interface ProductVariantDto {
    id: number;
    productId: number;
    brandName?: string | null;
    size?: string | null;
    material?: string | null;
    voltage?: string | null;
    color?: string | null;
    extraSku?: string | null;
    extraPrice?: number | null;
    stock: number;
    isDefault: boolean;
    status: string;
    displayOrder?: number | null;
}
