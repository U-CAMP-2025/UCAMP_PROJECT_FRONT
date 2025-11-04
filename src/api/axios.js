import { useAuthStore } from '@store/auth/useAuthStore';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

export const axiosRefreshInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

// request interceptor
// 로컬 스토리지에 accsssToken이 있다면 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  // remember whether this request had an access token at send time
  config._hadAT = Boolean(accessToken);
  return config;
});

let isRefreshing = false;
let pending = [];
let refreshFailed = false; // stop trying to refresh once it fails; reset on successful refresh/login

// response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    const original = config || {};
    const url = typeof original.url === 'string' ? original.url : '';

    // 0) 인증 관련 엔드포인트는 재시도하지 않음 (무한 루프 방지)
    if (typeof url === 'string' && url.includes('/auth/')) {
      return Promise.reject(error);
    }

    // 1) 인증 에러가 아니거나 이미 재시도한 요청이면 패스
    if (![401, 403].includes(response?.status) || original?._retry) {
      return Promise.reject(error);
    }

    // 2) 로그아웃 상태면(=refresh 실패 후) 더 이상 refresh 시도하지 않음
    const { isLogin } = useAuthStore.getState();
    if (!isLogin || refreshFailed) {
      return Promise.reject(error);
    }

    // 3) 애초에 AT 없이 보낸 요청은 refresh 시도 대상에서 제외 (선택)
    if (!original._hadAT) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pending.push((newToken) => {
          if (!newToken) return reject(error);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(original));
        });
      });
    }

    try {
      isRefreshing = true;
      original._retry = true;

      const refreshRes = await axiosRefreshInstance.post('/auth/refresh', {});
      const newAT = refreshRes?.data?.accessToken;

      if (newAT) useAuthStore.getState().setAccessToken(newAT);
      refreshFailed = false;

      pending.forEach((cb) => cb(newAT));
      pending = [];

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newAT}`;
      return axiosInstance(original);
    } catch (e) {
      refreshFailed = true;
      pending.forEach((cb) => cb(null));
      pending = [];
      useAuthStore.getState().logout();

      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);
