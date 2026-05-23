export interface CreateUserModel {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
  googleId?: string;
  profileImage?: string;
}
