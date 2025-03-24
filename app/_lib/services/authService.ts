import { User } from '../types';
import { api } from '../api/services';
import Cookies from 'js-cookie';

interface LoginResponse {
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
  statusCode: number;
  message: string;
  timestamp: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    const { access_token, refresh_token } = response.data.data;
    
    // Set access token with short expiry
    Cookies.set('access_token', access_token, { 
      expires: 1/96, // 15 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Set refresh token with long expiry
    Cookies.set('refresh_token', refresh_token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response.data;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/register', data);
    const { access_token, refresh_token } = response.data.data;
    
    // Set access token with short expiry
    Cookies.set('access_token', access_token, { 
      expires: 1/96, // 15 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Set refresh token with long expiry
    Cookies.set('refresh_token', refresh_token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response.data;
  }

  async logout(): Promise<void> {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    await api.post('/api/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ data: User }>('/api/auth/me');
    return response.data.data;
  }
}

export const authService = new AuthService(); 