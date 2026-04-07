import api from '../api/axios';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  User,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from '../types/auth.types';

export const registerUser = async (
  data: RegisterRequest
): Promise<ApiResponse<{ user: User }>> => {
  const res = await api.post('/api/auth/register', data);
  return res.data;
};

export const loginUser = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponseData>> => {
  const res = await api.post('/api/auth/login', data);
  return res.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<ApiResponse<VerifyOtpResponseData>> => {
  const res = await api.post('/api/auth/verify-otp', data);
  return res.data;
};

export const getMe = async (): Promise<ApiResponse<{ user: User }>> => {
  const res = await api.get('/api/auth/me');
  return res.data;
};
