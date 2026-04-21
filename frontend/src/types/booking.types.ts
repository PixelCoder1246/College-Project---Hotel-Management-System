import type { ApiResponse } from './auth.types';
import type { Room } from './room.types';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: BookingStatus;
  userId: string;
  roomId: string;
  room?: Room;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
}

export interface UpdateBookingRequest {
  checkIn?: string;
  checkOut?: string;
  roomId?: string;
  status?: BookingStatus;
}

export interface CheckAvailabilityRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
}

export type BookingResponse = ApiResponse<{ booking: Booking }>;
export type BookingsResponse = ApiResponse<{ bookings: Booking[] }>;
export type AvailabilityResponse = ApiResponse<{ isAvailable: boolean }>;
