import { PageFilterParams } from './product.params';

export interface BrandNameFilterParams extends PageFilterParams {
    status?: string | null;
}
