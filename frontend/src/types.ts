export interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  tables: number;
  equipment: string[];
}

export interface Slot {
  id: number;
  room: Room;
  date: string;
  startTime: string;
  durationMinutes: number;
  status: 'available' | 'booked';
  bookedByName: string | null;
  bookedByEmail: string | null;
  bookingPurpose: string | null;
}

export interface BookingPayload {
  name: string;
  email: string;
  purpose: string;
}

export interface BookingResult {
  slot: Slot;
  message: string;
}