// Tạo instance axios
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY,
  }
});

// Interceptor để xử lý lỗi chung
api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

export default api;