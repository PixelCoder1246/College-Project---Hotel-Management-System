import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getAllRooms } from '../services/room.service';
import { createBooking } from '../services/booking.service';
import type { Room, RoomType } from '../types/room.types';
import '../styles/bookings.css';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
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

  const handleBooking = async () => {
    if (!selectedRoom) return;
    try {
      await createBooking({
        roomId: selectedRoom.id,
        checkIn: searchDates.checkIn,
        checkOut: searchDates.checkOut,
      });
      toast.success('Booking successful!');
      setSelectedRoom(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  const calculateTotalPrice = (price: number) => {
    const start = new Date(searchDates.checkIn);
    const end = new Date(searchDates.checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return price * Math.max(1, nights);
  };

  return (
    <div className="booking-page">
      <section className="search-section">
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

      {loading ? (
        <div className="empty-state">Loading rooms...</div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-card__img">🏨</div>
              <div className="room-card__body">
                <div className="room-card__header">
                  <h3>Room {room.roomNumber}</h3>
                  <div className="room-card__price">
                    ${room.price}
                    <span>/night</span>
                  </div>
                </div>
                <div className="room-card__features">
                  <span>👤 {room.capacity} Guests</span>
                  <span>✨ {room.type}</span>
                </div>
                <button
                  className="btn btn--primary w-full"
                  onClick={() => setSelectedRoom(room)}
                  disabled={room.status !== 'AVAILABLE'}
                >
                  {room.status === 'AVAILABLE' ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoom && (
        <div className="booking-modal">
          <div className="booking-modal__content">
            <h2>Confirm Booking</h2>
            <div className="booking-summary">
              <div className="summary-item">
                <span>Room Number</span>
                <span>{selectedRoom.roomNumber}</span>
              </div>
              <div className="summary-item">
                <span>Check-in</span>
                <span>{searchDates.checkIn}</span>
              </div>
              <div className="summary-item">
                <span>Check-out</span>
                <span>{searchDates.checkOut}</span>
              </div>
              <div className="summary-total">
                <span>Total Price</span>
                <span>${calculateTotalPrice(selectedRoom.price)}</span>
              </div>
            </div>
            <div className="btn-group">
              <button className="btn btn--primary" onClick={handleBooking}>
                Confirm & Pay
              </button>
              <button
                className="btn btn--outline"
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
