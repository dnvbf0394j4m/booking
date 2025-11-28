// src/context/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Khi reload trang, nếu còn cookie refreshToken → tự gọi refresh-token 1 lần
  useEffect(() => {

    const bootstrap = async () => {
      try {
        const res = await api.post("/api/auth/ok", {}, { withCredentials: true });
        if (res.data?.accessToken) {
          console.log("Bootstrapped Access Token:", res.data.accessToken);
          console.log("Bootstrapped User Data:", res.json());
          setAccessToken(res.data.accessToken);
          // Nếu có API me
          // const me = await api.get("/api/auth/me");
            // setUser(me.data);
          }
      } catch (e) {
        clearAccessToken();
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  // 👇 Thêm hàm login chuẩn tại đây
  const login = (userData, accessToken) => {
    setAccessToken(accessToken); // lưu token vào memory (axios)
    setUser(userData);           // cập nhật thông tin user vào Context
  };

  const logout = async () => {
    clearAccessToken();
    setUser(null);
    // gọi thêm /api/auth/logout nếu muốn
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,        // 👈 nhớ export login
        logout,
        bootstrapping,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
};
