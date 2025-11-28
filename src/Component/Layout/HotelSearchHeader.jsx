// src/components/layout/HotelSearchHeader.jsx
import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Popover,
  DatePicker,
  InputNumber,
} from "antd";
import {
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function HotelSearchHeader({ onSearch }) {
  const [destination, setDestination] = useState("Hà Nội, Việt Nam");
  const [keyword, setKeyword] = useState("");

  // ngày
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateText, setDateText] = useState("Chọn ngày");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  // khách & phòng
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestText, setGuestText] = useState("2 Người lớn, 1 Phòng");
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  // xử lý thay đổi ngày
  const handleDateChange = (values) => {
    setDateRange(values || [null, null]);

    if (values && values[0] && values[1]) {
      const text = `${values[0].format("DD/MM")} - ${values[1].format(
        "DD/MM"
      )}`;
      setDateText(text);
    } else {
      setDateText("Chọn ngày");
    }
  };

  // xử lý text khách/phòng
  const updateGuestText = (a, c, r) => {
    const adultText = `${a} Người lớn`;
    const childText = c > 0 ? `, ${c} Trẻ em` : "";
    const roomText = `, ${r} Phòng`;
    setGuestText(adultText + childText + roomText);
  };

  const handleGuestChange = (field, value) => {
    if (field === "adults") {
      const v = value || 0;
      setAdults(v);
      updateGuestText(v, children, rooms);
    } else if (field === "children") {
      const v = value || 0;
      setChildren(v);
      updateGuestText(adults, v, rooms);
    } else if (field === "rooms") {
      const v = value || 1;
      setRooms(v);
      updateGuestText(adults, children, v);
    }
  };

  const handleSearchClick = () => {
    const [start, end] = dateRange;
    const filters = {
      destination,
      keyword,
      checkIn: start ? start.format("YYYY-MM-DD") : "",
      checkOut: end ? end.format("YYYY-MM-DD") : "",
      adultNum: adults,
      childNum: children,
      roomNum: rooms,
    };
    if (onSearch) onSearch(filters);
  };

  return (
    <div
      style={{
        background: "#1f2470",
        padding: "14px 0 18px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        <Row gutter={12} align="middle">
          {/* Địa điểm */}
          <Col xs={24} md={8}>
            <div
              style={{
                background: "#f7f7f7",
                borderRadius: 999,
                padding: "2px 18px",
                height: 48,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Hà Nội, Việt Nam"
                bordered={false}
                style={{
                  background: "transparent",
                  boxShadow: "none",
                }}
              />
            </div>
          </Col>

          {/* Chọn ngày */}
          <Col xs={24} md={7}>
            <Popover
              trigger="click"
              open={datePopoverOpen}
              onOpenChange={setDatePopoverOpen}
              placement="bottom"
              content={
                <RangePicker
                  value={dateRange}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  placeholder={["Nhận phòng", "Trả phòng"]}
                  allowClear
                />
              }
            >
              <div
                style={{
                  background: "#f7f7f7",
                  borderRadius: 999,
                  padding: "0 24px",
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#222",
                  cursor: "pointer",
                }}
              >
                {dateText}
              </div>
            </Popover>
          </Col>

          {/* Khách & phòng */}
          <Col xs={24} md={7}>
            <Popover
              trigger="click"
              open={guestPopoverOpen}
              onOpenChange={setGuestPopoverOpen}
              placement="bottom"
              content={
                <div style={{ minWidth: 260 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>Người lớn</span>
                    <InputNumber
                      min={1}
                      max={10}
                      value={adults}
                      onChange={(v) => handleGuestChange("adults", v)}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span>Trẻ em</span>
                    <InputNumber
                      min={0}
                      max={10}
                      value={children}
                      onChange={(v) => handleGuestChange("children", v)}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <span>Phòng</span>
                    <InputNumber
                      min={1}
                      max={10}
                      value={rooms}
                      onChange={(v) => handleGuestChange("rooms", v)}
                    />
                  </div>

                  <Button
                    type="primary"
                    block
                    onClick={() => setGuestPopoverOpen(false)}
                  >
                    Xong
                  </Button>
                </div>
              }
            >
              <div
                style={{
                  background: "#f7f7f7",
                  borderRadius: 999,
                  padding: "0 24px",
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#222",
                  cursor: "pointer",
                }}
              >
                {guestText}
              </div>
            </Popover>
          </Col>

          {/* Nút tìm kiếm */}
          <Col xs={24} md={2}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              block
              onClick={handleSearchClick}
              style={{
                height: 48,
                borderRadius: 999,
                background: "#ff5b00",
                borderColor: "#ff5b00",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width:"200px"
              }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
