export interface Invoice {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  bookingDetails: {
    bookingId: string;
    checkIn: string;
    checkOut: string;
    roomNumber: string;
    roomType: string;
  };
  amount: {
    subtotal: number;
    tax: number;
    total: number;
  };
  status: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  method: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessPaymentPayload {
  bookingId: string;
  amount: number;
  method: string;
  transactionId?: string;
}
