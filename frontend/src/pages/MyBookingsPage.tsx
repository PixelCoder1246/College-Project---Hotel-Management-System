import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getBookingHistory } from '../services/user.service';
import { cancelBooking } from '../services/booking.service';
import type { Booking } from '../types/booking.types';
import '../styles/bookings.css';

export default function MyBookingsPage() {
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
      toast.success('Booking cancelled');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="booking-page">
      <h1 className="room-mgmt__title" style={{ marginBottom: '2rem' }}>
        My Bookings
      </h1>

      {loading ? (
        <div className="empty-state">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📅</div>
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card__info">
                <h3 style={{ marginBottom: '0.5rem' }}>
                  Room {booking.room?.roomNumber || 'N/A'}
                </h3>
                <p className="text-secondary">
                  {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p
                  className="text-accent"
                  style={{ marginTop: '0.5rem', fontWeight: 600 }}
                >
                  Total: ${booking.totalPrice}
                </p>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
              >
                <span
                  className="room-badge"
                  style={{
                    background: `${getStatusColor(booking.status)}15`,
                    color: getStatusColor(booking.status),
                    borderColor: `${getStatusColor(booking.status)}30`,
                  }}
                >
                  ● {booking.status}
                </span>

                {booking.status !== 'CANCELLED' && (
                  <button
                    className="btn btn--outline-danger btn--sm"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
