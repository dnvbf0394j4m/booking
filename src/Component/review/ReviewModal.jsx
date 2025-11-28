import React, { useState } from "react";
import { Modal, Form, Rate, Input, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../api/client";

const { TextArea } = Input;

export default function ReviewModal({ open, onClose, hotelId, bookingId, onSuccess }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Giả sử bạn đã có API upload ảnh, ở đây demo lấy tạm base64 => images = []
      // Thực tế: bạn nên upload từng file lên server/cloud rồi nhận về URLs.
      const images = fileList.map((f) => f.url || f.response?.url).filter(Boolean);

      const res = await api.post("/reviews", {
        bookingId,
        rating: values.rating,
        comment: values.comment || "",
        images,
      });

      message.success("Cảm ơn bạn đã đánh giá!");
      form.resetFields();
      setFileList([]);
      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      if (err?.errorFields) return; // lỗi validate
      message.error(err.response?.data?.error || "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    listType: "picture-card",
    fileList,
    onChange: ({ fileList: newList }) => setFileList(newList),
    beforeUpload: () => false, // không auto upload
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Đánh giá khách sạn"
      onOk={handleOk}
      confirmLoading={submitting}
      okText="Gửi đánh giá"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Số sao"
          name="rating"
          rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item label="Nhận xét" name="comment">
          <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
        </Form.Item>

        <Form.Item label="Ảnh thực tế (tuỳ chọn)">
          <Upload {...uploadProps}>
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Thêm ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
