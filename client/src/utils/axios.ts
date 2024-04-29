import axios, { AxiosRequestConfig } from 'axios';

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
    // config.headers.Authorization = getToken() ? getToken() : '';
    // return config;

    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      //   if (error.response.status == 401) {
      //     removeToken();
      //     window.location.href = "/login";
      //     return;
      // }
      // return Promise.reject(error);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
