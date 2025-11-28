import React from "react";
import { Result, Button } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentFail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const reason = params.get("reason") || "Thanh toán không thành công";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", paddingTop: 40 }}>
      <Result
        status="error"
        title="Thanh toán thất bại!"
        subTitle={reason}
        extra={[
          <Button type="primary" key="retry" onClick={() => navigate(-1)}>
            Thử lại
          </Button>,
          <Button key="home" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        ]}
      />
    </div>
  );
}
