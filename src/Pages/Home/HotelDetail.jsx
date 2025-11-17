


import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Image,
  Tag,
  Space,
  Typography,
  Button,
  Skeleton,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

export default function HotelDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // nếu từ list truyền state.hotel sang thì dùng tạm cho nhanh
  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loading, setLoading] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // query: check_in, check_out, adult_num, child_num, room_num
  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const adultNum = Number(searchParams.get("adult_num") || 2);
  const childNum = Number(searchParams.get("child_num") || 0);
  const roomNum = Number(searchParams.get("room_num") || 1);

  const stayText =
    checkIn && checkOut
      ? `${checkIn} → ${checkOut} · ${roomNum} phòng · ${adultNum} người lớn${childNum > 0 ? `, ${childNum} trẻ em` : ""
      }`
      : `${roomNum} phòng · ${adultNum} người lớn${childNum > 0 ? `, ${childNum} trẻ em` : ""
      }`;

  const fetchHotelDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/hotels/public/${id}`);
      const json = await res.json();
      setHotel(json);
    } catch (e) {
      console.error("Fetch hotel detail error:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    if (!checkIn || !checkOut) return;

    try {
      setRoomsLoading(true);
      const params = new URLSearchParams();
      params.set("check_in", checkIn);
      params.set("check_out", checkOut);
      params.set("adult_num", String(adultNum));
      params.set("child_num", String(childNum));
      params.set("room_num", String(roomNum));

      const res = await fetch(
        `${API_BASE}/api/hotels/public/${id}/available-rooms?${params.toString()}`
      );
      const json = await res.json();
      console.log("Available rooms:", json);
      setRooms(json.data || []);
    } catch (e) {
      console.error("Fetch available rooms error:", e);
    } finally {
      setRoomsLoading(false);
    }
  };


  const handleGoBooking = (room) => {
    const params = new URLSearchParams();

    params.set("hotel_id", hotel._id);
    if (room?._id) params.set("room_id", room._id);
    if (checkIn) params.set("check_in", checkIn);
    if (checkOut) params.set("check_out", checkOut);
    params.set("adult_num", String(adultNum));
    params.set("child_num", String(childNum));
    params.set("room_num", String(roomNum));

    navigate({
      pathname: "/booking",
      search: `?${params.toString()}`,
    }, {
      state: { hotel, room }, // truyền kèm hotel + room để BookingPage đỡ phải fetch lại
    });
  };

  useEffect(() => {
    if (!hotel) {
      fetchHotelDetail();
    }
    fetchAvailableRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, checkIn, checkOut, adultNum, childNum, roomNum]);

  if (!hotel && loading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content style={{ padding: "24px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
            <Skeleton active />
          </div>
        </Content>
      </Layout>
    );
  }

  if (!hotel && !loading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content style={{ padding: "24px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ marginBottom: 16 }}
            >
              Quay lại
            </Button>
            <Title level={4}>Không tìm thấy khách sạn</Title>
          </div>
        </Content>
      </Layout>
    );
  }

  // ===== data render =====
  const images = hotel.hotelImages || [];
  const mainImage = images[0]?.image_url || "/placeholder-hotel.jpg";
  const smallImages = images.slice(1, 5); // tối đa 4 ảnh nhỏ

  const rating = Number(hotel.rating || 0);
  const reviewCount = Number(hotel.reviewCount || 0);
  const originalPrice = hotel.priceHotel || 0;
  const finalPrice =
    hotel.discount && hotel.discount > 0
      ? (originalPrice * (100 - hotel.discount)) / 100
      : originalPrice;

  const addressText = [
    hotel.address,
    hotel.area?.name,
    hotel.city?.name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          {/* back + breadcrumb */}
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            onClick={() => navigate(-1)}
            style={{ paddingLeft: 0, marginBottom: 4 ,position: "absolute",
    left:"160px",fontSize:"16px" }}
          >
            Quay lại danh sách
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Việt Nam &gt; {hotel.city?.name || "Điểm đến"} &gt; {hotel.name}
          </Text>

          {/* ===== BLOCK ẢNH + INFO HÀNG DƯỚI ===== */}
          <div
            style={{
              marginTop: 12,
              marginBottom: 16,
              background: "#ffffff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {/* GALLERY */}
            <Row gutter={0}>
              {/* ảnh lớn bên trái */}
              <Col span={14}>
                <div
                  style={{
                    height: 320,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={getImageUrl(mainImage)}
                    alt={hotel.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    preview={{ maskClassName: "hotel-main-img-mask" }}
                  />
                </div>
              </Col>

              {/* 4 ảnh nhỏ bên phải (2x2) */}
              <Col span={10}>
                <Row gutter={0}>
                  {smallImages.map((img, idx) => (
                    <Col key={img._id || idx} span={12}>
                      <div
                        style={{
                          height: 160, // 320 / 2
                          overflow: "hidden",
                          borderLeft: "1px solid #f0f0f0",
                          borderBottom: idx < 2 ? "1px solid #f0f0f0" : "none",
                        }}
                      >
                        <Image
                          src={getImageUrl(img.image_url)}
                          alt={hotel.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    </Col>
                  ))}

                  {/* fill ô trống nếu thiếu ảnh */}
                  {smallImages.length < 4 &&
                    Array.from({ length: 4 - smallImages.length }).map(
                      (_, idx) => (
                        <Col key={`empty-${idx}`} span={12}>
                          <div
                            style={{
                              height: 160,
                              overflow: "hidden",
                              borderLeft: "1px solid #f0f0f0",
                              borderBottom: idx < 2 ? "1px solid #f0f0f0" : "none",
                              background: "#f5f5f5",
                            }}
                          />
                        </Col>
                      )
                    )}
                </Row>
              </Col>
            </Row>

            {/* HÀNG DƯỚI: info trái / giá + nút phải */}
            <div
              style={{
                padding: "14px 20px 16px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 24,
              }}
            >
              {/* LEFT: tên + sao + địa chỉ */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Title
                  level={3}
                  style={{ margin: 0, marginBottom: 4, lineHeight: 1.3 }}
                >
                  {hotel.name}
                </Title>

                <Space size={4} style={{ marginBottom: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarFilled
                      key={i}
                      style={{
                        color: i < Math.round(rating) ? "#faad14" : "#d9d9d9",
                        fontSize: 15,
                      }}
                    />
                  ))}
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {rating ? rating.toFixed(1) : "0.0"} ({reviewCount} đánh giá)
                  </Text>
                </Space>

                <div>
                  {addressText && (
                    <Text type="secondary">
                      <EnvironmentOutlined /> {addressText}
                    </Text>
                  )}
                  <Button type="link" size="small">
                    Xem bản đồ &gt;
                  </Button>
                </div>
              </div>

              {/* RIGHT: giá + nút chọn phòng */}
              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                {hotel.discount > 0 && (
                  <Text
                    type="secondary"
                    delete
                    style={{ display: "block", fontSize: 13 }}
                  >
                    {formatMoney(originalPrice)} / đêm
                  </Text>
                )}

                <div style={{ marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      display: "inline-block",
                    }}
                  >
                    {formatMoney(finalPrice)}
                  </span>
                  <Text type="secondary" style={{ marginLeft: 4 }}>
                    / đêm
                  </Text>
                </div>

                <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                  1 phòng · {adultNum} người lớn
                </Text>

                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: 8,
                    background: "#ff5b00",
                    borderColor: "#ff5b00",
                    borderRadius: 999,
                    paddingInline: 32,
                  }}
                  onClick={() => {
                    console.log("Click nút Chọn phòng");
                  }}
                >
                  Chọn phòng
                </Button>
              </div>
            </div>
          </div>

          {/* TỔNG QUAN CHỖ NGHỈ */}
          <Card
            style={{ marginTop: 8, borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
            title="Tổng quan chỗ nghỉ"
          >
            {hotel.description ? (
              <Paragraph>{hotel.description}</Paragraph>
            ) : (
              <Text type="secondary">
                Chỗ nghỉ này chưa có mô tả chi tiết.
              </Text>
            )}

            <div style={{ marginTop: 12 }}>
              {(hotel.checkInTime || hotel.checkOutTime) && (
                <Text type="secondary">
                  {hotel.checkInTime && (
                    <>
                      Nhận phòng từ <b>{hotel.checkInTime}</b>
                    </>
                  )}
                  {hotel.checkInTime && hotel.checkOutTime && " · "}
                  {hotel.checkOutTime && (
                    <>
                      Trả phòng trước <b>{hotel.checkOutTime}</b>
                    </>
                  )}
                </Text>
              )}
            </div>
          </Card>

          {/* CHỌN PHÒNG CỦA BẠN */}
          <Card
            style={{ marginTop: 16, borderRadius: 12 }}
            bodyStyle={{ padding: 16 }}
            title="Chọn phòng của bạn"
          >
            {roomsLoading ? (
              <Skeleton active />
            ) : rooms.length === 0 ? (
              <Text type="secondary">
                Không còn phòng phù hợp với ngày và số khách đã chọn.
              </Text>
            ) : (
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {rooms.map((room) => {
                  const roomImage =
                    room.roomImages?.[0]?.image_url || "/placeholder-room.jpg";

                  const roomOriginalPrice = room.price || 0;
                  const roomFinalPrice =
                    hotel.discount && hotel.discount > 0
                      ? (roomOriginalPrice * (100 - hotel.discount)) / 100
                      : roomOriginalPrice;

                  return (
                    <Card
                      key={room._id}
                      size="small"
                      style={{ borderRadius: 10 }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <Row gutter={12}>
                        <Col xs={24} md={7}>
                          <div
                            style={{
                              borderRadius: 10,
                              overflow: "hidden",
                              height: 120,
                              background: "#eee",
                            }}
                          >
                            <img
                              src={getImageUrl(roomImage)}
                              alt={room.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </Col>

                        <Col xs={24} md={11}>
                          <Space
                            direction="vertical"
                            size={4}
                            style={{ width: "100%" }}
                          >
                            <Text strong style={{ fontSize: 16 }}>
                              {room.name}
                            </Text>
                            {room.beds && (
                              <Text type="secondary">Giường: {room.beds}</Text>
                            )}
                            {room.size_sqm && (
                              <Text type="secondary">
                                Diện tích: {room.size_sqm} m²
                              </Text>
                            )}
                            {room.description && (
                              <Text type="secondary">
                                {room.description}
                              </Text>
                            )}

                            <Space
                              size="small"
                              wrap
                              style={{ marginTop: 4 }}
                            >
                              <Tag color="green">
                                Phù hợp {room.max_guests} khách
                              </Tag>
                              {hotel.discount > 0 && (
                                <Tag color="red">
                                  Giảm {hotel.discount}%
                                </Tag>
                              )}
                            </Space>
                          </Space>
                        </Col>

                        <Col
                          xs={24}
                          md={6}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ textAlign: "right" }}>
                            {hotel.discount > 0 && (
                              <Text
                                type="secondary"
                                delete
                                style={{ display: "block" }}
                              >
                                {formatMoney(roomOriginalPrice)} / đêm
                              </Text>
                            )}
                            <Text
                              strong
                              style={{
                                fontSize: 18,
                                display: "block",
                                lineHeight: 1.2,
                              }}
                            >
                              {formatMoney(roomFinalPrice)} / đêm
                            </Text>
                            <Text
                              type="secondary"
                              style={{ fontSize: 12 }}
                            >
                              (chưa gồm thuế & phí)
                            </Text>
                          </div>

                          <Button
                            type="primary"
                            size="middle"
                            style={{ marginTop: 8 }}
                            onClick={() => handleGoBooking(room)}
                          >
                            Chọn phòng này
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </Space>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
