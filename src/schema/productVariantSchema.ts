import * as Yup from 'yup';
import { CreateProductVariantModel } from '@/models/product-variant.model';

const ProductVariantSchema: Yup.ObjectSchema<CreateProductVariantModel> = Yup.object().shape({
    productId: Yup.number()
        .typeError('Product is required')
        .integer()
        .positive('Product is required')
        .required('Product is required'),
    brandName: Yup.string().optional(),
    size: Yup.string().optional(),
    material: Yup.string().optional(),
    voltage: Yup.string().optional(),
    color: Yup.string().optional(),
    extraSku: Yup.string().optional(),
    extraPrice: Yup.number().typeError('Must be a number').min(0).optional(),
    stock: Yup.number().typeError('Must be a number').integer().min(0).optional(),
    isDefault: Yup.boolean().optional(),
    status: Yup.string().required('Status is required'),
    displayOrder: Yup.number().typeError('Must be a number').integer().min(0).optional(),
});

export default ProductVariantSchema;
