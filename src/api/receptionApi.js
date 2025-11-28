

// src/api/receptionApi.js
import api from "./client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Không cần đọc token ở đây nữa, axios client sẽ tự gắn Authorization

export function toRange(startDate, endDate) {
  const pad = (n) => String(n).padStart(2, "0");
  const toLocal = (d) => {
    const dt = new Date(d);
    return (
      `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
      `T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`
    );
  };
  return { from: toLocal(startDate), to: toLocal(endDate) };
}

/**
 * Lấy bookings theo khoảng thời gian cho 1 khách sạn
 * @param {{ hotel: string, from: string, to: string }} params
 *  - hotel: hotelId
 *  - from, to: chuỗi datetime (dùng toRange trả ra)
 */
export async function getBookingsRange({ hotel, from, to }) {
  if (!hotel) throw new Error("Thiếu hotelId (hotel) khi gọi getBookingsRange");

  // dùng query params cho đẹp
  const res = await api.get("/api/reception/bookings", {
    params: { hotel, from, to },
  });

  // axios tự parse JSON -> res.data
  return res.data;
}

/**
 * Lấy danh sách phòng của 1 khách sạn
 * @param {string} hotelId
 */
export async function getRoomsOfHotel(hotelId) {
  if (!hotelId) throw new Error("Thiếu hotelId khi gọi getRoomsOfHotel");

  const res = await api.get(`/api/hotels/${hotelId}/rooms`);
  return res.data;
}
