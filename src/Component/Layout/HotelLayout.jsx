// src/layouts/HotelLayout.jsx
import React from "react";
import { Layout } from "antd";
import HotelSearchHeader from "./HotelSearchHeader";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

export default function HotelLayout({ children, onSearch }) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header
        style={{
          background: "#ffffff",
          padding: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <HotelSearchHeader onSearch={onSearch} />
      </Header>

      <Content style={{ padding: "24px 40px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
