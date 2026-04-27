import api from '../api/axios';
import type { Invoice, Payment, ProcessPaymentPayload } from '../types/payment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const generateInvoice = async (bookingId: string): Promise<Invoice> => {
  const response = await api.get<ApiResponse<Invoice>>(
    `/payment/invoice/${bookingId}`
  );
  return response.data.data;
};

export const processPayment = async (
  payload: ProcessPaymentPayload
): Promise<Payment> => {
  const response = await api.post<ApiResponse<Payment>>(
    '/payment/process',
    payload
  );
  return response.data.data;
};

export const getPaymentStatus = async (
  bookingId: string
): Promise<Payment[]> => {
  const response = await api.get<ApiResponse<Payment[]>>(
    `/payment/booking/${bookingId}`
  );
  return response.data.data;
};
