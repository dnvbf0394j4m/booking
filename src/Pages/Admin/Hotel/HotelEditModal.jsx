// src/pages/admin/hotel/HotelEditModal.jsx
import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Row, Col, message } from "antd";
import api from "../../../api/client"; // chỉnh path nếu khác

const { TextArea } = Input;

const TYPE_OPTIONS = [
  { label: "Khách sạn", value: "HOTEL" },
  { label: "Căn hộ", value: "APARTMENT" },
  { label: "Resort", value: "RESORT" },
  { label: "Homestay", value: "HOMESTAY" },
  { label: "Villa", value: "VILLA" },
];

const AMENITY_OPTIONS = [
  { label: "WiFi miễn phí", value: "wifi" },
  { label: "Bể bơi", value: "pool" },
  { label: "Bao gồm bữa sáng", value: "breakfast" },
];

export default function HotelEditModal({ open, onClose, hotel, onUpdated }) {
  const [form] = Form.useForm();

  // Khi hotel thay đổi → fill form
  useEffect(() => {
    if (hotel) {
      form.setFieldsValue({
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        priceHotel: Number(hotel.priceHotel || hotel.priceHotelNumber || 0),
        discount: hotel.discount ?? 0,
        type: hotel.type || "HOTEL",
        amenities: hotel.amenities || [],
        lat: hotel.lat,
        lng: hotel.lng,
        checkInTime: hotel.checkInTime || "",
        checkOutTime: hotel.checkOutTime || "",
        city: hotel.city?._id || hotel.city,
        area: hotel.area?._id || hotel.area,
      });
    } else {
      form.resetFields();
    }
  }, [hotel, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Chuẩn bị payload gửi lên đúng theo updateHotelSchema
      const payload = {
        name: values.name,
        description: values.description,
        address: values.address,
        priceHotel: values.priceHotel,
        discount: values.discount,
        type: values.type,
        amenities: values.amenities || [],
        lat: values.lat,
        lng: values.lng,
        checkInTime: values.checkInTime || null,
        checkOutTime: values.checkOutTime || null,
        city: values.city || null,
        area: values.area || null,
      };

      const res = await api.put(`/api/hotels/${hotel._id}`, payload);
      message.success("Cập nhật khách sạn thành công");

      if (onUpdated) {
        onUpdated(res.data.hotel);
      }
      onClose();
    } catch (err) {
      // lỗi validate form thì err là ValidationError → bỏ qua
      if (err?.errorFields) return;

      console.error("Update hotel error:", err);
      message.error(
        err?.response?.data?.error || "Lỗi khi cập nhật khách sạn"
      );
    }
  };

  return (
    <Modal
      open={open}
      title={hotel ? `Sửa khách sạn: ${hotel.name}` : "Sửa khách sạn"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ discount: 0, type: "HOTEL", amenities: [] }}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="Tên khách sạn"
              name="name"
              rules={[{ required: true, message: "Nhập tên khách sạn" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Loại chỗ ở"
              name="type"
              rules={[{ required: true, message: "Chọn loại chỗ ở" }]}
            >
              <Select options={TYPE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Giá mỗi đêm (VND)"
              name="priceHotel"
              rules={[{ required: true, message: "Nhập giá" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={50000}
                formatter={(v) =>
                  `${(v || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                }
                parser={(v) => v.replace(/\./g, "")}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Giảm giá (%)"
              name="discount"
              rules={[
                { type: "number", min: 0, max: 100, message: "0 - 100" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Tiện nghi" name="amenities">
              <Select
                mode="multiple"
                allowClear
                options={AMENITY_OPTIONS}
                placeholder="Chọn tiện nghi"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giờ nhận phòng (HH:mm)" name="checkInTime">
              <Input placeholder="14:00" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giờ trả phòng (HH:mm)" name="checkOutTime">
              <Input placeholder="12:00" />
            </Form.Item>
          </Col>
        </Row>


        {/* Nếu bạn có dropdown city/area thì thay Input bằng Select, ở đây để tạm Input */}
        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Thành phố" name="city">
              <Select ... />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Khu vực" name="area">
              <Select ... />
            </Form.Item>
          </Col>
        </Row> */}
      </Form>
    </Modal>
  );
}
