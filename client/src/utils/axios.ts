import axios, { AxiosRequestConfig } from 'axios';
import { getToken, removeToken, setToken } from './tokenUtils';
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
    request.headers.Authorization = `Bearer ${token ? token : ''}`;
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originRequest = error.config;
      const hasToken = getToken();
      originRequest.retryCount = originRequest.retryCount || 0;

      if (error.response.status === 401 && originRequest.retryCount < 3) {
        originRequest.retryCount += 1;
        if (hasToken) {
          const token = await refreshToken();
          setToken(token.accessToken);
          return axiosInstance.request(originRequest);
        }
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
