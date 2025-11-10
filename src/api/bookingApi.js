// src/api/bookingApi.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function toNaiveISO(momentObj) {
  // Spring @DateTimeFormat(ISO.DATE_TIME) thường ăn chuỗi "yyyy-MM-dd'T'HH:mm:ss"
  // (không kèm múi giờ). Nếu backend của bạn nhận OffsetDateTime thì có thể dùng toISOString().
  return momentObj.format("YYYY-MM-DD[T]HH:mm:ss");
}

export async function fetchRooms() {
  const res = await fetch(`${API_BASE}/rooms`); // đổi path đúng với API của bạn
  if (!res.ok) throw new Error(`Fetch rooms failed: ${res.status}`);
  return res.json();
}

export async function fetchBookings7Days(startMoment, endMoment) {
  const start = toNaiveISO(startMoment);
  const end = toNaiveISO(endMoment);
  const url = `${API_BASE}/bookings-7days?startDay=${encodeURIComponent(start)}&endDay=${encodeURIComponent(end)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch bookings failed: ${res.status}`);
  return res.json();
}
