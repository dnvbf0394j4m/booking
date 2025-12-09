// pages/HotelDetail.jsx — Trang quản lý chi tiết khách sạn (ADMIN)
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
 Divider,
  Empty,
  Image,
  message,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Rate,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  UserOutlined,
  ExpandOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import api from "../../../api/client";

const { Title, Text, Paragraph } = Typography;

const API_BASE = "http://localhost:4000";

const asNumber = (v) => {
  if (v == null) return null;
  if (typeof v === "object" && v.$numberDecimal) return parseFloat(v.$numberDecimal);
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function HotelDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // ===== HANDLER ACTION =====
  const handleAddRoom = () => {
    // TODO: sửa route theo project của bạn
    // Ví dụ: /admin/hotel/:hotelId/rooms/new
    navigate(`/admin/hotel/${id}/rooms/new`);
  };

  const handleEditRoom = (room) => {
    // TODO: sửa route theo project của bạn
    // Ví dụ: /admin/hotel/:hotelId/rooms/:roomId/edit
    navigate(`/admin/hotel/${id}/rooms/${room._id}/edit`, {
      state: { hotel, room },
    });
  };

  const handleDeleteRoom = async (room) => {
    try {
      setLoadingRooms(true);
      // TODO: sửa API xoá room theo backend của bạn
      // Ví dụ: DELETE /api/hotels/:hotelId/rooms/:roomId
      await api.delete(`/api/hotels/${id}/rooms/${room._id}`);
      message.success("Đã xoá phòng");

      // Xoá trong state để cập nhật lại UI
      setHotel((prev) => ({
        ...prev,
        room: (prev?.room || []).filter((r) => r._id !== room._id),
      }));
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Xoá phòng thất bại";
      message.error(msg);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (hotel) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/api/hotels/${id}`);

        const raw = res.data;
        const detail =
          raw && (raw._id || raw.id)
            ? raw
            : raw?.data && (raw.data._id || raw.data.id)
            ? raw.data
            : null;

        if (!cancelled) {
          if (detail) {
            setHotel(detail);
          } else {
            message.error("Khách sạn không tồn tại!");
            navigate("/admin/hotel");
          }
        }
      } catch (e) {
        console.error("Lỗi tải chi tiết khách sạn:", e);
        if (!cancelled) {
          const msg =
            e?.response?.data?.error ||
            e?.response?.data?.message ||
            "ID khách sạn không hợp lệ hoặc không tồn tại!";
          message.error(msg);

          setTimeout(() => navigate("/admin/hotel"), 500);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const rooms = useMemo(() => hotel?.room || [], [hotel]);

  const hotelCover = useMemo(() => {
    const imgs = hotel?.hotelImages || [];
    const first = imgs[0]?.image_url;
    if (!first) return null;

    const path = first.startsWith("/") ? first : `/${first}`;
    return `${API_BASE}${path}`;
  }, [hotel]);

  const gallery = useMemo(() => {
    const imgs = hotel?.hotelImages || [];
    return imgs
      .map((i) => {
        if (!i?.image_url) return null;
        const path = i.image_url.startsWith("/") ? i.image_url : `/${i.image_url}`;
        return `${API_BASE}${path}`;
      })
      .filter(Boolean);
  }, [hotel]);

  const roomColumns = [
    {
      title: "Phòng",
      dataIndex: "name",
      key: "name",
      width: 240,
      render: (name, record) => (
        <Space>
          {record.roomImages?.[0]?.image_url && (
            <Avatar
              shape="square"
              size={48}
              src={`${API_BASE}${
                record.roomImages[0].image_url.startsWith("/")
                  ? record.roomImages[0].image_url
                  : `/${record.roomImages[0].image_url}`
              }`}
              style={{ borderRadius: 8 }}
            />
          )}
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              #{record._id?.slice(-6)}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => <Text style={{ fontSize: 13 }}>{text || "—"}</Text>,
    },
    {
      title: "Sức chứa",
      key: "capacity",
      width: 130,
      align: "center",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text style={{ fontSize: 13 }}>
            <UserOutlined style={{ color: "#1890ff" }} /> {record.max_guests} khách
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.beds} giường
          </Text>
        </Space>
      ),
    },
    {
      title: "Diện tích",
      dataIndex: "size_sqm",
      key: "size_sqm",
      align: "center",
      width: 110,
      render: (s) =>
        s != null ? (
          <Tag
            color="blue"
            style={{ borderRadius: 16, fontSize: 13, padding: "2px 10px" }}
          >
            <ExpandOutlined /> {s}m²
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 130,
      align: "center",
      render: (d) => (
        <Tag
          icon={d ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          color={d ? "error" : "success"}
          style={{ borderRadius: 16, padding: "4px 14px", fontSize: 13 }}
        >
          {d ? "Tạm dừng" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRoom(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá phòng"
            description="Bạn có chắc chắn muốn xoá phòng này?"
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteRoom(record)}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading || !hotel) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          background: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16, fontSize: 15 }}
          >
            Quay lại
          </Button>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          </Card>
        </div>
      </div>
    );
  }

  const priceNumber = asNumber(hotel.priceHotelNumber ?? hotel.priceHotel);
  const rating = Number(hotel.rating || 4.5);

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Chi tiết khách sạn
            </Title>
          </Space>

          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRoom}
            >
              Thêm phòng
            </Button>
            <Tag color={hotel.isDeleted ? "red" : "green"}>
              {hotel.isDeleted ? "Đang tạm dừng" : "Đang hoạt động"}
            </Tag>
          </Space>
        </div>

        {/* Khối chính */}
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
          }}
          bodyStyle={{ padding: 20 }}
        >
          {/* Thông tin cơ bản phía trên */}
          <Row gutter={[24, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={16}>
              <Space align="start">
                <div
                  style={{
                    width: 120,
                    height: 90,
                    borderRadius: 8,
                    backgroundColor: "#fafafa",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  {hotelCover ? (
                    <Image
                      src={hotelCover}
                      alt={hotel.name}
                      width={120}
                      height={90}
                      style={{ objectFit: "cover" }}
                      preview={true}
                    />
                  ) : (
                    <HomeOutlined style={{ fontSize: 32, color: "#d9d9d9" }} />
                  )}
                </div>
                <div>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {hotel.name}
                  </Title>
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">
                      <EnvironmentOutlined /> {hotel.address || "Chưa cập nhật địa chỉ"}
                    </Text>
                    {hotel.city && (
                      <Tag color="blue">
                        {hotel.city?.name || hotel.city}
                      </Tag>
                    )}
                    <Space size={16}>
                      <Space size={4}>
                        <Rate disabled value={rating} style={{ fontSize: 16 }} />
                        <Text type="secondary">({rating.toFixed(1)}/5)</Text>
                      </Space>
                      {typeof priceNumber === "number" && (
                        <Text strong>
                          Giá từ: {priceNumber.toLocaleString("vi-VN")} ₫ / đêm
                        </Text>
                      )}
                    </Space>
                  </Space>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Tổng số phòng"
                    value={rooms?.length || 0}
                    prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Đánh giá trung bình"
                    value={rating.toFixed(1)}
                    suffix="/5"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0 20px" }} />

          <Row gutter={[24, 24]}>
            {/* Cột trái: mô tả, gallery, phòng */}
            <Col xs={24} lg={16}>
              {/* Mô tả */}
              <Card
                type="inner"
                title="Mô tả khách sạn"
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: 16 }}
              >
                <Paragraph
                  style={{
                    fontSize: 14,
                    marginBottom: 0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {hotel.description || "Chưa có mô tả chi tiết về khách sạn này."}
                </Paragraph>
              </Card>

              {/* Gallery */}
              {gallery.length > 0 && (
                <Card
                  type="inner"
                  title="Thư viện ảnh"
                  style={{ marginBottom: 16 }}
                  bodyStyle={{ padding: 16 }}
                >
                  <Image.PreviewGroup>
                    <Row gutter={[8, 8]}>
                      {gallery.slice(0, 6).map((src, idx) => (
                        <Col xs={12} sm={8} key={idx}>
                          <Image
                            src={src}
                            width="100%"
                            height={100}
                            style={{
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Image.PreviewGroup>
                </Card>
              )}

              {/* Danh sách phòng */}
              <Card
                type="inner"
                title={
                  <Space>
                    <Text strong>Danh sách phòng</Text>
                    <Badge count={rooms.length} showZero />
                  </Space>
                }
                bodyStyle={{ padding: 16 }}
              >
                {rooms && rooms.length > 0 ? (
                  <Table
                    columns={roomColumns}
                    dataSource={rooms}
                    rowKey={(r) => r._id}
                    loading={loadingRooms}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng ${total} phòng`,
                    }}
                    size="middle"
                  />
                ) : (
                  <Empty
                    description="Chưa có phòng nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </Col>

            {/* Cột phải: thông tin tổng quan */}
            <Col xs={24} lg={8}>
              <Card
                type="inner"
                title="Thông tin tổng quan"
                bodyStyle={{ padding: 16 }}
              >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Địa chỉ
                    </Text>
                    <Paragraph
                      style={{
                        marginTop: 4,
                        marginBottom: 0,
                        fontSize: 14,
                      }}
                    >
                      <EnvironmentOutlined style={{ color: "#1890ff" }} />{" "}
                      {hotel.address || "Chưa cập nhật"}
                    </Paragraph>
                  </div>

                  {hotel.city && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        Thành phố
                      </Text>
                      <Paragraph
                        style={{
                          marginTop: 4,
                          marginBottom: 0,
                          fontSize: 14,
                        }}
                      >
                        <Tag color="geekblue">
                          {hotel.city?.name || hotel.city}
                        </Tag>
                      </Paragraph>
                    </div>
                  )}

                  <Divider style={{ margin: "8px 0" }} />

                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Trạng thái khách sạn
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag
                        color={hotel.isDeleted ? "red" : "green"}
                        icon={hotel.isDeleted ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                      >
                        {hotel.isDeleted ? "Đang tạm dừng" : "Đang hoạt động"}
                      </Tag>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
