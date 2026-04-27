import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllRooms, deleteRoom } from '../services/room.service';
import type {
  Room,
  RoomFilters,
  RoomType,
  RoomStatus,
} from '../types/room.types';
import RoomForm from '../components/RoomForm';
import '../styles/rooms.css';

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'var(--success)',
  BOOKED: 'var(--error)',
  MAINTENANCE: 'var(--warning)',
};
const STATUS_ICONS: Record<string, string> = {
  AVAILABLE: '✓',
  BOOKED: '✗',
  MAINTENANCE: '⚠',
};

export default function RoomManagementPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<RoomFilters>({
    type: undefined,
    status: undefined,
  });

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllRooms(filters);
      setRooms(response.data.rooms);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this room? This action cannot be undone.'))
      return;
    try {
      await deleteRoom(id);
      toast.success('Room deleted successfully.');
      fetchRooms();
    } catch {
      toast.error('Failed to delete room');
    }
  };

  const available = rooms.filter((r) => r.status === 'AVAILABLE').length;
  const booked = rooms.filter((r) => r.status === 'BOOKED').length;
  const maintenance = rooms.filter((r) => r.status === 'MAINTENANCE').length;

  return (
    <div className="room-mgmt">
      <header className="room-mgmt__header">
        <div>
          <h1 className="room-mgmt__title">Room Management</h1>
          <p className="room-mgmt__subtitle">
            Add, edit, and monitor all hotel rooms
          </p>
        </div>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>
      </header>

      {/* Stats Row */}
      <div className="info-grid" style={{ marginBottom: '2rem' }}>
        <div className="info-card">
          <div className="info-card__icon">🛏️</div>
          <div className="info-card__body">
            <span className="info-card__label">Total Rooms</span>
            <span className="info-card__value">{rooms.length}</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card__icon" style={{ color: 'var(--success)' }}>
            ✓
          </div>
          <div className="info-card__body">
            <span className="info-card__label">Available</span>
            <span
              className="info-card__value"
              style={{ color: 'var(--success)' }}
            >
              {available}
            </span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card__icon" style={{ color: 'var(--error)' }}>
            ✗
          </div>
          <div className="info-card__body">
            <span className="info-card__label">Booked</span>
            <span
              className="info-card__value"
              style={{ color: 'var(--error)' }}
            >
              {booked}
            </span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card__icon" style={{ color: 'var(--warning)' }}>
            ⚠
          </div>
          <div className="info-card__body">
            <span className="info-card__label">Maintenance</span>
            <span
              className="info-card__value"
              style={{ color: 'var(--warning)' }}
            >
              {maintenance}
            </span>
          </div>
        </div>
      </div>

      <div className="room-mgmt__content">
        {/* Form Panel */}
        <aside>
          <div className="room-form-panel">
            <div className="room-form-panel__title">
              {editingRoom ? '✏️ Edit Room' : '➕ Add New Room'}
            </div>
            <RoomForm
              editingRoom={editingRoom}
              onSuccess={() => {
                setEditingRoom(null);
                fetchRooms();
              }}
              onCancel={() => setEditingRoom(null)}
            />
          </div>
        </aside>

        {/* Table */}
        <main className="room-grid-container">
          {/* Filters */}
          <div className="filter-bar">
            <select
              className="form-input"
              value={filters.type || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: (e.target.value as RoomType) || undefined,
                })
              }
            >
              <option value="">All Types</option>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
            <select
              className="form-input"
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: (e.target.value as RoomStatus) || undefined,
                })
              }
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loading-spinner" />
              <p>Loading rooms…</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🛏️</div>
              <p className="empty-state__text">
                No rooms found. Add your first room using the form.
              </p>
            </div>
          ) : (
            <div className="room-table-wrap">
              <table className="room-table">
                <thead>
                  <tr>
                    <th>Room No.</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Price / Night</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="room-number-cell">#{room.roomNumber}</td>
                      <td>{room.type}</td>
                      <td>👤 {room.capacity}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 700 }}>
                        ₹{room.price}
                      </td>
                      <td>
                        <span
                          className="room-badge"
                          style={{
                            background: `${STATUS_COLORS[room.status]}18`,
                            color: STATUS_COLORS[room.status],
                            borderColor: `${STATUS_COLORS[room.status]}30`,
                          }}
                        >
                          {STATUS_ICONS[room.status]} {room.status}
                        </span>
                      </td>
                      <td>
                        <div className="room-actions">
                          <button
                            className="btn btn--secondary btn--sm"
                            onClick={() => setEditingRoom(room)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn--outline-danger btn--sm"
                            onClick={() => handleDelete(room.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
