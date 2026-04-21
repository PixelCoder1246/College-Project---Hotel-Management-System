import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getAllRooms, deleteRoom } from '../services/room.service';
import { Room, RoomFilters, RoomType, RoomStatus } from '../types/room.types';
import RoomForm from '../components/RoomForm';
import RoomTable from '../components/RoomTable';
import '../styles/rooms.css';

export default function RoomManagementPage() {
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
    try {
      await deleteRoom(id);
      toast.success('Room deleted');
      fetchRooms();
    } catch {
      toast.error('Failed to delete room');
    }
  };

  return (
    <div className="room-mgmt">
      <header className="room-mgmt__header">
        <h1 className="room-mgmt__title">Room Management</h1>
      </header>

      <div className="room-mgmt__content">
        <aside>
          <RoomForm
            editingRoom={editingRoom}
            onSuccess={() => {
              setEditingRoom(null);
              fetchRooms();
            }}
            onCancel={() => setEditingRoom(null)}
          />
        </aside>

        <main className="room-grid-container">
          <div className="filter-bar">
            <select
              className="form-input"
              style={{ width: 'auto' }}
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
              style={{ width: 'auto' }}
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
              <div className="loading-spinner"></div>
              <p>Fetching rooms...</p>
            </div>
          ) : (
            <RoomTable
              rooms={rooms}
              onEdit={setEditingRoom}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
}
