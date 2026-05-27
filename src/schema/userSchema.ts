import * as Yup from 'yup';
import { CreateUserModel } from '@/models/user.model';

export const SignupSchema: Yup.ObjectSchema<CreateUserModel> = Yup.object().shape({
  firstName: Yup.string().min(3, 'Name must be at least 3 characters'),
  lastName: Yup.string().min(3, 'Name must be at least 3 characters'),
  email: Yup.string().required('Email is required').email('Invalid email address'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  phone: Yup.string().min(10, 'Phone number must be at least 10 digits').optional(),
  googleId: Yup.string().optional(),
  isRegisterbyShop: Yup.boolean().optional(),
});

export default SignupSchema;
