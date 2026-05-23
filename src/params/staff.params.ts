import { PageFilterParams } from './pagination.params';

export interface StaffFilterParams extends PageFilterParams {
    storeId?: number;
    isActive?: boolean;
    department?: string;
    position?: string;
}
