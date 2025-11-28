// // src/api/bookingApi.js
// const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

// // Lấy token & hotelId mặc định từ localStorage
// function getToken() {
//   return localStorage.getItem("authToken");
// }
// function getHotelId() {
//   return localStorage.getItem("hotelId");
// }

// function authHeaders(token) {
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// /** Lấy danh sách phòng của 1 khách sạn
//  *  BE: GET /api/hotels/:hotelId/rooms
//  */
// export async function fetchRooms(hotelId, token) {
//   const t = token ?? getToken();
//   const hId = hotelId ?? getHotelId();

//   if (!hId) {
//     throw new Error("Thiếu hotelId, không biết lấy phòng của khách sạn nào");
//   }

//   const url = `${API_BASE}/api/hotels/${hId}/rooms`;

//   const res = await fetch(url, {
//     headers: {
//       ...authHeaders(t),
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await res.json();
 

//   if (!res.ok) {
//     throw new Error(data?.error || "Không tải được danh sách phòng");
//   }

//   // Kỳ vọng BE trả: [{ _id, name, number, type, status, hotel, ... }]
//   return Array.isArray(data) ? data : [];
// }

// /** Lấy booking theo khoảng ngày cho 1 hotel
//  *  BE: GET /api/reception/bookings?hotel=&from=&to=
//  *  from/to là Date object
//  */
// export async function fetchBookingsRange({ from, to, hotelId, token } = {}) {
//   const t = token ?? getToken();
//   const hId = hotelId ?? getHotelId();

//   if (!hId) {
//     throw new Error("Thiếu hotelId khi gọi danh sách booking");
//   }
//   if (!(from instanceof Date) || !(to instanceof Date)) {
//     throw new Error("from/to phải là Date object");
//   }

//   const url = new URL(`${API_BASE}/api/reception/bookings`);
//   url.searchParams.set("hotel", hId);
//   url.searchParams.set("from", from.toISOString());
//   url.searchParams.set("to", to.toISOString());

//   const res = await fetch(url.toString(), {
//     headers: {
//       ...authHeaders(t),
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     console.error("fetchBookingsRange error:", data);
//     throw new Error(data?.error || "Không tải được booking");
//   }

//   // BE: array các booking đã populate rooms.room
//   return Array.isArray(data) ? data : [];
// }

// /** Chuyển bookings BE -> items timeline (mỗi phòng 1 item) */
// export function shapeBookingsToTimelineItems(bookings) {
//   // booking: {
//   //   _id, orderCode,
//   //   customer:{name},
//   //   start_day, end_day, status,
//   //   rooms:[{room:{_id,name,number}, price}]
//   // }
//   const arr = [];

//   for (const b of bookings || []) {
//     const start = b.start_day || b.startDay;
//     const end = b.end_day || b.endDay;
//     const customerName = b.customer?.name || "";

//     for (const it of b.rooms || []) {
//       const r = it.room || {};
//       arr.push({
//         id: `${b._id}_${r._id}`,  // id item duy nhất
//         bookingId: b._id,
//         group: r._id,             // phải trùng id group phòng trong Timeline
//         startDay: start,
//         endDay: end,
//         status: b.status,
//         customerName,
//         code: b.orderCode,
//         roomName: r.name || r.number,
//       });
//     }
//   }

//   return arr;
// }



// export async function createBookingByStaff(payload, token) {
//   const res = await fetch(`${API_BASE}/api/reception/bookings`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeaders(token),
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data?.error || "Không tạo được booking");
//   return data;
// }

// export async function fetchRoomsAvalibale(hotelId, token, { start, end, adults, children }) {
//   const params = new URLSearchParams({
//     start_day: start.toISOString(),
//     end_day: end.toISOString(),
//     adults: String(adults ?? 1),
//     children: String(children ?? 0),
//   });

//   const res = await fetch(
//     `http://localhost:4000/api/rooms/hotels/${hotelId}/available-rooms?` +
//       params.toString(),
//     {
//       headers: {
//         Authorization: token ? `Bearer ${token}` : "",
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.error || "Không lấy được phòng còn trống");
//   }

//   const data = await res.json();
//   return data.rooms || [];
// }




// src/api/bookingApi.js
import api from "./client";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

// Lấy hotelId mặc định từ localStorage (cái này không vấn đề gì)
function getHotelId() {
  return localStorage.getItem("hotelId");
}

/** Lấy danh sách phòng của 1 khách sạn
 *  BE: GET /api/hotels/:hotelId/rooms
 *  hotelId: truyền vào hoặc lấy từ localStorage
 *  token (tham số thứ 2) GIỮ LẠI cho khỏi vỡ code cũ nhưng KHÔNG dùng nữa
 */
export async function fetchRooms(hotelId, _tokenIgnored) {
  const hId = hotelId ?? getHotelId();

  if (!hId) {
    throw new Error("Thiếu hotelId, không biết lấy phòng của khách sạn nào");
  }

  const url = `/api/hotels/${hId}/rooms`;

  // ✅ dùng api (axios) để tận dụng interceptor + accessToken hiện tại
  const res = await api.get(url);
  const data = res.data;

  // Kỳ vọng BE trả: [{ _id, name, number, type, status, hotel, ... }]
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

/** Lấy booking theo khoảng ngày cho 1 hotel
 *  BE: GET /api/reception/bookings?hotel=&from=&to=
 *  from/to là Date object
 *  token trong params GIỮ LẠI nhưng KHÔNG dùng nữa
 */
export async function fetchBookingsRange({ from, to, hotelId, token: _ignored } = {}) {
  const hId = hotelId ?? getHotelId();

  if (!hId) {
    throw new Error("Thiếu hotelId khi gọi danh sách booking");
  }
  if (!(from instanceof Date) || !(to instanceof Date)) {
    throw new Error("from/to phải là Date object");
  }

  const params = {
    hotel: hId,
    from: from.toISOString(),
    to: to.toISOString(),
  };

  // ✅ dùng api.get, để axios tự gắn Authorization
  const res = await api.get("/api/reception/bookings", { params });
  const data = res.data;

  // BE: array các booking đã populate rooms.room
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

/** Chuyển bookings BE -> items timeline (mỗi phòng 1 item) */
export function shapeBookingsToTimelineItems(bookings) {
  const arr = [];

  for (const b of bookings || []) {
    const start = b.start_day || b.startDay;
    const end = b.end_day || b.endDay;
    const customerName = b.customer?.name || "";

    for (const it of b.rooms || []) {
      const r = it.room || {};
      arr.push({
        id: `${b._id}_${r._id}`, // id item duy nhất
        bookingId: b._id,
        group: r._id, // phải trùng id group phòng trong Timeline
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

/** Nhân viên tạo booking tại quầy
 *  BE: POST /api/reception/bookings
 *  token param GIỮ nhưng bỏ qua
 */
export async function createBookingByStaff(payload, _tokenIgnored) {
  const res = await api.post("/api/reception/bookings", payload);
  const data = res.data;

  if (!res.status || res.status < 200 || res.status >= 300) {
    throw new Error(data?.error || "Không tạo được booking");
  }

  return data;
}

/** Lấy phòng còn trống theo khoảng ngày
 *  BE: GET /api/rooms/hotels/:hotelId/available-rooms?start_day=&end_day=&adults=&children=
 *  token param GIỮ nhưng bỏ qua
 */
export async function fetchRoomsAvalibale(
  hotelId,
  _tokenIgnored,
  { start, end, adults, children }
) {
  const hId = hotelId ?? getHotelId();
  if (!hId) throw new Error("Thiếu hotelId khi lấy phòng còn trống");

  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error("start/end phải là Date object");
  }

  const params = {
    start_day: start.toISOString(),
    end_day: end.toISOString(),
    adults: String(adults ?? 1),
    children: String(children ?? 0),
  };

  // ✅ dùng api.get + params
  const res = await api.get(`/api/rooms/hotels/${hId}/available-rooms`, {
    params,
  });

  const data = res.data;

  if (!res.status || res.status < 200 || res.status >= 300) {
    throw new Error(data?.error || "Không lấy được phòng còn trống");
  }

  // tuỳ cấu trúc BE trả
  if (Array.isArray(data?.rooms)) return data.rooms;
  if (Array.isArray(data)) return data;
  return [];
}
