import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3000/api';

// Tạo một instance Axios cho API chính của bạn
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây
  withCredentials: true,
});

// Bây giờ bạn có thể sử dụng các instance này:
// axiosInstance.get('/users')
