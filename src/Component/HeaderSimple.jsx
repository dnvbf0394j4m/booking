import React from "react";
import { Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function HeaderSimple() {
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  // 🔐 Parse authUser an toàn
  let user = null;
  const rawUser = localStorage.getItem("authUser");

  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch (err) {
      console.warn("Lỗi parse authUser từ localStorage:", err);
      user = null;
      // Optional: dọn luôn localStorage nếu bị sai
      localStorage.removeItem("authUser");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        height: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        background: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      {/* LOGO BÊN TRÁI */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#ff5b00",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        MyBooking
      </div>

      {/* BUTTON BÊN PHẢI */}
      <Space>
        {!token ? (
          <>
            <Button type="link" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
            <Button
              type="primary"
              onClick={() => navigate("/register")}
              style={{ background: "#ff5b00", borderColor: "#ff5b00" }}
            >
              Đăng ký
            </Button>
          </>
        ) : (
          <>
            <Text strong>Xin chào, {user?.name || "Khách"}</Text>
            <Button danger onClick={handleLogout}>
              Đăng xuất
            </Button>
          </>
        )}
      </Space>
    </div>
  );
}
