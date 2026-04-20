import type { User } from './auth.types';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponseData {
  user: User;
}

export interface BookingsResponseData {
  bookings: Booking[];
}
