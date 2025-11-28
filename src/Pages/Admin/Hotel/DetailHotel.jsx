// // pages/HotelDetail.jsx — version for API http://localhost:4000/api/hotels/:id
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import {
//   Avatar,
//   Button,
//   Card,
//   Col,
//   Divider,
//   Empty,
//   Flex,
//   Image,
//   message,
//   Row,
//   Skeleton,
//   Space,
//   Statistic,
//   Table,
//   Tag,
//   Typography,
// } from "antd";
// import { ArrowLeftOutlined, EnvironmentOutlined, HomeOutlined, StarFilled } from "@ant-design/icons";

// const { Title, Text, Paragraph } = Typography;

// const API_BASE = "http://localhost:4000"; // <-- theo yêu cầu

// const asNumber = (v) => {
//   if (v == null) return null;
//   if (typeof v === "object" && v.$numberDecimal) return parseFloat(v.$numberDecimal);
//   const n = Number(v);
//   return Number.isFinite(n) ? n : null;
// };

// export default function HotelDetail() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [hotel, setHotel] = useState(location.state?.hotel || null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!hotel) {
//       (async () => {
//         try {
//           setLoading(true);
//           const res = await fetch(`${API_BASE}/api/hotels/${id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             },
//           });
//           const data = await res.json();
//           // API detail trả trực tiếp object hotel (như ví dụ bạn gửi)
//           if (data && (data._id || data.id)) {
//             setHotel(data);
//           } else if (data?.data) {
//             setHotel(data.data);
//           } else {
//             message.error("Không tải được chi tiết khách sạn");
//           }
//         } catch (e) {
//           console.error(e);
//           message.error("Lỗi mạng khi tải chi tiết khách sạn");
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }
//   }, [id]);

//   const rooms = useMemo(() => hotel?.room || [], [hotel]);

//   const hotelCover = useMemo(() => {
//     const imgs = hotel?.hotelImages || [];
//     const first = imgs[0]?.image_url;
//     return first ? `${API_BASE}${first.startsWith("/") ? first : `/${first}`}` : null;
//   }, [hotel]);

//   const gallery = useMemo(() => {
//     const imgs = hotel?.hotelImages || [];
//     return imgs.map((i) => `${API_BASE}${i.image_url?.startsWith("/") ? i.image_url : `/${i.image_url}`}`);
//   }, [hotel]);

//   const roomColumns = [
//     {
//       title: "Mã phòng",
//       dataIndex: "_id",
//       key: "_id",
//       width: 160,
//       render: (id) => <Text strong>#{id?.slice(-6)}</Text>,
//     },
//     { title: "Tên phòng", dataIndex: "name", key: "name", width: 220 },
//     { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
//     { title: "Số khách tối đa", dataIndex: "max_guests", key: "max_guests", align: "center", width: 140 },
//     { title: "Số giường", dataIndex: "beds", key: "beds", align: "center", width: 140 },
//     {
//       title: "Diện tích (m²)",
//       dataIndex: "size_sqm",
//       key: "size_sqm",
//       align: "right",
//       width: 140,
//       render: (s) => (s != null ? <Text>{s} m²</Text> : <Text type="secondary">—</Text>),
//     },
//     {
//       title: "Hình ảnh",
//       dataIndex: "roomImages",
//       key: "roomImages",
//       width: 160,
//       render: (images) => {
//         const first = Array.isArray(images) && images[0]?.image_url;
//         const src = first ? `${API_BASE}${first.startsWith("/") ? first : `/${first}`}` : null;
//         return src ? (
//           <Image src={src} alt="room" width={90} style={{ borderRadius: 8 }} />
//         ) : (
//           <Text type="secondary">Không có ảnh</Text>
//         );
//       },
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "isDeleted",
//       key: "isDeleted",
//       width: 140,
//       render: (d) => (
//         <Tag color={d ? "warning" : "success"} style={{ borderRadius: 6, border: "none" }}>
//           {d ? "Tạm dừng" : "Hoạt động"}
//         </Tag>
//       ),
//     },
//   ];

//   if (loading || !hotel) {
//     return (
//       <div style={{ padding: 20 }}>
//         <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
//           Quay lại
//         </Button>
//         <Card style={{ marginTop: 12, borderRadius: 16 }}>
//           <Skeleton active avatar paragraph={{ rows: 4 }} />
//         </Card>
//       </div>
//     );
//   }

//   const priceNumber = asNumber(hotel.priceHotelNumber ?? hotel.priceHotel);

//   return (
//     <div style={{ padding: 20 }}>
//       <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
//         Quay lại
//       </Button>

//       <Card style={{ marginTop: 12, borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} md={6}>
//             {hotelCover ? (
//               <Image src={hotelCover} alt={hotel.name} width="100%" style={{ borderRadius: 12 }} />
//             ) : (
//               <Avatar size={120} shape="square" style={{ background: "#f0f0f0" }} icon={<HomeOutlined />} />
//             )}
//           </Col>
//           <Col xs={24} md={18}>
//             <Title level={3} style={{ marginBottom: 4 }}>{hotel.name}</Title>
//             <Space size={12} wrap>
//               <Text type="secondary"><EnvironmentOutlined /> {hotel.address || "(chưa có địa chỉ)"}</Text>
//               <Text><StarFilled style={{ color: "#faad14" }} /> {Number(hotel.rating || 4.5).toFixed(1)}/5.0</Text>
//               {hotel.city && <Tag color="geekblue">{hotel.city?.name || hotel.city}</Tag>}
//               {typeof priceNumber === "number" && (
//                 <Tag color="blue" style={{ borderRadius: 6 }}>{priceNumber.toLocaleString("vi-VN")} VND</Tag>
//               )}
//             </Space>
//           </Col>
//         </Row>

//         {gallery.length > 0 && (
//           <>
//             <Divider style={{ margin: "16px 0" }} />
//             <Row gutter={[8, 8]}>
//               {gallery.slice(0, 6).map((src, idx) => (
//                 <Col xs={8} md={4} key={idx}>
//                   <Image src={src} width="100%" style={{ borderRadius: 10 }} />
//                 </Col>
//               ))}
//             </Row>
//           </>
//         )}

//         <Divider style={{ margin: "16px 0" }} />

//         <Row gutter={[16, 16]}>
//           <Col xs={24} md={8}>
//             <Card size="small" style={{ borderRadius: 12 }}>
//               <Statistic title="Số phòng" value={rooms?.length || 0} />
//             </Card>
//           </Col>
//           <Col xs={24} md={16}>
//             <Card size="small" style={{ borderRadius: 12 }}>
//               <Title level={5} style={{ marginBottom: 8 }}>Mô tả</Title>
//               <Paragraph type="secondary" style={{ margin: 0 }}>{hotel.description || "—"}</Paragraph>
//             </Card>
//           </Col>
//         </Row>

//         <Divider style={{ margin: "16px 0" }} />

//         <Card size="small" style={{ borderRadius: 12 }}>
//           <Title level={5} style={{ margin: 0, marginBottom: 12 }}>Danh sách phòng</Title>
//           {rooms && rooms.length > 0 ? (
//             <Table
//               columns={roomColumns}
//               dataSource={rooms}
//               rowKey={(r) => r._id}
//               pagination={{ pageSize: 10, showSizeChanger: true }}
//               scroll={{ x: 1000 }}
//             />
//           ) : (
//             <Empty description="Chưa có phòng" />
//           )}
//         </Card>
//       </Card>
//     </div>
//   );
// }




// // pages/HotelDetail.jsx — Giao diện đẹp, hiện đại
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import {
//   Avatar,
//   Button,
//   Card,
//   Col,
//   Divider,
//   Empty,
//   Image,
//   message,
//   Row,
//   Skeleton,
//   Space,
//   Statistic,
//   Table,
//   Tag,
//   Typography,
//   Rate,
//   Badge,
// } from "antd";
// import {
//   ArrowLeftOutlined,
//   EnvironmentOutlined,
//   HomeOutlined,
//   StarFilled,
//   UserOutlined,
//   ExpandOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
// } from "@ant-design/icons";

// const { Title, Text, Paragraph } = Typography;

// const API_BASE = "http://localhost:4000";

// const asNumber = (v) => {
//   if (v == null) return null;
//   if (typeof v === "object" && v.$numberDecimal) return parseFloat(v.$numberDecimal);
//   const n = Number(v);
//   return Number.isFinite(n) ? n : null;
// };

// export default function HotelDetail() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [hotel, setHotel] = useState(location.state?.hotel || null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!hotel) {
//       (async () => {
//         try {
//           setLoading(true);
//           const res = await fetch(`${API_BASE}/api/hotels/${id}`, {
//             headers: {
//               "Content-Type": "application/json",
//               ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             },
//           });
//           const data = await res.json();
//           if (data && (data._id || data.id)) {
//             setHotel(data);
//           } else if (data?.data) {
//             setHotel(data.data);
//           } else {
//             message.error("Không tải được chi tiết khách sạn");
//           }
//         } catch (e) {
//           console.error(e);
//           message.error("Lỗi mạng khi tải chi tiết khách sạn");
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }
//   }, [id]);

//   const rooms = useMemo(() => hotel?.room || [], [hotel]);

//   const hotelCover = useMemo(() => {
//     const imgs = hotel?.hotelImages || [];
//     const first = imgs[0]?.image_url;
//     return first ? `${API_BASE}${first.startsWith("/") ? first : `/${first}`}` : null;
//   }, [hotel]);

//   const gallery = useMemo(() => {
//     const imgs = hotel?.hotelImages || [];
//     return imgs.map((i) => `${API_BASE}${i.image_url?.startsWith("/") ? i.image_url : `/${i.image_url}`}`);
//   }, [hotel]);

//   const roomColumns = [
//     {
//       title: "Phòng",
//       dataIndex: "name",
//       key: "name",
//       width: 200,
//       render: (name, record) => (
//         <Space>
//           {record.roomImages?.[0]?.image_url && (
//             <Avatar
//               shape="square"
//               size={48}
//               src={`${API_BASE}${record.roomImages[0].image_url.startsWith("/") ? record.roomImages[0].image_url : `/${record.roomImages[0].image_url}`}`}
//               style={{ borderRadius: 8 }}
//             />
//           )}
//           <div>
//             <Text strong style={{ fontSize: 15 }}>{name}</Text>
//             <br />
//             <Text type="secondary" style={{ fontSize: 12 }}>#{record._id?.slice(-6)}</Text>
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: "Mô tả",
//       dataIndex: "description",
//       key: "description",
//       ellipsis: true,
//       render: (text) => <Text style={{ fontSize: 13 }}>{text || "—"}</Text>,
//     },
//     {
//       title: "Sức chứa",
//       key: "capacity",
//       width: 120,
//       align: "center",
//       render: (_, record) => (
//         <Space direction="vertical" size={4}>
//           <Text style={{ fontSize: 13 }}>
//             <UserOutlined style={{ color: "#1890ff" }} /> {record.max_guests} khách
//           </Text>
//           <Text type="secondary" style={{ fontSize: 12 }}>
//             {record.beds} giường
//           </Text>
//         </Space>
//       ),
//     },
//     {
//       title: "Diện tích",
//       dataIndex: "size_sqm",
//       key: "size_sqm",
//       align: "center",
//       width: 100,
//       render: (s) =>
//         s != null ? (
//           <Tag color="blue" style={{ borderRadius: 6, fontSize: 13 }}>
//             <ExpandOutlined /> {s}m²
//           </Tag>
//         ) : (
//           <Text type="secondary">—</Text>
//         ),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "isDeleted",
//       key: "isDeleted",
//       width: 120,
//       align: "center",
//       render: (d) => (
//         <Tag
//           icon={d ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
//           color={d ? "error" : "success"}
//           style={{ borderRadius: 16, padding: "4px 12px", fontSize: 13 }}
//         >
//           {d ? "Tạm dừng" : "Hoạt động"}
//         </Tag>
//       ),
//     },
//   ];

//   if (loading || !hotel) {
//     return (
//       <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
//         <Button
//           type="text"
//           icon={<ArrowLeftOutlined />}
//           onClick={() => navigate(-1)}
//           style={{ marginBottom: 16, fontSize: 15 }}
//         >
//           Quay lại
//         </Button>
//         <Card style={{ borderRadius: 20, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
//           <Skeleton active avatar paragraph={{ rows: 6 }} />
//         </Card>
//       </div>
//     );
//   }

//   const priceNumber = asNumber(hotel.priceHotelNumber ?? hotel.priceHotel);
//   const rating = Number(hotel.rating || 4.5);

//   return (
//     <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: "24px" }}>
//       <div style={{ maxWidth: 1400, margin: "0 auto" }}>
//         <Button
//           type="text"
//           icon={<ArrowLeftOutlined />}
//           onClick={() => navigate(-1)}
//           style={{ marginBottom: 16, fontSize: 15, fontWeight: 500 }}
//         >
//           Quay lại danh sách
//         </Button>

//         {/* Hero Section - Ảnh bìa lớn */}
//         <Card
//           style={{
//             borderRadius: 20,
//             overflow: "hidden",
//             border: "none",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//             marginBottom: 24,
//           }}
//           bodyStyle={{ padding: 0 }}
//         >
//           {hotelCover ? (
//             <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
//               <Image
//                 src={hotelCover}
//                 alt={hotel.name}
//                 width="100%"
//                 height={400}
//                 style={{ objectFit: "cover" }}
//                 preview={{
//                   mask: <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 8, padding: "4px 12px" }}>Xem ảnh</div>,
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
//                   padding: "60px 32px 24px",
//                   color: "white",
//                 }}
//               >
//                 <Title level={2} style={{ color: "white", marginBottom: 8, fontSize: 32 }}>
//                   {hotel.name}
//                 </Title>
//                 <Space size={16} wrap>
//                   <Text style={{ color: "white", fontSize: 15 }}>
//                     <EnvironmentOutlined /> {hotel.address || "(chưa có địa chỉ)"}
//                   </Text>
//                   {hotel.city && (
//                     <Tag color="blue" style={{ borderRadius: 16, padding: "4px 12px", fontSize: 13 }}>
//                       {hotel.city?.name || hotel.city}
//                     </Tag>
//                   )}
//                 </Space>
//               </div>
//             </div>
//           ) : (
//             <div
//               style={{
//                 height: 400,
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <HomeOutlined style={{ fontSize: 80, color: "white", opacity: 0.6 }} />
//             </div>
//           )}
//         </Card>

//         {/* Thông tin chính */}
//         <Row gutter={[24, 24]}>
//           <Col xs={24} lg={16}>
//             {/* Gallery */}
//             {gallery.length > 1 && (
//               <Card
//                 title={
//                   <Text strong style={{ fontSize: 18 }}>
//                     Thư viện ảnh
//                   </Text>
//                 }
//                 style={{
//                   borderRadius: 20,
//                   marginBottom: 24,
//                   border: "none",
//                   boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//                 }}
//                 bodyStyle={{ padding: "16px 24px" }}
//               >
//                 <Image.PreviewGroup>
//                   <Row gutter={[12, 12]}>
//                     {gallery.slice(0, 8).map((src, idx) => (
//                       <Col xs={12} sm={8} md={6} key={idx}>
//                         <Badge count={idx === 7 && gallery.length > 8 ? `+${gallery.length - 8}` : 0}>
//                           <Image
//                             src={src}
//                             width="100%"
//                             height={120}
//                             style={{ borderRadius: 12, objectFit: "cover" }}
//                           />
//                         </Badge>
//                       </Col>
//                     ))}
//                   </Row>
//                 </Image.PreviewGroup>
//               </Card>
//             )}

//             {/* Mô tả */}
//             <Card
//               title={
//                 <Text strong style={{ fontSize: 18 }}>
//                   Mô tả khách sạn
//                 </Text>
//               }
//               style={{
//                 borderRadius: 20,
//                 marginBottom: 24,
//                 border: "none",
//                 boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//               }}
//             >
//               <Paragraph style={{ fontSize: 15, lineHeight: 1.8, color: "#595959" }}>
//                 {hotel.description || "Chưa có mô tả chi tiết về khách sạn này."}
//               </Paragraph>
//             </Card>

//             {/* Danh sách phòng */}
//             <Card
//               title={
//                 <Space>
//                   <Text strong style={{ fontSize: 18 }}>
//                     Danh sách phòng
//                   </Text>
//                   <Badge count={rooms.length} showZero style={{ backgroundColor: "#1890ff" }} />
//                 </Space>
//               }
//               style={{
//                 borderRadius: 20,
//                 border: "none",
//                 boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//               }}
//             >
//               {rooms && rooms.length > 0 ? (
//                 <Table
//                   columns={roomColumns}
//                   dataSource={rooms}
//                   rowKey={(r) => r._id}
//                   pagination={{
//                     pageSize: 10,
//                     showSizeChanger: true,
//                     showTotal: (total) => `Tổng ${total} phòng`,
//                   }}
//                   scroll={{ x: 900 }}
//                   style={{ fontSize: 14 }}
//                 />
//               ) : (
//                 <Empty description="Chưa có phòng nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
//               )}
//             </Card>
//           </Col>

//           {/* Sidebar thông tin */}
//           <Col xs={24} lg={8}>
//             <div style={{ position: "sticky", top: 24 }}>
//               {/* Đánh giá & Giá */}
//               <Card
//                 style={{
//                   borderRadius: 20,
//                   marginBottom: 24,
//                   border: "none",
//                   boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 }}
//                 bodyStyle={{ padding: 24 }}
//               >
//                 <Space direction="vertical" size={16} style={{ width: "100%" }}>
//                   <div style={{ textAlign: "center" }}>
//                     <Rate disabled defaultValue={rating} style={{ fontSize: 24, color: "#ffd700" }} />
//                     <Title level={2} style={{ color: "white", margin: "8px 0 0" }}>
//                       {rating.toFixed(1)}/5.0
//                     </Title>
//                     <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>Đánh giá xuất sắc</Text>
//                   </div>

//                   <Divider style={{ borderColor: "rgba(255,255,255,0.2)", margin: 0 }} />

//                   {typeof priceNumber === "number" && (
//                     <div style={{ textAlign: "center" }}>
//                       <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, display: "block" }}>
//                         Giá khởi điểm từ
//                       </Text>
//                       <Title level={3} style={{ color: "white", margin: "4px 0" }}>
//                         {priceNumber.toLocaleString("vi-VN")} ₫
//                       </Title>
//                       <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>/ đêm</Text>
//                     </div>
//                   )}
//                 </Space>
//               </Card>

//               {/* Thông tin tổng quan */}
//               <Card
//                 title={
//                   <Text strong style={{ fontSize: 18 }}>
//                     Thông tin tổng quan
//                   </Text>
//                 }
//                 style={{
//                   borderRadius: 20,
//                   border: "none",
//                   boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//                 }}
//               >
//                 <Space direction="vertical" size={16} style={{ width: "100%" }}>
//                   <Statistic
//                     title="Tổng số phòng"
//                     value={rooms?.length || 0}
//                     prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
//                     valueStyle={{ fontSize: 28, color: "#1890ff" }}
//                   />

//                   <Divider style={{ margin: 0 }} />

//                   <div>
//                     <Text type="secondary" style={{ fontSize: 13 }}>Địa chỉ</Text>
//                     <Paragraph style={{ marginTop: 4, marginBottom: 0, fontSize: 14 }}>
//                       <EnvironmentOutlined style={{ color: "#1890ff" }} /> {hotel.address || "Chưa cập nhật"}
//                     </Paragraph>
//                   </div>

//                   {hotel.city && (
//                     <div>
//                       <Text type="secondary" style={{ fontSize: 13 }}>Thành phố</Text>
//                       <Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
//                         <Tag color="geekblue" style={{ borderRadius: 8, padding: "4px 12px", fontSize: 14 }}>
//                           {hotel.city?.name || hotel.city}
//                         </Tag>
//                       </Paragraph>
//                     </div>
//                   )}
//                 </Space>
//               </Card>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// } 









// pages/HotelDetail.jsx — Giao diện đẹp, hiện đại
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
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
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  UserOutlined,
  ExpandOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

// ✅ Dùng axios instance có interceptor
import api from "../../../api/client"; // 👉 chỉnh lại path nếu file nằm sâu hơn

const { Title, Text, Paragraph } = Typography;

// Ưu tiên lấy từ .env, fallback localhost
const API_BASE =
  // import.meta.env.VITE_API_BASE_URL ||
  // import.meta.env.VITE_API_BASE ||
  "http://localhost:4000";

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

  // Nếu navigate từ list có state.hotel thì dùng luôn, đỡ phải gọi API lại
  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loading, setLoading] = useState(false);

  // ✅ Load chi tiết khách sạn (dùng axios + interceptor)

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

          // ⏳ delay nhỏ để user đọc message
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
    return imgs.map((i) => {
      if (!i?.image_url) return null;
      const path = i.image_url.startsWith("/") ? i.image_url : `/${i.image_url}`;
      return `${API_BASE}${path}`;
    }).filter(Boolean);
  }, [hotel]);

  const roomColumns = [
    {
      title: "Phòng",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name, record) => (
        <Space>
          {record.roomImages?.[0]?.image_url && (
            <Avatar
              shape="square"
              size={48}
              src={`${API_BASE}${record.roomImages[0].image_url.startsWith("/")
                  ? record.roomImages[0].image_url
                  : `/${record.roomImages[0].image_url}`
                }`}
              style={{ borderRadius: 8 }}
            />
          )}
          <div>
            <Text strong style={{ fontSize: 15 }}>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>#{record._id?.slice(-6)}</Text>
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
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
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
      width: 100,
      render: (s) =>
        s != null ? (
          <Tag color="blue" style={{ borderRadius: 6, fontSize: 13 }}>
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
      width: 120,
      align: "center",
      render: (d) => (
        <Tag
          icon={d ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          color={d ? "error" : "success"}
          style={{ borderRadius: 16, padding: "4px 12px", fontSize: 13 }}
        >
          {d ? "Tạm dừng" : "Hoạt động"}
        </Tag>
      ),
    },
  ];

  if (loading || !hotel) {
    return (
      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
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
            borderRadius: 20,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  const priceNumber = asNumber(hotel.priceHotelNumber ?? hotel.priceHotel);
  const rating = Number(hotel.rating || 4.5);

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16, fontSize: 15, fontWeight: 500 }}
        >
          Quay lại danh sách
        </Button>

        {/* Hero Section - Ảnh bìa lớn */}
        <Card
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: 24,
          }}
          bodyStyle={{ padding: 0 }}
        >
          {hotelCover ? (
            <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
              <Image
                src={hotelCover}
                alt={hotel.name}
                width="100%"
                height={400}
                style={{ objectFit: "cover" }}
                preview={{
                  mask: (
                    <div
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: 8,
                        padding: "4px 12px",
                      }}
                    >
                      Xem ảnh
                    </div>
                  ),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  padding: "60px 32px 24px",
                  color: "white",
                }}
              >
                <Title
                  level={2}
                  style={{ color: "white", marginBottom: 8, fontSize: 32 }}
                >
                  {hotel.name}
                </Title>
                <Space size={16} wrap>
                  <Text style={{ color: "white", fontSize: 15 }}>
                    <EnvironmentOutlined /> {hotel.address || "(chưa có địa chỉ)"}
                  </Text>
                  {hotel.city && (
                    <Tag
                      color="blue"
                      style={{
                        borderRadius: 16,
                        padding: "4px 12px",
                        fontSize: 13,
                      }}
                    >
                      {hotel.city?.name || hotel.city}
                    </Tag>
                  )}
                </Space>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: 400,
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomeOutlined
                style={{ fontSize: 80, color: "white", opacity: 0.6 }}
              />
            </div>
          )}
        </Card>

        {/* Thông tin chính */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* Gallery */}
            {gallery.length > 1 && (
              <Card
                title={
                  <Text strong style={{ fontSize: 18 }}>
                    Thư viện ảnh
                  </Text>
                }
                style={{
                  borderRadius: 20,
                  marginBottom: 24,
                  border: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
                bodyStyle={{ padding: "16px 24px" }}
              >
                <Image.PreviewGroup>
                  <Row gutter={[12, 12]}>
                    {gallery.slice(0, 8).map((src, idx) => (
                      <Col xs={12} sm={8} md={6} key={idx}>
                        <Badge
                          count={
                            idx === 7 && gallery.length > 8
                              ? `+${gallery.length - 8}`
                              : 0
                          }
                        >
                          <Image
                            src={src}
                            width="100%"
                            height={120}
                            style={{
                              borderRadius: 12,
                              objectFit: "cover",
                            }}
                          />
                        </Badge>
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              </Card>
            )}

            {/* Mô tả */}
            <Card
              title={
                <Text strong style={{ fontSize: 18 }}>
                  Mô tả khách sạn
                </Text>
              }
              style={{
                borderRadius: 20,
                marginBottom: 24,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Paragraph
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "#595959",
                }}
              >
                {hotel.description ||
                  "Chưa có mô tả chi tiết về khách sạn này."}
              </Paragraph>
            </Card>

            {/* Danh sách phòng */}
            <Card
              title={
                <Space>
                  <Text strong style={{ fontSize: 18 }}>
                    Danh sách phòng
                  </Text>
                  <Badge
                    count={rooms.length}
                    showZero
                    style={{ backgroundColor: "#1890ff" }}
                  />
                </Space>
              }
              style={{
                borderRadius: 20,
                border: "none",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {rooms && rooms.length > 0 ? (
                <Table
                  columns={roomColumns}
                  dataSource={rooms}
                  rowKey={(r) => r._id}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} phòng`,
                  }}
                  scroll={{ x: 900 }}
                  style={{ fontSize: 14 }}
                />
              ) : (
                <Empty
                  description="Chưa có phòng nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>

          {/* Sidebar thông tin */}
          <Col xs={24} lg={8}>
            <div style={{ position: "sticky", top: 24 }}>
              {/* Đánh giá & Giá */}
              <Card
                style={{
                  borderRadius: 20,
                  marginBottom: 24,
                  border: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div style={{ textAlign: "center" }}>
                    <Rate
                      disabled
                      defaultValue={rating}
                      style={{ fontSize: 24, color: "#ffd700" }}
                    />
                    <Title
                      level={2}
                      style={{
                        color: "white",
                        margin: "8px 0 0",
                      }}
                    >
                      {rating.toFixed(1)}/5.0
                    </Title>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: 14,
                      }}
                    >
                      Đánh giá xuất sắc
                    </Text>
                  </div>

                  <Divider
                    style={{
                      borderColor: "rgba(255,255,255,0.2)",
                      margin: 0,
                    }}
                  />

                  {typeof priceNumber === "number" && (
                    <div style={{ textAlign: "center" }}>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          fontSize: 14,
                          display: "block",
                        }}
                      >
                        Giá khởi điểm từ
                      </Text>
                      <Title
                        level={3}
                        style={{
                          color: "white",
                          margin: "4px 0",
                        }}
                      >
                        {priceNumber.toLocaleString("vi-VN")} ₫
                      </Title>
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: 13,
                        }}
                      >
                        / đêm
                      </Text>
                    </div>
                  )}
                </Space>
              </Card>

              {/* Thông tin tổng quan */}
              <Card
                title={
                  <Text strong style={{ fontSize: 18 }}>
                    Thông tin tổng quan
                  </Text>
                }
                style={{
                  borderRadius: 20,
                  border: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Space
                  direction="vertical"
                  size={16}
                  style={{ width: "100%" }}
                >
                  <Statistic
                    title="Tổng số phòng"
                    value={rooms?.length || 0}
                    prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ fontSize: 28, color: "#1890ff" }}
                  />

                  <Divider style={{ margin: 0 }} />

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
                        }}
                      >
                        <Tag
                          color="geekblue"
                          style={{
                            borderRadius: 8,
                            padding: "4px 12px",
                            fontSize: 14,
                          }}
                        >
                          {hotel.city?.name || hotel.city}
                        </Tag>
                      </Paragraph>
                    </div>
                  )}
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
