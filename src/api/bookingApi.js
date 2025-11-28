// src/api/bookingApi.js
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

// Lấy token & hotelId mặc định từ localStorage
function getToken() {
  return localStorage.getItem("authToken");
}
function getHotelId() {
  return localStorage.getItem("hotelId");
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Lấy danh sách phòng của 1 khách sạn
 *  BE: GET /api/hotels/:hotelId/rooms
 */
export async function fetchRooms(hotelId, token) {
  const t = token ?? getToken();
  const hId = hotelId ?? getHotelId();

  if (!hId) {
    throw new Error("Thiếu hotelId, không biết lấy phòng của khách sạn nào");
  }

  const url = `${API_BASE}/api/hotels/${hId}/rooms`;

  const res = await fetch(url, {
    headers: {
      ...authHeaders(t),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
 

  if (!res.ok) {
    throw new Error(data?.error || "Không tải được danh sách phòng");
  }

  // Kỳ vọng BE trả: [{ _id, name, number, type, status, hotel, ... }]
  return Array.isArray(data) ? data : [];
}

/** Lấy booking theo khoảng ngày cho 1 hotel
 *  BE: GET /api/reception/bookings?hotel=&from=&to=
 *  from/to là Date object
 */
export async function fetchBookingsRange({ from, to, hotelId, token } = {}) {
  const t = token ?? getToken();
  const hId = hotelId ?? getHotelId();

  if (!hId) {
    throw new Error("Thiếu hotelId khi gọi danh sách booking");
  }
  if (!(from instanceof Date) || !(to instanceof Date)) {
    throw new Error("from/to phải là Date object");
  }

  const url = new URL(`${API_BASE}/api/reception/bookings`);
  url.searchParams.set("hotel", hId);
  url.searchParams.set("from", from.toISOString());
  url.searchParams.set("to", to.toISOString());

  const res = await fetch(url.toString(), {
    headers: {
      ...authHeaders(t),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("fetchBookingsRange error:", data);
    throw new Error(data?.error || "Không tải được booking");
  }

  // BE: array các booking đã populate rooms.room
  return Array.isArray(data) ? data : [];
}

/** Chuyển bookings BE -> items timeline (mỗi phòng 1 item) */
export function shapeBookingsToTimelineItems(bookings) {
  // booking: {
  //   _id, orderCode,
  //   customer:{name},
  //   start_day, end_day, status,
  //   rooms:[{room:{_id,name,number}, price}]
  // }
  const arr = [];

  for (const b of bookings || []) {
    const start = b.start_day || b.startDay;
    const end = b.end_day || b.endDay;
    const customerName = b.customer?.name || "";

    for (const it of b.rooms || []) {
      const r = it.room || {};
      arr.push({
        id: `${b._id}_${r._id}`,  // id item duy nhất
        bookingId: b._id,
        group: r._id,             // phải trùng id group phòng trong Timeline
        startDay: start,
        endDay: end,
        status: b.status,
        customerName,
        code: b.orderCode,
        roomName: r.name || r.number,
      });
    }
  }

  return arr;
}



export async function createBookingByStaff(payload, token) {
  const res = await fetch(`${API_BASE}/api/reception/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Không tạo được booking");
  return data;
}

export async function fetchRoomsAvalibale(hotelId, token, { start, end, adults, children }) {
  const params = new URLSearchParams({
    start_day: start.toISOString(),
    end_day: end.toISOString(),
    adults: String(adults ?? 1),
    children: String(children ?? 0),
  });

  const res = await fetch(
    `http://localhost:4000/api/rooms/hotels/${hotelId}/available-rooms?` +
      params.toString(),
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Không lấy được phòng còn trống");
  }

  const data = await res.json();
  return data.rooms || [];
}

