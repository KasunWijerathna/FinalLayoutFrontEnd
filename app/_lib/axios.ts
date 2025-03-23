import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    const token = Cookies.get('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await instance.post('/api/auth/refresh');
        const { access_token } = response.data;

        // Save the new token to cookies
        Cookies.set('token', access_token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token and redirect to login
        Cookies.remove('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance; 