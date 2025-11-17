import HeaderSimple from "./HeaderSimple";
import { Outlet } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import HotelSearchBar from "./HotelSearchBar";

const { Content } = AntLayout;

export default function LayoutUser() {
  return (
    <AntLayout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <HeaderSimple />
       
      <Content style={{ padding: "24px 0" }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
}
