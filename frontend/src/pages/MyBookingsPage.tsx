import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBookingHistory } from '../services/user.service';
import { cancelBooking } from '../services/booking.service';
import type { Booking } from '../types/booking.types';
import '../styles/bookings.css';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  PENDING: {
    label: 'Pending',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    icon: '⏳',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    icon: '✅',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    icon: '✕',
  },
  COMPLETED: {
    label: 'Completed',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    icon: '🏁',
  },
};

const TYPE_ICONS: Record<string, string> = {
  SINGLE: '🛏️',
  DOUBLE: '🛏️',
  DELUXE: '✨',
  SUITE: '👑',
};

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookingHistory();
      setBookings(res.data.bookings);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?'))
      return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully.');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const calcNights = (checkIn: string, checkOut: string) =>
    Math.max(
      1,
      Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
      )
    );

  return (
    <div className="booking-page">
      <div className="booking-page__header">
        <h1 className="booking-page__title">My Reservations</h1>
        <p className="booking-page__subtitle">
          Manage your upcoming and past stays
        </p>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p>Loading your reservations…</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📅</div>
          <p className="empty-state__text">
            You haven't made any reservations yet. Start exploring our rooms!
          </p>
          <button
            className="btn btn--primary mt-2"
            onClick={() => navigate('/rooms')}
          >
            Browse Rooms →
          </button>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => {
            const status =
              STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
            const nights = calcNights(booking.checkIn, booking.checkOut);
            const roomType = booking.room?.type || 'SINGLE';

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card__icon">
                  {TYPE_ICONS[roomType] || '🛏️'}
                </div>

                <div className="booking-card__info">
                  <div className="booking-card__room">
                    Room {booking.room?.roomNumber || 'N/A'}
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginLeft: '0.5rem',
                        fontWeight: 400,
                      }}
                    >
                      {roomType}
                    </span>
                  </div>
                  <div className="booking-card__dates">
                    📅 {formatDate(booking.checkIn)} →{' '}
                    {formatDate(booking.checkOut)}
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      ({nights} night{nights > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="booking-card__price">
                    ₹{booking.totalPrice.toFixed(2)} total
                  </div>
                </div>

                <div className="booking-card__actions">
                  {/* Status Badge */}
                  <span
                    className="room-badge"
                    style={{
                      background: status.bg,
                      color: status.color,
                      borderColor: `${status.color}40`,
                    }}
                  >
                    {status.icon} {status.label}
                  </span>

                  {/* Pay Now (PENDING only) */}
                  {booking.status === 'PENDING' && (
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => navigate(`/payment/${booking.id}`)}
                    >
                      Pay Now
                    </button>
                  )}

                  {/* Cancel (not already cancelled/completed) */}
                  {booking.status !== 'CANCELLED' &&
                    booking.status !== 'COMPLETED' && (
                      <button
                        className="btn btn--outline-danger btn--sm"
                        onClick={() => handleCancel(booking.id)}
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
