// src/pages/Admin/CompanyBookingList.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Button,
  Typography,
  message,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../api/client";
import "./CompanyBookingList.css";
import BookingDetailModal from "./BookingDetailModal";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const STATUS_COLORS = {
  PENDING: "default",
  PARTIAL: "orange",
  PAID: "green",
  CHECKED_IN: "blue",
  CHECKED_OUT: "purple",
  CANCELLED: "red",
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PARTIAL", label: "Thanh toán một phần" },
  { value: "PAID", label: "Đã thanh toán đủ" },
  { value: "CHECKED_IN", label: "Đã check-in" },
  { value: "CHECKED_OUT", label: "Đã check-out" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function CompanyBookingList() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);


  const [loading, setLoading] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [sorter, setSorter] = useState({ field: null, order: null });

  const [filterHotel, setFilterHotel] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [dateRange, setDateRange] = useState([
    dayjs().add(-30, "day"),
    dayjs(),
  ]);
  const [searchText, setSearchText] = useState("");

  // ===== LOAD DANH SÁCH KHÁCH SẠN TRONG COMPANY =====
  const loadHotels = async () => {
    try {
      setLoadingHotels(true);
      const res = await api.get("/api/hotels", {
        params: { limit: 1000 },
      });
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      setHotels(items);
    } catch (e) {
      console.error("Load hotels error:", e);
      message.error("Không tải được danh sách khách sạn");
    } finally {
      setLoadingHotels(false);
    }
  };

  // ===== TẠO PARAM QUERY CHO API BOOKING =====
  const queryParams = useMemo(() => {
    const params = {};

    if (dateRange && dateRange.length === 2) {
      params.from = dateRange[0].format("YYYY-MM-DD");
      params.to = dateRange[1].format("YYYY-MM-DD");
    }

    if (filterStatus && filterStatus !== "ALL") {
      params.status = filterStatus;
    }

    if (filterHotel && filterHotel !== "ALL") {
      params.hotel = filterHotel;
    }

    if (searchText.trim()) {
      params.q = searchText.trim();
    }

    params.page = page;
    params.limit = limit;

    if (sorter.field) {
      const dir = sorter.order === "descend" ? "desc" : "asc";
      params.sort = `${sorter.field}:${dir}`;
    }

    return params;
  }, [dateRange, filterStatus, filterHotel, searchText, page, limit, sorter]);

  // ===== LOAD BOOKING THEO COMPANY =====
  const loadBookings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/bookings/company", {
        params: queryParams,
      });

      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data || [];

      setBookings(data);
      const totalRes = res.data?.pagination?.total ?? data.length;
      setTotal(totalRes);
    } catch (e) {
      console.error("Load bookings error:", e);
      message.error(
        e?.response?.data?.error || "Không tải được danh sách booking"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  // ===== CỘT TABLE =====
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_t, _r, i) => (page - 1) * limit + i + 1,
    },
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      sorter: true,
      render: (v, record) => (
        <button
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            background: "none",
            color: "#096dd9",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedBooking(record);
            setDetailOpen(true);
          }}
        >
          {v || "—"}
        </button>
      ),
    },

    {
      title: "Khách sạn",
      key: "hotel",
      render: (_, r) => (
        <span style={{ fontWeight: 500 }}>
          {r?.hotel?.name || "—"}
        </span>
      ),
    },
    {
      title: "Phòng",
      key: "rooms",
      render: (_, r) => {
        const rooms = r.rooms || [];
        if (!rooms.length) return "—";
        return (
          <span style={{ color: "#722ed1", fontWeight: 500 }}>
            {rooms.map((x) => x.room?.name).join(", ")}
          </span>
        );
      },
    },
    {
      title: "Ngày ở",
      key: "dateRange",
      sorter: true,
      render: (_, r) => {
        const start = dayjs(r.start_day).format("DD/MM");
        const end = dayjs(r.end_day).format("DD/MM");
        return (
          <span style={{ color: "#52c41a", fontWeight: 500 }}>
            {start} → {end}
          </span>
        );
      },
      sortOrder: sorter.field === "start_day" ? sorter.order : null,
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (v) =>
        typeof v === "number" ? (
          <span style={{ color: "#faad14", fontWeight: 600 }}>
            {v.toLocaleString("vi-VN")} ₫
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Đã thanh toán",
      dataIndex: "paid",
      key: "paid",
      sorter: true,
      render: (v, r) => {
        const remaining =
          typeof r.amount === "number" && typeof v === "number"
            ? r.amount - v
            : null;

        return (
          <div>
            <div style={{ color: "#52c41a", fontWeight: 500 }}>
              {v.toLocaleString("vi-VN")} ₫
            </div>

          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = STATUS_COLORS[status] || "default";
        const label =
          STATUS_OPTIONS.find((s) => s.value === status)?.label ||
          status;

        return (
          <Tag
            color={color}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, r) => {
        const c = r.customer || {};
        return (
          <div>
            <strong>{c.name || "—"}</strong>

          </div>
        );
      },
    },
    {
      title: "Tạo bởi",
      dataIndex: ["createdBy", "name"],
      key: "createdBy",
      render: (v) => (
        <span style={{ color: "#1890ff", fontWeight: 500 }}>
          {v || "Online"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (v) =>
        v ? (
          <span style={{ color: "#555", fontWeight: 500 }}>
            {dayjs(v).format("DD/MM/YYYY HH:mm")}
          </span>
        ) : (
          "—"
        ),
    },
  ];


  const hotelOptions = [
    { value: "ALL", label: "Tất cả khách sạn" },
    ...hotels.map((h) => ({
      value: h._id,
      label: h.name,
    })),
  ];

  const handleTableChange = (pagination, _filters, sorterInfo) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);

    if (sorterInfo && sorterInfo.field) {
      setSorter({
        field: sorterInfo.field === "dateRange" ? "start_day" : sorterInfo.field,
        order: sorterInfo.order,
      });
    } else {
      setSorter({ field: null, order: null });
    }
  };

  const handleReload = () => {
    setPage(1);
    loadBookings();
  };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
      >
        <Col>
          <Title level={4}>Quản lý booking toàn công ty</Title>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={handleReload}>
            Tải lại
          </Button>
        </Col>
      </Row>

      <Row gutter={16} className="filter-wrapper">
        <Col span={6}>
          <RangePicker
            style={{ width: "100%" }}
            value={dateRange}
            onChange={(val) => {
              setPage(1);
              setDateRange(val || []);
            }}
            format="DD/MM/YYYY"
          />
        </Col>

        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            options={hotelOptions}
            loading={loadingHotels}
            value={filterHotel}
            onChange={(val) => {
              setPage(1);
              setFilterHotel(val);
            }}
          />
        </Col>

        <Col span={5}>
          <Select
            style={{ width: "100%" }}
            options={STATUS_OPTIONS}
            value={filterStatus}
            onChange={(val) => {
              setPage(1);
              setFilterStatus(val);
            }}
          />
        </Col>

        <Col span={7}>
          <Input
            placeholder="Tìm theo mã đơn / khách hàng / SĐT..."
            allowClear
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => {
              setPage(1);
              setSearchText(e.target.value);
            }}
          />
        </Col>
      </Row>

      <Table
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={bookings}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (t) => `Tổng ${t} booking`,
        }}
        onChange={handleTableChange}
        bordered
        size="middle"
      />
      <BookingDetailModal
        open={detailOpen}
        booking={selectedBooking}
        onClose={() => {
          setDetailOpen(false);
          setSelectedBooking(null);
        }}
      />
    </div>

  );
}
