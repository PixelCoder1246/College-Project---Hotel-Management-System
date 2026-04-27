import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllRooms } from '../services/room.service';
import { createBooking } from '../services/booking.service';
import type { Room, RoomType } from '../types/room.types';
import '../styles/bookings.css';

const TYPE_ICONS: Record<string, string> = {
  SINGLE: '🛏️',
  DOUBLE: '🛏️🛏️',
  DELUXE: '✨',
  SUITE: '👑',
};
const TYPE_GRADIENT: Record<string, string> = {
  SINGLE: 'room-card__img--single',
  DOUBLE: 'room-card__img--double',
  DELUXE: 'room-card__img--deluxe',
  SUITE: 'room-card__img--suite',
};

export default function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [booking, setBooking] = useState(false);
  const [searchDates, setSearchDates] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });
  const [capacity, setCapacity] = useState(1);
  const [type, setType] = useState<RoomType | ''>('');

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllRooms({ capacity, type: type || undefined });
      setRooms(res.data.rooms);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [capacity, type]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const calculateNights = () => {
    const start = new Date(searchDates.checkIn);
    const end = new Date(searchDates.checkOut);
    return Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
  };

  const handleBooking = async () => {
    if (!selectedRoom) return;
    try {
      setBooking(true);
      const res = await createBooking({
        roomId: selectedRoom.id,
        checkIn: searchDates.checkIn,
        checkOut: searchDates.checkOut,
      });
      toast.success('Booking created! Redirecting to payment…');
      setSelectedRoom(null);
      // Navigate to payment page with the new booking id
      const bookingId = res.data?.booking?.id;
      if (bookingId) {
        navigate(`/payment/${bookingId}`);
      } else {
        navigate('/my-bookings');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const nights = calculateNights();

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-page__header">
        <h1 className="booking-page__title">Browse Rooms</h1>
        <p className="booking-page__subtitle">
          Find and reserve your perfect room
        </p>
      </div>

      {/* Search */}
      <section className="search-section">
        <div className="search-section__title">🔍 Search Availability</div>
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            fetchRooms();
          }}
        >
          <div className="form-group">
            <label className="form-label">Check-in</label>
            <input
              type="date"
              className="form-input"
              value={searchDates.checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) =>
                setSearchDates({ ...searchDates, checkIn: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Check-out</label>
            <input
              type="date"
              className="form-input"
              value={searchDates.checkOut}
              min={searchDates.checkIn}
              onChange={(e) =>
                setSearchDates({ ...searchDates, checkOut: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Guests</label>
            <input
              type="number"
              className="form-input"
              value={capacity}
              min="1"
              max="10"
              onChange={(e) => setCapacity(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Room Type</label>
            <select
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value as RoomType)}
            >
              <option value="">Any Type</option>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>
          <button type="submit" className="btn btn--primary">
            Search Rooms
          </button>
        </form>
      </section>

      {/* Room Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" />
          <p>Finding available rooms…</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🏨</div>
          <p className="empty-state__text">
            No rooms match your search. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => {
            const isAvailable = room.status === 'AVAILABLE';
            return (
              <div
                key={room.id}
                className={`room-card${!isAvailable ? ' room-card--unavailable' : ''}`}
              >
                <div
                  className={`room-card__img ${TYPE_GRADIENT[room.type] || 'room-card__img--single'}`}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {TYPE_ICONS[room.type] || '🛏️'}
                  </span>
                  <div
                    className={`room-card__status-pill room-card__status-pill--${room.status.toLowerCase()}`}
                  >
                    {room.status === 'AVAILABLE'
                      ? '✓ Available'
                      : room.status === 'BOOKED'
                        ? '✗ Booked'
                        : '⚠ Maintenance'}
                  </div>
                </div>
                <div className="room-card__body">
                  <div className="room-card__type-tag">{room.type}</div>
                  <div className="room-card__header">
                    <h3 className="room-card__title">Room {room.roomNumber}</h3>
                    <div className="room-card__price">
                      <div className="room-card__price-value">
                        ₹{room.price}
                      </div>
                      <div className="room-card__price-unit">/night</div>
                    </div>
                  </div>
                  <div className="room-card__features">
                    <span className="room-card__feature">
                      👤 {room.capacity} Guest{room.capacity > 1 ? 's' : ''}
                    </span>
                    <span className="room-card__feature">✨ {room.type}</span>
                  </div>
                  <div className="room-card__actions">
                    <button
                      className="btn btn--primary w-full"
                      onClick={() => setSelectedRoom(room)}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'Book This Room' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoom && (
        <div
          className="booking-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRoom(null);
          }}
        >
          <div className="booking-modal__content">
            <button
              className="booking-modal__close"
              onClick={() => setSelectedRoom(null)}
            >
              ✕
            </button>
            <h2 className="booking-modal__title">Confirm Reservation</h2>
            <p className="booking-modal__subtitle">
              Review the details below before proceeding to payment.
            </p>

            <div className="booking-summary">
              <div className="summary-item">
                <span className="summary-item__label">Room</span>
                <span className="summary-item__value">
                  Room {selectedRoom.roomNumber} — {selectedRoom.type}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item__label">Check-in</span>
                <span className="summary-item__value">
                  {new Date(searchDates.checkIn).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item__label">Check-out</span>
                <span className="summary-item__value">
                  {new Date(searchDates.checkOut).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-item__label">Duration</span>
                <span className="summary-item__value">
                  {nights} night{nights > 1 ? 's' : ''}
                </span>
              </div>
              <div className="summary-total">
                <span className="summary-total__label">Total (excl. tax)</span>
                <span className="summary-total__value">
                  ₹{(selectedRoom.price * nights).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="btn-group">
              <button
                className="btn btn--primary"
                onClick={handleBooking}
                disabled={booking}
              >
                {booking
                  ? 'Creating booking…'
                  : 'Confirm & Proceed to Payment →'}
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => setSelectedRoom(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
