// src/components/BookingDetailModal.jsx
import React from "react";
import { Modal, Descriptions, Tag, Divider, Typography } from "antd";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const STATUS_COLORS = {
  PENDING: "default",
  PARTIAL: "orange",
  PAID: "green",
  CHECKED_IN: "blue",
  CHECKED_OUT: "purple",
  CANCELLED: "red",
};

const STATUS_LABELS = {
  PENDING: "Chờ thanh toán",
  PARTIAL: "Thanh toán một phần",
  PAID: "Đã thanh toán đủ",
  CHECKED_IN: "Đã check-in",
  CHECKED_OUT: "Đã check-out",
  CANCELLED: "Đã hủy",
};

export default function BookingDetailModal({ open, booking, onClose }) {
  if (!booking) return null;

  const status = booking.status;
  const statusColor = STATUS_COLORS[status] || "default";
  const statusLabel = STATUS_LABELS[status] || status;

  const start = booking.start_day
    ? dayjs(booking.start_day).format("DD/MM/YYYY")
    : "—";
  const end = booking.end_day
    ? dayjs(booking.end_day).format("DD/MM/YYYY")
    : "—";
  const createdAt = booking.createdAt
    ? dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")
    : "—";

  const amount = booking.amount || 0;
  const paid = booking.paid || 0;
  const remaining = Math.max(0, amount - paid);

  const customer = booking.customer || {};
  const hotelName = booking.hotel?.name || "—";
  const rooms = Array.isArray(booking.rooms) ? booking.rooms : [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            Chi tiết booking –{" "}
            <Text strong style={{ color: "#096dd9" }}>
              {booking.orderCode}
            </Text>
          </span>
          <Tag color={statusColor} style={{ fontSize: 13, padding: "4px 10px" }}>
            {statusLabel}
          </Tag>
        </div>
      }
    >
      {/* Thông tin booking */}
      <Title level={5} style={{ marginTop: 0 }}>
        🧾 Thông tin đặt phòng
      </Title>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="Mã đơn">
          <Text strong>{booking.orderCode || "—"}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Khách sạn">
          <Text strong>{hotelName}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày ở">
          {start} → {end}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {createdAt}
        </Descriptions.Item>

        <Descriptions.Item label="Tổng tiền">
          <Text strong style={{ color: "#fa8c16" }}>
            {amount.toLocaleString("vi-VN")} ₫
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Đã thanh toán">
          <Text strong style={{ color: "#52c41a" }}>
            {paid.toLocaleString("vi-VN")} ₫
          </Text>
          {remaining > 0 && (
            <div style={{ fontSize: 12, color: "red" }}>
              Còn lại: {remaining.toLocaleString("vi-VN")} ₫
            </div>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Tạo bởi">
          {booking.createdBy?.name || "Online"}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          {booking.note || "—"}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Phòng */}
      <Title level={5}>🏨 Phòng & giá</Title>
      {rooms.length === 0 ? (
        <Text type="secondary">Không có phòng nào trong booking</Text>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {rooms.map((r) => (
            <li key={r._id || r.room?._id}>
              <Text strong>{r.room?.name || "Phòng"}</Text>{" "}
              –{" "}
              <Text>
                {r.price?.toLocaleString("vi-VN") || 0} ₫ / đêm
              </Text>
            </li>
          ))}
        </ul>
      )}

      <Divider />

      {/* Khách hàng */}
      <Title level={5}>👤 Thông tin khách hàng</Title>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="Họ tên">
          {customer.name || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {customer.phone || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {customer.email || "—"}
        </Descriptions.Item>
      </Descriptions>

      {/* Thanh toán chi tiết nếu bạn muốn thêm sau */}
      {/* <Divider />
      <Title level={5}>💳 Lịch sử thanh toán</Title> */}
    </Modal>
  );
}
