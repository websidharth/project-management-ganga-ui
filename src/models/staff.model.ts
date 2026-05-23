export interface CreateStaffModel {
    userId: number;
    storeId: number;
    position?: string | null;
    department?: string | null;
    hireDate?: Date;
    salary?: number | null;
    isActive?: boolean;
}

export interface UpdateStaffModel extends Partial<CreateStaffModel> { }
