import * as Yup from 'yup';
import { CreateProductVariantModel } from '@/models/product-variant.model';

const ProductVariantSchema: Yup.ObjectSchema<CreateProductVariantModel> = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    slug: Yup.string().optional(),
    productId: Yup.number().required('Product is required'),
    brandNameId:Yup.string().matches(/^[0-9]+$/, 'BrandNameId must contain only numbers').optional(),
    productAttributeId:Yup.string().matches(/^[0-9]+$/, 'ProductAttributeId must contain only numbers').optional(),
    attributeId:Yup.string().matches(/^[0-9]+$/, 'AttributeId must contain only numbers').optional(),
    cost:Yup.string().matches(/^[0-9]+$/, 'Cost must contain only numbers').required('Cost is required'),
    Price:Yup.string().matches(/^[0-9]+$/, 'Price must contain only numbers').required('Price is required'),
    stock:Yup.string().matches(/^[0-9]+$/, 'stock must contain only numbers').required('Stock is required'),
    lowStockThreshold:Yup.string().matches(/^[0-9]+$/, 'stock must contain only numbers').optional(),
    status: Yup.string().required('Status is required'),
    displayOrder: Yup.number().typeError('Must be a number').integer().min(0, 'Display order must be >= 0').nullable().optional(),
    isDefault: Yup.boolean().optional(),
});

export default ProductVariantSchema;
 
 
 
 