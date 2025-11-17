import React, { useEffect, useState } from "react";
import { Result, Button, Typography, Card, Spin } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";

const { Text, Title } = Typography;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = params.get("booking_id");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/public/bookings/${bookingId}`);
      const data = await res.json();
      setBooking(data);
    } catch (e) {
      console.error("Fetch booking failed:", e);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (bookingId) fetchBooking();  
  }, [bookingId]);

  if (loading) return <Spin fullscreen />;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", paddingTop: 40 }}>
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle={`Mã đặt phòng: ${bookingId}`}
      />

      <Card style={{ borderRadius: 12, padding: 16, marginTop: -24 }}>
        <Title level={4}>Thông tin đặt phòng</Title>

        <Text strong>Khách sạn:</Text>
        <Text> {booking?.hotel?.name}</Text>
        <br />

        <Text strong>Thời gian:</Text>
        <Text> {booking?.start_day?.slice(0, 10)} → {booking?.end_day?.slice(0, 10)}</Text>
        <br />

        <Text strong>Thanh toán:</Text>
        <Text> {(booking?.paid || 0).toLocaleString("vi-VN")}đ</Text>
        <br />

        <Text strong>Trạng thái:</Text>
        <Text> {booking?.status}</Text>
      </Card>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" size="large" onClick={() => navigate("/")}>
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
}
