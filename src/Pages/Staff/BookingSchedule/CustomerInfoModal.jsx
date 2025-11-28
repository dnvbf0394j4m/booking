import React, { useState } from "react";
import { Modal, Input, Form, InputNumber, Button, Space, message } from "antd";

export default function CustomerInfoModal({ open, onCancel, onSubmit, initialData }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // onSubmit do parent truyền vào (sẽ gọi API)
      await onSubmit(values);
      form.resetFields();
    } catch (e) {
      console.error(e);
      message.error(e.message || "Lỗi tạo booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thông tin khách hàng"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Họ tên khách"
          rules={[{ required: true, message: "Vui lòng nhập tên khách" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="09xx..." />
        </Form.Item>

        <Form.Item name="citizenId" label="CCCD / Passport">
          <Input placeholder="0792..." />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} placeholder="Ghi chú cho lễ tân" />
        </Form.Item>

        <Form.Item name="deposit" label="Khách thanh toán trước">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="0"
            formatter={(v) =>
              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
          />
        </Form.Item>

        <Space style={{ float: "right" }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Nhận phòng / Đặt trước
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
