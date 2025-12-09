import { useState, useEffect } from "react";
import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Modal,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import CreateEmployee from "./CreateEmlpoyee";
import api from "../../../api/client"; // 👉 CHỈNH LẠI PATH CHO ĐÚNG PROJECT CỦA BẠN

const { Search } = Input;

export default function Employee() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================== CALL API LẤY DANH SÁCH NHÂN VIÊN ==================
  const reloadEmployees = async () => {
    try {
      setLoading(true);
      // Có thể thêm query ?q=... nếu muốn backend search
      const res = await api.get("/api/staff");
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setEmployees(items);
    } catch (e) {
      console.error("Load employees error:", e);
      message.error(
        e?.response?.data?.error || "Không tải được danh sách nhân viên"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadEmployees();
  }, []);

  // ================== CẤU HÌNH BẢNG ==================
  const employeeColumns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đang làm việc" ? "green" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // ================== MAP DỮ LIỆU TỪ API -> DATA CHO TABLE ==================
  // Giả sử mỗi user từ API:
  // { _id, name, email, phone, roles, isDeleted }
  const mappedEmployees = employees.map((emp, index) => {
    const primaryRole = (emp.roles && emp.roles[0]) || "Staff";
    const status = emp.isDeleted ? "Nghỉ việc" : "Đang làm việc";

    return {
      key: emp._id || index,
      stt: index + 1,
      fullName: emp.name,
      email: emp.email,
      phone: emp.phone,
      role:
        primaryRole === "ADMIN" || primaryRole === "ADMIN_HOTEL"
          ? "Admin"
          : "Staff",
      status,
      raw: emp, // giữ lại bản gốc nếu sau này cần
    };
  });

  // ================== LỌC THEO TRẠNG THÁI + TÌM KIẾM ==================
  const filteredData = mappedEmployees.filter((employee) => {
    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;
    const matchesSearch =
      employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (employee.phone || "").includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    reloadEmployees(); // sau khi thêm xong reload lại danh sách
  };

  return (
    <>
      <div>
        <Row className="header" style={{ marginBottom: 20 }}>
          <Col span={4}>Quản Lý Nhân Viên</Col>
          <Col span={4} offset={16} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={showModal}>
              Thêm mới
            </Button>
          </Col>
        </Row>

        {/* Bộ lọc và tìm kiếm */}
        <Row style={{ marginBottom: 20 }} gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
              defaultValue="all"
              onChange={handleStatusChange}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "Đang làm việc", label: "Đang làm việc" },
                { value: "Nghỉ việc", label: "Nghỉ việc" },
              ]}
            />
          </Col>
          <Col span={10} style={{ textAlign: "right" }}>
            <span style={{ lineHeight: "40px", color: "#666" }}>
              Tìm thấy: <strong>{filteredData.length}</strong> nhân viên
            </span>
          </Col>
        </Row>

        {/* Bảng danh sách nhân viên */}
        <Row>
          <Col span={24}>
            <Table
              columns={employeeColumns}
              dataSource={filteredData}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Col>
        </Row>

        {/* Modal thêm nhân viên */}
        <Modal
          title="Thêm nhân viên mới"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={900}
          centered
        >
          <CreateEmployee onSuccess={handleOk} onCancel={handleCancel} />
        </Modal>
      </div>
    </>
  );
}
