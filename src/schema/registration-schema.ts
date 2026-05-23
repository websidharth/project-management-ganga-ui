import RegistrationModel from '@/models/registration-model';
import * as Yup from 'yup';

const RegistrationSchema: Yup.ObjectSchema<RegistrationModel> = Yup.object().shape({
  name: Yup.string().required('Full name is required').min(2, 'Minimum 2 characters required').max(50, 'Maximum 50 characters allowed'),
  email: Yup.string().required('Email is required').email('Please enter a valid email address'),
  phone: Yup.string().required('Phone is required').min(10, 'Phone number must be at least 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: Yup.string(),
});

export default RegistrationSchema;
