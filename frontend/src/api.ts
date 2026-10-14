import type { BookingPayload, BookingResult, Slot } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;
    throw new Error(message ?? 'Something went wrong');
  }
  return res.json();
}

export const getSlots = () => request<Slot[]>('/slots');

export const bookSlot = (id: number, payload: BookingPayload) =>
  request<BookingResult>(`/slots/${id}/book`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const cancelSlot = (id: number) =>
  request<Slot>(`/slots/${id}/cancel`, { method: 'POST' });
