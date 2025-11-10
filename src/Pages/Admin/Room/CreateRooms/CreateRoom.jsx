import { Form, Input, InputNumber, Button, Upload, Col, Row, Select, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ButtonSubmit from "../../../../Component/ButtonSubmit";
import "../CreateRooms/index.css"

export default function CreateRoom() {
  const [form] = Form.useForm();
  const { id } = useParams(); // lấy hotelId từ URL
  const navigate = useNavigate();

  const [fileList, setFileList] = useState([]);





  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", values.price);
      formData.append("max_guests", values.max_guests || 1);
      formData.append("beds", values.beds || "");
      formData.append("size_sqm", values.size_sqm);
      formData.append("hotelId", id);

      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });

      const response = await fetch("http://localhost:8082/api/rooms", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // tạo room thành công -> quay về danh sách room
        navigate(`/Admin/Hotel/${id}/rooms`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };


  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


      return (
      <>
        <Button type="primary" onClick={showModal}>
          + Thêm phòng mới
        </Button>

        <Modal
          title={`🛏️ Thêm phòng cho Khách sạn #${id}`}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={750}
          centered
        >
          <div className="room-form-container">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={24}>
                <Col span={11} className="innerleft">
                  <Form.Item
                    name="name"
                    label="Tên phòng"
                    rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
                  >
                    <Input placeholder="VD: Phòng Deluxe đôi" autoComplete="off" />
                  </Form.Item>

                  <Form.Item name="beds" label="Loại giường">
                    <Input placeholder="VD: 2 giường đôi" />
                  </Form.Item>

                  <Form.Item name="service" label="Tiện ích phòng">
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Chọn tiện ích"
                      options={options}
                    />
                  </Form.Item>

                  <Form.Item name="max_guests" label="Số khách tối đa">
                    <InputNumber min={1} max={20} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item label="Hình ảnh">
                    <Upload
                      listType="picture-card"
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={({ fileList }) => setFileList(fileList)}
                    >
                      {fileList.length < 5 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={11} className="innerRight">
                  <Form.Item
                    name="price"
                    label="Giá (VND)"
                    rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      step={100000}
                      formatter={(val) =>
                        `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>

                  <Form.Item name="size_sqm" label="Diện tích (m²)">
                    <InputNumber min={5} max={200} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item name="view" label="Cảnh (nếu có)">
                    <Input placeholder="VD: Hướng biển, thành phố, hồ bơi..." />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Button type="primary" htmlType="submit" size="large">
                  Thêm phòng
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </>
      );


    
}
