import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateInvoice, processPayment } from '../services/payment.service';
import type { Invoice } from '../types/payment';
import InvoiceUI from '../components/InvoiceUI';
import '../styles/payment.css';

// Map frontend labels → Prisma PaymentMethod enum values
const METHOD_ENUM: Record<string, string> = {
  'Credit Card': 'CREDIT_CARD',
  'Debit Card': 'DEBIT_CARD',
  UPI: 'UPI',
  PayPal: 'PAYPAL',
  Cash: 'CASH',
};

const METHODS = [
  { key: 'Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { key: 'Debit Card', icon: '🏦', desc: 'Direct bank card payment' },
  { key: 'UPI', icon: '📱', desc: 'Instant UPI transfer' },
  { key: 'PayPal', icon: '🅿️', desc: 'Pay with your PayPal wallet' },
];

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('Credit Card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!bookingId) return;
      try {
        setLoading(true);
        setError('');
        const data = await generateInvoice(bookingId);
        setInvoice(data);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(
          err.response?.data?.message ||
            'Failed to load invoice. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [bookingId]);

  const handlePayment = async () => {
    if (!bookingId || !invoice) return;
    try {
      setProcessing(true);
      setError('');
      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 1800));

      const payment = await processPayment({
        bookingId,
        amount: invoice.amount.total,
        method: METHOD_ENUM[method] || 'CREDIT_CARD',
      });

      const generatedTxn =
        (payment as { transactionId?: string }).transactionId ||
        `TXN-${Date.now()}`;
      setTxnId(generatedTxn);
      setPaymentSuccess(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(
        err.response?.data?.message || 'Payment failed. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  // ── Loading state ───────────────────────────────
  if (loading) {
    return (
      <div className="payment-loading">
        <div className="loading-spinner" />
        <p>Generating your invoice…</p>
      </div>
    );
  }

  // ── Invoice fetch error ─────────────────────────
  if (error && !invoice) {
    return (
      <div className="payment-loading">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>
        <button
          className="btn btn--secondary"
          onClick={() => navigate('/my-bookings')}
        >
          ← Return to Bookings
        </button>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="payment-success__card">
          <span className="payment-success__icon">✅</span>
          <h2 className="payment-success__title">Payment Successful!</h2>
          <p className="payment-success__text">
            Your reservation has been confirmed. A receipt will be sent to your
            email shortly.
          </p>
          <button
            className="btn btn--primary w-full"
            onClick={() => navigate('/my-bookings')}
          >
            View My Bookings
          </button>
          <button
            className="btn btn--ghost w-full mt-1"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
          {txnId && (
            <div className="payment-success__txn">Transaction ID: {txnId}</div>
          )}
        </div>
      </div>
    );
  }

  // ── Main payment page ───────────────────────────
  return (
    <div className="payment-page">
      <div className="payment-page__inner">
        {/* Left: Invoice */}
        {invoice && <InvoiceUI invoice={invoice} />}

        {/* Right: Payment Panel */}
        <div className="payment-panel">
          <h2 className="payment-panel__title">Complete Payment</h2>
          <p className="payment-panel__subtitle">
            Choose your preferred payment method below
          </p>

          {/* Amount Box */}
          {invoice && (
            <div className="payment-amount-box">
              <div className="payment-amount-label">Total Amount Due</div>
              <div className="payment-amount-value">
                ₹{invoice.amount.total.toFixed(2)}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="payment-method-list">
            {METHODS.map((m) => (
              <div
                key={m.key}
                className={`payment-method-option${method === m.key ? ' payment-method-option--selected' : ''}`}
                onClick={() => setMethod(m.key)}
                role="radio"
                aria-checked={method === m.key}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setMethod(m.key)}
              >
                <div className="payment-method-option__icon">{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <span className="payment-method-option__label">{m.key}</span>
                  <span className="payment-method-option__desc">{m.desc}</span>
                </div>
                <div className="payment-method-option__check" />
              </div>
            ))}
          </div>

          {/* Error */}
          {error && <div className="alert alert--error">⚠ {error}</div>}

          {/* Pay Button */}
          <button
            className="btn btn--primary w-full"
            onClick={handlePayment}
            disabled={processing || !invoice}
          >
            {processing ? (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <span className="spinner spinner--sm" />
                Processing payment…
              </span>
            ) : (
              `Pay ₹${invoice?.amount.total.toFixed(2)} via ${method}`
            )}
          </button>

          <div className="payment-secure-note">
            🔒 Secured by MockPay · All transactions are encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
