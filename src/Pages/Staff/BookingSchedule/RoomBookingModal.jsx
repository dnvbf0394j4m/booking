
import React, { useState } from "react";
import { Modal, Button, DatePicker, Select, Table, Tag, Radio } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const RoomBookingModal = ({ open, onCancel }) => {
  const [bookingType, setBookingType] = useState("day");
  const [selectedRooms, setSelectedRooms] = useState({});

  const roomData = [
    { key: 1, name: "SUPERIOR DOUBLE", price: 1400000, capacity: "2 người lớn + 1 trẻ em" },
    { key: 2, name: "DELUXE TWIN", price: 2000000, capacity: "2 người lớn + 1 trẻ em" },
    { key: 3, name: "DELUXE DOUBLE", price: 2000000, capacity: "2 người lớn + 1 trẻ em" },
    { key: 4, name: "DELUXE TRIPLE", price: 2000000, capacity: "3 người lớn + 1 trẻ em" },
    { key: 5, name: "FAMILY ROOM", price: 3000000, capacity: "4 người lớn + 2 trẻ em" },
  ];

  const handleSelectRoom = (record) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [record.key]: prev[record.key] ? undefined : record,
    }));
  };

  const columns = [
    {
      title: "Phòng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.capacity}</div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN"),
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (_, record) => <span>1</span>,
    },
    {
      title: "Tổng cộng",
      key: "total",
      render: (_, record) => <span>{record.price.toLocaleString("vi-VN")}</span>,
    },
    {
      key: "action",
      render: (_, record) => (
        <Button
          type={selectedRooms[record.key] ? "default" : "primary"}
          onClick={() => handleSelectRoom(record)}
        >
          {selectedRooms[record.key] ? "Bỏ chọn" : "Đặt phòng"}
        </Button>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Chọn phòng"
      footer={null}
      width={900}
    >
      {/* Bộ lọc chọn kiểu đặt */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Radio.Group
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value)}
        >
          <Radio.Button value="hour">Theo giờ</Radio.Button>
          <Radio.Button value="day">Theo ngày</Radio.Button>
          <Radio.Button value="night">Qua đêm</Radio.Button>
        </Radio.Group>

        <RangePicker
          showTime={{ format: "HH:mm" }}
          format="DD/MM/YYYY HH:mm"
          defaultValue={[moment(), moment().add(2, "days")]}
        />

        <Select
          defaultValue="1 phòng • 1 người lớn"
          style={{ width: 200 }}
          options={[
            { label: "1 phòng • 1 người lớn", value: "1" },
            { label: "1 phòng • 2 người lớn", value: "2" },
          ]}
        />
      </div>

      {/* Hiển thị số ngày */}
      <Tag color="green">2 ngày</Tag>

      {/* Bảng danh sách phòng */}
      <Table
        dataSource={roomData}
        columns={columns}
        pagination={false}
        rowKey="key"
      />
    </Modal>
  );
};

export default RoomBookingModal;
