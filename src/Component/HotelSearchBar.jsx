// src/components/HotelSearchBar.jsx
import React, { useState } from "react";
import { Row, Col, Input, DatePicker, Button, Typography, Dropdown, Space } from "antd";
import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function HotelSearchBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // đọc query param nếu có (để khi reload vẫn giữ giá trị)
  const params = new URLSearchParams(location.search);
  const [destination, setDestination] = useState(
    params.get("q") || "Hà Nội, Việt Nam"
  );

  const [dates, setDates] = useState(() => {
    const ci = params.get("check_in");
    const co = params.get("check_out");
    if (ci && co) {
      return [dayjs(ci), dayjs(co)];
    }
    return null;
  });

  const [adultNum, setAdultNum] = useState(Number(params.get("adult_num") || 2));
  const [childNum, setChildNum] = useState(Number(params.get("child_num") || 0));
  const [roomNum, setRoomNum] = useState(Number(params.get("room_num") || 1));

  const guestLabel = `${adultNum} người lớn${childNum ? `, ${childNum} trẻ em` : ""} · ${roomNum} phòng`;

  const guestMenuItems = [
    {
      key: "guest-panel",
      label: (
        <div style={{ width: 260 }}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Người lớn</Text>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button onClick={() => setAdultNum(Math.max(1, adultNum - 1))}>-</Button>
              <Text>{adultNum}</Text>
              <Button onClick={() => setAdultNum(adultNum + 1)}>+</Button>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <Text strong>Trẻ em</Text>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button onClick={() => setChildNum(Math.max(0, childNum - 1))}>-</Button>
              <Text>{childNum}</Text>
              <Button onClick={() => setChildNum(childNum + 1)}>+</Button>
            </div>
          </div>

          <div>
            <Text strong>Số phòng</Text>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <Button onClick={() => setRoomNum(Math.max(1, roomNum - 1))}>-</Button>
              <Text>{roomNum}</Text>
              <Button onClick={() => setRoomNum(roomNum + 1)}>+</Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (destination) searchParams.set("q", destination);

    if (dates && dates.length === 2) {
      searchParams.set("check_in", dates[0].format("YYYY-MM-DD"));
      searchParams.set("check_out", dates[1].format("YYYY-MM-DD"));
    }

    searchParams.set("adult_num", String(adultNum));
    searchParams.set("child_num", String(childNum));
    searchParams.set("room_num", String(roomNum));

    // điều hướng về trang danh sách (ở đây là "/")
    navigate({
      pathname: "/",
      search: `?${searchParams.toString()}`,
    });
  };

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "12px 40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 999,
          boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
          padding: "8px 12px",
        }}
      >
        <Row gutter={0} align="middle">
          {/* ĐỊA ĐIỂM */}
          <Col xs={24} md={8}>
            <div style={{ padding: "4px 12px", borderRight: "1px solid #f0f0f0" }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Địa điểm
              </Text>
              <Input
                bordered={false}
                prefix={<EnvironmentOutlined style={{ color: "#999" }} />}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Bạn muốn đi đâu?"
              />
            </div>
          </Col>

          {/* NGÀY NHẬN/TRẢ PHÒNG */}
          <Col xs={24} md={9}>
            <div style={{ padding: "4px 12px", borderRight: "1px solid #f0f0f0" }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Nhận phòng - Trả phòng
              </Text>
              <RangePicker
                bordered={false}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                value={dates}
                onChange={(values) => setDates(values)}
              />
            </div>
          </Col>

          {/* SỐ KHÁCH */}
          <Col xs={24} md={5}>
            <div style={{ padding: "4px 12px" }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Khách & Phòng
              </Text>
              <Dropdown
                menu={{ items: guestMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Space>
                    <UserOutlined style={{ color: "#999" }} />
                    <Text>{guestLabel}</Text>
                  </Space>
                </div>
              </Dropdown>
            </div>
          </Col>

          {/* NÚT TÌM */}
          <Col xs={24} md={2}>
            <div style={{ paddingLeft: 8, paddingRight: 4 }}>
              <Button
                type="primary"
                block
                size="large"
                style={{
                  borderRadius: 999,
                  background: "#ff5b00",
                  borderColor: "#ff5b00",
                }}
                onClick={handleSearch}
              >
                Tìm
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
