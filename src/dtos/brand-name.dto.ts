export interface BrandNameDto {
    id: number;
    brandName: string;
    status: string;
    displayOrder?: number | null;
    categoryId?: number | null;
    createdAt: Date;
    updatedAt: Date | null;
}
