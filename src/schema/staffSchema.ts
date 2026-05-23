import * as Yup from 'yup';
import { CreateStaffModel } from '@/models/staff.model';

const StaffSchema: Yup.ObjectSchema<CreateStaffModel> = Yup.object().shape({
    userId: Yup.number().typeError('User ID must be a number').required('User ID is required'),
    storeId: Yup.number().typeError('Store ID must be a number').required('Store ID is required'),
    position: Yup.string().nullable().optional(),
    department: Yup.string().nullable().optional(),
    hireDate: Yup.date().optional(),
    salary: Yup.number().typeError('Salary must be a number').min(0, 'Salary must be >= 0').nullable().optional(),
    isActive: Yup.boolean().optional(),
});

export default StaffSchema;
