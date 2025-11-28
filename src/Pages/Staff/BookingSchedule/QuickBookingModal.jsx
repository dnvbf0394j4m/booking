import React, { useMemo, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Typography,
  Input,
  DatePicker,
  Tag,
  InputNumber,
  Space,
  Divider,
  Button,
} from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function QuickBookingModal({
  open,
  onCancel,
  draft,      // payload từ RoomBookingModal
  onSubmit,   // (body) => Promise
  loading = false,
}) {
  // Nếu chưa có draft (chưa chọn phòng) thì không vẽ gì
  if (!draft) return null;

  console.log("QuickBookingModal draft:", draft); // 👈 debug xem có dữ liệu chưa

  const selected = draft.rooms?.[0] || {};
  const room = selected.roomData || {};   // nếu bạn có gắn roomData trong RoomBookingModal
  const quantity = selected.quantity || 1;

  const nights = useMemo(() => {
    if (draft.nights) return draft.nights;
    if (!draft.start_day || !draft.end_day) return 1;
    const s = dayjs(draft.start_day);
    const e = dayjs(draft.end_day);
    return Math.max(1, e.startOf("day").diff(s.startOf("day"), "day"));
  }, [draft]);

  const totalAmount = useMemo(() => {
    const price = selected.price || 0;
    return price * quantity * (nights || 1);
  }, [selected, quantity, nights]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    idNumber: "",
  });
  const [note, setNote] = useState("");
  const [deposit, setDeposit] = useState(0);

  const handleSubmit = async () => {
    console.log("QuickBookingModal handleSubmit clicked"); // 👈 1. check đã click nút chưa

    if (!customer.name || !customer.phone) {
      alert("Vui lòng nhập tên và số điện thoại khách.");
      return Modal.warning({
        title: "Thiếu thông tin khách",
        content: "Vui lòng nhập tên và số điện thoại khách.",
      });
    }

    // Build roomsPayload đúng với staffCreateBookingSchema
    const roomsPayload = Array.from({ length: quantity }, () => ({
      room: selected.room,
      price: selected.price,
    }));

    const body = {
      hotel: draft.hotel,
      start_day: draft.start_day,
      end_day: draft.end_day,
      rooms: roomsPayload,
      amount: totalAmount,
      deposit: deposit || 0,
      customer,
      note,
    };

    console.log("QuickBookingModal submit body:", body); // 👈 2. check body gửi đi

    if (onSubmit) {
      try {
        console.log("QuickBookingModal calling onSubmit..."); // 👈 3. check có gọi cha không
        await onSubmit(body);
        console.log("QuickBookingModal onSubmit done"); // 👈 4. check xong chưa
      } catch (err) {
        console.error("QuickBookingModal onSubmit error:", err);
      }
    } else {
      console.warn("QuickBookingModal: onSubmit is not provided");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Đặt / Nhận phòng nhanh"
      width={900}
      footer={null}
    >
      {/* Dòng trên: ngày nhận / trả */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Space size="large" wrap>
            <Space direction="vertical" size={4}>
              <Text type="secondary">Nhận phòng</Text>
              <DatePicker
                value={dayjs(draft.start_day)}
                showTime
                format="DD/MM/YYYY HH:mm"
                disabled
              />
            </Space>
            <Space direction="vertical" size={4}>
              <Text type="secondary">Trả phòng</Text>
              <DatePicker
                value={dayjs(draft.end_day)}
                showTime
                format="DD/MM/YYYY HH:mm"
                disabled
              />
            </Space>
            <Tag color="green">
              {nights} {nights > 1 ? "đêm" : "đêm"}
            </Tag>
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Text type="secondary">Ghi chú</Text>
          <Input.TextArea
            rows={2}
            placeholder="Nhập ghi chú..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Col>
      </Row>

      <Divider />

      {/* Thông tin phòng */}
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Text type="secondary">Hạng phòng</Text>
          <Title level={5} style={{ margin: "4px 0" }}>
            {room.name || "Phòng đã chọn"}
          </Title>
          <Text type="secondary">
            Tối đa {room.max_guests || draft.metaGuest?.adults || 2} khách •{" "}
            {room.beds || "1 giường"}
          </Text>
        </Col>
        <Col span={4}>
          <Text type="secondary">Số phòng</Text>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
            {quantity}
          </div>
        </Col>
        <Col span={4} style={{ textAlign: "right" }}>
          <Text type="secondary">Dự kiến</Text>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
            {formatMoney(totalAmount)} đ
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {nights} đêm
          </Text>
        </Col>
      </Row>

      <Divider />

      {/* Thông tin khách + thanh toán */}
      <Row gutter={24}>
        <Col span={14}>
          <Title level={5}>Thông tin khách</Title>
          <Row gutter={12}>
            <Col span={12}>
              <Text type="secondary">Tên khách *</Text>
              <Input
                placeholder="Nhập tên khách"
                value={customer.name}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, name: e.target.value }))
                }
              />
            </Col>
            <Col span={12}>
              <Text type="secondary">Số điện thoại *</Text>
              <Input
                placeholder="SĐT"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, phone: e.target.value }))
                }
              />
            </Col>
            <Col span={12} style={{ marginTop: 8 }}>
              <Text type="secondary">Email</Text>
              <Input
                placeholder="Email (nếu có)"
                value={customer.email}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, email: e.target.value }))
                }
              />
            </Col>
            <Col span={12} style={{ marginTop: 8 }}>
              <Text type="secondary">CMND/CCCD</Text>
              <Input
                placeholder="Số giấy tờ"
                value={customer.idNumber}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, idNumber: e.target.value }))
                }
              />
            </Col>
          </Row>
        </Col>

        <Col span={10}>
          <Title level={5}>Thanh toán</Title>
          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Row justify="space-between">
              <Text>Khách cần trả</Text>
              <Text strong>{formatMoney(totalAmount)} đ</Text>
            </Row>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginTop: 12 }}
            >
              <Text>Khách thanh toán (đặt cọc)</Text>
              <InputNumber
                min={0}
                value={deposit}
                onChange={(v) => setDeposit(Number(v) || 0)}
                formatter={(v) =>
                  `${(v || 0).toLocaleString("vi-VN", {
                    maximumFractionDigits: 0,
                  })}`
                }
                parser={(v) => v.replace(/\./g, "").replace(/[^0-9]/g, "")}
              />
            </Row>
          </div>

          <Space
            style={{
              marginTop: 16,
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button onClick={onCancel}>Huỷ</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              Đặt trước
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}
