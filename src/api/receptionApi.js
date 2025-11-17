// src/api/receptionApi.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
});

export function toRange(startDate, endDate) {
  const pad = (n) => String(n).padStart(2, "0");
  const toLocal = (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  };
  return { from: toLocal(startDate), to: toLocal(endDate) };
}

export async function getBookingsRange({ hotel, from, to }) {
  const url = `${API_BASE}/api/reception/bookings?hotel=${encodeURIComponent(hotel)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const res = await fetch(url, { headers: authHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getRoomsOfHotel(hotelId) {
  const url = `${API_BASE}/api/hotels/${hotelId}/rooms`;
  const res = await fetch(url, { headers: authHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
