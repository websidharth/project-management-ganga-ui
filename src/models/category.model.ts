export interface CreateCategoryModel {
    name: string;
    description?: string;
    parentId?: number;
}

export interface UpdateCategoryModel extends Partial<CreateCategoryModel> { }
