import type { Room } from '../types/room.types';

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

export default function RoomTable({ rooms, onEdit, onDelete }: RoomTableProps) {
  const getStatusBadge = (status: string) => {
    const className = `room-badge room-badge--${status.toLowerCase()}`;
    const labels: Record<string, string> = {
      AVAILABLE: '● Available',
      BOOKED: '○ Booked',
      MAINTENANCE: '⚠ Maintenance',
    };
    return <span className={className}>{labels[status] || status}</span>;
  };

  if (rooms.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🛏️</div>
        <p>No rooms found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="room-table-wrapper">
      <table className="room-table">
        <thead>
          <tr>
            <th>Room #</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td style={{ fontWeight: 700 }}>{room.roomNumber}</td>
              <td>{room.type}</td>
              <td>{room.capacity} Guests</td>
              <td>${room.price.toFixed(2)}</td>
              <td>{getStatusBadge(room.status)}</td>
              <td>
                <div className="action-btns">
                  <button
                    className="btn-icon btn-icon--edit"
                    onClick={() => onEdit(room)}
                    title="Edit Room"
                  >
                    ✎
                  </button>
                  <button
                    className="btn-icon btn-icon--delete"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this room?'
                        )
                      ) {
                        onDelete(room.id);
                      }
                    }}
                    title="Delete Room"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
