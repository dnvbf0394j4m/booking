// pages/HotelDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, Avatar, Row, Col, Typography, Tag, Table, Spin, Button , Image } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import ButtonSubmit from "../../../Component/ButtonSubmit";
import CreateRoom from "../Room/CreateRooms/CreateRoom";



const { Title, Text } = Typography;

export default function HotelDetail() {
  
  const { id } = useParams(); // id = hotelId
  const location = useLocation();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // nếu đã có hotel từ state thì không fetch, ngược lại fetch từ backend
    if (!hotel) {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      fetch(`http://localhost:8082/identity/api/hotel/DetailHotel/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          // điều chỉnh theo cấu trúc API của bạn
          if (data && data.code === 0) {
            // có thể data.result hoặc data.result.content
            setHotel(data.result || data);
          } else {
            // xử lý lỗi
            console.error("Fetch hotel error", data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const rooms = hotel?.room || [];

 const roomColumns = [
  {
    title: "Mã phòng",
    dataIndex: "room_id",
    key: "room_id",
    render: (id) => <Text strong>#{id}</Text>,
  },
  {
    title: "Tên phòng",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Số khách tối đa",
    dataIndex: "max_guests",
    key: "max_guests",
    align: "center",
  },
  {
    title: "Số giường",
    dataIndex: "beds",
    key: "beds",
    align: "center",
  },
  {
    title: "Diện tích (m²)",
    dataIndex: "size_sqm",
    key: "size_sqm",
    align: "right",
    render: (s) => <Text>{s} m²</Text>,
  },
  {
    title: "Hình ảnh",
    dataIndex: "roomImages",
    key: "roomImages",
    render: (images) =>
      images && images.length > 0 ? (
        <Image
          src={images[0].url || images[0]} // nếu API trả về object hoặc string đều được
          alt="room"
          width={80}
        />
      ) : (
        <Text type="secondary">Không có ảnh</Text>
      ),
  },
  {
    title: "Trạng thái",
    dataIndex: "deleteRoom",
    key: "deleteRoom",
    render: (deleted) =>
      deleted ? (
        <Text type="danger">Đã xoá</Text>
      ) : (
        <Text type="success">Hoạt động</Text>
      ),
  },
];

  if (loading) return <Spin />;

  if (!hotel) return <div>Không tìm thấy thông tin khách sạn.</div>;

  return (
    <div style={{ padding: 20 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>

      <Card style={{ marginTop: 12 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Avatar src={`http://localhost:8082/identity${hotel.avarta}`} size={120} shape="square" />
          </Col>
          <Col span={18}>
            <Title level={3}>{hotel.name}</Title>
            <div style={{ marginBottom: 8 }}>
              <EnvironmentOutlined /> <Text>{hotel.address}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <StarFilled /> <Text>{hotel.rating}/5.0</Text>
            </div>
            {hotel.city && <Tag>{hotel.city.name || hotel.city}</Tag>}
          </Col>
        </Row>
        <div>
    
          <CreateRoom/>
          

        </div>
        

        <div style={{ marginTop: 18 }}>
          <Title level={5}>Danh sách phòng</Title>
          <Table
            columns={roomColumns}
            dataSource={rooms}
            rowKey={"room_id"}
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
