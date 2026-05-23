import * as Yup from 'yup';
import { CreateProductModel } from '@/models/product.model';

const ProductSchema: Yup.ObjectSchema<CreateProductModel> = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    slug: Yup.string().required('Slug is required'),
    sku: Yup.string().required('SKU is required'),
    price: Yup.number().typeError('Price must be a number').min(0, 'Price must be >= 0').required('Price is required'),
    categoryId: Yup.number().typeError('Category is required').required('Category is required'),
    createdById: Yup.number().typeError('Created by is required').required('Created by is required'),
    description: Yup.string().nullable().optional(),
    cost: Yup.number().typeError('Cost must be a number').min(0, 'Cost must be >= 0').nullable().optional(),
    stock: Yup.number().typeError('Stock must be a number').min(0, 'Stock must be >= 0').optional(),
    lowStockThreshold: Yup.number().typeError('Low stock threshold must be a number').min(0).nullable().optional(),
    brandNameId: Yup.number().typeError('Brand must be a number').nullable().optional(),
    storeId: Yup.number().typeError('Store must be a number').nullable().optional(),
    displayOrder: Yup.number().typeError('Display order must be a number').nullable().optional(),
    images: Yup.array().of(Yup.string().required()).optional(),
    status: Yup.string().optional(),
    updatedAt: Yup.date().optional(),
    updatedById: Yup.number().nullable().optional(),
});

export default ProductSchema;
