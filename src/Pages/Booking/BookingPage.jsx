// src/pages/booking/BookingPage.jsx
import React, { useMemo } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Form,
    Input,
    Button,
    Divider,
    Space,
    message,
    
    
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const formatMoney = (v) =>
    (v || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    });

export default function BookingPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // đọc query
    const params = new URLSearchParams(location.search);
    const hotelId = params.get("hotel_id");
    const roomId = params.get("room_id");
    const checkIn = params.get("check_in");
    const checkOut = params.get("check_out");
    const adultNum = Number(params.get("adult_num") || 2);
    const childNum = Number(params.get("child_num") || 0);
    const roomNum = Number(params.get("room_num") || 1);

    // đọc hotel / room từ state (truyền từ HotelDetail sang để không phải fetch lại)
    const state = location.state || {};
    const hotel = state.hotel || null;
    const room = state.room || null;

    const nightCount = useMemo(() => {
        if (!checkIn || !checkOut) return 1;
        const ci = dayjs(checkIn);
        const co = dayjs(checkOut);
        const diff = co.diff(ci, "day");
        return diff > 0 ? diff : 1;
    }, [checkIn, checkOut]);

    const pricePerNight = room?.price || hotel?.priceHotel || 0;
    const total = pricePerNight * nightCount * roomNum;
const [form] = Form.useForm();  // 👈 dùng để validate + lấy dữ liệu


const handlePayVNPay = async () => {
  try {
    if (!hotel || !room) {
      message.error("Thiếu thông tin khách sạn hoặc phòng. Vui lòng quay lại chọn lại.");
      return;
    }
    if (!checkIn || !checkOut) {
      message.error("Vui lòng chọn ngày nhận phòng và trả phòng.");
      return;
    }

    // Validate form + lấy dữ liệu
    const values = await form.validateFields(); // { name, phone, email, note? }

    const res = await fetch(`${API_BASE}/api/public/bookings/create-and-pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel: hotel._id,
        room: room._id,
        start_day: checkIn,
        end_day: checkOut,
        customer: {
          name: values.name,
          phone: values.phone,
          email: values.email,
        },
        note: values.note || "",
      }),
    });

    const data = await res.json();
    console.log("📌 Payment data:", data);

    if (!res.ok) {
      message.error(data.error || "Lỗi tạo booking online");
      return;
    }

    if (!data.paymentUrl) {
      message.error("API không trả về paymentUrl, kiểm tra lại backend!");
      return;
    }

    // ✅ Redirect sang VNPay
    window.location.href = data.paymentUrl;
  } catch (e) {
    // Nếu lỗi là validate form của AntD thì k cần báo
    if (e?.errorFields) return;
    console.error("Lỗi thanh toán VNPay:", e);
    message.error(e.message || "Không thể tạo thanh toán VNPay");
  }
};


    const onFinish = async (values) => {
        console.log("Submit booking:", {
            ...values,
            hotelId,
            roomId,
            checkIn,
            checkOut,
            adultNum,
            childNum,
            roomNum,
        });

        // TODO: gọi API tạo booking, ví dụ:
        // const res = await fetch(`${API_BASE}/api/bookings/public/create`, { ... })

        // tạm thời chỉ mock:
        // message.success("Đặt phòng thành công!");
        // navigate("/"); 
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <Content style={{ padding: "24px 0" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
                    <Button type="link" onClick={() => navigate(-1)} style={{ paddingLeft: 0 ,position: "absolute",left:"248px",fontSize:"16px" }}>
                        ← Quay lại chi tiết khách sạn
                    </Button>

                    <Title level={3} style={{ marginBottom: 16 }}>
                        Hoàn tất đặt phòng
                    </Title>

                    <Row gutter={24}>
                        {/* LEFT: form thông tin khách */}
                        <Col xs={24} md={16}>
                            <Card
                                title="Thông tin liên hệ"
                                style={{ borderRadius: 12, marginBottom: 16 }}
                                bodyStyle={{ padding: 16 }}
                            >
                                <Form layout="vertical" onFinish={onFinish} form={form} >
                                    <Form.Item
                                        label="Họ và tên"
                                        name="name"
                                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>

                                    <Form.Item label="Ghi chú" name="note">
                                        <Input.TextArea rows={3} placeholder="Yêu cầu thêm (nếu có)" />
                                    </Form.Item>

                                    <Divider />

                                    {/* Payment đơn giản: Offline, sau này gắn VNPAY */}
                                    <Title level={5}>Phương thức thanh toán</Title>
                                    {/* <Text type="secondary">
                                        Tạm thời thanh toán tại khách sạn (OFFLINE_CASH / OFFLINE_CARD). Sau này mình
                                        gắn VNPAY giống flow bạn đã nói.
                                    </Text> */}

                                    <Form.Item style={{ marginTop: 16 }}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            style={{ background: "#ff5b00", borderColor: "#ff5b00" }}
                                            onClick={handlePayVNPay}
                                        >
                                            Thanh toán qua VNPay
                                        </Button>

                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>

                        {/* RIGHT: tóm tắt đơn */}
                        <Col xs={24} md={8}>
                            <Card
                                style={{ borderRadius: 12, position: "sticky", top: 80 }}
                                bodyStyle={{ padding: 16 }}
                                title="Tóm tắt đặt phòng"
                            >
                                {hotel && (
                                    <>
                                        <Text strong>{hotel.name}</Text>
                                        <br />
                                        <Text type="secondary">{hotel.address}</Text>
                                        <Divider style={{ margin: "12px 0" }} />
                                    </>
                                )}

                                {room && (
                                    <div style={{ marginBottom: 8 }}>
                                        <Text strong>Phòng: {room.name}</Text>
                                        {room.max_guests && (
                                            <div>
                                                <Text type="secondary">
                                                    Phù hợp {room.max_guests} khách
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary">Nhận phòng</Text>
                                    <br />
                                    <Text strong>{checkIn || "Chưa chọn"}</Text>
                                </div>

                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary">Trả phòng</Text>
                                    <br />
                                    <Text strong>{checkOut || "Chưa chọn"}</Text>
                                </div>

                                <div style={{ marginBottom: 8 }}>
                                    <Text type="secondary">Khách & phòng</Text>
                                    <br />
                                    <Text strong>
                                        {roomNum} phòng · {adultNum} người lớn
                                        {childNum ? `, ${childNum} trẻ em` : ""}
                                    </Text>
                                </div>

                                <Divider style={{ margin: "12px 0" }} />

                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                    size={4}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text type="secondary">
                                            {formatMoney(pricePerNight)} x {nightCount} đêm x {roomNum} phòng
                                        </Text>
                                        <Text strong>{formatMoney(total)}</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
}
