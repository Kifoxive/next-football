import axios from "axios";
// import { getAccessToken } from "@/utils/auth"; // твоя функція для токена, налаштуй

export const axiosClient = axios.create({
  baseURL: "/api", // або просто залиш /api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // якщо треба cookie — постав true
});

// // 🔐 Додаємо токен перед кожним запитом
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken(); // твоя логіка
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// ❗ Глобальна обробка помилок (опційно)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe redirect to login");
      // Можна перенаправити або очистити токени
    }
    return Promise.reject(error);
  }
);
