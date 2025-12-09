// src/components/Layout/AppLayout.jsx (ví dụ)
import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Avatar, Space } from "antd";
import logo from "../../Images/logo.svg";
import logo_mini from "../../Images/logo-mini.svg";
import "../Layout/lauout.css";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

// Nên đặt chữ cái đầu viết hoa
const AppLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const path = location.pathname;


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
    localStorage.removeItem("hotelId");
    navigate("/");
    window.location.reload();
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = Layout.useToken
      ? Layout.useToken()
      : // nếu bạn đang dùng theme.useToken như cũ thì giữ nguyên
      { token: { colorBgContainer: "#fff", borderRadiusLG: 8 } };


  console.log("Current user in AppLayout:", user);

  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <div style={{ minWidth: 180 }}>
          <div style={{ fontWeight: 600 }}>{user?.name || "Tài khoản"}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {user?.email || ""}
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout
      style={{ minHeight: "100vh", width: "100%", minWidth: "100vw", margin: 0 }}
    >
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <div className="header">
          <div className={collapsed ? "header_logo_mini" : "header_logo"}>
            <img
              src={collapsed ? logo_mini : logo}
              alt="Logo"
              style={{ height: 40, width: "100px" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flex: 1,
              paddingLeft: 20,
              paddingRight: 40,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="head_right" style={{ display: "flex",alignItems:"center", gap: 16 }}>
              <div>
                <NotificationBell
                  onOpenBooking={(bookingId) => {
                    console.log("Open booking detail:", bookingId);
                  }}
                />
              </div>

              {/* PROFILE DROPDOWN */}
              <Dropdown
                menu={{ items: profileMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button type="text">
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span style={{ maxWidth: 160 }} className="text-ellipsis">
                      {user?.name || user?.email || "Đăng nhập"}
                    </span>
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>

      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} width={240}>
          <div className="demo-logo-vertical" />

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[path]}
            items={[
              {
                key: "/Admin",
                icon: <UserOutlined />,
                label: <NavLink to="/Admin">Tổng quát</NavLink>,
              },
              {
                key: "/Admin/Hotel",
                icon: <VideoCameraOutlined />,
                label: <NavLink to="/Admin/Hotel">Quản lý phòng</NavLink>,
              },
              {
                key: "/Admin/employee",
                icon: <UploadOutlined />,
                label: <NavLink to="/Admin/employee">Nhân viên</NavLink>,
              },
              {
                key: "/Admin/booking",
                icon: <UploadOutlined />,
                label: <NavLink to="/Admin/booking">Đặt phòng</NavLink>,
              },
            ]}
          />
        </Sider>

        <Content
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
