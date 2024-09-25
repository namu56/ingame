import axios, { AxiosRequestConfig } from 'axios';
import { getToken, setToken } from './tokenUtils';
import { SERVER_API_URL } from '../settings';
import { refreshToken } from '@/api/auth.api';

let isTokenRefreshing = false;
let refreshSubscribers: ((accessToken: string) => void)[] = [];

const onTokenRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (accessToken: string) => void) => {
  refreshSubscribers.push(callback);
};

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
      const { config, response } = error;
      const originalRequest = config;

      if (response.status === 401 && response.data.message === 'TokenExpired') {
        if (!isTokenRefreshing) {
          isTokenRefreshing = true;

          const { accessToken } = await refreshToken();
          setToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          onTokenRefreshed(accessToken);
          return axiosInstance(originalRequest);
        }

        const retryOriginalRequest = new Promise((resolve) => {
          addRefreshSubscriber((accessToken) => {
            config.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });

        return retryOriginalRequest;
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

// const createClient = (config?: AxiosRequestConfig) => {
//   const axiosInstance = axios.create({
//     baseURL: SERVER_API_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     withCredentials: true,
//     timeout: 5000,
//     ...config,
//   });

//   axiosInstance.interceptors.request.use((request) => {
//     const token = getToken();

//     if (token) request.headers.Authorization = `Bearer ${token}`;
//     return request;
//   });

//   axiosInstance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originRequest = error.config;

//       if (error.response.status === 401) {
//         console.log('401 error at:', new Date().toISOString());
//         const token = await refreshToken();
//         console.log('Received token at:', new Date().toISOString(), token);
//         console.log(token);
//         setToken(token.accessToken);
//         originRequest.headers.Authorization = `Bearer ${token.accessToken}`;
//         return;
//       }

//       if (process.env.NODE_ENV === 'production') {
//         console.clear();
//       }

//       return Promise.reject(error);
//     }
//   );

//   return axiosInstance;
// };

// export const httpClient = createClient();
