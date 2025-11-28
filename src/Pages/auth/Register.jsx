import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (values.password !== values.confirmPassword)
        return message.error("Mật khẩu không trùng nhau");

      const { confirmPassword, ...payload } = values;

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      message.success("Đăng ký thành công!");
      navigate("/login");
    } catch (e) {
      message.error(e.message || "Đăng ký thất bại");
      alert("thoong tin khong hop le!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 16,
      }}
    >
      <Card style={{ width: 420, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center" }}>Đăng ký</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input size="large" />
          </Form.Item>


          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item name="confirmPassword" label="Nhập lại mật khẩu" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Đăng ký
          </Button>

          <Button type="link" block onClick={() => navigate("/login")} style={{ marginTop: 8 }}>
            Đã có tài khoản? Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
