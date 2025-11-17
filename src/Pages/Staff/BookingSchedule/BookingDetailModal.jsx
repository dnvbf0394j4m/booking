// src/pages/reception/BookingDetailModal.jsx
import React from "react";
import { Modal, Row, Col, Typography, Tag, Divider, Button, Space } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

const STATUS_COLOR = {
  PENDING: "gold",
  PARTIAL: "blue",
  PAID: "green",
  CHECKED_IN: "cyan",
  CHECKED_OUT: "default",
  CANCELLED: "red",
};

const STATUS_LABEL = {
  PENDING: "Đã đặt trước",
  PARTIAL: "Đã cọc một phần",
  PAID: "Đã thanh toán",
  CHECKED_IN: "Đang lưu trú",
  CHECKED_OUT: "Đã trả phòng",
  CANCELLED: "Đã huỷ",
};

export default function BookingDetailModal({
  open,
  onCancel,
  booking,
  onEdit,      // optional: gọi khi bấm "Sửa đặt phòng"
  onCheckIn,   // optional: gọi khi bấm "Nhận phòng"
  onCheckOut,  // optional: gọi khi bấm "Trả phòng"
  onClean,
}) {
  if (!booking) return null;

  // ====== Lấy dữ liệu từ booking shape/_raw ======
  const checkIn = dayjs(booking.startDay || booking.start_day);
  const checkOut = dayjs(booking.endDay || booking.end_day);

  const nights = Math.max(
    1,
    checkOut.startOf("day").diff(checkIn.startOf("day"), "day")
  );

  const totalAmount = booking.amount || 0;
  const paidAmount = booking.paid || 0;
  const remain = Math.max(0, totalAmount - paidAmount);

  const roomLabel =
    booking.roomName ||
    booking.roomCode ||
    booking.rooms?.[0]?.room?.name ||
    "Phòng";

  const roomType =
    booking.roomType || booking.rooms?.[0]?.room?.type || "Hạng phòng";

  const code = booking.code || booking.orderCode || booking._id;

  const customerName =
    booking.customerName || booking.customer?.name || "Khách lẻ";

  const customerPhone = booking.customerPhone || booking.customer?.phone || "";

  const adults =
    booking.adults ??
    booking.metaGuest?.adults ??
    booking.customer?.adults ??
    0;
  const children =
    booking.children ??
    booking.metaGuest?.children ??
    booking.customer?.children ??
    0;

  const status = booking.status || "PENDING";
  const statusColor = STATUS_COLOR[status] || "default";
  const statusLabel = STATUS_LABEL[status] || status;

  const isStaying = status === "CHECKED_IN"; // 🔥 đang lưu trú hay không

  // ====== handlers ======
  const handleEdit = () => {
    if (onEdit) onEdit(booking);
  };

  const handleCheckIn = () => {
    if (onCheckIn) onCheckIn(booking);
  };

  const handleCheckOut = () => {
    if (onCheckOut) onCheckOut(booking);
  };

  const handleClean = () => {
    if (onClean) onClean(booking);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      title={null}
    >
      {/* Tiêu đề giống: "Chi tiết P102" */}
      <div style={{ marginBottom: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          Chi tiết {roomLabel}
        </Title>
      </div>

      {/* Khung trắng chính */}
      <div
        style={{
          borderRadius: 12,
          border: "1px solid #f0f0f0",
          padding: 16,
          background: "#fff",
        }}
      >
        {/* Header hạng phòng + trạng thái */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {roomType}
            </Title>
            <Text type="secondary">{roomLabel}</Text>
          </div>
          <Tag color={statusColor} style={{ fontWeight: 500 }}>
            {statusLabel}
          </Tag>
        </div>

        {/* Block thông tin chính (trái) + tiền (phải) */}
        <Row gutter={16}>
          {/* Bên trái: khách, thời gian, mã đặt phòng */}
          <Col span={16}>
            <Row gutter={[16, 12]}>
              <Col span={12}>
                <Text type="secondary">Khách hàng</Text>
                <div style={{ fontWeight: 500 }}>{customerName}</div>
                {customerPhone && (
                  <div style={{ fontSize: 12 }}>{customerPhone}</div>
                )}
              </Col>

              <Col span={12}>
                <Text type="secondary">Khách lưu trú</Text>
                <div style={{ fontWeight: 500 }}>
                  {adults} người lớn, {children} trẻ em
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Nhận phòng</Text>
                <div style={{ fontWeight: 500 }}>
                  {checkIn.format("DD [Thg] MM, HH:mm")}
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Trả phòng</Text>
                <div style={{ fontWeight: 500 }}>
                  {checkOut.format("DD [Thg] MM, HH:mm")}
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Thời gian lưu trú</Text>
                <div style={{ fontWeight: 500 }}>
                  {nights} {nights > 1 ? "ngày" : "ngày"}
                </div>
              </Col>

              <Col span={12}>
                <Text type="secondary">Mã đặt phòng</Text>
                <div style={{ fontWeight: 500 }}>{code}</div>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            {/* Các phòng trong đoàn (hiện tại 1 phòng) */}
            <Text type="secondary">Các phòng trong đoàn:</Text>
            <div style={{ marginTop: 8 }}>
              {(booking.rooms || []).map((r, idx) => (
                <Tag key={idx} color="default" style={{ marginBottom: 4 }}>
                  {r.room?.name || r.roomName || roomLabel}
                </Tag>
              ))}
              {(!booking.rooms || booking.rooms.length === 0) && (
                <Tag color="default">{roomLabel}</Tag>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <Text type="secondary">Ghi chú</Text>
              <div style={{ fontSize: 12 }}>
                {booking.note || "Chưa có ghi chú"}
              </div>
            </div>
          </Col>

          {/* Bên phải: tiền */}
          <Col span={8}>
            <div
              style={{
                borderRadius: 12,
                background: "#fafafa",
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">{roomLabel}</Text>
                <Text strong>{formatMoney(totalAmount)} đ</Text>
              </div>

              {/* Nếu sau này có nhiều phòng, bạn có thể thêm dòng "Cả đoàn" */}
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">Cả đoàn</Text>
                <Text strong>{formatMoney(totalAmount)} đ</Text>
              </div> */}

              <Divider style={{ margin: "8px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text type="secondary">Khách đã trả</Text>
                <Text>{formatMoney(paidAmount)} đ</Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text type="secondary">Còn lại</Text>
                <Text strong>{formatMoney(remain)} đ</Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Footer: nút hành động */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Space>
          {/* ❌ ẨN nút sửa khi đã trả phòng */}
          {status !== "CHECKED_OUT" && (
            <Button onClick={handleEdit} disabled={!onEdit}>
              Sửa đặt phòng
            </Button>
          )}

          {status === "CHECKED_OUT" ? (
            // 🧹 ĐÃ TRẢ PHÒNG → chỉ hiện nút Dọn phòng
            <Button
              type="primary"
              danger
              onClick={handleClean}
              disabled={!onClean}
            >
              Dọn phòng
            </Button>
          ) : status === "CHECKED_IN" ? (
            // 🏨 ĐANG LƯU TRÚ → Trả phòng
            <Button
              type="primary"
              danger
              onClick={handleCheckOut}
              disabled={!onCheckOut}
            >
              Trả phòng
            </Button>
          ) : (
            // 🟦 Chưa check-in → Nhận phòng
            <Button
              type="primary"
              onClick={handleCheckIn}
              disabled={!onCheckIn}
            >
              Nhận phòng
            </Button>
          )}
        </Space>
      </div>



    </Modal>
  );
}
