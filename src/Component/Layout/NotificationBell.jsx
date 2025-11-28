// src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import {
  Badge,
  Popover,
  List,
  Typography,
  Tag,
  Spin,
  Button,
  message,
} from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../api/client"; // chỉnh lại đường dẫn nếu cần

const { Text } = Typography;

export default function NotificationBell({ onOpenBooking }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleClickNotification = async (noti) => {
    try {
      if (!noti.read) {
        await api.patch(`/api/notifications/${noti._id}/read`);
        setItems((prev) =>
          prev.map((x) =>
            x._id === noti._id ? { ...x, read: true } : x
          )
        );
      }

      if (onOpenBooking && noti.booking?._id) {
        onOpenBooking(noti.booking._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const content = (
    <div style={{ width: 320, maxHeight: 400, overflowY: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text strong>Thông báo</Text>
        <Button type="link" size="small" onClick={loadNotifications}>
          Tải lại
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : items.length === 0 ? (
        <Text type="secondary">Chưa có thông báo nào</Text>
      ) : (
        <List
          size="small"
          dataSource={items}
          renderItem={(n) => (
            <List.Item
              style={{
                cursor: "pointer",
                background: n.read ? "#fff" : "#e6f7ff",
                borderRadius: 4,
                marginBottom: 4,
                padding: 8,
              }}
              onClick={() => handleClickNotification(n)}
            >
              <div style={{ width: "100%" }}>
                <div style={{ marginBottom: 4 }}>
                  <Tag color="blue">Đặt phòng mới</Tag>
                  {!n.read && (
                    <Tag color="red" style={{ marginLeft: 4 }}>
                      Mới
                    </Tag>
                  )}
                </div>

                <Text>{n.message}</Text>

                {n.booking && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Mã đơn: {n.booking.orderCode} |{" "}
                      {dayjs(n.booking.start_day).format("DD/MM")} -{" "}
                      {dayjs(n.booking.end_day).format("DD/MM")}
                    </Text>
                  </div>
                )}

                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {dayjs(n.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <Badge count={unreadCount} size="small" overflowCount={99}>
        <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
      </Badge>
    </Popover>
  );
}
