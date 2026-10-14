import { useState } from 'react';
import { formatDate, formatRange } from '../format';
import type { BookingResult } from '../types';
import { Modal } from './Modal';

interface Props {
  result: BookingResult;
  onClose: () => void;
  onUndo: () => Promise<void>;
}

export function ConfirmationModal({ result, onClose, onUndo }: Props) {
  const { slot, message } = result;
  const [undoing, setUndoing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUndo() {
    setUndoing(true);
    setError(null);
    try {
      await onUndo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel');
      setUndoing(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">You're booked!</h2>
      <p className="confirm-message">{message}</p>

      <div className="summary">
        <div><span>Room</span><strong>{slot.room.name}</strong></div>
        <div><span>When</span><strong>{formatDate(slot.date)}, {formatRange(slot.startTime, slot.durationMinutes)}</strong></div>
        <div><span>Booked by</span><strong>{slot.bookedByName}</strong></div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={handleUndo} disabled={undoing}>
          {undoing ? 'Cancelling…' : 'Made a mistake? Cancel booking'}
        </button>
        <button className="btn" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}