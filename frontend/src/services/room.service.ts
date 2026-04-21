import api from '../api/axios';
import {
  CreateRoomRequest,
  RoomFilters,
  RoomsResponse,
  SingleRoomResponse,
  UpdateRoomRequest,
} from '../types/room.types';

export const getAllRooms = async (
  filters?: RoomFilters
): Promise<RoomsResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  const res = await api.get(`/api/rooms?${params.toString()}`);
  return res.data;
};

export const addRoom = async (
  data: CreateRoomRequest
): Promise<SingleRoomResponse> => {
  const res = await api.post('/api/rooms', data);
  return res.data;
};

export const updateRoom = async (
  id: string,
  data: UpdateRoomRequest
): Promise<SingleRoomResponse> => {
  const res = await api.patch(`/api/rooms/${id}`, data);
  return res.data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/api/rooms/${id}`);
};
