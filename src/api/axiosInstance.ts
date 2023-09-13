import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const axiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const createInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}`,
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });

  return createInstance;
};
