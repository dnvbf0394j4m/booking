

// src/pages/reception/RoomBookingModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Tabs,
  DatePicker,
  Space,
  Typography,
  Tag,
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchRoomsAvalibale } from "../../../api/bookingApi";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

const DEFAULT_ADULTS = 1;
const DEFAULT_CHILDREN = 0;

export default function RoomBookingModal({
  open,
  onCancel,
  hotelId,
  onConfirm, // (payload) => void
}) {
  const token = localStorage.getItem("authToken");

  const [mode, setMode] = useState("day");

  const [dates, setDates] = useState([
    dayjs().hour(14).minute(0).second(0),
    dayjs().add(1, "day").hour(12).minute(0).second(0),
  ]);

  const [numRooms, setNumRooms] = useState(1);
  const [adults, setAdults] = useState(DEFAULT_ADULTS);
  const [children, setChildren] = useState(DEFAULT_CHILDREN);

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const nights = useMemo(() => {
    const [checkIn, checkOut] = dates || [];
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.startOf("day").diff(checkIn.startOf("day"), "day");
    return Math.max(diff, 0);
  }, [dates]);

  // roomId -> quantity (số phòng loại đó muốn đặt)
  const [quantities, setQuantities] = useState({});

  // ===== GỌI API LẤY PHÒNG TRỐNG =====
  useEffect(() => {
    if (!open || !hotelId) return;

    const [checkIn, checkOut] = dates || [];
    if (!checkIn || !checkOut) return;

    (async () => {
      try {
        setLoadingRooms(true);
        const data = await fetchRoomsAvalibale(hotelId, token, {
          start: checkIn.toDate(),
          end: checkOut.toDate(),
          adults,
          children,
        });
        console.log("Rooms data:", data);
        setRooms(data || []);
      } catch (e) {
        console.error(e);
        message.error(e.message || "Không tải được danh sách phòng");
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, [open, hotelId, token, dates, adults, children]);

  // Nhóm theo loại (nếu chưa có roomType thì tất cả vào "Khác")
  const groupedRooms = useMemo(() => {
    const map = new Map();
    for (const r of rooms) {
      const key = r.roomType || r.type || "Khác";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return Array.from(map.entries());
  }, [rooms]);

 const handleBookOneType = (room) => {
  const [checkIn, checkOut] = dates || [];
  if (!checkIn || !checkOut) {
    return message.warning("Vui lòng chọn ngày nhận và trả phòng");
  }
  if (nights <= 0) {
    return message.warning("Ngày trả phải sau ngày nhận");
  }

  const qty = quantities[room._id] || 1;
  if (qty <= 0) {
    return message.warning("Số lượng phòng phải lớn hơn 0");
  }

  const price = room.price || room.basePrice || 0;

  const payload = {
    hotel: hotelId,
    start_day: checkIn.toDate(),
    end_day: checkOut.toDate(),
    nights,
    rooms: [
      {
        room: room._id,
        price,
        quantity: qty,   // 👈 số phòng loại này
        roomData: room,  // 👈 toàn bộ info phòng cho modal 2
      },
    ],
    metaGuest: {
      rooms: numRooms,
      adults,
      children,
    },
  };

  if (onConfirm) onConfirm(payload);
  onCancel?.();
};


  const headerSummary = useMemo(() => {
    const [checkIn, checkOut] = dates || [];
    if (!checkIn || !checkOut) return null;
    return (
      <Space size="large" wrap>
        <Space>
          <CalendarOutlined />
          <span>
            Nhận: <b>{checkIn.format("DD/MM, HH:mm")}</b>
          </span>
        </Space>
        <Space>
          <CalendarOutlined />
          <span>
            Trả: <b>{checkOut.format("DD/MM, HH:mm")}</b>
          </span>
        </Space>
        <Tag color="green">
          {nights || 1} {nights > 1 ? "ngày" : "ngày"}
        </Tag>
        <Tag>
          {numRooms} phòng • {adults} người lớn • {children} trẻ em
        </Tag>
      </Space>
    );
  }, [dates, nights, numRooms, adults, children]);

  return (
    <Modal
      title="Chọn phòng"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnClose
    >
      <Tabs
        activeKey={mode}
        onChange={setMode}
        items={[
          { key: "hour", label: "Theo giờ", disabled: true },
          { key: "day", label: "Theo ngày" },
          { key: "overnight", label: "Qua đêm", disabled: true },
        ]}
        style={{ marginBottom: 16 }}
      />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={10}>
          <div>Nhận phòng / Trả phòng</div>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            value={dates}
            onChange={(vals) => setDates(vals ?? [])}
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
          />
        </Col>
        <Col xs={24} md={8}>
          <div>Số lượng</div>
          <Space wrap>
            <Space>
              <Text>Phòng:</Text>
              <InputNumber
                min={1}
                max={20}
                value={numRooms}
                onChange={(v) => setNumRooms(v || 1)}
              />
            </Space>
            <Space>
              <UserOutlined />
              <InputNumber
                min={1}
                max={30}
                value={adults}
                onChange={(v) => setAdults(v || 1)}
              />
              <span>người lớn</span>
            </Space>
            <Space>
              <TeamOutlined />
              <InputNumber
                min={0}
                max={30}
                value={children}
                onChange={(v) => setChildren(v || 0)}
              />
              <span>trẻ em</span>
            </Space>
          </Space>
        </Col>
        <Col xs={24} md={6} style={{ display: "flex", alignItems: "flex-end" }}>
          {headerSummary}
        </Col>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      {groupedRooms.map(([type, list]) => (
        <div key={type} style={{ marginBottom: 16 }}>
          <div
            style={{
              background: "#f6ffed",
              padding: "6px 12px",
              borderRadius: 4,
              marginBottom: 8,
            }}
          >
            <Text strong>{type}</Text>
          </div>

          {list.map((room) => {
            const qty = quantities[room._id] ?? 1;
            const pricePerNight = room.price || room.basePrice || 0;
            const total = pricePerNight * qty * (nights || 1);

            return (
              <Card
                key={room._id}
                style={{
                  marginBottom: 8,
                  borderRadius: 8,
                  borderColor: "#e8e8e8",
                }}
                bodyStyle={{ padding: "12px 16px" }}
              >
                <Row align="middle">
                  <Col xs={24} md={10}>
                    <Title level={5} style={{ marginBottom: 4 }}>
                      {room.name || room.number}
                    </Title>
                    <Text type="secondary">
                      Tối đa {room.max_guests || 2} khách •{" "}
                      {room.beds || "1 giường"}
                    </Text>
                  </Col>

                  <Col xs={24} md={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">Giá</Text>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                      {formatMoney(pricePerNight)} đ
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      /đêm
                    </Text>
                  </Col>

                  <Col xs={24} md={4} style={{ textAlign: "center" }}>
                    <Text type="secondary">Số lượng</Text>
                    <div>
                      <InputNumber
                        min={1}
                        max={10}
                        value={qty}
                        onChange={(v) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [room._id]: v || 1,
                          }))
                        }
                      />
                    </div>
                  </Col>

                  <Col xs={24} md={4} style={{ textAlign: "right" }}>
                    <Text type="secondary">Tổng cộng</Text>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                      {formatMoney(total)} đ
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {nights || 1} đêm
                    </Text>
                  </Col>

                  <Col xs={24} md={2} style={{ textAlign: "right" }}>
                    <Button
                      type="primary"
                      style={{ marginTop: 4 }}
                      onClick={() => handleBookOneType(room)}
                    >
                      Đặt phòng
                    </Button>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      ))}

      {!groupedRooms.length && !loadingRooms && (
        <Text type="secondary">Không có phòng nào cho khách sạn này.</Text>
      )}
    </Modal>
  );
}
