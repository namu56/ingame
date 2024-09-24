import axios, { AxiosRequestConfig } from 'axios';
import { getToken, setToken } from './tokenUtils';
import { SERVER_API_URL } from '../settings';
import { refreshToken } from '@/api/auth.api';

const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: SERVER_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 5000,
    ...config,
  });

  axiosInstance.interceptors.request.use((request) => {
    const token = getToken();

    if (token) request.headers.Authorization = `Bearer ${token}`;
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originRequest = error.config;

      if (error.response.status === 401) {
        const token = await refreshToken();
        setToken(token.accessToken);
        originRequest.headers.Authorization = `Bearer ${token.accessToken}`;
        return;
      }

      if (process.env.NODE_ENV === 'production') {
        console.clear();
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
