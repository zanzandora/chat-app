import axios from 'axios';

// Tạo một instance Axios cho API chính của bạn
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 giây
  withCredentials: true,
});

// Bây giờ bạn có thể sử dụng các instance này:
// axiosInstance.get('/users')
