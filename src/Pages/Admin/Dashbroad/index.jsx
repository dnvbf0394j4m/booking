// import React from "react";
// import {
//   Row,
//   Col,
//   Card,
//   Statistic,
//   Typography,
//   Select,
//   DatePicker,
//   Table,
//   Tag,
// } from "antd";
// import {
//   DollarCircleOutlined,
//   TeamOutlined,
//   HomeOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;

// // ================== MOCK DATA ==================
// const todaySummary = {
//   revenue: 0,
//   bookings: 11,
//   occupiedRooms: 9,
//   totalRooms: 19,
//   occupancyRate: 47.4,
//   totalCustomers: 0,
// };

// const revenueByBranch = [
//   { name: "182 Lạc Long Quân", revenue: 4200000, bookings: 12 },
//   { name: "11 Mỹ Đình", revenue: 3800000, bookings: 10 },
//   { name: "25 Quan Hoa", revenue: 3600000, bookings: 9 },
//   { name: "15 Trung Liệt", revenue: 3400000, bookings: 8 },
// ];

// const revenueLast30Days = [
//   { date: "01", revenue: 0 },
//   { date: "05", revenue: 500000 },
//   { date: "10", revenue: 1200000 },
//   { date: "15", revenue: 2500000 },
//   { date: "20", revenue: 3000000 },
//   { date: "25", revenue: 4200000 },
//   { date: "30", revenue: 4800000 },
// ];

// const roomTypeStruct = [
//   { name: "Qua đêm", value: 50.8 },
//   { name: "Chưa xác định", value: 26.7 },
//   { name: "Combo", value: 22.6 },
// ];

// const customerSourceStruct = [
//   { name: "Chưa xác định", value: 19.1 },
//   { name: "Facebook Ads", value: 80.9 },
// ];

// const staffRevenue = [
//   { key: "1", name: "Hải", bookings: 14, revenue: 6631000, unpaid: 0 },
//   { key: "2", name: "Thanh", bookings: 11, revenue: 5237000, unpaid: 297000 },
//   { key: "3", name: "Admin", bookings: 11, revenue: 5106000, unpaid: 0 },
//   { key: "4", name: "Hà", bookings: 10, revenue: 3944000, unpaid: 0 },
//   { key: "5", name: "Minh", bookings: 6, revenue: 2603000, unpaid: 0 },
// ];

// const COLORS1 = ["#4e73df", "#1cc88a", "#36b9cc"];
// const COLORS2 = ["#4e73df", "#1cc88a"];

// const AdminDashboard = () => {
//   const occupancyRate = todaySummary.occupancyRate;
//   const avgStayHours = 11.2;

//   const staffColumns = [
//     {
//       title: "Nhân viên",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Số booking",
//       dataIndex: "bookings",
//       key: "bookings",
//     },
//     {
//       title: "Doanh thu",
//       dataIndex: "revenue",
//       key: "revenue",
//       render: (value) =>
//         value.toLocaleString("vi-VN", {
//           style: "currency",
//           currency: "VND",
//           maximumFractionDigits: 0,
//         }),
//     },
//     {
//       title: "Chưa thanh toán",
//       dataIndex: "unpaid",
//       key: "unpaid",
//       render: (value) => {
//         const color = value > 0 ? "red" : "green";
//         return (
//           <Tag color={color}>
//             {value.toLocaleString("vi-VN", {
//               style: "currency",
//               currency: "VND",
//               maximumFractionDigits: 0,
//             })}
//           </Tag>
//         );
//       },
//     },
//   ];

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {/* ==== HÀNG FILTER TRÊN CÙNG ==== */}
//       <Card bodyStyle={{ padding: 16 }}>
//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} md={8} lg={6}>
//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <Text strong>Cơ sở:</Text>
//               <Select
//                 defaultValue="ALL"
//                 style={{ minWidth: 160 }}
//                 options={[
//                   { label: "Tất cả", value: "ALL" },
//                   { label: "182 Lạc Long Quân", value: "CS1" },
//                   { label: "11 Mỹ Đình", value: "CS2" },
//                   { label: "25 Quan Hoa", value: "CS3" },
//                 ]}
//               />
//             </div>
//           </Col>
//           <Col xs={24} md={8} lg={6}>
//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <Text strong>Từ ngày:</Text>
//               <DatePicker style={{ width: "100%" }} />
//             </div>
//           </Col>
//           <Col xs={24} md={8} lg={6}>
//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <Text strong>Đến ngày:</Text>
//               <DatePicker style={{ width: "100%" }} />
//             </div>
//           </Col>
//         </Row>
//       </Card>

//       {/* ==== 6 THẺ CHỈ SỐ NHANH ==== */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={12} lg={4}>
//           <Card
//             style={{ background: "#e8f4ff" }}
//             bodyStyle={{ padding: 16, minHeight: 90 }}
//           >
//             <Statistic
//               title="Doanh thu hôm nay"
//               value={todaySummary.revenue}
//               prefix={<DollarCircleOutlined />}
//               valueRender={() => (
//                 <span>
//                   {todaySummary.revenue.toLocaleString("vi-VN")} <Text>đ</Text>
//                 </span>
//               )}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={4}>
//           <Card
//             style={{ background: "#fce8ff" }}
//             bodyStyle={{ padding: 16, minHeight: 90 }}
//           >
//             <Statistic
//               title="Lượt khách hôm nay"
//               value={todaySummary.bookings}
//               prefix={<UserOutlined />}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={4}>
//           <Card
//             style={{ background: "#e7fff4" }}
//             bodyStyle={{ padding: 16, minHeight: 90 }}
//           >
//             <Statistic
//               title="Phòng đang có khách"
//               value={todaySummary.occupiedRooms}
//               suffix={`/ ${todaySummary.totalRooms}`}
//               prefix={<HomeOutlined />}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={4}>
//           <Card
//             style={{ background: "#fff5e6" }}
//             bodyStyle={{ padding: 16, minHeight: 90 }}
//           >
//             <Statistic
//               title="Tỷ lệ lấp đầy"
//               value={occupancyRate}
//               suffix="%"
//             />
//           </Card>
//         </Col>

//         <Col xs={24} sm={12} lg={4}>
//           <Card
//             style={{ background: "#e8f4ff" }}
//             bodyStyle={{ padding: 16, minHeight: 90 }}
//           >
//             <Statistic
//               title="Tổng số khách hàng"
//               value={todaySummary.totalCustomers}
//               prefix={<TeamOutlined />}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* ==== DOANH THU THEO CƠ SỞ + DOANH THU 30 NGÀY ==== */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24} lg={12}>
//           <Card title="Doanh thu theo cơ sở">
//             <div style={{ width: "100%", height: 260 }}>
//               <ResponsiveContainer>
//                 <BarChart
//                   data={revenueByBranch}
//                   layout="vertical"
//                   margin={{ left: 80 }}
//                 >
//                   <XAxis
//                     type="number"
//                     tickFormatter={(v) =>
//                       v.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
//                     }
//                   />
//                   <YAxis type="category" dataKey="name" />
//                   <Tooltip
//                     formatter={(value) =>
//                       value.toLocaleString("vi-VN", {
//                         style: "currency",
//                         currency: "VND",
//                         maximumFractionDigits: 0,
//                       })
//                     }
//                   />
//                   <Bar dataKey="revenue" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} lg={12}>
//           <Card title="Doanh thu 30 ngày gần nhất">
//             <div style={{ width: "100%", height: 260 }}>
//               <ResponsiveContainer>
//                 <BarChart data={revenueLast30Days}>
//                   <XAxis dataKey="date" />
//                   <YAxis
//                     tickFormatter={(v) =>
//                       v.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
//                     }
//                   />
//                   <Tooltip
//                     formatter={(value) =>
//                       value.toLocaleString("vi-VN", {
//                         style: "currency",
//                         currency: "VND",
//                         maximumFractionDigits: 0,
//                       })
//                     }
//                   />
//                   <Bar dataKey="revenue" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* ==== CƠ CẤU PHÒNG + CƠ CẤU NGUỒN KHÁCH + THỜI GIAN LƯU TRÚ ==== */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24} lg={8}>
//           <Card title="Cơ cấu theo hình thức phòng">
//             <div style={{ width: "100%", height: 220 }}>
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={roomTypeStruct}
//                     dataKey="value"
//                     nameKey="name"
//                     outerRadius={80}
//                     label={(entry) => `${entry.name}`}
//                   >
//                     {roomTypeStruct.map((_, index) => (
//                       <Cell key={index} fill={COLORS1[index % COLORS1.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(v) => `${v}%`} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} lg={8}>
//           <Card title="Cơ cấu theo nguồn khách">
//             <div style={{ width: "100%", height: 220 }}>
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={customerSourceStruct}
//                     dataKey="value"
//                     nameKey="name"
//                     outerRadius={80}
//                     label={(entry) => `${entry.name}`}
//                   >
//                     {customerSourceStruct.map((_, index) => (
//                       <Cell key={index} fill={COLORS2[index % COLORS2.length]} />
//                     ))}
//                   </Pie>
//                   <Legend />
//                   <Tooltip formatter={(v) => `${v}%`} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} lg={8}>
//           <Card title="Thời gian lưu trú trung bình" style={{ textAlign: "center" }}>
//             <Title level={2} style={{ marginBottom: 0 }}>
//               {avgStayHours}h
//             </Title>
//             <Text type="secondary">(≈ 0.5 ngày)</Text>
//           </Card>
//         </Col>
//       </Row>

//       {/* ==== DOANH THU THEO NHÂN VIÊN ==== */}
//       <Card title="Doanh thu theo nhân viên">
//         <Table
//           dataSource={staffRevenue}
//           columns={staffColumns}
//           pagination={false}
//           size="middle"
//         />
//       </Card>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Table,
  Tag,
  Spin,
  message,
} from "antd";
import {
  DollarCircleOutlined,
  TeamOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import api from "../../../api/client"; // 👈 giữ nguyên path của bạn

const { Title, Text } = Typography;

// ================== DEFAULT DATA ==================
const DEFAULT_SUMMARY = {
  revenue: 0,
  bookings: 0,
  occupiedRooms: 0,
  totalRooms: 0,
  occupancyRate: 0,
  totalCustomers: 0,
  avgStayHours: 0,
};

const COLORS1 = ["#4e73df", "#1cc88a", "#36b9cc"];
const COLORS2 = ["#4e73df", "#1cc88a"];

const AdminDashboard = () => {
  // ===== STATE FILTER =====
  const [selectedHotel, setSelectedHotel] = useState("ALL"); // 👈 thay branch bằng hotel
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // danh sách khách sạn của admin-hotel
  const [hotelOptions, setHotelOptions] = useState([
    { label: "Tất cả khách sạn", value: "ALL" },
  ]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  // ===== STATE DATA TỪ API =====
  const [loading, setLoading] = useState(false);
  const [todaySummary, setTodaySummary] = useState(DEFAULT_SUMMARY);
  const [revenueByBranch, setRevenueByBranch] = useState([]);
  const [revenueLast30Days, setRevenueLast30Days] = useState([]);
  const [roomTypeStruct, setRoomTypeStruct] = useState([]);
  const [customerSourceStruct, setCustomerSourceStruct] = useState([]);
  const [staffRevenue, setStaffRevenue] = useState([]);

  // ===== CÁC GIÁ TRỊ TÍNH TOÁN =====
  const occupancyRate = todaySummary.occupancyRate || 0;
  const avgStayHours = todaySummary.avgStayHours || 0;

  // ===== CALL API: LẤY DANH SÁCH KHÁCH SẠN =====
  const fetchHotels = async () => {
    try {
      setLoadingHotels(true);
      // Backend: GET /api/admin-hotel/my-hotels
      const res = await api.get("/api/dashboard/my-hotels");
      const list = res.data?.data || res.data || [];

      const opts = [
        { label: "Tất cả khách sạn", value: "ALL" },
        ...list.map((h) => ({
          label: h.name,
          value: h._id,
        })),
      ];
      setHotelOptions(opts);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách khách sạn");
    } finally {
      setLoadingHotels(false);
    }
  };

  // ===== CALL API DASHBOARD =====
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const params = {
        hotel: selectedHotel || "ALL", // 👈 gửi hotelId hoặc "ALL"
        from: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
        to: toDate ? toDate.format("YYYY-MM-DD") : undefined,
      };

      // 👇 endpoint dành cho admin-hotel
      // Backend: GET /api/admin-hotel/dashboard
      const res = await api.get("/api/dashboard", { params });

      // Backend trả:
      // {
      //   data: {
      //     todaySummary: {...},
      //     revenueByBranch: [...],
      //     revenueLast30Days: [...],
      //     roomTypeStruct: [...],
      //     customerSourceStruct: [...],
      //     staffRevenue: [...]
      //   }
      // }
      const data = res.data?.data || res.data || {};
      console.log("Dashboard data:", data);

      setTodaySummary(data.todaySummary || DEFAULT_SUMMARY);
      setRevenueByBranch(data.revenueByBranch || []);
      setRevenueLast30Days(data.revenueLast30Days || []);
      setRoomTypeStruct(data.roomTypeStruct || []);
      setCustomerSourceStruct(data.customerSourceStruct || []);
      setStaffRevenue(data.staffRevenue || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Lần đầu load danh sách khách sạn
  useEffect(() => {
    fetchHotels();
  }, []);

  // Gọi lại API khi hotel / fromDate / toDate thay đổi
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel, fromDate, toDate]);

  // ===== COLUMNS BẢNG NHÂN VIÊN =====
  const staffColumns = [
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số booking",
      dataIndex: "bookings",
      key: "bookings",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value = 0) =>
        value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }),
    },
    {
      title: "Chưa thanh toán",
      dataIndex: "unpaid",
      key: "unpaid",
      render: (value = 0) => {
        const color = value > 0 ? "red" : "green";
        return (
          <Tag color={color}>
            {value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            })}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ==== HÀNG FILTER TRÊN CÙNG ==== */}
      <Card bodyStyle={{ padding: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8} lg={6}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text strong>Khách sạn:</Text>
              <Select
                value={selectedHotel}
                loading={loadingHotels}
                onChange={(val) => setSelectedHotel(val)}
                style={{ minWidth: 200 }}
                options={hotelOptions}
              />
            </div>
          </Col>
          <Col xs={24} md={8} lg={6}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text strong>Từ ngày:</Text>
              <DatePicker
                style={{ width: "100%" }}
                value={fromDate}
                onChange={(val) => setFromDate(val)}
              />
            </div>
          </Col>
          <Col xs={24} md={8} lg={6}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text strong>Đến ngày:</Text>
              <DatePicker
                style={{ width: "100%" }}
                value={toDate}
                onChange={(val) => setToDate(val)}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {/* ==== 5 THẺ CHỈ SỐ NHANH ==== */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <Card
              style={{ background: "#e8f4ff" }}
              bodyStyle={{ padding: 16, minHeight: 90 }}
            >
              <Statistic
                title="Doanh thu"
                value={todaySummary.revenue}
                prefix={<DollarCircleOutlined />}
                valueRender={() => (
                  <span>
                    {todaySummary.revenue.toLocaleString("vi-VN")} <Text>đ</Text>
                  </span>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <Card
              style={{ background: "#fce8ff" }}
              bodyStyle={{ padding: 16, minHeight: 90 }}
            >
              <Statistic
                title="Lượt booking"
                value={todaySummary.bookings}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <Card
              style={{ background: "#e7fff4" }}
              bodyStyle={{ padding: 16, minHeight: 90 }}
            >
              <Statistic
                title="Phòng đang có khách"
                value={todaySummary.occupiedRooms}
                suffix={`/ ${todaySummary.totalRooms}`}
                prefix={<HomeOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <Card
              style={{ background: "#fff5e6" }}
              bodyStyle={{ padding: 16, minHeight: 90 }}
            >
              <Statistic
                title="Tỷ lệ lấp đầy"
                value={occupancyRate}
                suffix="%"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <Card
              style={{ background: "#e8f4ff" }}
              bodyStyle={{ padding: 16, minHeight: 90 }}
            >
              <Statistic
                title="Tổng số khách hàng"
                value={todaySummary.totalCustomers}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* ==== DOANH THU THEO CƠ SỞ + DOANH THU 30 NGÀY ==== */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Doanh thu theo khách sạn">
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={revenueByBranch}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <XAxis
                      type="number"
                      tickFormatter={(v) =>
                        v.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
                      }
                    />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip
                      formatter={(value) =>
                        value.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        })
                      }
                    />
                    <Bar dataKey="revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Doanh thu 30 ngày gần nhất">
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={revenueLast30Days}>
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(v) =>
                        v.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        value.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        })
                      }
                    />
                    <Bar dataKey="revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ==== CƠ CẤU PHÒNG + CƠ CẤU NGUỒN KHÁCH + THỜI GIAN LƯU TRÚ ==== */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Cơ cấu theo hình thức phòng">
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={roomTypeStruct}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label={(entry) => `${entry.name}`}
                    >
                      {roomTypeStruct.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS1[index % COLORS1.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Cơ cấu theo nguồn khách">
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={customerSourceStruct}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label={(entry) => `${entry.name}`}
                    >
                      {customerSourceStruct.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS2[index % COLORS2.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="Thời gian lưu trú trung bình"
              style={{ textAlign: "center" }}
            >
              <Title level={2} style={{ marginBottom: 0 }}>
                {avgStayHours}h
              </Title>
              <Text type="secondary">
                (≈ {(avgStayHours / 24).toFixed(1)} ngày)
              </Text>
            </Card>
          </Col>
        </Row>

        {/* ==== DOANH THU THEO NHÂN VIÊN ==== */}
        <Card title="Doanh thu theo nhân viên">
          <Table
            dataSource={staffRevenue}
            columns={staffColumns}
            pagination={false}
            size="middle"
            rowKey="id"
          />
        </Card>
      </Spin>
    </div>
  );
};

export default AdminDashboard;
