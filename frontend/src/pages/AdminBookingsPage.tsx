import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBookings, updateBooking } from '../services/booking.service';
import '../styles/bookings.css';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } catch {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'CANCELLED': return '#ef4444';
      case 'COMPLETED': return '#3b82f6';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="booking-page">
      <header className="room-mgmt__header" style={{ marginBottom: '2rem' }}>
        <h1 className="room-mgmt__title">Booking Management</h1>
        <p className="room-mgmt__subtitle">Confirm or cancel guest reservations</p>
      </header>
      
      {loading ? (
        <div className="empty-state">Loading all bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📅</div>
          <p>No bookings found in the system.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card__info">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>Room {booking.room?.roomNumber}</h3>
                  <span className="text-secondary">|</span>
                  <span className="text-accent" style={{ fontWeight: 600 }}>{booking.user?.name}</span>
                </div>
                <p className="text-secondary">
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className="text-accent" style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  Total: ${booking.totalPrice} • {booking.user?.email}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span 
                  className="room-badge"
                  style={{ 
                    background: `${getStatusColor(booking.status)}15`,
                    color: getStatusColor(booking.status),
                    borderColor: `${getStatusColor(booking.status)}30`
                  }}
                >
                  ● {booking.status}
                </span>
                
                <div className="btn-group">
                  {booking.status === 'PENDING' && (
                    <button 
                      className="btn btn--primary btn--sm"
                      onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <button 
                      className="btn btn--outline-danger btn--sm"
                      onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
