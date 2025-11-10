// import { Button, Checkbox, Form, Input } from 'antd';

// const onFinish = values => {
//     console.log('Success:', values);
// };
// const onFinishFailed = errorInfo => {
//     console.log('Failed:', errorInfo);
// };


// export default function CreateHotel() {
//     return (
//         <>
//             <Form
//                 name="basic"
               
//                 labelCol={{ span: 3 }}     // label chiếm 6 cột
//   wrapperCol={{ span: 7 }}  // input chiếm 18 cột
//                 style={{ maxWidth: '100%'}}
//                 initialValues={{ remember: true }}
//                 onFinish={onFinish}
//                 onFinishFailed={onFinishFailed}
//                 autoComplete="off"
                
//             >
//                 <Form.Item
//                     label="nhap ten khach san: "
//                     name="name"
//                     rules={[{ required: true, message: 'Please input your username!' }]}
                    
//                 >
//                     <Input />
//                 </Form.Item>

//                   <Form.Item
//                     label="mo ta: : "
//                     name="description"
//                     rules={[{ message: 'Please input your description!' }]}
                    
//                 >
//                     <Input.TextArea />
//                 </Form.Item>

//                   <Form.Item
//                     label="nhap gia: "
//                     name="price"
//                     rules={[{ required: true, message: 'Please input your price!' }]}
                    
//                 >
//                     <Input />
//                 </Form.Item>

//                   <Form.Item
//                     label="nhap giam gia: "
//                     name="discount"
//                     rules={[{ required: true, message: 'Please input your discount!' }]}
                    
//                 >
//                     <Input />
//                 </Form.Item>

             

//                 <Form.Item name="remember" valuePropName="checked" label={null}>
//                     <Checkbox>Remember me</Checkbox>
//                 </Form.Item>

//                 <Form.Item label={null}>
//                     <Button type="primary" htmlType="submit">
//                         Submit
//                     </Button>
//                 </Form.Item>
//             </Form>

//         </>
//     )
// }






import { useEffect, useRef, useState } from "react";

export default function CreateHotel() {
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: 21.0285, lng: 105.8542 }); // Hà Nội mặc định

  useEffect(() => {
    const initMap = async () => {
      // Import Google Maps library
      const { Map } = await google.maps.importLibrary("maps");
      const { Autocomplete } = await google.maps.importLibrary("places");

      // Khởi tạo bản đồ
      const mapInstance = new Map(mapRef.current, {
        center: coords,
        zoom: 13,
      });
      setMap(mapInstance);

      // Khởi tạo Autocomplete
      if (inputRef.current) {
        const autocomplete = new Autocomplete(inputRef.current, {
          // không fix cứng types để Google trả về cả địa chỉ lẫn tòa nhà
          fields: ["name", "formatted_address", "geometry", "address_components"],
        });

        // Khi người dùng chọn một địa điểm
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          const location = place.geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          setCoords({ lat, lng });
          setAddress(place.formatted_address);

          console.log("Tên:", place.name);
          console.log("Địa chỉ:", place.formatted_address);
          console.log("Chi tiết:", place.address_components);
          console.log("Tọa độ:", { lat, lng });

          // Zoom map tới vị trí chính xác
          mapInstance.setCenter({ lat, lng });
          mapInstance.setZoom(18);

          // Đặt marker
          if (marker) {
            marker.setPosition({ lat, lng });
          } else {
            const newMarker = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              title: place.name || place.formatted_address,
            });
            setMarker(newMarker);
          }
        });
      }
    };

    initMap();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hotelData = {
      name: hotelName,
      address: address,
      latitude: coords.lat,
      longitude: coords.lng,
    };

    console.log("Hotel data gửi về backend:", hotelData);

    // Ví dụ gọi API Spring Boot
    // await fetch("http://localhost:8080/api/hotels", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(hotelData),
    // });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Tạo khách sạn</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên khách sạn: </label>
          <input
            type="text"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Địa chỉ / Tòa nhà: </label>
          <input
            ref={inputRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ cụ thể hoặc tên tòa nhà..."
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        {/* Hiển thị tọa độ cho dễ debug */}
        <div style={{ marginBottom: "10px", fontSize: "14px", color: "gray" }}>
          <strong>Tọa độ:</strong> {coords.lat}, {coords.lng}
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Lưu khách sạn
        </button>
      </form>

      {/* Google Map */}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", marginTop: "20px" }}
      />
    </div>
  );
}
