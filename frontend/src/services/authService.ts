import { ApiResponse, LoginCredentials, RegisterData, User } from '@/types';
import api from './api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};