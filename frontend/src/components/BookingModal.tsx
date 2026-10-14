import { useState, type FormEvent } from 'react';
import { bookSlot } from '../api';
import { formatDate, formatRange } from '../format';
import type { BookingResult, Slot } from '../types';
import { Modal } from './Modal';

interface Props {
  slot: Slot;
  onClose: () => void;
  onBooked: (result: BookingResult) => void;
}

export function BookingModal({ slot, onClose, onBooked }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await bookSlot(slot.id, { name, email, purpose });
      onBooked(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Book {slot.room.name}</h2>
      <p className="modal-sub">
        {formatDate(slot.date)} · {formatRange(slot.startTime, slot.durationMinutes)}
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          What is the booking for?
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            maxLength={500}
            rows={3}
            placeholder="e.g. Preparing our final project presentation"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Booking…' : 'Book room'}
          </button>
        </div>
      </form>
    </Modal>
  );
}