import { AxiosResponse } from 'axios';
import { LoginDto, refreshTokenResponseDto } from '@/dtos/LoginDto';
import Response from '@/dtos/Response';
import LoginModel from '@/models/LoginModel';
import PlainDto from '@/dtos/PlainDto';
import { CreateUserModel } from '@/models/user.model';

export default interface IAccountService {
  login_response_way(model: LoginModel): Promise<AxiosResponse<Response<LoginDto>>>;
  login(model: LoginModel): Promise<AxiosResponse<LoginDto>>;
  logout(token: string): Promise<AxiosResponse<Response<PlainDto>>>
  logoutAllSession(): Promise<AxiosResponse<Response<PlainDto>>>;
  getRefreshToken(token: string): Promise<AxiosResponse<Response<refreshTokenResponseDto>>>;
  createUser(model: CreateUserModel): Promise<AxiosResponse<Response<LoginDto>>>;
}
