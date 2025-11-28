// import React, { useEffect, useState } from "react";
// import {
//   Layout,
//   Typography,
//   Table,
//   Tag,
//   Button,
//   Space,
//   Modal,
//   Form,
//   Rate,
//   Input,
//   message,
// } from "antd";
// import dayjs from "dayjs";
// import api from "../../api/client";

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { TextArea } = Input;

// export default function MyBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [reviewModalOpen, setReviewModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [form] = Form.useForm();


//   const loadBookings = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/bookings/my");
//       console.log("Bookings data:", res);
//       setBookings(
//         res.data.map((b) => ({
//           ...b,
//           key: b._id,
//         }))
//       );
//     } catch (err) {
//       console.error(err);
//       message.error("Không tải được danh sách đơn đặt phòng");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const openReviewModal = (booking) => {
//     setSelectedBooking(booking);
//     form.resetFields();
//     setReviewModalOpen(true);
//   };

//   const handleSubmitReview = async () => {
//     try {
//       const values = await form.validateFields();
//       if (!selectedBooking) return;

//       setSubmitting(true);

//       const hotelId =
//         selectedBooking.hotel._id || selectedBooking.hotel; // tùy populate

//       await api.post(`/api/hotels/${hotelId}/reviews`, {
//         rating: values.rating,
//         comment: values.comment,
//         bookingId: selectedBooking._id,
//       });

//       message.success("Gửi đánh giá thành công!");
//       setReviewModalOpen(false);
//       setSelectedBooking(null);
//       loadBookings();
//     } catch (err) {
//       if (err?.errorFields) return; // lỗi validate form
//       console.error(err);
//       const msg =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         "Gửi đánh giá thất bại";
//       message.error(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderStatusTag = (status) => {
//     let color = "default";
//     let label = status;

//     switch (status) {
//       case "PENDING":
//         color = "gold";
//         label = "Chờ xử lý";
//         break;
//       case "PARTIAL":
//         color = "cyan";
//         label = "Thanh toán một phần";
//         break;
//       case "PAID":
//         color = "blue";
//         label = "Đã thanh toán";
//         break;
//       case "CHECKED_IN":
//         color = "green";
//         label = "Đang ở";
//         break;
//       case "CHECKED_OUT":
//         color = "purple";
//         label = "Đã trả phòng";
//         break;
//       case "CANCELLED":
//         color = "red";
//         label = "Đã hủy";
//         break;
//       default:
//         break;
//     }

//     return <Tag color={color}>{label}</Tag>;
//   };

//   const columns = [
//     {
//       title: "Khách sạn",
//       dataIndex: ["hotel", "name"],
//       key: "hotel",
//       render: (_, record) => {
//         const hotel = record.hotel || {};
//         return (
//           <div>
//             <Text strong>{hotel.name}</Text>
//             <br />
//             <Text type="secondary" style={{ fontSize: 12 }}>
//               {hotel.address}
//             </Text>
//           </div>
//         );
//       },
//     },
//     {
//       title: "Ngày nhận / trả phòng",
//       key: "dates",
//       render: (_, record) => (
//         <div>
//           <Text>
//             {dayjs(record.start_day).format("DD/MM/YYYY")} -{" "}
//             {dayjs(record.end_day).format("DD/MM/YYYY")}
//           </Text>
//         </div>
//       ),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => renderStatusTag(status),
//     },
//     {
//       title: "Đánh giá",
//       key: "review",
//       render: (_, record) => {
//         const canReview =
//           record.status === "CHECKED_OUT" && !record.reviewed;

//         if (!canReview) {
//           return record.status === "CHECKED_OUT" && record.reviewed ? (
//             <Tag color="green">Đã đánh giá</Tag>
//           ) : (
//             <Text type="secondary">-</Text>
//           );
//         }

//         return (
//           <Button
//             type="primary"
//             size="small"
//             onClick={() => openReviewModal(record)}
//           >
//             Đánh giá
//           </Button>
//         );
//       },
//     },
//   ];

//   return (
//     <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
//       <Content style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
//         <Title level={3} style={{ marginBottom: 16 }}>
//           Đơn đặt phòng của tôi
//         </Title>
//         <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
//           Xem lịch sử đặt phòng và để lại đánh giá cho những khách sạn bạn đã lưu trú.
//         </Text>

//         <Table
//           columns={columns}
//           dataSource={bookings}
//           loading={loading}
//           pagination={{ pageSize: 5 }}
//         />

//         <Modal
//           title={
//             selectedBooking?.hotel?.name
//               ? `Đánh giá: ${selectedBooking.hotel.name}`
//               : "Đánh giá khách sạn"
//           }
//           open={reviewModalOpen}
//           onCancel={() => {
//             setReviewModalOpen(false);
//             setSelectedBooking(null);
//           }}
//           onOk={handleSubmitReview}
//           confirmLoading={submitting}
//           okText="Gửi đánh giá"
//           cancelText="Hủy"
//         >
//           {selectedBooking && (
//             <Space direction="vertical" style={{ width: "100%" }}>
//               <Text>
//                 Lưu trú từ{" "}
//                 {dayjs(selectedBooking.start_day).format("DD/MM/YYYY")} đến{" "}
//                 {dayjs(selectedBooking.end_day).format("DD/MM/YYYY")}
//               </Text>

//               <Form layout="vertical" form={form}>
//                 <Form.Item
//                   label="Điểm đánh giá"
//                   name="rating"
//                   rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
//                 >
//                   <Rate />
//                 </Form.Item>

//                 <Form.Item
//                   label="Nhận xét"
//                   name="comment"
//                   rules={[
//                     { required: true, message: "Vui lòng nhập nhận xét" },
//                     { min: 10, message: "Nhận xét tối thiểu 10 ký tự" },
//                   ]}
//                 >
//                   <TextArea rows={4} placeholder="Cảm nhận của bạn về khách sạn..." />
//                 </Form.Item>
//               </Form>
//             </Space>
//           )}
//         </Modal>
//       </Content>
//     </Layout>
//   );
// }





import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Rate,
  Input,
  message,
} from "antd";
import dayjs from "dayjs";
import api from "../../api/client";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const calcNights = (start, end) => {
  const s = dayjs(start);
  const e = dayjs(end);
  const diff = e.diff(s, "day");
  return diff > 0 ? diff : 1;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings/my");
      console.log("Bookings data:", res);

      const data = res.data || [];
      setBookings(
        data.map((b) => ({
          ...b,
          key: b._id,
        }))
      );
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách đơn đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    form.resetFields();
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedBooking) return;

      setSubmitting(true);

      const hotelId =
        selectedBooking.hotel?._id || selectedBooking.hotel; // tùy populate



      await api.post("/api/reviews", {
        bookingId: selectedBooking._id,
        rating: values.rating,
        comment: values.comment,
      });







      message.success("Gửi đánh giá thành công!");
      setReviewModalOpen(false);
      setSelectedBooking(null);
      loadBookings();
    } catch (err) {
      if (err?.errorFields) return;
      console.error(err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Gửi đánh giá thất bại";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusTag = (status) => {
    let color = "default";
    let label = status;

    switch (status) {
      case "PENDING":
        color = "gold";
        label = "Chờ xử lý";
        break;
      case "PARTIAL":
        color = "cyan";
        label = "Thanh toán một phần";
        break;
      case "PAID":
        color = "blue";
        label = "Đã thanh toán";
        break;
      case "CHECKED_IN":
        color = "green";
        label = "Đang ở";
        break;
      case "CHECKED_OUT":
        color = "purple";
        label = "Đã trả phòng";
        break;
      case "CANCELLED":
        color = "red";
        label = "Đã hủy";
        break;
      default:
        break;
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: "Khách sạn / Phòng",
      key: "hotelRooms",
      render: (_, record) => {
        const hotel = record.hotel || {};
        const rooms = record.rooms || [];

        return (
          <div>
            <Text strong style={{ fontSize: 14 }}>
              {hotel.name || "Khách sạn không xác định"}
            </Text>
            <br />
            {hotel.address && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {hotel.address}
              </Text>
            )}
            {rooms.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {rooms.map((r, idx) => (
                  <div key={idx}>
                    <Text style={{ fontSize: 13 }}>
                      Phòng:{" "}
                      <strong>
                        {r.room?.name ||
                          r.room?.roomNumber ||
                          "—"}
                      </strong>
                      {r.room?.type && (
                        <Tag style={{ marginLeft: 6 }}>
                          {r.room.type}
                        </Tag>
                      )}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Giá/đêm: {formatMoney(r.price)}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày nhận / trả phòng",
      key: "dates",
      render: (_, record) => (
        <div>
          <Text>
            {dayjs(record.start_day).format("DD/MM/YYYY")} -{" "}
            {dayjs(record.end_day).format("DD/MM/YYYY")}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Số đêm: {calcNights(record.start_day, record.end_day)}
          </Text>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <Text strong>{formatMoney(amount)}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Đánh giá",
      key: "review",
      render: (_, record) => {
        const canReview =
          record.status === "CHECKED_OUT" && !record.reviewed;


        if (record.status === "CHECKED_OUT" && record.reviewed==false) {
          return (
            <Tag color="green" style={{ fontWeight: 600 }}>
              ✓ Đã đánh giá
            </Tag>
          );
        }

        if (!canReview) {
          return <Text type="secondary">-</Text>;
        }

        return (
          <Button
            type="primary"
            size="small"
            onClick={() => openReviewModal(record)}
          >
            Đánh giá
          </Button>
        );
      },
    },

  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content
        style={{
          maxWidth: 1000,
          margin: "24px auto",
          padding: "0 16px",
        }}
      >
        <Title level={3} style={{ marginBottom: 8 }}>
          Đơn đặt phòng của tôi
        </Title>
        <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
          Xem lịch sử đặt phòng, thông tin phòng và để lại đánh giá cho những
          khách sạn bạn đã lưu trú.
        </Text>

        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          pagination={{ pageSize: 5 }}
          bordered
        />

        <Modal
          title={
            selectedBooking?.hotel?.name
              ? `Đánh giá: ${selectedBooking.hotel.name}`
              : "Đánh giá khách sạn"
          }
          open={reviewModalOpen}
          onCancel={() => {
            setReviewModalOpen(false);
            setSelectedBooking(null);
          }}
          onOk={handleSubmitReview}
          confirmLoading={submitting}
          okText="Gửi đánh giá"
          cancelText="Hủy"
        >
          {selectedBooking && (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>
                Lưu trú từ{" "}
                {dayjs(selectedBooking.start_day).format("DD/MM/YYYY")} đến{" "}
                {dayjs(selectedBooking.end_day).format("DD/MM/YYYY")}
              </Text>

              {Array.isArray(selectedBooking.rooms) &&
                selectedBooking.rooms.length > 0 && (
                  <div>
                    <Text type="secondary">Các phòng:</Text>
                    {selectedBooking.rooms.map((r, idx) => (
                      <div key={idx}>
                        <Text>
                          •{" "}
                          {r.room?.name ||
                            r.room?.roomNumber ||
                            "—"}{" "}
                          ({formatMoney(r.price)}/đêm)
                        </Text>
                      </div>
                    ))}
                  </div>
                )}

              <Form layout="vertical" form={form}>
                <Form.Item
                  label="Điểm đánh giá"
                  name="rating"
                  rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
                >
                  <Rate />
                </Form.Item>

                <Form.Item
                  label="Nhận xét"
                  name="comment"
                  rules={[
                    { required: true, message: "Vui lòng nhập nhận xét" },
                    { min: 10, message: "Nhận xét tối thiểu 10 ký tự" },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Cảm nhận của bạn về khách sạn và các phòng..."
                  />
                </Form.Item>
              </Form>
            </Space>
          )}
        </Modal>
      </Content>
    </Layout>
  );
}
