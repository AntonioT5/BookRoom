import type { Slot } from '../types';
import { formatDate, formatRange } from '../format';

interface Props {
  slot: Slot;
  onBook: (slot: Slot) => void;
}

export function SlotCard({ slot, onBook }: Props) {
  const { room } = slot;
  return (
    <article className="card">
      <div className="card-when">
        <span className="card-date">{formatDate(slot.date)}</span>
        <span className="card-time">
          {formatRange(slot.startTime, slot.durationMinutes)}
        </span>
      </div>

      <h2 className="card-room">{room.name}</h2>
      <p className="card-desc">{room.description}</p>

      <div className="card-facts">
        <span>{room.capacity} people</span>
        <span>{room.tables} {room.tables === 1 ? 'table' : 'tables'}</span>
        <span>{slot.durationMinutes} min</span>
      </div>

      <div className="chips">
        {room.equipment.map((item) => (
          <span className="chip" key={item}>{item}</span>
        ))}
      </div>

      <button className="btn" onClick={() => onBook(slot)}>
        Book this room
      </button>
    </article>
  );
}
