// src/pages/reception/CheckInModal.jsx
import React, { useMemo, useState } from "react";
import { Modal, Row, Col, Typography, Tag, Divider, InputNumber, Button, Space, Input } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function CheckInModal({
  open,
  onCancel,
  booking,
  onSubmit,       // (payload) => Promise<void>
  loading = false,
  onEdit,         // optional: bấm "Sửa đặt phòng" trong modal nhận phòng
}) {
  const [payAmount, setPayAmount] = useState(0);
  const [note, setNote] = useState("");

  const computed = useMemo(() => {
    if (!booking) {
      return {
        code: "",
        customerName: "",
        adults: 0,
        children: 0,
        roomName: "",
        amount: 0,
        paid: 0,
        remain: 0,
        start: null,
        end: null,
        nights: 0,
      };
    }

    const start = dayjs(booking.startDay || booking.start_day);
    const end = dayjs(booking.endDay || booking.end_day);
    const nights = Math.max(
      1,
      end.startOf("day").diff(start.startOf("day"), "day")
    );

    const amount = booking.amount || 0;
    const paid = booking.paid || 0;
    const remain = Math.max(0, amount - paid);

    const customerName =
      booking.customerName || booking.customer?.name || "Khách lẻ";

    const adults =
      booking.guests?.adults ??
      booking.adults ??
      booking.metaGuest?.adults ??
      0;

    const children =
      booking.guests?.children ??
      booking.children ??
      booking.metaGuest?.children ??
      0;

    const roomName =
      booking.roomName ||
      booking.rooms?.[0]?.room?.name ||
      booking.rooms?.[0]?.roomName ||
      "";

    const code = booking.code || booking.orderCode || booking._id;

    return {
      code,
      customerName,
      adults,
      children,
      roomName,
      amount,
      paid,
      remain,
      start,
      end,
      nights,
    };
  }, [booking]);

  const handleOk = async () => {
    if (!booking || !onSubmit) return;
    // không cho trả quá số còn lại
    const pay = Math.max(0, Math.min(payAmount || 0, computed.remain));

    await onSubmit({
      payAmount: pay,
      note,
    });
  };

  const handleEditClick = () => {
    if (onEdit && booking) onEdit(booking);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      title={null}
      destroyOnClose
    >
      {booking && (
        <>
          {/* Header: Thông tin nhận phòng - Mã */}
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>
              Thông tin nhận phòng - {computed.code}
            </Title>
          </div>

          <div
            style={{
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              padding: 16,
              background: "#fff",
            }}
          >
            {/* Block trên: Khách, thời gian, phòng */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Text type="secondary">Khách hàng</Text>
                <div style={{ fontWeight: 500 }}>{computed.customerName}</div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Khách lưu trú</Text>
                <div style={{ fontWeight: 500 }}>
                  {computed.adults} người lớn, {computed.children} trẻ em
                </div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Phòng nhận</Text>
                <div style={{ fontWeight: 500 }}>{computed.roomName}</div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Text type="secondary">Nhận phòng</Text>
                <div style={{ fontWeight: 500 }}>
                  {computed.start &&
                    computed.start.format("DD Thg MM, HH:mm")}
                </div>
              </Col>
              <Col span={6}>
                <Text type="secondary">Trả phòng</Text>
                <div style={{ fontWeight: 500 }}>
                  {computed.end && computed.end.format("DD Thg MM, HH:mm")}
                </div>
              </Col>
              <Col span={6}>
                <Text type="secondary">Thời gian lưu trú</Text>
                <div style={{ fontWeight: 500 }}>
                  {computed.nights} {computed.nights > 1 ? "ngày" : "ngày"}
                </div>
              </Col>
              <Col span={6}>
                <Text type="secondary">Trạng thái</Text>
                <div style={{ fontWeight: 500 }}>
                  {booking.status || "PENDING"}
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            {/* Hàng giữa: bảng khách lưu trú (demo đơn giản) */}
            <div
              style={{
                background: "#f6ffed",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 12,
              }}
            >
              <Row>
                <Col span={8}>
                  <Text strong>Họ và tên</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Thông tin cá nhân</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Giấy tờ</Text>
                </Col>
              </Row>
            </div>
            <div style={{ minHeight: 40, marginBottom: 12 }}>
              <Text type="secondary">
                Chưa có thông tin khách lưu trú (có thể bổ sung sau).
              </Text>
            </div>

            {/* Ghi chú + tiền */}
            <Row gutter={16}>
              <Col span={16}>
                <Text type="secondary">Ghi chú</Text>
                <TextArea
                  placeholder="Nhập ghi chú nhận phòng"
                  autoSize={{ minRows: 3, maxRows: 4 }}
                  style={{ marginTop: 8 }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Col>

              <Col span={8}>
                <div
                  style={{
                    borderRadius: 12,
                    background: "#fafafa",
                    padding: 12,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text type="secondary">Khách cần trả</Text>
                    <Text strong>
                      {formatMoney(computed.remain)} đ
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text type="secondary">Khách đã trả</Text>
                    <Text>{formatMoney(computed.paid)} đ</Text>
                  </div>

                  <Divider style={{ margin: "8px 0" }} />

                  <div style={{ marginBottom: 4 }}>
                    <Text type="secondary">Khách thanh toán thêm</Text>
                  </div>
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    max={computed.remain}
                    value={payAmount}
                    formatter={(v) =>
                      `${(v || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                    }
                    parser={(v) => Number((v || "0").replace(/\./g, ""))}
                    onChange={(v) => setPayAmount(v || 0)}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Footer nút */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleEditClick} disabled={!onEdit}>
              Sửa đặt phòng
            </Button>
            <Space>
              <Button onClick={onCancel}>Huỷ</Button>
              <Button
                type="primary"
                loading={loading}
                onClick={handleOk}
              >
                Xong (Nhận phòng)
              </Button>
            </Space>
          </div>
        </>
      )}

      {!booking && <div>Không có dữ liệu booking.</div>}
    </Modal>
  );
}
