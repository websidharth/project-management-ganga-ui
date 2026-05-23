import * as Yup from 'yup';
import { CreateBrandNameModel } from '@/models/brand-name.model';

const BrandNameSchema: Yup.ObjectSchema<CreateBrandNameModel> = Yup.object().shape({
    brandName: Yup.string().required('Brand name is required'),
    status: Yup.string().required('Status is required'),
    displayOrder: Yup.number().optional().default(0),
    categoryIds: Yup.array().of(Yup.number().required()).optional().default([]),
});

export default BrandNameSchema;
