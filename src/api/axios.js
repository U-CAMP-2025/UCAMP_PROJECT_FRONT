import { useAuthStore } from '@store/auth/authStore';
import axios from 'axios';

import { postTokenRefresh } from './authAPIS';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
});

// request interceptor
// 로컬 스토리지에 accsssToken이 있다면 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing = null;

// response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // 이미 재시도 요청이면 그대로 실패
    if (error?.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      if (!refreshing) {
        refreshing = (async () => {
          const data = postTokenRefresh(); // refreshToken 쿠키 전송됨
          useAuthStore.getState().setAccessToken(data.accessToken);
          refreshing = null;
        })().catch((e) => {
          refreshing = null;
          useAuthStore.getState().logoutLocal();
          throw e;
        });
      }
      await refreshing;
      return axiosInstance(original);
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: 공통 401 에러 처리(로그아웃/토큰 리프레쉬)
      console.warn('Unauthorized');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
