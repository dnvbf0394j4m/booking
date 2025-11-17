// // src/pages/RoomGridView.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { Card, Tag, Badge, Typography, Space, Input, Row, Col, Button, message, Dropdown } from "antd";
// import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
// import moment from "moment";
// import "moment/locale/vi";
// import { getBookingsRange, getRoomsOfHotel, toRange } from "../../../api/receptionApi";

// moment.locale("vi");
// const { Text, Title } = Typography;

// // Map status -> màu + text ngắn
// const STATUS_CONFIG = {
//   EMPTY: { color: "default", label: "Trống" },
//   SOON_IN: { color: "gold", label: "Sắp nhận" },
//   IN_USE: { color: "green", label: "Đang sử dụng" },
//   SOON_OUT: { color: "blue", label: "Sắp trả" },
//   OVERDUE: { color: "red", label: "Quá giờ trả" },
//   CLEANING: { color: "orange", label: "Dọn dẹp" },
// };


// const token = localStorage.getItem("authToken"); // nếu chưa có
// const hotelId = localStorage.getItem("hotelId");







// export default function RoomGridView() {
//   const hotelId = localStorage.getItem("hotelId");
//   const [rooms, setRooms] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [kw, setKw] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!hotelId) return;
//     let cancel = false;
//     (async () => {
//       try {
//         setLoading(true);
//         const todayStart = moment().startOf("day").toDate();
//         const todayEnd = moment().endOf("day").toDate();
//         const { from, to } = toRange(todayStart, todayEnd);

//         const [rms, bks] = await Promise.all([
//           getRoomsOfHotel(hotelId),
//           getBookingsRange({ hotel: hotelId, from, to }),
//         ]);
//         if (cancel) return;
//         setRooms(Array.isArray(rms) ? rms : (rms?.data || []));
//         setBookings(Array.isArray(bks) ? bks : (bks?.data || []));
//       } catch (e) {
//         message.error("Không tải được dữ liệu phòng: " + (e.message || e));
//       } finally {
//         if (!cancel) setLoading(false);
//       }
//     })();
//     return () => { cancel = true; };
//   }, [hotelId]);

//   // Nhóm theo loại phòng – giả sử `room.typeName` hoặc dùng beds / category
//   const groups = useMemo(() => {
//     const map = new Map();
//     rooms.forEach(r => {
//       const typeName = r.typeName || r.category || r.beds || "Khác";
//       if (!map.has(typeName)) map.set(typeName, []);
//       map.get(typeName).push(r);
//     });
//     return [...map.entries()];
//   }, [rooms]);

//   // filter theo search
//   const filterRoom = (r) => {
//     if (!kw) return true;
//     const q = kw.toLowerCase();
//     return (
//       String(r.name || r.number || "").toLowerCase().includes(q) ||
//       String(r.typeName || r.category || r.beds || "").toLowerCase().includes(q)
//     );
//   };



//   const handleCleanRoom = async (booking) => {
//     if (!booking) return;
//     const id = booking._id || booking.id || booking.bookingId;
//     if (!id) {
//       message.error("Không tìm được ID booking để dọn phòng");
//       return;
//     }


//     try {
//       // hỏi lại 1 lần
//       if (!window.confirm("Xác nhận đã dọn phòng và muốn xóa booking khỏi sơ đồ?")) {
//         return;
//       }

//       const res = await fetch(
//         `http://localhost:4000/api/reception/bookings/${id}`,
//         {
//           method: "DELETE", // hoặc PATCH /soft-delete tuỳ API của bạn
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Dọn phòng thất bại");

//       message.success("Đã dọn phòng, phòng trở lại trạng thái trống");

//       // reload rooms + bookings hôm nay
//       const todayStart = moment().startOf("day").toDate();
//       const todayEnd = moment().endOf("day").toDate();
//       const { from, to } = toRange(todayStart, todayEnd);

//       const [rms, bks] = await Promise.all([
//         getRoomsOfHotel(hotelId),
//         getBookingsRange({ hotel: hotelId, from, to }),
//       ]);
//       setRooms(Array.isArray(rms) ? rms : (rms?.data || []));
//       setBookings(Array.isArray(bks) ? bks : (bks?.data || []));
//     } catch (e) {
//       console.error(e);
//       message.error(e.message || "Lỗi khi dọn phòng");
//     }
//   };


//   function classifyRoomToday(room, bookingsToday) {
//     const now = moment();

//     const list = bookingsToday.filter(b =>
//       (b.rooms || []).some(it => String(it.room?._id || it.room) === String(room._id))
//     );

//     if (!list.length) {
//       return { statusKey: "EMPTY", booking: null, infoText: "Đang trống" };
//     }

//     // lấy booking gần nhất (theo start_day)
//     const sorted = [...list].sort((a, b) => new Date(a.start_day) - new Date(b.start_day));
//     const b = sorted[0];

//     // 🆕 Nếu booking đã CHECKED_OUT => phòng chờ dọn
//     if ((b.status || "").toUpperCase() === "CHECKED_OUT") {
//       return {
//         statusKey: "CLEANING",
//         booking: b,
//         infoText: "Đã trả phòng - chờ dọn",
//       };
//     }

//     const start = moment(b.start_day);
//     const end = moment(b.end_day);
//     const status = String(b.status || "").toUpperCase();

//     // helper format countdown
//     const diffHuman = (t) => {
//       const diffMin = t.diff(now, "minutes");
//       const sign = diffMin >= 0 ? 1 : -1;
//       const abs = Math.abs(diffMin);
//       const h = Math.floor(abs / 60);
//       const m = abs % 60;
//       const txt = `${h ? `${h} giờ ` : ""}${m} phút`;
//       return sign > 0 ? `${txt} nữa` : `${txt}`;
//     };

//     // ❌ nếu đã huỷ thì coi như trống
//     if (status === "CANCELLED") {
//       return { statusKey: "EMPTY", booking: null, infoText: "Đang trống" };
//     }

//     // ✅ ĐÃ TRẢ PHÒNG → chuyển sang trạng thái DỌN DẸP
//     if (status === "CHECKED_OUT") {
//       return {
//         statusKey: "CLEANING",
//         booking: b,
//         infoText: "Đã trả phòng - chờ dọn",
//       };
//     }

//     // các trạng thái khác giữ logic cũ
//     if (now.isBetween(start, end)) {
//       const untilOut = diffHuman(end);
//       return { statusKey: "IN_USE", booking: b, infoText: `Còn ${untilOut}` };
//     }
//     if (start.isAfter(now) && start.isSame(now, "day")) {
//       const until = diffHuman(start);
//       return { statusKey: "SOON_IN", booking: b, infoText: `${until} nhận phòng` };
//     }
//     if (end.isAfter(now) && end.isSame(now, "day")) {
//       const until = diffHuman(end);
//       return { statusKey: "SOON_OUT", booking: b, infoText: `${until} trả phòng` };
//     }
//     if (end.isBefore(now)) {
//       return { statusKey: "OVERDUE", booking: b, infoText: "Đã quá giờ trả" };
//     }

//     return { statusKey: "EMPTY", booking: null, infoText: "Đang trống" };
//   }
//   return (
//     <div style={{ padding: 16 }}>
//       {/* Thanh trên: search + legend nhanh */}
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
//         <Input
//           style={{ width: 320 }}
//           allowClear
//           prefix={<SearchOutlined />}
//           placeholder="Tìm kiếm phòng, khách hàng, mã đặt phòng…"
//           value={kw}
//           onChange={(e) => setKw(e.target.value)}
//         />
//         <Space size={8} wrap>
//           <Tag color="default">Đang trống</Tag>
//           <Tag color="gold">Sắp nhận</Tag>
//           <Tag color="green">Đang sử dụng</Tag>
//           <Tag color="blue">Sắp trả</Tag>
//           <Tag color="red">Quá giờ trả</Tag>
//         </Space>

//         <Button
//           style={{ marginLeft: "auto" }}
//           icon={<MoreOutlined />}
//           onClick={() => message.info("Thêm bộ lọc nâng cao sau")}
//         />
//       </div>

//       {/* Danh sách group loại phòng */}
//       {groups.map(([typeName, roomList]) => {
//         const filtered = roomList.filter(filterRoom);
//         if (!filtered.length) return null;

//         return (
//           <div key={typeName} style={{ marginBottom: 24 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//               <Title level={5} style={{ margin: 0 }}>
//                 {typeName}{" "}
//                 <Text type="secondary">({filtered.length})</Text>
//               </Title>
//             </div>

//             <Row gutter={[16, 16]}>
//               {filtered.map((room) => {
//                 const info = classifyRoomToday(room, bookings);
//                 const conf = STATUS_CONFIG[info.statusKey];

//                 return (
//                   <Col key={room._id} xs={24} sm={12} md={8} lg={6} xl={4}>
//                     <Card
//                       loading={loading}
//                       hoverable
//                       style={{
//                         borderRadius: 12,
//                         border: "none",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                         background:
//                           info.statusKey === "EMPTY"
//                             ? "#ffffff"
//                             : info.statusKey === "CLEANING"
//                               ? "#fff7e6"   // cam nhạt cho dọn dẹp
//                               : "#f6ffed",  // xanh nhạt cho các trạng thái còn lại

//                       }}
//                       bodyStyle={{ padding: 12 }}
//                       onClick={() => {
//                         // mở modal chi tiết / đặt phòng
//                         console.log("click room", room);
//                       }}
//                     >
//                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
//                         <Space size={6}>
//                           {info.statusKey === "CLEANING" ? (
//                             <Tag color="red" style={{ borderRadius: 9999, padding: "0 8px" }}>
//                               Bẩn
//                             </Tag>
//                           ) : (
//                             <Tag color="default" style={{ borderRadius: 9999, padding: "0 8px" }}>
//                               Sạch
//                             </Tag>
//                           )}

//                           {conf && (
//                             <Tag color={conf.color} style={{ borderRadius: 9999, padding: "0 8px" }}>
//                               {conf.label}
//                             </Tag>
//                           )}
//                         </Space>

//                         {/* 🆕 Dropdown 3 chấm */}
//                         <Dropdown
//                           trigger={["click"]}
//                           menu={{
//                             items: [
//                               {
//                                 key: "detail",
//                                 label: "Xem chi tiết",
//                               },
//                               // chỉ show "Dọn phòng" nếu phòng đang CLEANING
//                               ...(info.statusKey === "CLEANING"
//                                 ? [{
//                                   key: "clean",
//                                   label: "Dọn phòng",
//                                 }]
//                                 : []),
//                             ],
//                             onClick: ({ key }) => {
//                               if (key === "detail") {
//                                 console.log("Xem chi tiết phòng", room);
//                                 // TODO: mở BookingDetailModal nếu bạn muốn
//                               }
//                               if (key === "clean") {
//                                 handleCleanRoom(info.booking); // booking lấy từ classifyRoomToday
//                               }
//                             },
//                           }}
//                         >
//                           <Button
//                             type="text"
//                             size="small"
//                             icon={<MoreOutlined />}
//                             onClick={(e) => e.stopPropagation()} // tránh trùng click với Card
//                           />
//                         </Dropdown>

//                       </div>

//                       <div style={{ marginBottom: 8 }}>
//                         <Text strong style={{ fontSize: 20 }}>
//                           {room.name || room.number}
//                         </Text>
//                         <br />
//                         <Text type="secondary">
//                           {room.subName || room.description || "Khách lẻ"}
//                         </Text>
//                       </div>

//                       <div style={{ marginBottom: 8 }}>
//                         <div style={{ fontSize: 12, color: "#8c8c8c" }}>
//                           Giá:{" "}
//                           <Text strong>
//                             {room.price || room.basePrice
//                               ? `${(room.price || room.basePrice).toLocaleString("vi-VN")} đ`
//                               : "—"}
//                           </Text>
//                         </div>
//                         {room.max_guests && (
//                           <div style={{ fontSize: 12, color: "#8c8c8c" }}>
//                             Số khách tối đa: {room.max_guests}
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <Badge
//                           status={conf?.color === "green" ? "success" : conf?.color === "red" ? "error" : "processing"}
//                           text={
//                             <span style={{ fontSize: 12 }}>
//                               {info.infoText}
//                             </span>
//                           }
//                         />
//                       </div>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>
//           </div>
//         );
//       })}
//     </div>
//   );
// }




// src/pages/RoomGridView.jsx - Giao diện hiện đại
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Tag,
  Badge,
  Typography,
  Space,
  Input,
  Row,
  Col,
  Button,
  message,
  Dropdown,
  Avatar,
  Divider,
  Statistic,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  HomeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/vi";
import { getBookingsRange, getRoomsOfHotel, toRange } from "../../../api/receptionApi";

moment.locale("vi");
const { Text, Title } = Typography;

// Map status -> màu + text + icon
const STATUS_CONFIG = {
  EMPTY: { color: "#52c41a", label: "Trống", gradient: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)" },
  SOON_IN: { color: "#faad14", label: "Sắp nhận", gradient: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)" },
  IN_USE: { color: "#1890ff", label: "Đang sử dụng", gradient: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)" },
  SOON_OUT: { color: "#722ed1", label: "Sắp trả", gradient: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)" },
  OVERDUE: { color: "#f5222d", label: "Quá giờ", gradient: "linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)" },
  CLEANING: { color: "#fa8c16", label: "Dọn dẹp", gradient: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)" },
};

const token = localStorage.getItem("authToken");

export default function RoomGridView() {
  const hotelId = localStorage.getItem("hotelId");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [kw, setKw] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const loadData = async () => {
    if (!hotelId) return;
    try {
      setLoading(true);
      const todayStart = moment().startOf("day").toDate();
      const todayEnd = moment().endOf("day").toDate();
      const { from, to } = toRange(todayStart, todayEnd);

      const [rms, bks] = await Promise.all([
        getRoomsOfHotel(hotelId),
        getBookingsRange({ hotel: hotelId, from, to }),
      ]);
      setRooms(Array.isArray(rms) ? rms : rms?.data || []);
      setBookings(Array.isArray(bks) ? bks : bks?.data || []);
    } catch (e) {
      message.error("Không tải được dữ liệu phòng: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [hotelId]);

  const groups = useMemo(() => {
    const map = new Map();
    rooms.forEach((r) => {
      const typeName = r.typeName || r.category || r.beds || "Khác";
      if (!map.has(typeName)) map.set(typeName, []);
      map.get(typeName).push(r);
    });
    return [...map.entries()];
  }, [rooms]);

  const filterRoom = (r) => {
    if (!kw) return true;
    const q = kw.toLowerCase();
    return (
      String(r.name || r.number || "")
        .toLowerCase()
        .includes(q) ||
      String(r.typeName || r.category || r.beds || "")
        .toLowerCase()
        .includes(q)
    );
  };

  const handleCleanRoom = async (booking) => {
    if (!booking) return;
    const id = booking._id || booking.id || booking.bookingId;
    if (!id) {
      message.error("Không tìm được ID booking để dọn phòng");
      return;
    }

    try {
      if (!window.confirm("Xác nhận đã dọn phòng và muốn xóa booking khỏi sơ đồ?")) {
        return;
      }

      const res = await fetch(`http://localhost:4000/api/reception/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Dọn phòng thất bại");

      message.success("Đã dọn phòng, phòng trở lại trạng thái trống");
      loadData();
    } catch (e) {
      console.error(e);
      message.error(e.message || "Lỗi khi dọn phòng");
    }
  };

  function classifyRoomToday(room, bookingsToday) {
    const now = moment();

    const list = bookingsToday.filter((b) =>
      (b.rooms || []).some((it) => String(it.room?._id || it.room) === String(room._id))
    );

    if (!list.length) {
      return { statusKey: "EMPTY", booking: null, infoText: "Đang trống" };
    }

    const sorted = [...list].sort((a, b) => new Date(a.start_day) - new Date(b.start_day));
    const b = sorted[0];

    if ((b.status || "").toUpperCase() === "CHECKED_OUT") {
      return {
        statusKey: "CLEANING",
        booking: b,
        infoText: "Đã trả phòng - chờ dọn",
      };
    }

    const start = moment(b.start_day);
    const end = moment(b.end_day);
    const status = String(b.status || "").toUpperCase();

    const diffHuman = (t) => {
      const diffMin = t.diff(now, "minutes");
      const sign = diffMin >= 0 ? 1 : -1;
      const abs = Math.abs(diffMin);
      const h = Math.floor(abs / 60);
      const m = abs % 60;
      const txt = `${h ? `${h}h ` : ""}${m}m`;
      return sign > 0 ? `${txt}` : `${txt}`;
    };

    if (status === "CANCELLED") {
      return { statusKey: "EMPTY", booking: null, infoText: "Đang trống" };
    }

    if (now.isBetween(start, end)) {
      const untilOut = diffHuman(end);
      return { statusKey: "IN_USE", booking: b, infoText: `Còn ${untilOut}` };
    }
    if (start.isAfter(now) && start.isSame(now, "day")) {
      const until = diffHuman(start);
      return { statusKey: "SOON_IN", booking: b, infoText: `${until} nữa` };
    }
    if (end.isAfter(now) && end.isSame(now, "day")) {
      const until = diffHuman(end);
      return { statusKey: "SOON_OUT", booking: b, infoText: `${until} nữa` };
    }
    if (end.isBefore(now)) {
      return { statusKey: "OVERDUE", booking: b, infoText: "Quá giờ trả" };
    }

    return { statusKey: "EMPTY", booking: null, infoText: "Đang trống" };
  }

  // Tính thống kê
  const stats = useMemo(() => {
    const result = {
      total: rooms.length,
      empty: 0,
      inUse: 0,
      cleaning: 0,
      soonIn: 0,
      soonOut: 0,
      overdue: 0,
    };

    rooms.forEach((room) => {
      const info = classifyRoomToday(room, bookings);
      switch (info.statusKey) {
        case "EMPTY":
          result.empty++;
          break;
        case "IN_USE":
          result.inUse++;
          break;
        case "CLEANING":
          result.cleaning++;
          break;
        case "SOON_IN":
          result.soonIn++;
          break;
        case "SOON_OUT":
          result.soonOut++;
          break;
        case "OVERDUE":
          result.overdue++;
          break;
      }
    });

    return result;
  }, [rooms, bookings]);

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
            <HomeOutlined style={{ marginRight: 8 }} />
            Sơ đồ phòng
          </Title>
          <Text type="secondary">Cập nhật: {moment().format("HH:mm - DD/MM/YYYY")}</Text>
        </div>

        {/* Thống kê tổng quan */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              style={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Statistic
                title={<Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>Tổng phòng</Text>}
                value={stats.total}
                valueStyle={{ color: "white", fontSize: 28 }}
                prefix={<HomeOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              onClick={() => setSelectedStatus(selectedStatus === "EMPTY" ? null : "EMPTY")}
              style={{
                borderRadius: 16,
                border: selectedStatus === "EMPTY" ? "2px solid #52c41a" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Statistic
                title={<Text style={{ fontSize: 13 }}>Đang trống</Text>}
                value={stats.empty}
                valueStyle={{ color: "#52c41a", fontSize: 28 }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              onClick={() => setSelectedStatus(selectedStatus === "IN_USE" ? null : "IN_USE")}
              style={{
                borderRadius: 16,
                border: selectedStatus === "IN_USE" ? "2px solid #1890ff" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Statistic
                title={<Text style={{ fontSize: 13 }}>Đang sử dụng</Text>}
                value={stats.inUse}
                valueStyle={{ color: "#1890ff", fontSize: 28 }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              onClick={() => setSelectedStatus(selectedStatus === "CLEANING" ? null : "CLEANING")}
              style={{
                borderRadius: 16,
                border: selectedStatus === "CLEANING" ? "2px solid #fa8c16" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Statistic
                title={<Text style={{ fontSize: 13 }}>Cần dọn dẹp</Text>}
                value={stats.cleaning}
                valueStyle={{ color: "#fa8c16", fontSize: 28 }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              onClick={() => setSelectedStatus(selectedStatus === "SOON_OUT" ? null : "SOON_OUT")}
              style={{
                borderRadius: 16,
                border: selectedStatus === "SOON_OUT" ? "2px solid #722ed1" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Statistic
                title={<Text style={{ fontSize: 13 }}>Sắp trả</Text>}
                value={stats.soonOut}
                valueStyle={{ color: "#722ed1", fontSize: 28 }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              onClick={() => setSelectedStatus(selectedStatus === "OVERDUE" ? null : "OVERDUE")}
              style={{
                borderRadius: 16,
                border: selectedStatus === "OVERDUE" ? "2px solid #f5222d" : "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Statistic
                title={<Text style={{ fontSize: 13 }}>Quá giờ</Text>}
                value={stats.overdue}
                valueStyle={{ color: "#f5222d", fontSize: 28 }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Toolbar */}
        <Card
          style={{
            borderRadius: 16,
            marginBottom: 24,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
          bodyStyle={{ padding: "16px 24px" }}
        >
          <Space size={12} wrap style={{ width: "100%" }}>
            <Input
              style={{ width: 320 }}
              size="large"
              allowClear
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Tìm kiếm phòng, loại phòng..."
              value={kw}
              onChange={(e) => setKw(e.target.value)}
            />
            <Button size="large" icon={<FilterOutlined />} onClick={() => message.info("Bộ lọc nâng cao")}>
              Bộ lọc
            </Button>
            <Button size="large" icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              Tải lại
            </Button>
          </Space>
        </Card>

        {/* Danh sách phòng theo nhóm */}
        {groups.map(([typeName, roomList]) => {
          const filtered = roomList
            .filter(filterRoom)
            .filter((room) => {
              if (!selectedStatus) return true;
              const info = classifyRoomToday(room, bookings);
              return info.statusKey === selectedStatus;
            });

          if (!filtered.length) return null;

          return (
            <div key={typeName} style={{ marginBottom: 32 }}>
              <Card
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Title level={5} style={{ margin: 0, display: "inline-block" }}>
                    {typeName}
                  </Title>
                  <Badge
                    count={filtered.length}
                    showZero
                    style={{ backgroundColor: "#1890ff", marginLeft: 12 }}
                  />
                </div>

                <Row gutter={[16, 16]}>
                  {filtered.map((room) => {
                    const info = classifyRoomToday(room, bookings);
                    const conf = STATUS_CONFIG[info.statusKey];

                    return (
                      <Col key={room._id} xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Card
                          loading={loading}
                          hoverable
                          style={{
                            borderRadius: 16,
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            transition: "all 0.3s ease",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          bodyStyle={{ padding: 16 }}
                          onClick={() => console.log("click room", room)}
                        >
                          {/* Gradient bar trên */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: conf?.gradient || "#d9d9d9",
                            }}
                          />

                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 12,
                            }}
                          >
                            <Space direction="vertical" size={4}>
                              <Text strong style={{ fontSize: 22, color: "#262626" }}>
                                {room.name || room.number}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {room.subName || room.description || "Khách lẻ"}
                              </Text>
                            </Space>

                            <Dropdown
                              trigger={["click"]}
                              menu={{
                                items: [
                                  {
                                    key: "detail",
                                    label: "Xem chi tiết",
                                    icon: <HomeOutlined />,
                                  },
                                  ...(info.statusKey === "CLEANING"
                                    ? [
                                        {
                                          key: "clean",
                                          label: "Đã dọn xong",
                                          icon: <CheckCircleOutlined />,
                                        },
                                      ]
                                    : []),
                                ],
                                onClick: ({ key }) => {
                                  if (key === "detail") {
                                    console.log("Xem chi tiết phòng", room);
                                  }
                                  if (key === "clean") {
                                    handleCleanRoom(info.booking);
                                  }
                                },
                              }}
                            >
                              <Button
                                type="text"
                                size="small"
                                icon={<MoreOutlined />}
                                style={{
                                  borderRadius: 8,
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Dropdown>
                          </div>

                          <Divider style={{ margin: "12px 0" }} />

                          {/* Status badges */}
                          <Space size={8} wrap style={{ marginBottom: 12 }}>
                            <Tag
                              color={info.statusKey === "CLEANING" ? "orange" : "success"}
                              style={{
                                borderRadius: 16,
                                padding: "2px 10px",
                                border: "none",
                                fontSize: 12,
                              }}
                            >
                              {info.statusKey === "CLEANING" ? "Bẩn" : "Sạch"}
                            </Tag>
                            {conf && (
                              <Tag
                                style={{
                                  borderRadius: 16,
                                  padding: "2px 10px",
                                  border: "none",
                                  fontSize: 12,
                                  background: conf.gradient,
                                  color: "white",
                                }}
                              >
                                {conf.label}
                              </Tag>
                            )}
                          </Space>

                          {/* Info */}
                          <Space direction="vertical" size={8} style={{ width: "100%" }}>
                            {room.max_guests && (
                              <div style={{ display: "flex", alignItems: "center", fontSize: 13 }}>
                                <UserOutlined style={{ color: "#8c8c8c", marginRight: 6 }} />
                                <Text type="secondary">{room.max_guests} khách</Text>
                              </div>
                            )}
                            {(room.price || room.basePrice) && (
                              <div style={{ display: "flex", alignItems: "center", fontSize: 13 }}>
                                <DollarOutlined style={{ color: "#8c8c8c", marginRight: 6 }} />
                                <Text strong style={{ color: "#1890ff" }}>
                                  {(room.price || room.basePrice).toLocaleString("vi-VN")} đ
                                </Text>
                              </div>
                            )}
                          </Space>

                          <Divider style={{ margin: "12px 0" }} />

                          {/* Time info */}
                          <div
                            style={{
                              background: "#fafafa",
                              borderRadius: 8,
                              padding: "8px 12px",
                              textAlign: "center",
                            }}
                          >
                            <Badge
                              status={
                                conf?.color === "#52c41a"
                                  ? "success"
                                  : conf?.color === "#f5222d"
                                  ? "error"
                                  : "processing"
                              }
                              text={
                                <Text strong style={{ fontSize: 13, color: conf?.color || "#595959" }}>
                                  {info.infoText}
                                </Text>
                              }
                            />
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}