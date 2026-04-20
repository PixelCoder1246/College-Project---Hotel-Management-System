import api from '../api/axios';
import type { ApiResponse } from '../types/auth.types';
import type { ProfileResponseData, BookingsResponseData } from '../types/user.types';
import type { User } from '../types/auth.types';

export const getProfile = async (): Promise<ApiResponse<ProfileResponseData>> => {
  const response = await api.get('/api/user/profile');
  return response.data;
};

export const updateProfile = async (
  data: Partial<User>
): Promise<ApiResponse<ProfileResponseData>> => {
  const response = await api.patch('/api/user/profile', data);
  return response.data;
};

export const getBookingHistory = async (): Promise<ApiResponse<BookingsResponseData>> => {
  const response = await api.get('/api/user/bookings');
  return response.data;
};
