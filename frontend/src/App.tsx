import { useEffect, useState } from 'react';
import { cancelSlot, getSlots } from './api';
import { BookingModal } from './components/BookingModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SlotCard } from './components/SlotCard';
import type { BookingResult, Slot } from './types';

export default function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Slot | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  async function loadSlots() {
    try {
      setError(null);
      setSlots(await getSlots());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load rooms');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  function closeBooking() {
    setSelected(null);
    loadSlots();
  }

  function handleBooked(res: BookingResult) {
    setSlots((current) => current.filter((s) => s.id !== res.slot.id));
    setSelected(null);
    setResult(res);
  }

  async function handleUndo() {
    if (!result) return;
    await cancelSlot(result.slot.id);
    setResult(null);
    await loadSlots();
  }

  return (
    <div className="page">
      <header className="hero">
        <span className="eyebrow">Room booking</span>
        <h1>
          Find a room. <span className="accent">Book it in seconds.</span>
        </h1>
        <p>Pick an open slot, tell us what it's for, and it's yours.</p>
      </header>

      {loading && <p className="state">Loading rooms…</p>}
      {error && <p className="state state-error">{error}</p>}
      {!loading && !error && slots.length === 0 && (
        <p className="state">No rooms available right now.</p>
      )}

      <main className="grid">
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} onBook={setSelected} />
        ))}
      </main>

      {selected && (
        <BookingModal slot={selected} onClose={closeBooking} onBooked={handleBooked} />
      )}
      {result && (
        <ConfirmationModal
          result={result}
          onClose={() => setResult(null)}
          onUndo={handleUndo}
        />
      )}
    </div>
  );
}