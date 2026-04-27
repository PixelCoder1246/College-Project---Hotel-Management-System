import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBookings, updateBooking } from '../services/booking.service';
import type { Booking } from '../types/booking.types';
import '../styles/bookings.css';

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '⏳' },
  CONFIRMED: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '✅' },
  CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '✕' },
  COMPLETED: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: '🏁' },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      setBookings(res.data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateBooking(id, { status });
      toast.success(`Booking marked as ${status.toLowerCase()}.`);
      fetchBookings();
    } catch {
      toast.error('Failed to update booking status');
    }
  };

  const filtered = filter
    ? bookings.filter((b) => b.status === filter)
    : bookings;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="booking-page">
      <div
        className="booking-page__header"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="booking-page__title">Booking Management</h1>
          <p className="booking-page__subtitle">
            Review, confirm, or cancel all guest reservations
          </p>
        </div>
        <select
          className="form-input"
          style={{ width: 'auto' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p>Loading all reservations…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📅</div>
          <p className="empty-state__text">
            No bookings found{filter ? ` with status "${filter}"` : ''}.
          </p>
        </div>
      ) : (
        <div className="booking-list">
          {filtered.map((booking) => {
            const status =
              STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card__icon">🏨</div>

                <div className="booking-card__info">
                  <div className="booking-card__room">
                    Room {booking.room?.roomNumber}
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginLeft: '0.5rem',
                        fontWeight: 400,
                      }}
                    >
                      {booking.room?.type}
                    </span>
                  </div>
                  <div className="booking-card__dates">
                    👤 {booking.user?.name}
                    <span
                      style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}
                    >
                      ·
                    </span>
                    {formatDate(booking.checkIn)} →{' '}
                    {formatDate(booking.checkOut)}
                  </div>
                  <div
                    className="booking-card__price"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {booking.user?.email}
                    <span
                      style={{
                        marginLeft: '0.75rem',
                        color: 'var(--accent)',
                        fontWeight: 700,
                      }}
                    >
                      ₹{booking.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="booking-card__actions">
                  <span
                    className="room-badge"
                    style={{
                      background: status.bg,
                      color: status.color,
                      borderColor: `${status.color}40`,
                    }}
                  >
                    {status.icon} {booking.status}
                  </span>

                  {booking.status === 'PENDING' && (
                    <button
                      className="btn btn--outline-success btn--sm"
                      onClick={() =>
                        handleStatusUpdate(booking.id, 'CONFIRMED')
                      }
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status !== 'CANCELLED' &&
                    booking.status !== 'COMPLETED' && (
                      <button
                        className="btn btn--outline-danger btn--sm"
                        onClick={() =>
                          handleStatusUpdate(booking.id, 'CANCELLED')
                        }
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
