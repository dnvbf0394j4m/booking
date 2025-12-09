import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  DatePicker,
  Radio,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../../api/client"; // 👈 chỉnh path cho đúng

const { TextArea } = Input;

export default function CreateEmployee({ onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ====== LOAD DANH SÁCH KHÁCH SẠN ĐỂ CHỌN ======
  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoadingHotels(true);
        // có thể reuse API list hotel đang dùng cho admin
        const res = await api.get("/api/hotels?limit=1000");
        const items = Array.isArray(res.data?.data) ? res.data.data : [];
        setHotels(items);
      } catch (err) {
        console.error("Load hotels error:", err);
        message.error("Không tải được danh sách khách sạn");
      } finally {
        setLoadingHotels(false);
      }
    };

    loadHotels();
  }, []);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      const payload = {
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        hotelId: values.hotelId, // 👈 LẤY TỪ FORM, không lấy từ user nữa
      };

      console.log("Payload create staff:", payload);

      const res = await api.post("/api/companies/admin-hotel/staff", payload);

      message.success("Thêm nhân viên thành công");
      form.resetFields();
      onSuccess && onSuccess(res.data);
    } catch (error) {
      console.error("Create staff error:", error);
      message.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Không thể tạo nhân viên"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel && onCancel();
  };

  const hotelOptions = hotels.map((h) => ({
    value: h._id,
    label: h.name,
  }));

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Row gutter={16}>
          {/* Họ và tên */}
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên!" },
                { min: 3, message: "Họ tên phải có ít nhất 3 ký tự!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên"
                size="middle"
              />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@email.com"
                size="middle"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Số điện thoại */}
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số!",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="0901234567"
                maxLength={10}
                size="middle"
              />
            </Form.Item>
          </Col>

          {/* CMND/CCCD */}
          <Col span={12}>
            <Form.Item
              label="CMND/CCCD"
              name="idCard"
              rules={[
                { required: true, message: "Vui lòng nhập CMND/CCCD!" },
                {
                  pattern: /^[0-9]{9,12}$/,
                  message: "CMND/CCCD không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="Nhập số CMND/CCCD"
                size="middle"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Ngày sinh */}
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="birthDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker
                placeholder="Chọn ngày sinh"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                size="middle"
              />
            </Form.Item>
          </Col>

          {/* Giới tính */}
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Chọn khách sạn quản lý */}
          <Col span={12}>
            <Form.Item
              label="Khách sạn quản lý"
              name="hotelId"
              rules={[
                { required: true, message: "Vui lòng chọn khách sạn quản lý!" },
              ]}
            >
              <Select
                placeholder="Chọn khách sạn"
                size="middle"
                loading={loadingHotels}
                options={hotelOptions}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>

         {/* Địa chỉ */}
          <Col span={12}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ!" },
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Nhập địa chỉ đầy đủ"
                size="middle"
              />
            </Form.Item>
          </Col>
        </Row>

        

        <Row gutter={16}>
          {/* Ghi chú */}
          <Col span={24}>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="middle"
                loading={submitting}
              >
                Thêm nhân viên
              </Button>
            </Col>
            <Col span={12}>
              <Button
                htmlType="button"
                onClick={handleCancel}
                block
                size="middle"
                disabled={submitting}
              >
                Hủy
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}
