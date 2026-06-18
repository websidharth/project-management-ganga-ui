export interface CreateUserModel {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  isRegisterbyShop?: boolean;
  role?: string;
}
