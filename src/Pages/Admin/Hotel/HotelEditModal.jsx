// src/pages/admin/hotel/HotelEditModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message,
  Image,
  Upload,
  Button,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../../api/client";

const { TextArea } = Input;

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function HotelEditModal({ open, onClose, hotel, onUpdated }) {
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);



  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoadingCities(true);
      const res = await api.get("/api/cities?limit=1000");

      // backend của bạn trả res.data.data hoặc res.data ?
      const items = res.data.data || res.data;

      setCities(
        items.map((c) => ({
          label: c.name,
          value: c._id,
        }))
      );
    } catch (err) {
      console.log("Load cities err:", err);
    } finally {
      setLoadingCities(false);
    }
  };


  useEffect(() => {
    if (hotel) {
      form.setFieldsValue({
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        priceHotel: convertPrice(hotel.priceHotel),
        discount: hotel.discount ?? 0,
        type: hotel.type || "HOTEL",
        amenities: hotel.amenities || [],
        lat: hotel.lat,
        lng: hotel.lng,
        checkInTime: hotel.checkInTime || "",
        checkOutTime: hotel.checkOutTime || "",
        city: hotel.city?._id || hotel.city,
      });

      setImages(hotel.hotelImages || []);
    }
  }, [hotel]);

  const convertPrice = (price) => {
    if (!price) return 0;
    if (typeof price === "number") return price;
    if (price.$numberDecimal) return Number(price.$numberDecimal);
    return Number(price);
  };

  // ============================================================
  // 🔥 UPLOAD ẢNH MỚI
  // ============================================================
  const handleUpload = async ({ file }) => {
    if (!hotel?._id) return message.error("Thiếu hotelId");

    const formData = new FormData();
    formData.append("images", file); // khớp với array("images", 10)

    try {
      const res = await api.post(
        `/api/hotels/${hotel._id}/images`,
        formData // ❌ bỏ headers Content-Type, để axios tự set
      );

      message.success("Tải ảnh lên thành công");

      // ✅ dùng hotel đã populate từ backend
      const newHotel = res.data.hotel;
      setImages(newHotel.hotelImages || []);

      // báo ra ngoài trang list
      onUpdated && onUpdated(newHotel);
    } catch (err) {
      console.log(err);
      message.error("Upload ảnh thất bại");
    }
  };


  // ============================================================
  // 🔥 XOÁ ẢNH
  // ============================================================
  const handleDeleteImg = async (imgId) => {
    try {
      const res = await api.delete(
        `/api/hotels/${hotel._id}/images/${imgId}`
      );

      message.success("Xoá ảnh thành công");

      // cập nhật UI theo ảnh mới từ backend
      setImages(res.data.hotel.hotelImages || []);

      onUpdated && onUpdated(res.data.hotel);
    } catch (err) {
      message.error("Không xoá được ảnh");
    }
  };


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

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
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,
         city: values.city,
      };

      const res = await api.put(`/api/hotels/${hotel._id}`, payload);

      message.success("Cập nhật khách sạn thành công");
      onUpdated && onUpdated(res.data.hotel);
      onClose();
    } catch (err) {
      if (err?.errorFields) return;
      message.error("Lỗi cập nhật hotel");
    }
  };

  return (
    <Modal
      open={open}
      title={`Sửa khách sạn: ${hotel?.name || ""}`}
      onCancel={onClose}
      onOk={handleSubmit}
      width={850}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="Tên khách sạn"
              name="name"
              rules={[{ required: true, message: "Nhập tên" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Loại chỗ ở"
              name="type"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Khách sạn", value: "HOTEL" },
                  { label: "Căn hộ", value: "APARTMENT" },
                  { label: "Resort", value: "RESORT" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Chọn thành phố" }]}
            >
              <Select
                placeholder="Chọn thành phố"
                loading={loadingCities}
                options={cities}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tiện nghi" name="amenities">
              <Select
                mode="multiple"
                options={[
                  { label: "WiFi miễn phí", value: "wifi" },
                  { label: "Bể bơi", value: "pool" },
                  { label: "Bao gồm bữa sáng", value: "breakfast" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>


        <Form.Item label="Mô tả" name="description">
          <TextArea rows={3} />
        </Form.Item>

        {/* ===================================================== */}
        {/* 🔥 QUẢN LÝ ẢNH KHÁCH SẠN */}
        {/* ===================================================== */}
        <Form.Item label="Ảnh khách sạn">
          <Row gutter={[12, 12]}>
            {images
              .filter(Boolean) // loại phần tử null/undefined nếu lỡ còn sót
              .map((img) => {
                const raw = img?.image_url || (typeof img === "string" ? img : "");
                if (!raw) return null;

                const src = raw.startsWith("http") ? raw : `${API_BASE}${raw}`;

                return (
                  <Col span={6} key={img._id || src}>
                    <div style={{ position: "relative" }}>
                      <Image
                        src={src}
                        style={{
                          width: "100%",
                          height: 110,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />

                      <Popconfirm
                        title="Xoá ảnh?"
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => img._id && handleDeleteImg(img._id)}
                      >
                        <Button
                          type="primary"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            borderRadius: "50%",
                          }}
                        />
                      </Popconfirm>
                    </div>
                  </Col>
                );
              })}

            {/* Nút Upload */}
            <Col span={6}>
              <Upload
                customRequest={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <div
                  style={{
                    border: "1px dashed #aaa",
                    height: 110,
                    borderRadius: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <PlusOutlined /> Thêm ảnh
                </div>
              </Upload>
            </Col>
          </Row>
        </Form.Item>


        {/* ===================================================== */}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Giá mỗi đêm"
              name="priceHotel"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Giảm giá (%)" name="discount">
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Tiện nghi" name="amenities">
              <Select
                mode="multiple"
                options={[
                  { label: "WiFi miễn phí", value: "wifi" },
                  { label: "Bể bơi", value: "pool" },
                  { label: "Bao gồm bữa sáng", value: "breakfast" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
