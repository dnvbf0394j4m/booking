import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Typography, DatePicker, Space, Button } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export default function EditBookingModal({
  open,
  onCancel,
  booking,
  onSubmit,
  loading = false,
}) {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (booking) {
      const start = booking.startDay || booking.start_day;
      const end = booking.endDay || booking.end_day;
      setDates(start && end ? [dayjs(start), dayjs(end)] : []);
    } else {
      setDates([]);
    }
  }, [booking]);

  const handleOk = async () => {
    if (!dates || dates.length !== 2) return;

    const [start, end] = dates;
    if (!start || !end) return;

    const body = {
      start_day: start.toDate(),
      end_day: end.toDate(),
      recalcAmount: true, // cho BE tự tính lại tiền
    };

    if (onSubmit) {
      await onSubmit(body);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Sửa đặt phòng"
      onOk={handleOk}
      okText="Lưu thay đổi"
      confirmLoading={loading}
      destroyOnClose
    >
      {booking ? (
        <>
          <Row style={{ marginBottom: 12 }}>
            <Col span={24}>
              <Text type="secondary">Phòng</Text>
              <div style={{ fontWeight: 500 }}>
                {booking.roomName ||
                  booking.rooms?.[0]?.room?.name ||
                  "Phòng đã đặt"}
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Text type="secondary">Nhận phòng / Trả phòng</Text>
              <div style={{ marginTop: 8 }}>
                <RangePicker
                  showTime={{ format: "HH:mm" }}
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: "100%" }}
                  value={dates}
                  onChange={(vals) => setDates(vals || [])}
                />
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <div>Không có dữ liệu booking.</div>
      )}
    </Modal>
  );
}
