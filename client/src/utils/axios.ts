import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from './tokenUtils';

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_MOCK_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 5000,
    ...config,
  });
  axiosInstance.interceptors.request.use((request) => {
    request.headers.Authorization = `Bearer ${getToken() ? getToken() : ''}`;
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // if (error.response.status == 401) {
      //   window.location.href = '/login';
      //   return;
      // }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
