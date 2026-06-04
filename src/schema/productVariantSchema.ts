import * as Yup from 'yup';
import { CreateProductVariantModel } from '@/models/product-variant.model';

const ProductVariantSchema: Yup.ObjectSchema<CreateProductVariantModel> = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    slug: Yup.string().optional(),
    productId: Yup.number()
        .typeError('Product is required')
        .integer()
        .positive('Product is required')
        .required('Product is required'),
    brandNameId: Yup.number().typeError('Brand must be a number').integer().positive().optional(),
    productAttributeId: Yup.number().typeError('Must be a number').integer().positive().nullable().optional(),
    attributeId: Yup.number().typeError('Must be a number').integer().positive().nullable().optional(),
    cost: Yup.number().typeError('Cost must be a number').min(0, 'Cost must be >= 0').optional(),
    Price: Yup.number().typeError('Price must be a number').min(0, 'Price must be >= 0').optional(),
    stock: Yup.number().typeError('Stock must be a number').integer().min(0, 'Stock must be >= 0').optional(),
    lowStockThreshold: Yup.number().typeError('Low stock threshold must be a number').integer().min(0, 'Low stock threshold must be >= 0').nullable().optional(),
    status: Yup.string().required('Status is required'),
    displayOrder: Yup.number().typeError('Must be a number').integer().min(0, 'Display order must be >= 0').nullable().optional(),
    isDefault: Yup.boolean().optional(),
});

export default ProductVariantSchema;
 
 