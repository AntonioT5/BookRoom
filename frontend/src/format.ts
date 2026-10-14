export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatRange(startTime: string, durationMinutes: number) {
  const [h, m] = startTime.split(':').map(Number);
  const end = h * 60 + m + durationMinutes;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)} – ${pad(Math.floor(end / 60) % 24)}:${pad(end % 60)}`;
}