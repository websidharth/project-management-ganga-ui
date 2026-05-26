export interface CreateUserModel {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string; 
  profileImage?: string;
  isRegisterbyShop?: boolean;
}
