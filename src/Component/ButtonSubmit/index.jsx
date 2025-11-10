import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ButtonSubmit(){
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

    return <>
        <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                style={{
                  borderRadius: 8,
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
                }}
                onClick={showModal}
              >
                
                Thêm khách sạn
              </Button>
    </>
}