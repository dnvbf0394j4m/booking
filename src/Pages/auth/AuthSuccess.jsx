import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // chính hàm login(userData, accessToken) của bạn

  useEffect(() => {
    const token = params.get("token");
    const rawUser = params.get("user");
    const userStr = decodeURIComponent(rawUser);

    const user = JSON.parse(userStr);



    console.log("AuthSuccess - Retrieved user:", user);

    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    try {
      

      // Nếu bạn có dùng axios instance, set header luôn:
      // api.defaults.headers.common.Authorization = `Bearer ${token}`;
      // ✅ Nếu vẫn muốn dùng localStorage thì để thế này
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      // ✅ Lấy hotelId an toàn
      let hotelId = null;
      const hotel = user.hotel;

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


      // 👇 Gọi login chuẩn
      login(user, token);

      navigate("/");
    } catch (err) {
      console.error("Parse user from Google callback failed:", err);
      navigate("/login");
    }
  }, []);

  return <div>Đang xử lý đăng nhập Google...</div>;
}
