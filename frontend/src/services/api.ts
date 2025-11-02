import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/store';
import { clearCredentials } from '@/store/authSlice';
import { toast } from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const { accessToken } = state.auth;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const response = await this.api.post('/auth/refresh-token');
            const { accessToken, user } = response.data.data;

            // Update store with new token
            store.dispatch({
              type: 'auth/setCredentials',
              payload: { user, accessToken }
            });

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            store.dispatch(clearCredentials());
            toast.error('Session expired. Please login again.');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 400:
              toast.error(data.error?.message || 'Bad request');
              break;
            case 403:
              toast.error('You do not have permission to perform this action');
              break;
            case 404:
              toast.error('Resource not found');
              break;
            case 429:
              toast.error('Too many requests. Please try again later');
              break;
            case 500:
              toast.error('Internal server error. Please try again later');
              break;
            default:
              toast.error(data.error?.message || 'An error occurred');
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection');
        } else {
          toast.error('An unexpected error occurred');
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete(url, config);
  }

  // File upload method
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }
}

export default new ApiService();