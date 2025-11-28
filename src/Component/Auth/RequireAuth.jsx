import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function RequireAuth({ allowedRoles }) {
  const token = localStorage.getItem("authToken");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);   // đọc payload từ jwt
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      localStorage.removeItem("authToken");
      return <Navigate to="/login" replace />;
    }

    const roles = decoded.roles || [];
    const ok = roles.some(r => allowedRoles.includes(r));

    if (!ok) return <Navigate to="/403" replace />; // trang cấm truy cập

    return <Outlet />;

  } catch (error) {
    localStorage.removeItem("authToken");
    return <Navigate to="/login" replace />;
  }
}
