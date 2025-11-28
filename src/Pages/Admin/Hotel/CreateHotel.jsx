// import {
//   Button, Col, Form, Input, Row, Upload, Tabs, TimePicker, Switch, Space,
//   Select,
//   Modal,
//   Image
// } from "antd";
// import { useEffect, useRef, useState } from "react";
// import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import UploadImages from "../../../Component/UploadImages";

// export default function CreateHotel() {
//   const [form] = Form.useForm();
//   const inputRef = useRef(null);
//   const mapRef = useRef(null);
//   const [marker, setMarker] = useState(null);
//   const [coords, setCoords] = useState({ lat: 21.0285, lng: 105.8542 });
//   const [area, setArea] = useState([])
//   const [city, setCity] = useState([])
//   const [activeTab, setActiveTab] = useState("1");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fileList, setFileList] = useState([]);



//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');

//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleOk = () => {
//     setIsModalOpen(false);
//   };
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };


//   const token = localStorage.getItem("authToken");


//   useEffect(() => {
//     const initMap = async () => {
//       const { Map } = await google.maps.importLibrary("maps");
//       const { Autocomplete } = await google.maps.importLibrary("places");

//       fetch("http://localhost:8082/identity/api/area", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, // thêm token vào header
//         },

//       })
//         .then(res => res.json())
//         .then(data => {
//           if (data.code === 0 && Array.isArray(data.result)) {
//             console.log(data.result)
//             setArea(data.result);
//           }
//         }
//         )

//       fetch("http://localhost:8082/identity/api/city", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, // thêm token vào header
//         },

//       })
//         .then(res => res.json())
//         .then(data => {
//           if (data.code === 0 && Array.isArray(data.result)) {
//             console.log(data.result)
//             setCity(data.result);
//           }
//         }
//         )

//       const mapInstance = new Map(mapRef.current, {
//         center: coords,
//         zoom: 13,
//       });

//       if (inputRef.current) {
//         const autocomplete = new Autocomplete(inputRef.current, {
//           fields: ["name", "formatted_address", "geometry"],
//         });

//         autocomplete.addListener("place_changed", () => {
//           const place = autocomplete.getPlace();
//           if (!place.geometry) return;

//           const lat = place.geometry.location.lat();
//           const lng = place.geometry.location.lng();

//           setCoords({ lat, lng });
//           form.setFieldsValue({
//             address: place.formatted_address,
//             lat,
//             lng,
//           });

//           if (marker) {
//             marker.setPosition({ lat, lng });
//           } else {
//             const newMarker = new google.maps.Marker({
//               position: { lat, lng },
//               map: mapInstance,
//               title: place.formatted_address,
//             });
//             setMarker(newMarker);
//           }

//           mapInstance.setCenter({ lat, lng });
//           mapInstance.setZoom(18);
//         });
//       }
//     };

//     initMap();
//   }, []);

//   const onFinish = async (values) => {
//     try {
//       console.log("Form submit:", values);

//       const formData = new FormData();

//       // Append các field từ form
//       formData.append("name", values.name);
//       formData.append("description", values.description || "");
//       formData.append("priceHotel", values.price);
//       formData.append("discount", values.discount || 0);
//       formData.append("city_id", values.city);   // phải khớp với CreateHotelRequest
//       formData.append("area_id", values.area);   // phải khớp với CreateHotelRequest
//       formData.append("address", values.address);
//       formData.append("lat", values.lat);
//       formData.append("lng", values.lng);
//       // formData.append("checkInTime", values.check_in_time ? values.check_in_time.format("HH:mm") : "");
//       // formData.append("checkOutTime", values.check_out_time ? values.check_out_time.format("HH:mm") : "");
//       // formData.append("childFreeAge", values.child_free_age || "");
//       // formData.append("allowPet", values.allow_pet ? "true" : "false");

//       // Chính sách khác (nếu có)
//       // if (values.custom_policies) {
//       //   values.custom_policies.forEach((policy, index) => {
//       //     formData.append(`customPolicies[${index}].title`, policy.title);
//       //     formData.append(`customPolicies[${index}].description`, policy.description);
//       //   });
//       // }

//       // Append nhiều ảnh
//       fileList.forEach((file) => {
//         if (file.originFileObj) {
//           formData.append("images", file.originFileObj); // key "images" khớp @RequestParam("images")
//         }
//       });

//       const response = await fetch("http://localhost:8082/identity/api/hotel", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         console.log("Tạo khách sạn thành công:", data);
//         alert("dang ki thanh cong")
//         form.resetFields();
//         setFileList([]);
//       } else {
//         console.error("Lỗi khi tạo khách sạn:", data);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };




//   const getBase64 = file =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });

//   const handlePreview = async file => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };


//   const tabItems = [
//     {
//       key: "1",
//       label: "Thông tin cơ bản",
//       children: (
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Tên khách sạn"

//               name="name"
//               rules={[{ required: true, message: "Vui lòng nhập tên khách sạn!" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item label="Mô tả" name="description">
//               <Input.TextArea />
//             </Form.Item>

//             <Form.Item
//               label="Giá"
//               name="price"
//               rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
//             >
//               <Input type="number" />
//             </Form.Item>

//             <Form.Item label="Giảm giá" name="discount">
//               <Input type="number" />
//             </Form.Item>

//             <Form.Item label="thanh pho" name="city">
//               <Select
//                 showSearch
//                 placeholder="Select a person"
//                 optionFilterProp="label"
//                 // onChange={onChange}
//                 // onSearch={onSearch}
//                 options={city.map(item => ({
//                   value: item.city_id,
//                   label: item.name
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item label="khu vuc" name="area">
//               <Select
//                 showSearch
//                 placeholder="Select a person"
//                 optionFilterProp="label"
//                 // onChange={onChange}
//                 // onSearch={onSearch}
//                 options={area.map((item) => ({
//                   value: item.areaId, // giá trị lưu vào form
//                   label: item.name,   // hiển thị ra ngoài
//                 }))}
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" onClick={showModal}>
//                 Open Modal
//               </Button>
//               <Modal
//                 title="Basic Modal"
//                 open={isModalOpen}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//                 width={1000}


//                 styles={{
//                   content: {
//                     height: 500,              // 👈 modal cố định cao 500px
//                     display: "flex",
//                     flexDirection: "column",  // giữ layout header - body - footer
//                   },
//                   body: {
//                     flex: 1,                  // chiếm hết phần còn lại
//                     overflowY: "auto",        // scroll riêng body
//                     scrollbarWidth: "none", // Firefox
//                     msOverflowStyle: "none", // IE + Edge cũ
//                   },
//                 }}
//               >
//                 <Form.Item label="Hình ảnh" name="upload">
//                   <Upload
//                     multiple
//                     beforeUpload={() => false}
//                     showUploadList={false} // ✅ chỉ giữ nút Upload
//                     onChange={({ fileList }) => setFileList(fileList)}
//                   >
//                     <Button icon={<UploadOutlined />}>Upload ảnh</Button>
//                   </Upload>
//                 </Form.Item>

//                 {/* Danh sách ảnh scroll riêng */}
//                 <div
//                   style={{
//                     // maxHeight: 500,
//                     // overflowY: "auto",
//                     border: "1px solid #f0f0f0",
//                     padding: 8,
//                     borderRadius: 8,
//                   }}
//                 >
//                   <Image.PreviewGroup
//                     preview={{
//                       visible: previewOpen,
//                       onVisibleChange: (visible) => setPreviewOpen(visible),
//                     }}
//                   >
//                     <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//                       {fileList.map((file) => {
//                         const src = file.originFileObj
//                           ? URL.createObjectURL(file.originFileObj)
//                           : file.url;

//                         return (
//                           <div
//                             key={file.uid}
//                             style={{
//                               position: "relative",
//                               width: 120,
//                               border: "1px solid #ddd",
//                               borderRadius: 8,
//                               padding: 8,
//                               textAlign: "center",
//                             }}
//                           >
//                             {/* Ảnh hiển thị + preview */}
//                             <Image
//                               src={src}
//                               width={100}
//                               height={80}
//                               style={{ objectFit: "cover", borderRadius: 4 }}
//                               onClick={() => {
//                                 setPreviewImage(src);
//                                 setPreviewOpen(true);
//                               }}
//                             />

//                             {/* Nút xoá */}
//                             <Button
//                               type="text"
//                               size="small"
//                               danger
//                               icon={<UploadOutlined />}
//                               onClick={() =>
//                                 setFileList(fileList.filter((item) => item.uid !== file.uid))
//                               }
//                               style={{
//                                 position: "absolute",
//                                 top: 4,
//                                 right: 4,
//                                 background: "rgba(255,255,255,0.7)",
//                                 borderRadius: "50%",
//                               }}
//                             />

//                             {/* Tên file */}
//                             <div
//                               style={{
//                                 fontSize: 12,
//                                 marginTop: 4,
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               {file.name}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </Image.PreviewGroup>
//                 </div>
//               </Modal>

//             </Form.Item>


//           </Col>

//           <Col span={12}>
//             <Form.Item
//               label="Địa chỉ"
//               name="address"
//               rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
//             >
//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Nhập địa chỉ hoặc chọn gợi ý..."
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   background: "white",
//                   border: "1px solid #d9d9d9",
//                   borderRadius: "6px",
//                 }}
//               />
//             </Form.Item>
//             <div
//               ref={mapRef}
//               style={{ width: "100%", height: "300px", marginTop: "10px" }}
//             />
//           </Col>

//           {/* hidden lat/lng */}
//           <Form.Item name="lat" noStyle>
//             <input type="hidden" />
//           </Form.Item>
//           <Form.Item name="lng" noStyle>
//             <input type="hidden" />
//           </Form.Item>
//         </Row>
//       ),
//     },
//     {
//       key: "2",
//       label: "Chính sách lưu trú",
//       children: (
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item label="Giờ nhận phòng" name="check_in_time">
//               <TimePicker format="HH:mm" />
//             </Form.Item>
//             <Form.Item label="Giờ trả phòng" name="check_out_time">
//               <TimePicker format="HH:mm" />
//             </Form.Item>
//             <Form.Item label="Tuổi trẻ em miễn phí" name="child_free_age">
//               <Input type="number" placeholder="VD: 6" />
//             </Form.Item>
//             <Form.Item label="Thú cưng" name="allow_pet" valuePropName="checked">
//               <Switch checkedChildren="Cho phép" unCheckedChildren="Không" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.List name="custom_policies">
//               {(fields, { add, remove }) => (
//                 <>
//                   <label>Chính sách khác</label>
//                   {fields.map(({ key, name, ...restField }) => (
//                     <Space
//                       key={key}
//                       style={{ display: "flex", marginBottom: 8 }}
//                       align="baseline"
//                     >
//                       <Form.Item
//                         {...restField}
//                         name={[name, "title"]}
//                         rules={[{ required: true, message: "Nhập tiêu đề" }]}
//                       >
//                         <Input placeholder="Tiêu đề (VD: Chính sách hút thuốc)" />
//                       </Form.Item>
//                       <Form.Item
//                         {...restField}
//                         name={[name, "description"]}
//                         rules={[{ required: true, message: "Nhập nội dung" }]}
//                       >
//                         <Input.TextArea placeholder="Nội dung" rows={2} />
//                       </Form.Item>
//                       <MinusCircleOutlined onClick={() => remove(name)} />
//                     </Space>
//                   ))}
//                   <Form.Item>
//                     <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                       Thêm chính sách
//                     </Button>
//                   </Form.Item>
//                 </>
//               )}
//             </Form.List>
//           </Col>
//         </Row>
//       ),
//     },
//   ];

//   return (
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={onFinish}
//       style={{ maxWidth: "100%" }}
//       labelCol={{ span: 5 }}
//       wrapperCol={{ span: 15 }}
//       scrollToFirstError
//       onFinishFailed={({ errorFields }) => {
//         if (errorFields.length > 0) {
//           const firstError = errorFields[0];

//           // 🔹 Tìm tab chứa field lỗi
//           const errorName = firstError.name[0]; // ví dụ "check_in_time"
//           if (["check_in_time", "check_out_time", "child_free_age", "allow_pet", "custom_policies"].includes(errorName)) {
//             setActiveTab("2"); // chuyển sang tab Chính sách lưu trú
//           } else {
//             setActiveTab("1"); // mặc định tab Thông tin cơ bản
//           }

//           setTimeout(() => {
//             form.scrollToField(firstError.name);
//             form.getFieldInstance(firstError.name)?.focus?.();
//           }, 200); // delay chút để tab render xong
//         }
//       }}
//     >
//       {/* <div style={{ position: "relative" }}>
        
//           <Button type="primary" htmlType="submit" style={{ position: 'absolute', right: 0 }}>
//             Lưu khách sạn
//           </Button>
       
//         <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

//       </div> */}

//       <div style={{ position: "relative" }}>
//         <Button
//           type="primary"
//           htmlType="submit"
//           style={{ position: "absolute", right: 0, top: 0,zIndex:99 }}
//         >
//           Lưu khách sạn
//         </Button>
//         <Tabs
//           defaultActiveKey="1"
//           activeKey={activeTab}
//           onChange={setActiveTab}
//           items={tabItems}
//         />
//       </div>




//     </Form>
//   );
// }






import {
  Button, Col, Form, Input, Row, Upload, Tabs, TimePicker, Switch, Space,
  Select, Modal, Image, message
} from "antd";
import { useEffect, useRef, useState } from "react";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";

const { Option } = Select;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function CreateHotel() {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [coords, setCoords] = useState({ lat: 21.0285, lng: 105.8542 });
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const token = localStorage.getItem("token");

  // ---- Load cities/areas từ Express ----
  useEffect(() => {
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE}/api/cities`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE}/api/areas`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([c, a]) => {
      setCities(Array.isArray(c?.data) ? c.data : []);
      setAreas(Array.isArray(a?.data) ? a.data : []);
    });
  }, [token]);

  // ---- Google Maps + Places ----
  useEffect(() => {
    let mapInstance, ac, markerInst;

    const init = () => {
      if (!window.google?.maps?.places) return;

      // Map
      mapInstance = new window.google.maps.Map(mapRef.current, {
        center: coords, zoom: 13,
      });

      // Marker init
      markerInst = new window.google.maps.Marker({
        position: coords, map: mapInstance,
      });
      setMarker(markerInst);

      // Autocomplete
      if (inputRef.current) {
        ac = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["name", "formatted_address", "geometry"],
        });

        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (!place?.geometry) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setCoords({ lat, lng });
          form.setFieldsValue({
            address: place.formatted_address,
            lat,
            lng,
          });

          markerInst.setPosition({ lat, lng });
          mapInstance.setCenter({ lat, lng });
          mapInstance.setZoom(17);
        });
      }
    };

    // chờ script sẵn sàng
    const poll = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(poll);
        init();
      }
    }, 100);

    return () => clearInterval(poll);
  }, [form, coords.lat, coords.lng]);

  // ---- Submit: gửi FormData (meta JSON + images) ----
  const onFinish = async (values) => {
    try {
      // Chuẩn hóa payload cho backend (không dùng location)
      const payload = {
        name: values.name,
        description: values.description || "",
        address: values.address,
        priceHotel: Number(values.price),
        discount: Number(values.discount || 0),
        city: values.city || undefined,     // ObjectId
        area: values.area || undefined,     // ObjectId
        lat: Number(values.lat),
        lng: Number(values.lng),
        checkInTime: values.check_in_time ? values.check_in_time.format("HH:mm") : undefined,
        checkOutTime: values.check_out_time ? values.check_out_time.format("HH:mm") : undefined,
        // bạn có thể thêm các policy khác nếu backend hỗ trợ
      };

      // Kiểm tra tối thiểu
      if (!payload.lat || !payload.lng) {
        message.warning("Vui lòng chọn địa chỉ trên bản đồ để lấy lat/lng.");
        return;
      }

      const formData = new FormData();
      formData.append("meta", JSON.stringify(payload));

      fileList.forEach((file) => {
        if (file.originFileObj) formData.append("images", file.originFileObj);
      });

      const res = await fetch(`${API_BASE}/api/hotels`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // KHÔNG set Content-Type khi gửi FormData
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Tạo khách sạn thất bại");

      message.success("Tạo khách sạn thành công!");
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error(err);
      message.error(err.message || "Có lỗi xảy ra");
    }
  };

  // ---- Upload preview helpers ----
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // ---- Tabs content ----
  const tabItems = [
    {
      key: "1",
      label: "Thông tin cơ bản",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên khách sạn"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên khách sạn!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Giá (VND)"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item label="Giảm giá (%)" name="discount">
              <Input type="number" min={0} max={100} />
            </Form.Item>

            <Form.Item label="Thành phố" name="city">
              <Select
                showSearch
                placeholder="Chọn thành phố"
                optionFilterProp="label"
                options={cities.map((c) => ({ value: c._id, label: c.name }))}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Khu vực" name="area">
              <Select
                showSearch
                placeholder="Chọn khu vực"
                optionFilterProp="label"
                options={areas.map((a) => ({ value: a._id, label: a.name }))}
                allowClear
              />
            </Form.Item>

            <Form.Item label="Hình ảnh">
              <Upload
                multiple
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>

              <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
                <Image alt="preview" src={previewImage} width="100%" />
              </Modal>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập địa chỉ hoặc chọn gợi ý..."
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "white",
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>

            <div ref={mapRef} style={{ width: "100%", height: "300px", marginTop: "10px" }} />

            {/* hidden lat/lng */}
            <Form.Item name="lat" noStyle>
              <input type="hidden" />
            </Form.Item>
            <Form.Item name="lng" noStyle>
              <input type="hidden" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Chính sách lưu trú",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giờ nhận phòng" name="check_in_time">
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item label="Giờ trả phòng" name="check_out_time">
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item label="Tuổi trẻ em miễn phí" name="child_free_age">
              <Input type="number" placeholder="VD: 6" />
            </Form.Item>
            <Form.Item label="Thú cưng" name="allow_pet" valuePropName="checked">
              <Switch checkedChildren="Cho phép" unCheckedChildren="Không" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.List name="custom_policies">
              {(fields, { add, remove }) => (
                <>
                  <label>Chính sách khác</label>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "Nhập tiêu đề" }]}
                      >
                        <Input placeholder="Tiêu đề (VD: Chính sách hút thuốc)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        rules={[{ required: true, message: "Nhập nội dung" }]}
                      >
                        <Input.TextArea placeholder="Nội dung" rows={2} />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm chính sách
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: "100%" }}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      scrollToFirstError
      onFinishFailed={({ errorFields }) => {
        if (errorFields.length > 0) {
          const errorName = errorFields[0].name[0];
          if (
            ["check_in_time", "check_out_time", "child_free_age", "allow_pet", "custom_policies"]
              .includes(errorName)
          ) setActiveTab("2"); else setActiveTab("1");

          setTimeout(() => {
            form.scrollToField(errorFields[0].name);
            form.getFieldInstance(errorFields[0].name)?.focus?.();
          }, 200);
        }
      }}
    >
      <div style={{ position: "relative" }}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ position: "absolute", right: 0, top: 0, zIndex: 99 }}
        >
          Lưu khách sạn
        </Button>
        <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </div>
    </Form>
  );
}
