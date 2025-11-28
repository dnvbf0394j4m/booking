

// src/pages/hotel/HotelSearchPage.jsx (hoặc Home.jsx)
import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Rate,
  Tag,
  Button,
  Slider,
  Checkbox,
  Radio,
  Input,
  Space,
  Typography,
  Select,
  Skeleton,
  Popover,
  InputNumber,
} from "antd";

import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import api from "../../api/client";



const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;


// Backend base URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


// Helper format tiền
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

export default function Home() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("Hà Nội, Việt Nam");
  const [keyword, setKeyword] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);  // [checkIn, checkOut]

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [dateText, setDateText] = useState("Chọn ngày");
  const [priceRange, setPriceRange] = useState([200000, 3000000]);



  // Ngày – bạn đã có dateRange, dateText, datePopoverOpen rồi

  // Khách & phòng
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestText, setGuestText] = useState("2 Người lớn, 1 Phòng");
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  const [starFilter, setStarFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);



  const updateGuestText = (a, c, r) => {
    const adultText = `${a} Người lớn`;
    const childText = c > 0 ? `, ${c} Trẻ em` : "";
    const roomText = `, ${r} Phòng`;
    setGuestText(adultText + childText + roomText);
  };

  const handleGuestChange = (field, value) => {
    if (field === "adults") {
      const v = value || 0;
      setAdults(v);
      updateGuestText(v, children, rooms);
    } else if (field === "children") {
      const v = value || 0;
      setChildren(v);
      updateGuestText(adults, v, rooms);
    } else if (field === "rooms") {
      const v = value || 1;
      setRooms(v);
      updateGuestText(adults, children, v);
    }
  };



  const [selectedCityId] = useState("");
  const [selectedAreaId] = useState("");

  // Gọi API public list
  const fetchHotels = async () => {
    try {
      setLoading(true);

      // chuẩn bị check-in/check-out nếu có
      const [start, end] = dateRange;
      const checkIn = start ? start.format("YYYY-MM-DD") : "";
      const checkOut = end ? end.format("YYYY-MM-DD") : "";

      const params = new URLSearchParams();
      if (keyword) params.set("search", keyword);
      if (selectedCityId) params.set("city", selectedCityId);
      if (selectedAreaId) params.set("area", selectedAreaId);
      if (checkIn) params.set("check_in", checkIn);
      if (checkOut) params.set("check_out", checkOut);
      params.set("adult_num", String(adults));
      params.set("child_num", String(children));
      // params.set("room_num", String(rooms));

      const res = await fetch(
        `${API_BASE}/api/hotels/public/list?${params.toString()}`
      );
      const json = await res.json();
      console.log("Fetched hotels:", json);
      setHotels(json.data || []);
    } catch (e) {
      console.error("Fetch hotels error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (values) => {
    setDateRange(values || [null, null]);

    if (values && values[0] && values[1]) {
      const text = `${values[0].format("DD/MM")} - ${values[1].format("DD/MM")}`;
      setDateText(text);
    } else {
      setDateText("Chọn ngày");
    }
  };


  useEffect(() => {
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchHotels();
  };

  // Filter client-side theo giá + hạng sao
  const filteredHotels = hotels.filter((h) => {
    // lọc theo khoảng giá
    if (h.priceHotel < priceRange[0] || h.priceHotel > priceRange[1]) {
      return false;
    }

    // lọc theo hạng sao (rating)
    if (starFilter.length > 0) {
      const minStar = Math.min(...starFilter); // vd [5,4] => 4
      const rating = h.rating || 0;
      if (rating < minStar) return false;
    }

    return true;
  });

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* HEADER SEARCH */}

      <Header
        style={{
          background: "#ffffff",
          padding: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Thanh xanh giống Klook */}
        <div
          style={{
            background: "#1f2470",        // xanh đậm
            padding: "14px 0 18px",       // trên / dưới
          }}
        >
          {/* Khung giữa, giới hạn chiều rộng */}
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 40px",
            }}
          >
            <Row gutter={12} align="middle">
              {/* Địa điểm */}
              <Col xs={24} md={8}>
                <div
                  style={{
                    background: "#f7f7f7",
                    borderRadius: 999,
                    padding: "2px 18px",
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Hà Nội, Việt Nam"
                    bordered={false}
                    style={{
                      background: "transparent",
                      boxShadow: "none",
                    }}
                  />
                </div>
              </Col>


              {/* Chọn ngày */}
              <Col xs={24} md={7}>
                <Popover
                  trigger="click"
                  open={datePopoverOpen}
                  onOpenChange={setDatePopoverOpen}
                  placement="bottom"
                  content={
                    <RangePicker
                      value={dateRange}
                      onChange={handleDateChange}
                      format="DD/MM/YYYY"
                      placeholder={["Nhận phòng", "Trả phòng"]}
                      allowClear
                      // 🟢 Chỉ cho chọn từ hôm nay trở đi
                      disabledDate={(current) =>
                        current && current < dayjs().startOf("day")
                      }
                    />
                  }
                >
                  <div
                    style={{
                      background: "#f7f7f7",
                      borderRadius: 999,
                      padding: "0 24px",
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#222",
                      cursor: "pointer",
                    }}
                  >
                    {dateText}
                  </div>
                </Popover>

              </Col>


              {/* Khách & phòng */}
              <Col xs={24} md={7}>
                <Popover
                  trigger="click"
                  open={guestPopoverOpen}
                  onOpenChange={setGuestPopoverOpen}
                  placement="bottom"
                  content={
                    <div style={{ minWidth: 260 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span>Người lớn</span>
                        <InputNumber
                          min={1}
                          max={10}
                          value={adults}
                          onChange={(v) => handleGuestChange("adults", v)}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span>Trẻ em</span>
                        <InputNumber
                          min={0}
                          max={10}
                          value={children}
                          onChange={(v) => handleGuestChange("children", v)}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 12,
                        }}
                      >
                        <span>Phòng</span>
                        <InputNumber
                          min={1}
                          max={10}
                          value={rooms}
                          onChange={(v) => handleGuestChange("rooms", v)}
                        />
                      </div>

                      <Button
                        type="primary"
                        block
                        onClick={() => setGuestPopoverOpen(false)}
                      >
                        Xong
                      </Button>
                    </div>
                  }
                >
                  <div
                    style={{
                      background: "#f7f7f7",
                      borderRadius: 999,
                      padding: "0 24px",
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#222",
                      cursor: "pointer",
                    }}
                  >
                    {guestText}
                  </div>
                </Popover>
              </Col>


              {/* Nút tìm kiếm */}
              <Col xs={24} md={2}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="large"
                  block
                  onClick={handleSearch}
                  style={{
                    height: 48,
                    borderRadius: 999,
                    background: "#ff5b00",
                    borderColor: "#ff5b00",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "200px",
                  }}
                >
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Header>




      {/* CONTENT */}
      <Content style={{ padding: "24px 40px 40px ", marginTop: 55 }}>
        <Row gutter={24}>
          {/* LEFT: FILTER */}
          <Col xs={24} md={7} lg={6}>
            <Card title="Bộ lọc" style={{ marginBottom: 16 }}>
              {/* Giá */}
              <div style={{ marginBottom: 24 }}>
                <Text strong>Giá mỗi đêm</Text>
                <Slider
                  range
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={priceRange}
                  onChange={setPriceRange}
                />
                <Space>
                  <Text type="secondary">Từ</Text>
                  <Text strong>{formatMoney(priceRange[0])}</Text>
                  <Text type="secondary">Đến</Text>
                  <Text strong>{formatMoney(priceRange[1])}</Text>
                </Space>
              </div>

              {/* Hạng sao – giờ lọc theo rating thật */}
              <div style={{ marginBottom: 24 }}>
                <Text strong>Hạng sao</Text>
                <div style={{ marginTop: 8 }}>
                  {[5, 4, 3].map((s) => (
                    <Checkbox
                      key={s}
                      checked={starFilter.includes(s)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStarFilter([...starFilter, s]);
                        } else {
                          setStarFilter(
                            starFilter.filter((st) => st !== s)
                          );
                        }
                      }}
                      style={{ display: "block", marginBottom: 4 }}
                    >
                      <Rate disabled value={s} /> trở lên
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Loại chỗ ở – placeholder */}
              <div style={{ marginBottom: 24 }}>
                <Text strong>Loại chỗ ở</Text>
                <Radio.Group
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 8,
                  }}
                >
                  <Radio value="HOTEL">Khách sạn</Radio>
                  <Radio value="APARTMENT">Căn hộ</Radio>
                  <Radio value="RESORT">Resort</Radio>
                </Radio.Group>
              </div>

              {/* Tiện nghi – placeholder */}
              <div>
                <Text strong>Tiện nghi</Text>
                <div style={{ marginTop: 8 }}>
                  <Checkbox style={{ display: "block" }}>
                    WiFi miễn phí
                  </Checkbox>
                  <Checkbox style={{ display: "block" }}>
                    Bể bơi
                  </Checkbox>
                  <Checkbox style={{ display: "block" }}>
                    Bao gồm bữa sáng
                  </Checkbox>
                </div>
              </div>
            </Card>
          </Col>

          {/* RIGHT: HOTEL LIST */}
          <Col xs={24} md={17} lg={18}>
            <Space
              style={{ marginBottom: 16 }}
              size="large"
              align="center"
            >
              <Title level={4} style={{ margin: 0 }}>
                {filteredHotels.length} chỗ nghỉ tại {destination}
              </Title>
            </Space>

            {loading ? (
              <>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </>
            ) : (
              filteredHotels.map((hotel) => {
                const img =
                  hotel.hotelImages?.[0]?.image_url ||
                  "/placeholder-hotel.jpg";

                const addressText = [
                  hotel.address,
                  hotel.area?.name,
                  hotel.city?.name,
                ]
                  .filter(Boolean)
                  .join(", ");

                const originalPrice = hotel.priceHotel || 0;
                const finalPrice =
                  hotel.discount && hotel.discount > 0
                    ? (originalPrice * (100 - hotel.discount)) / 100
                    : originalPrice;

                const rating = hotel.rating || 0;
                const reviewCount = hotel.reviewCount || 0;

                return (
                  <Card
                    key={hotel._id}
                    hoverable
                    style={{
                      marginBottom: 16,
                      borderRadius: 12,
                    }}
                    bodyStyle={{ padding: 16 }}
                    onClick={() => {
                      const params = new URLSearchParams();

                      const [start, end] = dateRange; // nếu bạn đang dùng state dateRange
                      const checkIn = start ? start.format("YYYY-MM-DD") : "";
                      const checkOut = end ? end.format("YYYY-MM-DD") : "";

                      if (checkIn) params.set("check_in", checkIn);
                      if (checkOut) params.set("check_out", checkOut);
                      params.set("adult_num", String(adults));
                      params.set("child_num", String(children));
                      params.set("room_num", String(rooms));

                      navigate(`/hotels/${hotel._id}?${params.toString()}`, {
                        state: { hotel },
                      });
                    }}

                  >
                    <Row gutter={16}>
                      {/* ẢNH */}
                      <Col xs={24} md={8}>
                        <div
                          style={{
                            borderRadius: 12,
                            overflow: "hidden",
                            height: 180,
                            background: "#eee",
                          }}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={hotel.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </Col>

                      {/* INFO */}
                      <Col xs={24} md={10}>
                        <Space
                          direction="vertical"
                          size={4}
                          style={{ width: "100%" }}
                        >
                          <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            Khách sạn
                          </Text>
                          <Title level={4} style={{ margin: 0 }}>
                            {hotel.name}
                          </Title>

                          {addressText && (
                            <Text type="secondary">
                              <EnvironmentOutlined /> {addressText}
                            </Text>
                          )}

                          {hotel.description && (
                            <Text type="secondary">
                              {hotel.description}
                            </Text>
                          )}

                          {/* TAGS + DISCOUNT */}
                          <Space size="small" wrap>
                            {Array.isArray(hotel.tags) &&
                              hotel.tags.map((tag) => (
                                <Tag color="green" key={tag}>
                                  {tag}
                                </Tag>
                              ))}

                            {(!hotel.tags ||
                              hotel.tags.length === 0) && (
                                <Tag color="green">
                                  Xác nhận ngay
                                </Tag>
                              )}

                            {hotel.discount > 0 && (
                              <Tag color="red">
                                Giảm {hotel.discount}%
                              </Tag>
                            )}
                          </Space>

                          {/* RATING REAL */}
                          <Space align="center">
                            <Rate
                              allowHalf
                              disabled
                              value={rating}
                            />
                            <Text strong>
                              {rating.toFixed
                                ? rating.toFixed(1)
                                : rating}
                            </Text>
                            <Text type="secondary">
                              ({reviewCount} đánh giá)
                            </Text>
                          </Space>
                        </Space>
                      </Col>

                      {/* GIÁ + ACTION */}
                      <Col
                        xs={24}
                        md={6}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <div style={{ textAlign: "right" }}>
                          {hotel.discount > 0 && (
                            <Text
                              type="secondary"
                              delete
                              style={{ display: "block" }}
                            >
                              {formatMoney(originalPrice)}
                            </Text>
                          )}

                          <Text
                            strong
                            style={{
                              fontSize: 20,
                              display: "block",
                              lineHeight: 1.2,
                            }}
                          >
                            {formatMoney(finalPrice)}
                          </Text>
                          <Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            /phòng/đêm
                          </Text>
                        </div>
                        <Button type="primary" size="large">
                          Xem phòng
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
