// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Button,
//   Flex,
//   Table,
//   Space,
//   Popconfirm,
//   message,
//   Card,
//   Tag,
//   Typography,
//   Input,
//   Select,
//   Statistic,
//   Row,
//   Col,
//   Badge,
//   Tooltip,
//   Divider,
// } from "antd";
// import {
//   SearchOutlined,
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   HomeOutlined,
//   EnvironmentOutlined,
//   FilterOutlined,
//   ExportOutlined,
//   StarFilled,
//   EyeOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const { Title, Text } = Typography;
// const { Search } = Input;
// const { Option } = Select;

// const API_BASE = "http://localhost:4000";

// export default function HotelList() {
//   // ---- server-state ----
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(8);
//   const [total, setTotal] = useState(0);
//   const [sort, setSort] = useState({ field: "createdAt", order: "descend" }); // antd style

//   // ---- ui-state ----
//   const [loading, setLoading] = useState(false);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [filterCity, setFilterCity] = useState("all");

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   // ---- build query params for API ----
//   const queryParams = useMemo(() => {
//     const params = new URLSearchParams();
//     if (searchText.trim()) params.set("q", searchText.trim());
//     params.set("page", String(page));
//     params.set("limit", String(limit));

//     // convert antd sort to API sort format: <field>:<asc|desc>
//     if (sort?.field) {
//       const dir = sort.order === "descend" ? "desc" : "asc";
//       params.set("sort", `${sort.field}:${dir}`);
//     }
//     if (filterCity !== "all" && filterCity) {
//       params.set("city", filterCity); // lưu ý: cần _id city nếu backend yêu cầu _id
//     }
//     return params.toString();
//   }, [searchText, page, limit, sort, filterCity]);

//   // ---- load hotels from API ----
//   useEffect(() => {
//     let cancelled = false;
//     const load = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE}/api/hotels?${queryParams}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (cancelled) return;
//         console.log("Fetched hotels:", res);

//         // Backend trả: { data: [], pagination: { page, limit, total }, ... }
//         const items = Array.isArray(res.data?.data) ? res.data.data : [];
//         setData(items);
//         setTotal(res.data?.pagination?.total || 0);
//       } catch (e) {
//         console.error(e);
//         message.error(e?.response?.data?.error || "Không tải được danh sách khách sạn");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };
//     load();
//     return () => { cancelled = true; };
//   }, [queryParams, token]);

//   const handleViewDetail = (e, record) => {
//     e?.stopPropagation?.();
//     // Điều hướng đến trang chi tiết (bạn chỉnh route theo app của bạn)
//     navigate(`/Admin/Hotel/detail/${record._id}`);
//   };

//   const onTableChange = (pagination, _filters, sorter) => {
//     // pagination
//     if (pagination?.current) setPage(pagination.current);
//     if (pagination?.pageSize) setLimit(pagination.pageSize);

//     // sort
//     if (sorter?.field) {
//       setSort({ field: sorter.field, order: sorter.order });
//     } else {
//       setSort({ field: "createdAt", order: "descend" });
//     }
//   };

//   // ---- Statistics (tính sơ bộ từ trang hiện tại + total) ----
//   const totalHotels = total;
//   const activeHotels = data.filter(h => !h.isDelete).length; // bản trên trang
//   // nếu backend chưa trả rooms/availableRooms, tạm ẩn hoặc để 0
//   const totalRooms = 0;
//   const availableRooms = 0;
//   const occupancyRate = totalRooms > 0 ? (((totalRooms - availableRooms) / totalRooms) * 100).toFixed(1) : 0;

//   // ---- Columns ----
//   const hotelColumns = [
//     {
//       title: "Khách sạn",
//       dataIndex: "name",
//       key: "name",
//       width: 300,
//       sorter: true,
//       render: (text, record) => (
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           {/* Avatar nếu có ảnh: <Avatar src={record.imageUrl} size={48} shape="square" /> */}
//           <div>
//             <Text strong style={{ fontSize: 15, color: "#262626" }}>{text}</Text>
//             <br />
//             <Text type="secondary" style={{ fontSize: 12 }}>
//               <EnvironmentOutlined style={{ marginRight: 4 }} />
//               {record.address || "(chưa có địa chỉ)"}
//             </Text>
//             <div style={{ marginTop: 4 }}>
//               <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
//               <Text style={{ fontSize: 12, marginLeft: 4, color: "#595959" }}>
//                 {Number(record.rating || 4.5).toFixed(1)}/5.0
//               </Text>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "Thành phố",
//       dataIndex: ["city", "name"], // backend populate("city","name")
//       key: "city",
//       width: 160,
//       sorter: false,
//       render: (_text, record) => (
//         <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 500, border: "none" }}>
//           {record?.city?.name || "—"}
//         </Tag>
//       ),
//       // Nếu muốn lọc client-side nữa (đang lọc server bằng query city):
//       onFilter: (value, record) => (record?.city?.name || "").toLowerCase() === String(value).toLowerCase(),
//       filters: [
//         // Chỉ demo; nếu muốn dynamic, fetch danh sách city trước rồi map vào filters
//         { text: "Hà Nội", value: "Hà Nội" },
//         { text: "Hồ Chí Minh", value: "Hồ Chí Minh" },
//         { text: "Đà Nẵng", value: "Đà Nẵng" },
//         { text: "Nha Trang", value: "Nha Trang" },
//         { text: "Phú Quốc", value: "Phú Quốc" },
//       ],
//     },
//     {
//       title: "Giá TB/đêm",
//       dataIndex: "priceHotelNumber", // backend đã map virtual number
//       key: "priceHotelNumber",
//       width: 140,
//       sorter: true, // backend sẽ sort theo field này nếu bạn cài đặt
//       render: (price) => (
//         <div style={{ textAlign: "right" }}>
//           <Text strong style={{ color: "#1890ff", fontSize: 14 }}>
//             {typeof price === "number" ? price.toLocaleString("vi-VN") : "—"} VND
//           </Text>
//           <br />
//           <Text type="secondary" style={{ fontSize: 11 }}>VND</Text>
//         </div>
//       ),
//       align: "right",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "isDelete",
//       key: "status",
//       width: 120,
//       render: (isDelete) => (
//         <Tag
//           color={!isDelete ? "success" : "warning"}
//           style={{ borderRadius: 6, fontWeight: 500, border: "none", fontSize: 12 }}
//         >
//           {!isDelete ? "Hoạt động" : "Tạm dừng"}
//         </Tag>
//       ),
//       filters: [
//         { text: "Hoạt động", value: "active" },
//         { text: "Tạm dừng", value: "paused" },
//       ],
//       // lọc client-side cho hiển thị; lọc server-side bạn có thể thêm query includeDeleted=1 nếu muốn
//       onFilter: (value, record) => (value === "active" ? !record.isDelete : !!record.isDelete),
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       width: 160,
//       render: (_, record) => (
//         <Space size={4} wrap>
//           <Tooltip title="Xem chi tiết">
//             <Button
//               type="text"
//               size="small"
//               icon={<EyeOutlined />}
//               style={{ color: "#1890ff" }}
//               onClick={(e) => handleViewDetail(e, record)}
//             />
//           </Tooltip>
//           <Tooltip title="Chỉnh sửa">
//             <Button
//               type="text"
//               size="small"
//               icon={<EditOutlined />}
//               style={{ color: "#52c41a" }}
//               onClick={() => navigate(`/Admin/Hotel/edit/${record._id}`)}
//             />
//           </Tooltip>
//           <Popconfirm
//             title="Xác nhận xóa"
//             description="Bạn có chắc muốn xoá khách sạn này?"
//             onConfirm={async () => {
//               try {
//                 await axios.delete(`${API_BASE}/api/hotels/${record._id}`, {
//                   headers: { Authorization: `Bearer ${token}` },
//                 });
//                 message.success("Đã xoá (soft) khách sạn");
//                 // reload current page
//                 const newPage = page; setPage(newPage);
//               } catch (e) {
//                 message.error(e?.response?.data?.error || "Xoá thất bại");
//               }
//             }}
//             okText="Xóa"
//             cancelText="Hủy"
//           >
//             <Tooltip title="Xóa">
//               <Button type="text" size="small" icon={<DeleteOutlined />} danger />
//             </Tooltip>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: setSelectedRowKeys,
//   };

//   const handleDeleteSelected = async () => {
//     try {
//       await Promise.all(
//         selectedRowKeys.map((id) =>
//           axios.delete(`${API_BASE}/api/hotels/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         )
//       );
//       message.success(`Đã xoá ${selectedRowKeys.length} khách sạn`);
//       setSelectedRowKeys([]);
//       // reload
//       const newPage = page; setPage(newPage);
//     } catch (e) {
//       message.error(e?.response?.data?.error || "Xoá thất bại");
//     }
//   };

//   return (
//     <>
//       {/* Statistics Cards */}
//       <div style={{ background: "#f5f5f5" }}>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} lg={6}>
//             <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
//               <Statistic
//                 title="Tổng khách sạn"
//                 value={totalHotels}
//                 prefix={<HomeOutlined style={{ color: "#1890ff" }} />}
//                 valueStyle={{ color: "#1890ff", fontWeight: 600 }}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} lg={6}>
//             <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
//               <Statistic
//                 title="Đang hoạt động (trên trang)"
//                 value={activeHotels}
//                 valueStyle={{ color: "#52c41a", fontWeight: 600 }}
//                 suffix={<span style={{ fontSize: 14, color: "#8c8c8c" }}>/{data.length}</span>}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} lg={6}>
//             <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
//               <Statistic title="Tổng phòng" value={totalRooms} valueStyle={{ fontWeight: 600 }} />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} lg={6}>
//             <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
//               <Statistic
//                 title="Tỷ lệ lấp đầy"
//                 value={occupancyRate}
//                 suffix="%"
//                 valueStyle={{
//                   color: occupancyRate > 70 ? "#52c41a" : occupancyRate > 50 ? "#faad14" : "#ff4d4f",
//                   fontWeight: 600,
//                 }}
//               />
//             </Card>
//           </Col>
//         </Row>
//       </div>

//       {/* Main Content */}
//       <div style={{ paddingTop: "24px", background: "#f5f5f5" }}>
//         <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
//           {/* Header */}
//           <div style={{ marginBottom: 24 }}>
//             <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
//               <Title level={4} style={{ margin: 0, color: "#262626" }}>
//                 <HomeOutlined style={{ marginRight: 8, color: "#1890ff" }} />
//                 Quản lý khách sạn
//               </Title>

//               <Space size={12}>
//                 <Search
//                   placeholder="Tìm khách sạn, thành phố..."
//                   allowClear
//                   enterButton={<SearchOutlined />}
//                   style={{ width: 280 }}
//                   value={searchText}
//                   onChange={(e) => {
//                     setSearchText(e.target.value);
//                     setPage(1);
//                   }}
//                   size="middle"
//                 />
//                 <Select
//                   value={filterCity}
//                   onChange={(v) => { setFilterCity(v); setPage(1); }}
//                   style={{ width: 180 }}
//                   size="middle"
//                   suffixIcon={<FilterOutlined />}
//                 >
//                   <Option value="all">Tất cả</Option>
//                   {/* Nếu backend yêu cầu city _id thay vì tên, bạn nên load danh sách city và set value = _id */}
//                   <Option value="Hà Nội">Hà Nội</Option>
//                   <Option value="Hồ Chí Minh">TP.HCM</Option>
//                   <Option value="Đà Nẵng">Đà Nẵng</Option>
//                   <Option value="Nha Trang">Nha Trang</Option>
//                   <Option value="Phú Quốc">Phú Quốc</Option>
//                 </Select>
//               </Space>
//             </Flex>
//           </div>

//           <Divider style={{ margin: "16px 0" }} />

//           {/* Action Buttons */}
//           <Flex align="center" justify="space-between" style={{ marginBottom: 20 }} wrap="wrap">
//             <div>
//               {selectedRowKeys.length > 0 && (
//                 <Text type="secondary">
//                   Đã chọn <Text strong>{selectedRowKeys.length}</Text> khách sạn
//                 </Text>
//               )}
//             </div>

//             <Space>
//               <Button icon={<ExportOutlined />} style={{ borderRadius: 6 }}>
//                 Xuất Excel
//               </Button>

//               <Popconfirm
//                 title="Xác nhận xóa"
//                 description={`Xóa ${selectedRowKeys.length} khách sạn đã chọn?`}
//                 onConfirm={handleDeleteSelected}
//                 disabled={selectedRowKeys.length === 0}
//               >
//                 <Button
//                   danger
//                   disabled={selectedRowKeys.length === 0}
//                   icon={<DeleteOutlined />}
//                   style={{ borderRadius: 6 }}
//                 >
//                   Xoá ({selectedRowKeys.length})
//                 </Button>
//               </Popconfirm>

//               <Button
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 onClick={() => navigate("/Admin/Hotel/create")}
//               >
//                 Thêm khách sạn
//               </Button>
//             </Space>
//           </Flex>

//           {/* Table */}
//           <Table
//             rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
//             columns={hotelColumns}
//             dataSource={data}
//             loading={loading}
//             rowKey="_id"
//             size="middle"
//             style={{ marginTop: 16 }}
//             pagination={{
//               current: page,
//               pageSize: limit,
//               total,
//               showSizeChanger: true,
//               showQuickJumper: true,
//               showTotal: (t, range) => `${range[0]}-${range[1]} của ${t} khách sạn`,
//               style: { marginTop: 24 },
//             }}
//             onChange={onTableChange}
//             scroll={{ x: 1200 }}
//           />
//         </Card>
//       </div>
//     </>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  EyeOutlined,
  FilterOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

/**
 * Utils
 */
const toVnd = (v) => {
  if (v == null) return null;
  const n = typeof v === "object" && v?.$numberDecimal ? parseFloat(v.$numberDecimal) : Number(v);
  return Number.isFinite(n) ? n : null;
};

const useDebounce = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

export default function HotelList() {
  // ---- server-state ----
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ field: "createdAt", order: "descend" });

  // ---- ui-state ----
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [cities, setCities] = useState([]);

  const token = localStorage.getItem("authToken");
  console.log("Token in HotelList:", token);
  const navigate = useNavigate();

  const debouncedQ = useDebounce(searchText, 500);

  // ---- load cities for filter (optional dynamic) ----
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cities?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        setCities(items.map((c) => ({ label: c.name, value: c._id })));
      } catch (e) {
        // silent; filter can still use static options
      }
    };
    run();
    return () => { cancelled = true; };
  }, [token]);

  // ---- build query params for API ----
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (sort?.field) {
      const dir = sort.order === "descend" ? "desc" : "asc";
      params.set("sort", `${sort.field}:${dir}`);
    }
    if (filterCity !== "all" && filterCity) {
      params.set("city", filterCity); // backend expects _id
    }
    if (includeDeleted) params.set("includeDeleted", "1");
    return params.toString();
  }, [debouncedQ, page, limit, sort, filterCity, includeDeleted]);

  // ---- load hotels from API ----
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/hotels?${queryString}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (cancelled) return;
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        setData(items);
        setTotal(res.data?.pagination?.total ?? items.length);
      } catch (e) {
        console.error(e);
        message.error(e?.response?.data?.error || "Không tải được danh sách khách sạn");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [queryString, token]);

  // ---- Actions ----
  const handleViewDetail = (e, record) => {
    e?.stopPropagation?.();
    navigate(`/Admin/Hotel/detail/${record._id}`);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          axios.delete(`${API_BASE}/api/hotels/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      message.success(`Đã xoá ${selectedRowKeys.length} khách sạn`);
      setSelectedRowKeys([]);
      // reload current page
      setPage((p) => p);
    } catch (e) {
      message.error(e?.response?.data?.error || "Xoá thất bại");
    }
  };

  // ---- Derived stats (simple) ----
  const totalHotels = total;
  const activeOnPage = data.filter((h) => !h.isDelete).length;
  const totalRooms = 0; // you can wire this when backend provides
  const availableRooms = 0;
  const occupancyRate = totalRooms > 0 ? (((totalRooms - availableRooms) / totalRooms) * 100).toFixed(1) : 0;

  // ---- Columns ----
  const columns = [
    {
      title: "Khách sạn",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 360,
      render: (_text, record) => {
        const price = record.priceHotelNumber ?? toVnd(record.priceHotel);
        const firstImg = Array.isArray(record.hotelImages) && record.hotelImages.length > 0
          ? (record.hotelImages[0]?.url || record.hotelImages[0]?.secure_url || record.hotelImages[0])
          : null;

        console.log(firstImg);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                background: "#f0f0f0",
                overflow: "hidden",
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #f0f0f0",
              }}
            >
              {firstImg ? (
                <img src={"http://localhost:4000"+firstImg.image_url} alt={record.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <HomeOutlined style={{ fontSize: 20, color: "#bfbfbf" }} />
              )}
            </div>
            <div>
              <Text strong style={{ fontSize: 15 }}>{record.name}</Text>
              <div style={{ marginTop: 4 }}>
                <EnvironmentOutlined style={{ marginRight: 6, color: "#8c8c8c" }} />
                <Text type="secondary" style={{ fontSize: 12 }}>{record.address || "(chưa có địa chỉ)"}</Text>
              </div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
                <Text style={{ fontSize: 12, color: "#595959" }}>{Number(record.rating || 4.5).toFixed(1)}/5.0</Text>
                {price != null && (
                  <Tag color="blue" style={{ marginLeft: 8, borderRadius: 6 }}>{price.toLocaleString("vi-VN")} VND</Tag>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Thành phố",
      dataIndex: ["city", "name"],
      key: "city",
      width: 160,
      render: (_t, r) => (
        <Tag color="geekblue" style={{ borderRadius: 6, border: "none" }}>{r?.city?.name || "—"}</Tag>
      ),
    },
    {
      title: "Giá TB/đêm",
      dataIndex: "priceHotelNumber",
      key: "priceHotelNumber",
      align: "right",
      width: 140,
      sorter: true,
      render: (v, r) => {
        const price = v ?? toVnd(r.priceHotel);
        return (
          <div style={{ textAlign: "right" }}>
            <Text strong style={{ color: "#1677ff" }}>{price != null ? price.toLocaleString("vi-VN") : "—"}</Text>
            <div style={{ fontSize: 11, color: "#8c8c8c" }}>VND</div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isDelete",
      key: "status",
      width: 120,
      render: (isDelete) => (
        <Tag color={!isDelete ? "success" : "warning"} style={{ borderRadius: 6, border: "none", fontSize: 12 }}>
          {!isDelete ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Tạm dừng", value: "paused" },
      ],
      onFilter: (value, record) => (value === "active" ? !record.isDelete : !!record.isDelete),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 170,
      render: (_, record) => (
        <Space size={4} wrap>
          <Tooltip title="Xem chi tiết">
            <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: "#1677ff" }} onClick={(e) => handleViewDetail(e, record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" size="small" icon={<EditOutlined />} style={{ color: "#52c41a" }} onClick={() => navigate(`/Admin/Hotel/edit/${record._id}`)} />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xoá khách sạn này?"
            onConfirm={async () => {
              try {
                await axios.delete(`${API_BASE}/api/hotels/${record._id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                message.success("Đã xoá (soft) khách sạn");
                setPage((p) => p);
              } catch (e) {
                message.error(e?.response?.data?.error || "Xoá thất bại");
              }
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" size="small" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ---- Table events ----
  const onTableChange = (pagination, _filters, sorter) => {
    if (pagination?.current) setPage(pagination.current);
    if (pagination?.pageSize) setLimit(pagination.pageSize);
    if (sorter?.field) setSort({ field: sorter.field, order: sorter.order });
    else setSort({ field: "createdAt", order: "descend" });
  };

  return (
    <>
      {/* Statistics Cards */}
      <div style={{ background: "#f5f5f5", paddingTop: 8 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <Statistic title="Tổng khách sạn" value={totalHotels} prefix={<HomeOutlined />} valueStyle={{ color: "#1677ff", fontWeight: 600 }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <Statistic title="Đang hoạt động (trên trang)" value={activeOnPage} valueStyle={{ color: "#52c41a", fontWeight: 600 }} suffix={<span style={{ fontSize: 14, color: "#8c8c8c" }}>/{data.length}</span>} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <Statistic title="Tổng phòng" value={0} valueStyle={{ fontWeight: 600 }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <Statistic title="Tỷ lệ lấp đầy" value={occupancyRate} suffix="%" valueStyle={{ color: occupancyRate > 70 ? "#52c41a" : occupancyRate > 50 ? "#faad14" : "#ff4d4f", fontWeight: 600 }} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: 24, background: "#f5f5f5" }}>
        <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          {/* Header */}
          <Flex align="center" justify="space-between" wrap="wrap" gap={16} style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              <HomeOutlined style={{ marginRight: 8, color: "#1677ff" }} /> Quản lý khách sạn
            </Title>

            <Space size={12} wrap>
              <Input
                placeholder="Tìm khách sạn, địa chỉ..."
                allowClear
                prefix={<SearchOutlined />}
                style={{ width: 280 }}
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                size="middle"
              />

              <Select
                value={filterCity}
                onChange={(v) => { setFilterCity(v); setPage(1); }}
                style={{ width: 220 }}
                size="middle"
                suffixIcon={<FilterOutlined />}
                showSearch
                optionFilterProp="label"
              >
                <Option value="all" label="Tất cả">Tất cả thành phố</Option>
                {cities.length > 0 ? (
                  cities.map((c) => (
                    <Option key={c.value} value={c.value} label={c.label}>{c.label}</Option>
                  ))
                ) : (
                  <>
                    <Option value="Hà Nội">Hà Nội</Option>
                    <Option value="Hồ Chí Minh">TP.HCM</Option>
                    <Option value="Đà Nẵng">Đà Nẵng</Option>
                  </>
                )}
              </Select>

              <Tooltip title="Bao gồm đã xoá (soft)">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Include deleted</Text>
                  <Switch checked={includeDeleted} onChange={setIncludeDeleted} />
                </div>
              </Tooltip>

              <Button icon={<ExportOutlined />} onClick={() => message.info("TODO: Export CSV")}>Xuất</Button>

              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/Admin/Hotel/create")}>
                Thêm khách sạn
              </Button>
            </Space>
          </Flex>

          <Divider style={{ margin: "12px 0 16px" }} />

          {/* Table */}
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="_id"
            size="middle"
            onChange={onTableChange}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (t, range) => `${range[0]}-${range[1]} của ${t} khách sạn`,
              style: { marginTop: 16 },
              onChange: (nextPage, nextSize) => {
                if (nextSize !== limit) {
                  setLimit(nextSize);
                  setPage(1);
                } else {
                  setPage(nextPage);
                }
                window.scrollTo({ top: 0, behavior: "instant" });
              },
              onShowSizeChange: (_cur, nextSize) => {
                setLimit(nextSize);
                setPage(1);
                window.scrollTo({ top: 0, behavior: "instant" });
              },
            }}
            scroll={{ x: 1200 }}
          />

          {/* Bulk actions */}
          <Flex align="center" justify="space-between" style={{ marginTop: 12 }}>
            {selectedRowKeys.length > 0 ? (
              <Text type="secondary">
                Đã chọn <Text strong>{selectedRowKeys.length}</Text> khách sạn
              </Text>
            ) : <span />}

            <Popconfirm
              title="Xác nhận xóa"
              description={`Xóa ${selectedRowKeys.length} khách sạn đã chọn?`}
              onConfirm={handleBulkDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button danger disabled={selectedRowKeys.length === 0} icon={<DeleteOutlined />}>Xoá ({selectedRowKeys.length})</Button>
            </Popconfirm>
          </Flex>
        </Card>
      </div>
    </>
  );
}
