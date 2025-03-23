import { User } from '../types';
import { api } from './api';
import Cookies from 'js-cookie';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    const { token } = response.data;
    Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
    return response.data;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/register', data);
    const { token } = response.data;
    Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
    return response.data;
  }

  async logout(): Promise<void> {
    Cookies.remove('token');
    await api.post('/api/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  }
}

export const authService = new AuthService(); 