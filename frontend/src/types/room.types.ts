import type { ApiResponse } from './auth.types';

export type RoomStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
export type RoomType = 'SINGLE' | 'DOUBLE' | 'DELUXE' | 'SUITE';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFilters {
  type?: RoomType;
  status?: RoomStatus;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}

export interface CreateRoomRequest {
  roomNumber: string;
  type: RoomType;
  price: number;
  status?: RoomStatus;
  capacity: number;
}

export type UpdateRoomRequest = Partial<CreateRoomRequest>;

export type RoomsResponse = ApiResponse<{ rooms: Room[] }>;
export type SingleRoomResponse = ApiResponse<{ room: Room }>;
