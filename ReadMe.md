# BookRoom

A room booking app. A host publishes time slots for meeting rooms, and anyone can book one with their name, email and the purpose of the booking. After booking, Gemini writes a short personalized confirmation, and the booking can be undone from the confirmation window.

**Live app:** https://book-room-cyan.vercel.app/
**API:** https://bookroom-api-nqdu.onrender.com/slots

The backend runs on a free Render instance, so the first request after a period of inactivity can take up to a minute while it wakes up.

## What I built

- 3 rooms (Aurora, Nebula, Quasar), each with a description, capacity, number of tables and equipment, and 5 slots on different days.
- Slots are created in the database by a seed script on first start (the "host" publishes them).
- Booking opens a modal with name, email and purpose.
- No double booking: the booking is a single conditional SQL update (`WHERE status = 'available'`), so if two people click at the same moment only one wins and the other gets a clear error.
- Booked slots are not deleted. They stay in the database with status `booked` and are hidden from the list, which keeps the booking history.
- After booking, a confirmation modal shows an AI-written message based on the name, room, date and purpose. An "undo" button there flips the slot back to `available`.
- Dark UI with a light-green accent.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** NestJS, TypeORM, PostgreSQL
- **AI:** Gemini (Google AI Studio free tier) through `@google/genai`. If the AI call fails, the booking still succeeds with a plain fallback message.
- **Hosting:** Vercel (frontend), Render (backend), Neon (database)

## API

| Method | Path | Description |
|---|---|---|
| GET | `/slots` | List available slots |
| POST | `/slots/:id/book` | Book a slot (`name`, `email`, `purpose`), returns the slot and the AI message |
| POST | `/slots/:id/cancel` | Undo a booking, the slot becomes available again |

## Run it locally

Requirements: Node.js, Docker (or any PostgreSQL), and a free Gemini API key from https://aistudio.google.com/apikey

1. Start PostgreSQL:

```bash
   docker run --name rooms-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=rooms -p 5432:5432 -d postgres:16
```

2. Backend:

```bash
   cd backend
   npm install
```

   Create `backend/.env`:

```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/rooms
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
```

   Then run `npm run start:dev`. On first start the tables are created and the rooms and slots are seeded.

3. Frontend (in a second terminal):

```bash
   cd frontend
   npm install
   npm run dev
```

   Open http://localhost:5173. To point it at another backend, set `VITE_API_URL`.

## AI tools I used

- **Claude** helped me through the build (architecture, NestJS and React code, deployment). I made the product decisions myself: the room concept, the booking and undo flow, keeping booked slots as history, and the visual style.
- **Gemini** is part of the product itself, for the confirmation messages.

## What I would improve with more time

- Rate limiting on the booking and AI endpoints.
- A date filter for the slot list.
- Email confirmations.
- Tests for the booking logic, especially the concurrent double-booking case.