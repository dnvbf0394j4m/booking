import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Table,
  Space,
  Popconfirm,
  message,
  Card,
  Tag,
  Typography,
  Input,
  Select,
  Statistic,
  Row,
  Col,
  Avatar,
  Badge,
  Tooltip,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  ExportOutlined,
  StarFilled,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ButtonSubmit from "../../../Component/ButtonSubmit";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function HotelList() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterCity, setFilterCity] = useState("all");

  const token = localStorage.getItem("authToken");


  const navigate = useNavigate(); 
 

  const handleViewDetail = (e, record) => {
    e?.stopPropagation?.(); // tránh kích hoạt row click/selection
    // 1) Chuyển route và truyền state (không cần fetch lại nếu đã có record)
    // navigate(`/hotels/${record.hotelId}`, { state: { hotel: record } });

    // 2) Nếu bạn muốn chỉ truyền id và fetch ở trang detail thì dùng:
    navigate(`/Admin/Hotel/detail/${record.hotelId}`);
  };

  // 🔹 Giả lập dữ liệu hotel + room + manager
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // const cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Nha Trang", "Phú Quốc"];
      // const hotelTypes = ["Hotel", "Resort", "Villa", "Apartment"];
      // const staffNames = [
      //   "Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Cường", "Phạm Thu Duyên",
      //   "Hoàng Văn Em", "Đặng Thị Phương", "Vũ Quốc Huy", "Bùi Thị Hương",
      //   "Ngô Văn Khoa", "Dương Thị Lan", "Trương Minh Tuấn", "Lý Thị Nga"
      // ];

      // const fakeHotels = Array.from({ length: 12 }).map((_, i) => ({
      //   key: i + 1,
      //   name: `${hotelTypes[i % 4]} ${["Grand", "Royal", "Golden", "Diamond"][i % 4]} ${i + 1}`,
      //   city: cities[i % cities.length],
      //   price: 800000 + i * 150000,
      //   address: `${i + 1} Đường Lê Lợi, ${cities[i % cities.length]}`,
      //   rating: (4.0 + Math.random() * 1.0).toFixed(1),
      //   totalRooms: 20 + i * 5,
      //   availableRooms: 15 + Math.floor(Math.random() * 10),
      //   status: i % 4 === 0 ? "Tạm dừng" : "Hoạt động",
      //   image: `https://picsum.photos/48/48?random=${i + 100}`,
      //   manager: {
      //     name: staffNames[i],
      //     avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      //     phone: `090${Math.floor(1000000 + Math.random() * 9000000)}`,
      //     email: staffNames[i].toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '@hotel.com'
      //   },
      //   rooms: Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map((__, j) => ({
      //     key: `${i + 1}-${j + 1}`,
      //     roomNumber: `${Math.floor((i + 1) / 10)}${(j + 1).toString().padStart(2, '0')}`,
      //     type: j % 3 === 0 ? "Deluxe" : j % 3 === 1 ? "Standard" : "Suite",
      //     price: 400000 + j * 200000,
      //     status: Math.random() > 0.3 ? "Còn trống" : "Đã đặt",
      //     guests: Math.floor(Math.random() * 4) + 1,
      //   })),
      // }));
      console.log(token)

      fetch("http://localhost:8082/identity/api/hotel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // thêm token vào header
        },

      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 0 && Array.isArray(data.result.content)) {
            console.log(data.result.content)
            setDataSource(data.result.content);
            setFilteredData(data.result.content);
          }
        }
        )

      // setDataSource(fakeHotels);
      // setFilteredData(fakeHotels);
      setLoading(false);
    }, 1200);
  }, []);

  // 🔹 Filter và search
  useEffect(() => {
    let filtered = dataSource;

    if (searchText) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchText.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchText.toLowerCase()) ||
        hotel.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterCity !== "all") {
      filtered = filtered.filter(hotel => hotel.city === filterCity);
    }

    setFilteredData(filtered);
  }, [searchText, filterCity, dataSource]);

  // 🔹 Statistics
  const totalHotels = dataSource.length;
  const activeHotels = dataSource.filter(h => h.status === "Hoạt động").length;
  const totalRooms = dataSource.reduce((sum, hotel) => sum + hotel.totalRooms, 0);
  const availableRooms = dataSource.reduce((sum, hotel) => sum + hotel.availableRooms, 0);
  const occupancyRate = totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms * 100).toFixed(1) : 0;

  // 🔹 Cột trong bảng Hotel
  const hotelColumns = [
    {
      title: "Khách sạn",
      dataIndex: "name",
      key: "name",
      width: 300,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            src={`http://localhost:8082/identity${record.avarta}`}

            size={48}
            shape="square"
            style={{
              borderRadius: 8,
              border: '2px solid #f0f0f0'
            }}
          />
          <div>
            <Text strong style={{ fontSize: 15, color: '#262626' }}>
              {text}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {record.address}
            </Text>
            <div style={{ marginTop: 4 }}>
              <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
              <Text style={{ fontSize: 12, marginLeft: 4, color: '#595959' }}>
                {record.rating}/5.0
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
      width: 120,
      render: (city, record) => (
        <Tag
          color="geekblue"
          style={{
            borderRadius: 6,
            fontWeight: 500,
            border: 'none'
          }}
        >
          {record.city.name}
        </Tag>
      ),
      filters: [
        { text: "Hà Nội", value: "Hà Nội" },
        { text: "Hồ Chí Minh", value: "Hồ Chí Minh" },
        { text: "Đà Nẵng", value: "Đà Nẵng" },
        { text: "Nha Trang", value: "Nha Trang" },
        { text: "Phú Quốc", value: "Phú Quốc" },
      ],
      onFilter: (value, record) => record.city === value,
    },
    {
      title: "Giá TB/đêm",
      dataIndex: "priceHotel",
      key: "priceHotel",
      width: 130,
      render: (price) => (
        <div style={{ textAlign: 'right' }}>
          <Text strong style={{ color: '#1890ff', fontSize: 14 }}>
  {price} VND
</Text>


          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            VND
          </Text>
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
      align: 'right',
    },
    {
      title: "Phòng",
      dataIndex:"availableRooms",
      key: "availableRooms",
      width: 100,
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <Badge
            count={record.availableRooms}
            style={{
              backgroundColor: record.availableRooms > 5 ? '#52c41a' : '#faad14',
              fontWeight: 'bold'
            }}
          >
            <div style={{
              background: '#f6f6f6',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 500,
              minWidth: 50
            }}>
              {record.totalRooms}
            </div>
          </Badge>
          <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
            {record.availableRooms} trống
          </div>
        </div>
      ),
      sorter: (a, b) => a.availableRooms - b.availableRooms,
    },
    // {
    //   title: "Nhân viên quản lý",
    //   key: "manager",
    //   width: 200,
    //   render: (_, record) => (
    //     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    //       <Avatar
    //         src={record.manager.avatar}
    //         size={40}
    //         style={{ 
    //           border: '2px solid #e6f7ff'
    //         }}
    //       />
    //       <div>
    //         <Text strong style={{ fontSize: 13, color: '#262626' }}>
    //           {record.manager.name}
    //         </Text>
    //         <br />
    //         <Text type="secondary" style={{ fontSize: 11 }}>
    //           {record.manager.phone}
    //         </Text>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => (
        <Tag
          color={status === "Hoạt động" ? "success" : "warning"}
          style={{
            borderRadius: 6,
            fontWeight: 500,
            border: 'none',
            fontSize: 12
          }}
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: "Hoạt động", value: "Hoạt động" },
        { text: "Tạm dừng", value: "Tạm dừng" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space size={4}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                style={{ color: '#1890ff' }}
                onClick={(e) => handleViewDetail(e, record)}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc muốn xoá khách sạn này?"
              onConfirm={() => handleDelete(record.key)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  // 🔹 Cột trong bảng Room
  const roomColumns = [
    {
      title: "Phòng",
      dataIndex: "roomNumber",
      width: 80,
      render: (num) => (
        <Text strong style={{ color: '#1890ff' }}>
          #{num}
        </Text>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type) => {
        const colors = {
          'Standard': 'default',
          'Deluxe': 'blue',
          'Suite': 'gold'
        };
        return (
          <Tag color={colors[type]} style={{ borderRadius: 4 }}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Giá/đêm",
      dataIndex: "price",
      render: (price) => (
        <Text strong style={{ color: '#52c41a' }}>
          {(price / 1000000).toFixed(1)}M
        </Text>
      ),
      align: 'right',
    },
    {
      title: "Khách",
      dataIndex: "guests",
      render: (guests) => `${guests} người`,
      align: 'center',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Badge
          status={status === "Còn trống" ? "success" : "error"}
          text={status}
        />
      ),
    },
  ];

  // 🔹 Xoá 1 khách sạn
  const handleDelete = (key) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
    message.success("Đã xoá khách sạn thành công!");
  };

  // 🔹 Chọn nhiều dòng
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 🔹 Xoá nhiều
  const handleDeleteSelected = () => {
    setDataSource((prev) =>
      prev.filter((item) => !selectedRowKeys.includes(item.key))
    );
    setSelectedRowKeys([]);
    message.success(`Đã xoá ${selectedRowKeys.length} khách sạn`);
  };

  return (
    <>
      {/* Statistics Cards */}
      <div style={{ background: '#f5f5f5' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Statistic
                title="Tổng khách sạn"
                value={totalHotels}
                prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Statistic
                title="Đang hoạt động"
                value={activeHotels}
                valueStyle={{ color: '#52c41a', fontWeight: 600 }}
                suffix={<span style={{ fontSize: 14, color: '#8c8c8c' }}>/{totalHotels}</span>}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Statistic
                title="Tổng phòng"
                value={totalRooms}
                valueStyle={{ fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Statistic
                title="Tỷ lệ lấp đầy"
                value={occupancyRate}
                suffix="%"
                valueStyle={{
                  color: occupancyRate > 70 ? '#52c41a' : occupancyRate > 50 ? '#faad14' : '#ff4d4f',
                  fontWeight: 600
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: "24px", background: '#f5f5f5' }}>
        <Card
          style={{
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
              <Title level={4} style={{ margin: 0, color: '#262626' }}>
                <HomeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Quản lý khách sạn
              </Title>

              <Space size={12}>
                <Search
                  placeholder="Tìm khách sạn, thành phố..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  style={{ width: 280 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  size="middle"
                />
                <Select
                  value={filterCity}
                  onChange={setFilterCity}
                  style={{ width: 140 }}
                  size="middle"
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="Hà Nội">Hà Nội</Option>
                  <Option value="Hồ Chí Minh">TP.HCM</Option>
                  <Option value="Đà Nẵng">Đà Nẵng</Option>
                  <Option value="Nha Trang">Nha Trang</Option>
                  <Option value="Phú Quốc">Phú Quốc</Option>
                </Select>
              </Space>
            </Flex>
          </div>

          <Divider style={{ margin: '16px 0' }} />

          {/* Action Buttons */}
          <Flex align="center" justify="space-between" style={{ marginBottom: 20 }} wrap="wrap">
            <div>
              {selectedRowKeys.length > 0 && (
                <Text type="secondary">
                  Đã chọn <Text strong>{selectedRowKeys.length}</Text> khách sạn
                </Text>
              )}
            </div>

            <Space>
              <Button
                icon={<ExportOutlined />}
                style={{ borderRadius: 6 }}
              >
                Xuất Excel
              </Button>

              <Popconfirm
                title="Xác nhận xóa"
                description={`Xóa ${selectedRowKeys.length} khách sạn đã chọn?`}
                onConfirm={handleDeleteSelected}
                disabled={selectedRowKeys.length === 0}
              >
                <Button
                  danger
                  disabled={selectedRowKeys.length === 0}
                  icon={<DeleteOutlined />}
                  style={{ borderRadius: 6 }}
                >
                  Xoá ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
              <ButtonSubmit/>
            </Space>
          </Flex>

          {/* Table */}
          <Table
            rowSelection={rowSelection}

            columns={hotelColumns}
            dataSource={filteredData}
            loading={loading}
            rowKey="hotelId"
            size="middle"
            style={{ marginTop: 16 }}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} khách sạn`,
              style: { marginTop: 24 }
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </div>
    </>
  );
}