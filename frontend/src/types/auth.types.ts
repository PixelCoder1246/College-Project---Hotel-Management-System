export type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
  trustedToken?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  rememberMe: boolean;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface LoginResponseData {
  requiresOtp: boolean;
  token?: string;
  trustedToken?: string | null;
  user?: User;
}

export interface VerifyOtpResponseData {
  token: string;
  trustedToken?: string | null;
  user: User;
}
