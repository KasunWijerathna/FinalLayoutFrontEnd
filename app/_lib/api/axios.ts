import axios from 'axios';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance; 