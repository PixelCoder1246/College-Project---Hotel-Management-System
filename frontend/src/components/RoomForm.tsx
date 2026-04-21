import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addRoom, updateRoom } from '../services/room.service';
import {
  Room,
  CreateRoomRequest,
  RoomType,
  RoomStatus,
} from '../types/room.types';

interface RoomFormProps {
  editingRoom: Room | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const INITIAL_STATE: CreateRoomRequest = {
  roomNumber: '',
  type: 'SINGLE',
  price: 0,
  status: 'AVAILABLE',
  capacity: 1,
};

export default function RoomForm({
  editingRoom,
  onSuccess,
  onCancel,
}: RoomFormProps) {
  const [formData, setFormData] = useState<CreateRoomRequest>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        roomNumber: editingRoom.roomNumber,
        type: editingRoom.type,
        price: editingRoom.price,
        status: editingRoom.status,
        capacity: editingRoom.capacity,
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [editingRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
        toast.success('Room updated successfully');
      } else {
        await addRoom(formData);
        toast.success('Room added successfully');
      }
      onSuccess();
      setFormData(INITIAL_STATE);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="room-form-card">
      <h3 className="room-form__title">
        {editingRoom ? '✨ Edit Room' : '➕ Add New Room'}
      </h3>

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="form-group">
          <label className="form-label">Room Number</label>
          <input
            type="text"
            className="form-input"
            value={formData.roomNumber}
            onChange={(e) =>
              setFormData({ ...formData, roomNumber: e.target.value })
            }
            placeholder="e.g. 101"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as RoomType })
              }
            >
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              className="form-input"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) })
              }
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Price per Night ($)</label>
          <input
            type="number"
            className="form-input"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as RoomStatus })
            }
          >
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div className="btn-group" style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
            style={{ flex: 2 }}
          >
            {loading ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
          </button>
          {editingRoom && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={onCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
