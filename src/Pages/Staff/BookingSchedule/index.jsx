// import React, { useState } from "react";
// import Timeline, { TimelineHeaders, DateHeader, TodayMarker } from "react-calendar-timeline";
// import moment from "moment";
// import { Button, Dropdown, Input, Tag, Typography } from "antd";
// import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
// import "react-calendar-timeline/style.css";
// import "./BookingSchedule.css";
// import RoomBookingModal from "./RoomBookingModal"; 



// import "moment/locale/vi";
// moment.locale("vi");

// const { Text } = Typography;

// const BookingSchedule = () => {
//   // 🕓 Bắt đầu từ hôm nay
//   const [currentStart, setCurrentStart] = useState(moment().startOf("day"));

//   // 🟢 Chuyển tuần (7 ngày)
//   const goToPreviousWeek = () => setCurrentStart((prev) => prev.clone().subtract(7, "days"));
//   const goToNextWeek = () => setCurrentStart((prev) => prev.clone().add(7, "days"));

//   const [isModalOpen, setIsModalOpen] = useState(false);

// const handleBook = () => {
//   setIsModalOpen(true);
// };


//   const groups = [
//     { id: "t2", title: "Tầng 2", isFloor: true },
//     { id: 1, title: "P.201", floor: "Tầng 2" },
//     { id: 2, title: "P.202", floor: "Tầng 2" },
//     { id: 3, title: "P.203", floor: "Tầng 2" },
//     { id: "t3", title: "Tầng 3", isFloor: true },
//     { id: 4, title: "P.301", floor: "Tầng 3" },
//     { id: 5, title: "P.302", floor: "Tầng 3" },
//     { id: 6, title: "P.303", floor: "Tầng 3" },
//   ];

//   const items = [
//     {
//       id: 1,
//       group: 1,
//       title: "Khách Lê",
//       start_time: moment("2025-10-22 14:00"),
//       end_time: moment("2025-10-23 12:00"),
//       status: "checked-in",
//     },
//     {
//       id: 2,
//       group: 2,
//       title: "Tài",
//       start_time: moment("2025-10-23 14:00"),
//       end_time: moment("2025-10-25 12:00"),
//       status: "booked",
//     },
//     {
//       id: 3,
//       group: 3,
//       title: "Vinh",
//       start_time: moment("2025-10-25 14:00"),
//       end_time: moment("2025-10-26 12:00"),
//       status: "booked",
//     },
//     {
//       id: 4,
//       group: 5,
//       title: "Nhớ",
//       start_time: moment("2025-10-24 15:00"),
//       end_time: moment("2025-10-27 23:00"),
//       status: "checked-in",
//     },
//   ];

//   // 🟣 Màu trạng thái
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "booked":
//         return "#FFE7BA";
//       case "checked-in":
//         return "#A7D7C5";
//       case "pending":
//         return "#FFF1B8";
//       default:
//         return "#FAFAFA";
//     }
//   };

//   // 🗓️ Thời gian hiển thị: Hôm nay → 6 ngày tiếp theo
//   const timeStart = currentStart.clone().startOf("day");
//   const timeEnd = currentStart.clone().add(6, "days").endOf("day");

//   // 🧱 Style cho item
//   const styledItems = items.map((item) => ({
//     ...item,
//     itemProps: {
//       style: {
//         background: getStatusColor(item.status),
//         borderRadius: 6,
//         border: "1px solid #d9d9d9",
//         color: "#333",
//         fontSize: 12,
//         padding: "4px 6px",
//       },
//     },
//   }));

//   return (
//     <div style={{ padding: 16 }}>
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 16,
//         }}
//       >
//         {/* 🔍 Thanh tìm kiếm */}
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <Input
//             placeholder="Tìm kiếm khách hàng, mã đặt phòng..."
//             prefix={<SearchOutlined />}
//             style={{ width: 320 }}
//           />

//           {/* Trạng thái */}
//           <Tag color="green">Đang trống (15)</Tag>
//           <Tag color="orange">Sắp nhận (2)</Tag>
//           <Tag color="blue">Đang sử dụng (2)</Tag>
//           <Tag color="purple">Sắp trả (1)</Tag>
//           <Tag color="magenta">Quá giờ trả (1)</Tag>
//         </div>

//         {/* Nút bên phải */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           {/* <Dropdown overlay={menu}>
//             <Button>
//               Bảng Giá 2025 <DownOutlined />
//             </Button>
//           </Dropdown> */}
//           <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
//             <Button icon={<LeftOutlined />} onClick={goToPreviousWeek} size="small" />
//             <Text style={{ margin: "0 12px", fontWeight: 500 }}>
//               {timeStart.format("DD/MM")} - {timeEnd.format("DD/MM/YYYY")}
//             </Text>
//             <Button icon={<RightOutlined />} onClick={goToNextWeek} size="small" />
//           </div>

//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//           onClick={handleBook}
//           >
//             Đặt phòng
//           </Button>
//         </div>
//       </div>
//       {/* Header */}


//       {/* Timeline */}
//       <Timeline
//         groups={groups}
//         items={styledItems}
//         visibleTimeStart={timeStart.valueOf()}
//         visibleTimeEnd={timeEnd.valueOf()}
//         lineHeight={50}
//         itemHeightRatio={0.8}
//         canMove={false}
//         canResize={false}
//         stackItems
//         sidebarWidth={150}
//         itemTouchSendsClick
//         traditionalZoom={false}
//         verticalLineClassNamesForTime={() => ["custom-grid-line"]}
//         groupRenderer={({ group }) => (
//           <div
//             style={{
//               fontWeight: group.isFloor ? "600" : "400",
//               background: group.isFloor ? "#f5f5f5" : "transparent",
//               paddingLeft: group.isFloor ? 8 : 20,
//             }}
//           >
//             {group.title}
//           </div>
//         )}
//       >
//         {/* 🟢 Đường hiện tại */}
//         <TodayMarker>
//           {({ styles }) => (
//             <div
//               style={{
//                 ...styles,
//                 backgroundColor: "green",
//                 width: "2px",
//               }}
//             />
//           )}
//         </TodayMarker>

//         {/* 🗓️ Header hiển thị thứ & ngày */}
//         <TimelineHeaders className="sticky-header">
//           {/* <DateHeader
//             unit="primaryHeader"
//             labelFormat={() => ""}
//           /> */}
//           <DateHeader unit="day" labelFormat="ddd DD/MM" />
//         </TimelineHeaders>
//       </Timeline>
//       <RoomBookingModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} />
//     </div>
//   );
// };

// export default BookingSchedule;




import React, { useMemo, useState, useEffect } from "react";
import Timeline, { TimelineHeaders, DateHeader, TodayMarker } from "react-calendar-timeline";
import moment from "moment";
import { Button, Input, Tag, Typography, Spin, message } from "antd";
import { LeftOutlined, PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import "react-calendar-timeline/style.css";
import "./BookingSchedule.css";
import RoomBookingModal from "./RoomBookingModal";

import "moment/locale/vi";
moment.locale("vi");

import { fetchRooms, fetchBookings7Days } from "../../../api/bookingApi"; // đường dẫn tùy dự án

const { Text } = Typography;

const BookingSchedule = () => {
  // 🕓 Bắt đầu từ hôm nay
  const [currentStart, setCurrentStart] = useState(moment().startOf("day"));
  const timeStart = useMemo(() => currentStart.clone().startOf("day"), [currentStart]);
  const timeEnd = useMemo(() => currentStart.clone().add(6, "days").endOf("day"), [currentStart]);

  // Dữ liệu từ API
  const [rooms, setRooms] = useState([]);        // RoomRespone[]
  const [bookings, setBookings] = useState([]);  // BookingRespone[]
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleBook = () => setIsModalOpen(true);

  // Search (client-side)
  const [keyword, setKeyword] = useState("");

  // 🟢 Chuyển tuần (7 ngày)
  const goToPreviousWeek = () => setCurrentStart((prev) => prev.clone().subtract(7, "days"));
  const goToNextWeek = () => setCurrentStart((prev) => prev.clone().add(7, "days"));

  // 🔄 Load rooms + bookings khi đổi cửa sổ thời gian
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [roomList, bookingList] = await Promise.all([
          fetchRooms(),
          fetchBookings7Days(timeStart, timeEnd),
        ]);

        if (cancelled) return;
        setRooms(roomList || []);
        setBookings(bookingList || []);
      } catch (e) {
        if (!cancelled) {
          setErr(e);
          message.error(e.message || "Lỗi tải dữ liệu");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [timeStart, timeEnd]);

  // 🟣 Màu trạng thái
  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "booked":
      case "RESERVED":
        return "#FFE7BA";
      case "checked-in":
      case "CHECKED_IN":
        return "#A7D7C5";
      case "pending":
      case "PENDING":
        return "#FFF1B8";
      case "paid":
      case "PAID":
        return "#d6f5d6";
      default:
        return "#FAFAFA";
    }
  };

  // 🧭 Helper: tách tầng từ tên phòng (ví dụ "P.201" -> "Tầng 2")
  const getFloorLabel = (roomName) => {
    const m = /(\d)(\d{2})$/.exec(roomName || ""); // bắt số cuối như 201, 302...
    if (m) {
      const floor = m[1]; // chữ số hàng trăm là tầng
      return `Tầng ${floor}`;
    }
    // fallback: nếu không parse được thì xếp vào "Khác"
    return "Khác";
  };

  // 🧱 Build groups gồm header tầng + phòng
  const groups = useMemo(() => {
    if (!rooms.length) return [];

    // gom phòng theo tầng
    const byFloor = new Map();
    rooms.forEach((r) => {
      const floorLabel = getFloorLabel(r.name);
      if (!byFloor.has(floorLabel)) byFloor.set(floorLabel, []);
      byFloor.get(floorLabel).push(r);
    });

    // tạo group: mỗi tầng 1 header (id string), mỗi phòng 1 group (id = room_id)
    const result = [];
    [...byFloor.keys()]
      .sort((a, b) => {
        // sắp theo số tầng nếu có
        const na = parseInt((a.match(/\d+/) || [999])[0], 10);
        const nb = parseInt((b.match(/\d+/) || [999])[0], 10);
        return na - nb;
      })
      .forEach((floorLabel) => {
        const idHeader = `t-${floorLabel}`;
        result.push({ id: idHeader, title: floorLabel, isFloor: true });

        const list = byFloor.get(floorLabel) || [];
        // sort phòng theo tên
        list.sort((x, y) => (x.name || "").localeCompare(y.name || "", "vi"));

        list.forEach((r) => {
          result.push({
            id: r.room_id,           // timeline group id
            title: r.name || `Room ${r.room_id}`,
            floor: floorLabel,
            _raw: r,
          });
        });
      });

    return result;
  }, [rooms]);

  // 🔎 Lọc theo từ khóa (khách hàng, mã đặt phòng...) — ví dụ trên title/mã
  const filteredBookings = useMemo(() => {
    if (!keyword) return bookings;
    const kw = keyword.toLowerCase();
    return bookings.filter((b) => {
      const code = (b.code || "").toLowerCase();
      const name = (b.customerName || b.title || "").toLowerCase();
      const roomName = (b.roomName || "").toLowerCase();
      return code.includes(kw) || name.includes(kw) || roomName.includes(kw);
    });
  }, [bookings, keyword]);

  // 🧱 Items cho timeline
  const items = useMemo(() => {
    // Kỳ vọng BookingRespone có các field:
    // id, room_id, startDay, endDay, status, customerName (đổi theo DTO của bạn)
    return filteredBookings.map((b) => ({
      id: b.id,
      group: b.room_id, // phải trùng group id của phòng
      title: b.customerName || b.title || `Booking #${b.id}`,
      start_time: moment(b.startDay),
      end_time: moment(b.endDay),
      status: b.status,
      itemProps: {
        style: {
          background: getStatusColor(b.status),
          borderRadius: 6,
          border: "1px solid #d9d9d9",
          color: "#333",
          fontSize: 12,
          padding: "4px 6px",
        },
      },
    }));
  }, [filteredBookings]);

  // 👉 Thống kê trạng thái nhanh (demo đơn giản)
  const quickStats = useMemo(() => {
    const now = moment();
    let empty = 0, soonCheckin = 0, inUse = 0, soonCheckout = 0, overdue = 0;

    // Tính “đang sử dụng” từ bookings
    const busyRoomIds = new Set(
      bookings
        .filter((b) => now.isBetween(moment(b.startDay), moment(b.endDay)))
        .map((b) => b.room_id)
    );

    rooms.forEach((r) => {
      if (!busyRoomIds.has(r.room_id)) empty += 1;
    });

    bookings.forEach((b) => {
      const start = moment(b.startDay);
      const end = moment(b.endDay);
      if (start.diff(now, "hours") <= 24 && start.isAfter(now)) soonCheckin += 1;
      if (now.isBetween(start, end)) inUse += 1;
      if (end.diff(now, "hours") <= 24 && end.isAfter(now)) soonCheckout += 1;
      if (end.isBefore(now)) overdue += 1;
    });

    return { empty, soonCheckin, inUse, soonCheckout, overdue };
  }, [rooms, bookings]);

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        {/* 🔍 Thanh tìm kiếm */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Input
            placeholder="Tìm kiếm khách hàng, mã đặt phòng..."
            prefix={<SearchOutlined />}
            style={{ width: 320 }}
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {/* Trạng thái nhanh (ước lượng) */}
          <Tag color="green">Đang trống ({quickStats.empty})</Tag>
          <Tag color="orange">Sắp nhận ({quickStats.soonCheckin})</Tag>
          <Tag color="blue">Đang sử dụng ({quickStats.inUse})</Tag>
          <Tag color="purple">Sắp trả ({quickStats.soonCheckout})</Tag>
          <Tag color="magenta">Quá giờ trả ({quickStats.overdue})</Tag>
        </div>

        {/* Nút bên phải */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <Button icon={<LeftOutlined />} onClick={goToPreviousWeek} size="small" />
            <Text style={{ margin: "0 12px", fontWeight: 500 }}>
              {timeStart.format("DD/MM")} - {timeEnd.format("DD/MM/YYYY")}
            </Text>
            <Button icon={<RightOutlined />} onClick={goToNextWeek} size="small" />
          </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={handleBook}>
            Đặt phòng
          </Button>
        </div>
      </div>
      {/* Header */}

      <Spin spinning={loading}>
        <Timeline
          groups={groups}
          items={items}
          visibleTimeStart={timeStart.valueOf()}
          visibleTimeEnd={timeEnd.valueOf()}
          lineHeight={50}
          itemHeightRatio={0.8}
          canMove={false}
          canResize={false}
          stackItems
          sidebarWidth={150}
          itemTouchSendsClick
          traditionalZoom={false}
          verticalLineClassNamesForTime={() => ["custom-grid-line"]}
          groupRenderer={({ group }) => (
            <div
              style={{
                fontWeight: group.isFloor ? "600" : "400",
                background: group.isFloor ? "#f5f5f5" : "transparent",
                paddingLeft: group.isFloor ? 8 : 20,
              }}
            >
              {group.title}
            </div>
          )}
        >
          {/* 🟢 Đường hiện tại */}
          <TodayMarker>
            {({ styles }) => (
              <div
                style={{
                  ...styles,
                  backgroundColor: "green",
                  width: "2px",
                }}
              />
            )}
          </TodayMarker>

          {/* 🗓️ Header hiển thị thứ & ngày */}
          <TimelineHeaders className="sticky-header">
            <DateHeader unit="day" labelFormat="ddd DD/MM" />
          </TimelineHeaders>
        </Timeline>
      </Spin>

      <RoomBookingModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} />
      {err && (
        <div style={{ marginTop: 8, color: "#ff4d4f" }}>
          Lỗi: {String(err?.message || err)}
        </div>
      )}
    </div>
  );
};

export default BookingSchedule;
