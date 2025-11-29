



// import {
//   Button, Col, Form, Input, Row, Upload, Tabs, TimePicker, Switch, Space,
//   Select, Modal, Image, message
// } from "antd";
// import { useEffect, useRef, useState } from "react";
// import {
//   UploadOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
//   DeleteOutlined
// } from "@ant-design/icons";

// const { Option } = Select;
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// export default function CreateHotel() {
//   const [form] = Form.useForm();
//   const inputRef = useRef(null);
//   const mapRef = useRef(null);
//   const [marker, setMarker] = useState(null);
//   const [coords, setCoords] = useState({ lat: 21.0285, lng: 105.8542 });
//   const [areas, setAreas] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [activeTab, setActiveTab] = useState("1");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fileList, setFileList] = useState([]);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   const token = localStorage.getItem("token");

//   // ---- Load cities/areas từ Express ----
//   useEffect(() => {
//     const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
//     Promise.all([
//       fetch(`${API_BASE}/api/cities`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
//       fetch(`${API_BASE}/api/areas`, { headers }).then(r => r.json()).catch(() => ({ data: [] })),
//     ]).then(([c, a]) => {
//       setCities(Array.isArray(c?.data) ? c.data : []);
//       setAreas(Array.isArray(a?.data) ? a.data : []);
//     });
//   }, [token]);

//   // ---- Google Maps + Places ----
//   useEffect(() => {
//     let mapInstance, ac, markerInst;

//     const init = () => {
//       if (!window.google?.maps?.places) return;

//       // Map
//       mapInstance = new window.google.maps.Map(mapRef.current, {
//         center: coords, zoom: 13,
//       });

//       // Marker init
//       markerInst = new window.google.maps.Marker({
//         position: coords, map: mapInstance,
//       });
//       setMarker(markerInst);

//       // Autocomplete
//       if (inputRef.current) {
//         ac = new window.google.maps.places.Autocomplete(inputRef.current, {
//           fields: ["name", "formatted_address", "geometry"],
//         });

//         ac.addListener("place_changed", () => {
//           const place = ac.getPlace();
//           if (!place?.geometry) return;

//           const lat = place.geometry.location.lat();
//           const lng = place.geometry.location.lng();

//           setCoords({ lat, lng });
//           form.setFieldsValue({
//             address: place.formatted_address,
//             lat,
//             lng,
//           });

//           markerInst.setPosition({ lat, lng });
//           mapInstance.setCenter({ lat, lng });
//           mapInstance.setZoom(17);
//         });
//       }
//     };

//     // chờ script sẵn sàng
//     const poll = setInterval(() => {
//       if (window.google?.maps?.places) {
//         clearInterval(poll);
//         init();
//       }
//     }, 100);

//     return () => clearInterval(poll);
//   }, [form, coords.lat, coords.lng]);

//   // ---- Submit: gửi FormData (meta JSON + images) ----
//   const onFinish = async (values) => {
//     try {
//       // Chuẩn hóa payload cho backend (không dùng location)
//       const payload = {
//         name: values.name,
//         description: values.description || "",
//         address: values.address,
//         priceHotel: Number(values.price),
//         discount: Number(values.discount || 0),
//         city: values.city || undefined,     // ObjectId
//         area: values.area || undefined,     // ObjectId
//         lat: Number(values.lat),
//         lng: Number(values.lng),
//         checkInTime: values.check_in_time ? values.check_in_time.format("HH:mm") : undefined,
//         checkOutTime: values.check_out_time ? values.check_out_time.format("HH:mm") : undefined,
//         // bạn có thể thêm các policy khác nếu backend hỗ trợ
//       };

//       // Kiểm tra tối thiểu
//       if (!payload.lat || !payload.lng) {
//         message.warning("Vui lòng chọn địa chỉ trên bản đồ để lấy lat/lng.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("meta", JSON.stringify(payload));

//       fileList.forEach((file) => {
//         if (file.originFileObj) formData.append("images", file.originFileObj);
//       });

//       const res = await fetch(`${API_BASE}/api/hotels`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` }, // KHÔNG set Content-Type khi gửi FormData
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.error || "Tạo khách sạn thất bại");

//       message.success("Tạo khách sạn thành công!");
//       form.resetFields();
//       setFileList([]);
//     } catch (err) {
//       console.error(err);
//       message.error(err.message || "Có lỗi xảy ra");
//     }
//   };

//   // ---- Upload preview helpers ----
//   const getBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//     });

//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };

//   // ---- Tabs content ----
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
//               label="Giá (VND)"
//               name="price"
//               rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
//             >
//               <Input type="number" min={0} />
//             </Form.Item>

//             <Form.Item label="Giảm giá (%)" name="discount">
//               <Input type="number" min={0} max={100} />
//             </Form.Item>

//             <Form.Item label="Thành phố" name="city">
//               <Select
//                 showSearch
//                 placeholder="Chọn thành phố"
//                 optionFilterProp="label"
//                 options={cities.map((c) => ({ value: c._id, label: c.name }))}
//                 allowClear
//               />
//             </Form.Item>

//             <Form.Item label="Khu vực" name="area">
//               <Select
//                 showSearch
//                 placeholder="Chọn khu vực"
//                 optionFilterProp="label"
//                 options={areas.map((a) => ({ value: a._id, label: a.name }))}
//                 allowClear
//               />
//             </Form.Item>

//             <Form.Item label="Hình ảnh">
//               <Upload
//                 multiple
//                 listType="picture-card"
//                 fileList={fileList}
//                 beforeUpload={() => false}
//                 onPreview={handlePreview}
//                 onChange={({ fileList }) => setFileList(fileList)}
//               >
//                 <div>
//                   <UploadOutlined />
//                   <div style={{ marginTop: 8 }}>Upload</div>
//                 </div>
//               </Upload>

//               <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
//                 <Image alt="preview" src={previewImage} width="100%" />
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

//             <div ref={mapRef} style={{ width: "100%", height: "300px", marginTop: "10px" }} />

//             {/* hidden lat/lng */}
//             <Form.Item name="lat" noStyle>
//               <input type="hidden" />
//             </Form.Item>
//             <Form.Item name="lng" noStyle>
//               <input type="hidden" />
//             </Form.Item>
//           </Col>
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
//                     <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
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
//                       <Button
//                         type="text"
//                         danger
//                         icon={<DeleteOutlined />}
//                         onClick={() => remove(name)}
//                       />
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
//           const errorName = errorFields[0].name[0];
//           if (
//             ["check_in_time", "check_out_time", "child_free_age", "allow_pet", "custom_policies"]
//               .includes(errorName)
//           ) setActiveTab("2"); else setActiveTab("1");

//           setTimeout(() => {
//             form.scrollToField(errorFields[0].name);
//             form.getFieldInstance(errorFields[0].name)?.focus?.();
//           }, 200);
//         }
//       }}
//     >
//       <div style={{ position: "relative" }}>
//         <Button
//           type="primary"
//           htmlType="submit"
//           style={{ position: "absolute", right: 0, top: 0, zIndex: 99 }}
//         >
//           Lưu khách sạn
//         </Button>
//         <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
//       </div>
//     </Form>
//   );
// }



// src/pages/Hotel/CreateHotel.jsx
import {
  Button, Col, Form, Input, Row, Upload, Tabs, TimePicker, Switch, Space,
  Select, Modal, Image, message
} from "antd";
import { useEffect, useRef, useState } from "react";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import api from "../../../api/client";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"; // không dùng có thể bỏ

export default function CreateHotel() {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [coords, setCoords] = useState({ lat: 21.0285, lng: 105.8542 });
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // ---- Load cities/areas từ Express bằng axios client ----
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          api.get("/api/cities"),
          api.get("/api/areas"),
        ]);

        const cityData = Array.isArray(cRes.data?.data)
          ? cRes.data.data
          : Array.isArray(cRes.data)
            ? cRes.data
            : [];

        console.log("cityData", cityData);

        const areaData = Array.isArray(aRes.data?.data)
          ? aRes.data.data
          : Array.isArray(aRes.data)
            ? aRes.data
            : [];

        console.log("areaData", areaData);

        setCities(cityData);
        setAreas(areaData);
      } catch (err) {
        console.error(err);
        message.error("Không load được danh sách thành phố / khu vực");
      }
    };

    loadMeta();
  }, []);

  // ---- Google Maps + Places ----
  useEffect(() => {
    let mapInstance, ac, markerInst;

    const init = () => {
      if (!window.google?.maps?.places) return;

      // Map
      mapInstance = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 13,
      });

      // Marker init
      markerInst = new window.google.maps.Marker({
        position: coords,
        map: mapInstance,
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

          // cập nhật vào form, để lat/lng luôn có value
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

    const poll = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(poll);
        init();
      }
    }, 100);

    return () => clearInterval(poll);
  }, [form, coords.lat, coords.lng]);

  // ---- Upload preview helpers ----
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // ---- Submit: gửi FormData (meta JSON + images) bằng axios client ----
  const onFinish = async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || "",
        address: values.address,
        priceHotel: Number(values.price),
        discount: Number(values.discount || 0),
        city: values.city || undefined,
        area: values.area || undefined,
        lat: Number(values.lat),
        lng: Number(values.lng),
        checkInTime: values.check_in_time
          ? values.check_in_time.format("HH:mm")
          : undefined,
        checkOutTime: values.check_out_time
          ? values.check_out_time.format("HH:mm")
          : undefined,
        childFreeAge: values.child_free_age
          ? Number(values.child_free_age)
          : undefined,
        allowPet: !!values.allow_pet,
        customPolicies: values.custom_policies || [],
      };

      if (Number.isNaN(payload.lat) || Number.isNaN(payload.lng)) {
        message.warning("Vui lòng chọn địa chỉ trên bản đồ để lấy lat/lng.");
        return;
      }

      const formData = new FormData();
      formData.append("meta", JSON.stringify(payload));

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      const res = await api.post("/api/hotels", formData);
      const data = res.data;

      message.success("Tạo khách sạn thành công!");
      console.log("Created hotel:", data);

      // ✅ reset form (tuỳ bạn, có thể bỏ)
      form.resetFields();
      setFileList([]);

      // ✅ điều hướng về trang list
      navigate("/Admin/Hotel");     // 👈 đường dẫn list của bạn
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra";
      message.error(msg);
    }
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

              <Modal
                open={previewOpen}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
              >
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

            <div
              ref={mapRef}
              style={{ width: "100%", height: "300px", marginTop: "10px" }}
            />

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
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
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
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
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
      initialValues={{
        price: 0,
        discount: 0,
        address: "",
        lat: coords.lat,
        lng: coords.lng,
        allow_pet: false,
      }}
      onFinishFailed={({ errorFields }) => {
        if (errorFields.length > 0) {
          const errorName = errorFields[0].name[0];
          if (
            [
              "check_in_time",
              "check_out_time",
              "child_free_age",
              "allow_pet",
              "custom_policies",
            ].includes(errorName)
          )
            setActiveTab("2");
          else setActiveTab("1");

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
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>
    </Form>
  );
}
