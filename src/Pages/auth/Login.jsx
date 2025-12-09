// import React, { useState } from "react";
// import { Card, Form, Input, Button, Typography, message } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/useAuth";
// import api, { setAccessToken, clearAccessToken ,setUser} from "../../api/client";

// const { Title, Text } = Typography;
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// export default function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

// const onFinish = async (values) => {
//   try {
//     setLoading(true);
//     const res = await fetch(`${API_BASE}/api/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(values),
//     });

//     let data = null;
//     try {
//       data = await res.json();
//     } catch {
//       // nếu backend không trả JSON thì bỏ qua
//     }

//     if (!res.ok) {
//       console.log("Login error response:", res.status, data);

//       const raw = data?.error || data?.message || "";

//       let errMsg = "Đăng nhập thất bại";

//       if (raw.includes('"email" must be a valid email')) {
//         errMsg = "Email không hợp lệ. Vui lòng nhập đúng định dạng (vd: abc@gmail.com)";
//       } else if (raw) {
//         // nếu backend đã có message rõ ràng thì dùng luôn
//         errMsg = raw;
//       } else if (res.status === 400) {
//         errMsg = "Tài khoản hoặc mật khẩu không đúng";
//       }

//       message.error(errMsg);
//       alert(errMsg);
//       return; // dừng, không set token, không navigate
//     }

//      // res.data.accessToken + res.data.user
//     setAccessToken(data.accessToken);

//     // lưu user vào context (KHÔNG lưu token vào localStorage)
//     setUser(data.user);

//     // ✅ Trường hợp OK
//     localStorage.setItem("authToken", data.accessToken);
//     localStorage.setItem("authUser", JSON.stringify(data.user));

//     message.success("Đăng nhập thành công!");
//     navigate("/");
//   } catch (e) {
//     console.error(e);
//     message.error(e.message || "Đăng nhập thất bại");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#f5f5f5",
//         padding: 16,
//       }}
//     >
//       <Card style={{ width: 420, borderRadius: 12 }}>
//         <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
//           Đăng nhập
//         </Title>
//         <Text
//           type="secondary"
//           style={{ display: "block", textAlign: "center", marginBottom: 16 }}
//         >
//           Nhập email và mật khẩu để tiếp tục
//         </Text>

//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[{ required: true, message: "Nhập email" }]}
//           >
//             <Input size="large" placeholder="example@gmail.com" />
//           </Form.Item>

//           <Form.Item
//             label="Mật khẩu"
//             name="password"
//             rules={[{ required: true, message: "Nhập mật khẩu" }]}
//           >
//             <Input.Password size="large" />
//           </Form.Item>

//           <Button
//             type="primary"
//             htmlType="submit"
//             size="large"
//             block
//             loading={loading}
//             style={{ marginTop: 8 }}
//           >
//             Đăng nhập
//           </Button>

//           <Button
//             type="link"
//             block
//             onClick={() => navigate("/register")}
//             style={{ marginTop: 8 }}
//           >
//             Chưa có tài khoản? Đăng ký
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { setAccessToken } from "../../api/client";
import { GoogleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const handleGoogle = () => {
  window.location.href = API_BASE+"/api/auth/google";
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // lấy hàm login từ context
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // nếu backend không trả JSON thì bỏ qua
      }

      if (!res.ok) {
        console.log("Login error response:", res.status, data);

        const raw = data?.error || data?.message || "";
        let errMsg = "Đăng nhập thất bại";

        if (raw.includes('"email" must be a valid email')) {
          errMsg =
            "Email không hợp lệ. Vui lòng nhập đúng định dạng (vd: abc@gmail.com)";
        } else if (raw) {
          errMsg = raw;
        } else if (res.status === 400) {
          errMsg = "Tài khoản hoặc mật khẩu không đúng";
        }

        message.error(errMsg);
        alert(errMsg);
        return;
      }

      // ✅ Kiểm tra data hợp lệ
      if (!data || !data.accessToken || !data.user) {
        message.error("Dữ liệu trả về không hợp lệ");
        console.log("Login data invalid:", data);
        return;
      }

      console.log("🔐 Login data:", data);

      // ✅ Lưu token vào client
      setAccessToken(data.accessToken);

      // ✅ Lưu user vào AuthContext
      login(data.user, data.accessToken);

      // ✅ Nếu vẫn muốn dùng localStorage thì để thế này
      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      // ✅ Lấy hotelId an toàn
      let hotelId = null;
      const hotel = data.user.hotel;

      if (typeof hotel === "string") {
        // trường hợp backend trả về hotel là ID string
        hotelId = hotel;
      } else if (hotel && (hotel._id || hotel.id)) {
        // trường hợp backend populate hotel thành object
        hotelId = hotel._id || hotel.id;
      }

      if (hotelId) {
        localStorage.setItem("hotelId", hotelId);
      } else {
        console.warn("⚠️ User không có hotelId, không lưu vào localStorage");
        // tuỳ bạn: có thể message.warning ở đây nếu là ADMIN_HOTEL mà chưa gán khách sạn
      }

      message.success("Đăng nhập thành công!");
      navigate("/");
    } catch (e) {
      console.error(e);
      message.error(e.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 16,
      }}
    >
      <Card style={{ width: 420, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
          Đăng nhập
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 16 }}
        >
          Nhập email và mật khẩu để tiếp tục
        </Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Nhập email" }]}
          >
            <Input size="large" placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ marginTop: 8 }}
          >
            Đăng nhập
          </Button>

          <Button
            type="link"
            block
            onClick={() => navigate("/register")}
            style={{ marginTop: 8 }}
          >
            Chưa có tài khoản? Đăng ký
          </Button>
          <button
            onClick={handleGoogle}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          >
            <GoogleOutlined /> Đăng nhập với Google
          </button>
        </Form>
      </Card>
    </div>
  );
}
