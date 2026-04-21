import api from '../api/axios';
import {
  type AvailabilityResponse,
  type BookingResponse,
  type CheckAvailabilityRequest,
  type CreateBookingRequest,
  type UpdateBookingRequest,
} from '../types/booking.types';

export const checkAvailability = async (
  data: CheckAvailabilityRequest
): Promise<AvailabilityResponse> => {
  const params = new URLSearchParams({
    roomId: data.roomId,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
  });
  const res = await api.get(`/api/bookings/check-availability?${params.toString()}`);
  return res.data;
};

export const createBooking = async (
  data: CreateBookingRequest
): Promise<BookingResponse> => {
  const res = await api.post('/api/bookings', data);
  return res.data;
};

export const updateBooking = async (
  id: string,
  data: UpdateBookingRequest
): Promise<BookingResponse> => {
  const res = await api.patch(`/api/bookings/${id}`, data);
  return res.data;
};

export const getAllBookings = async (filters?: { status?: string; userId?: string; roomId?: string }): Promise<{ data: { bookings: any[] } }> => {
  const res = await api.get('/api/bookings', { params: filters });
  return res.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await api.delete(`/api/bookings/${id}`);
};

export const getBookingById = async (id: string): Promise<BookingResponse> => {
  const res = await api.get(`/api/bookings/${id}`);
  return res.data;
};
