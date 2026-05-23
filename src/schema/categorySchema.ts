import * as Yup from 'yup';
import { CreateCategoryModel } from '@/models/category.model';

const CategorySchema: Yup.ObjectSchema<CreateCategoryModel> = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().optional(),
    parentId: Yup.number().integer().positive().optional(),
});

export default CategorySchema;
