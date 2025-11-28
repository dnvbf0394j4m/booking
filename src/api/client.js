// src/api/client.js
import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const API_BASE="http://localhost:4000";


// biến module-level, không lưu localStorage
export let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // để gửi cookie refreshToken
});

// Request interceptor: gắn accessToken vào header

console.log("Current Access Token:", accessToken);
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: tự refresh token khi 401
let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  pendingRequests = [];
};

api.interceptors.response.use(
  
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // Nếu không phải 401 hoặc request này đã retry rồi thì bỏ
    if (
      error.response?.status !== 401 ||
      originalConfig._retry
    ) {
      return Promise.reject(error);
    }

    // Đánh dấu để tránh lặp vô hạn
    originalConfig._retry = true;

    if (isRefreshing) {
      // Nếu đang refresh → chờ đến khi refresh xong
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve: (token) => {
            if (token) {
              originalConfig.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalConfig));
          },
          reject,
        });
      });
    } 

    isRefreshing = true;

    console.log("vao duoc day")
    try {
      // Gọi refreshToken, cookie httpOnly sẽ được gửi kèm nhờ withCredentials
      const res = await axios.post(
        `${API_BASE}/api/auth/ok`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = res.data.accessToken;
      console.log("Refreshed Access Token:", newAccessToken);
      setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      // Gắn token mới vào request cũ và retry
      originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalConfig);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
