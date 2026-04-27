import React from 'react';
import type { Invoice } from '../types/payment';

interface InvoiceUIProps {
  invoice: Invoice;
}

const InvoiceUI: React.FC<InvoiceUIProps> = ({ invoice }) => {
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(invoice.bookingDetails.checkOut).getTime() -
        new Date(invoice.bookingDetails.checkIn).getTime()) /
        86400000
    )
  );

  return (
    <div className="invoice-panel">
      {/* Invoice Header */}
      <div className="invoice-header">
        <div>
          <div className="invoice-header__brand">⚜ Royal Orchid</div>
          <div className="invoice-header__label">Tax Invoice</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="invoice-header__number">{invoice.invoiceNumber}</div>
          <div className="invoice-header__date">
            {new Date(invoice.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="invoice-body">
        <div className="invoice-grid">
          {/* Billed To */}
          <div>
            <div className="invoice-section__label">Billed To</div>
            <div className="invoice-section__name">{invoice.customer.name}</div>
            <div className="invoice-section__text">
              {invoice.customer.email}
            </div>
            {invoice.customer.phone && (
              <div className="invoice-section__text">
                {invoice.customer.phone}
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div>
            <div className="invoice-section__label">Reservation Details</div>
            <div className="invoice-section__row">
              <strong>Booking ID</strong>
              {invoice.bookingDetails.bookingId.slice(0, 8).toUpperCase()}
            </div>
            <div className="invoice-section__row">
              <strong>Room</strong>
              {invoice.bookingDetails.roomNumber}
            </div>
            <div className="invoice-section__row">
              <strong>Type</strong>
              {invoice.bookingDetails.roomType}
            </div>
            <div className="invoice-section__row">
              <strong>Check-in</strong>
              {new Date(invoice.bookingDetails.checkIn).toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric', year: 'numeric' }
              )}
            </div>
            <div className="invoice-section__row">
              <strong>Check-out</strong>
              {new Date(invoice.bookingDetails.checkOut).toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric', year: 'numeric' }
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="invoice-table-wrap">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Nights</th>
                <th>Rate/Night</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {invoice.bookingDetails.roomType} Room —{' '}
                  {invoice.bookingDetails.roomNumber}
                </td>
                <td>{nights}</td>
                <td>₹{(invoice.amount.subtotal / nights).toFixed(2)}</td>
                <td>₹{invoice.amount.subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="invoice-total-row">
            <span className="invoice-total-label">Subtotal</span>
            <span className="invoice-total-value">
              ₹{invoice.amount.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="invoice-total-row">
            <span className="invoice-total-label">Tax (10%)</span>
            <span className="invoice-total-value">
              ₹{invoice.amount.tax.toFixed(2)}
            </span>
          </div>
          <div className="invoice-total-row">
            <span className="invoice-total-label">Total Due</span>
            <span className="invoice-total-value">
              ₹{invoice.amount.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceUI;
