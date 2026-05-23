import { LoginModel } from '@/models/login.model';
import * as Yup from 'yup';

const LoginSchema: Yup.ObjectSchema<LoginModel> = Yup.object().shape({
  email: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export default LoginSchema;
