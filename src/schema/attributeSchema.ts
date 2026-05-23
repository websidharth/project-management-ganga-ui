import * as Yup from 'yup';
import { CreateAttributeModel } from '@/models/attribute.model';

const AttributeSchema: Yup.ObjectSchema<CreateAttributeModel> = Yup.object().shape({
    name: Yup.string().min(1, 'Name is required').required('Name is required'),
    unit: Yup.string().nullable().optional(),
    status: Yup.string().oneOf(['Published', 'Draft'], 'Status must be Published or Draft').required('Status is required'),
    displayOrder: Yup.number().nullable().optional(),
});

export default AttributeSchema;
