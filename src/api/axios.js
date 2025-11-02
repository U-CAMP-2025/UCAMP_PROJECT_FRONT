import { useAuthStore } from '@store/auth/useAuthStore';
import axios from 'axios';

import { postTokenRefresh } from './authAPIS';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

// request interceptor
// 로컬 스토리지에 accsssToken이 있다면 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  console.log('accessToken', accessToken);
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let ifRefreshing = false;
let pending = [];

// response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    const original = config || {};
    const url = typeof original.url === 'string' ? original.url : '';

    // 인증 관련 엔드포인트 자체에서의 401은 재시도하지 않음 (무한 루프 방지)
    if (url.startsWith('/auth/')) {
      throw error;
    }

    if (response?.status !== 401 || response?.status !== 403 || original?._retry) {
      return Promise.reject(error);
    }

    if (ifRefreshing) {
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
      ifRefreshing = true;
      original._retry = true;

      const response = await postTokenRefresh();
      const newAT = response.accessToken;

      if (!newAT) useAuthStore.getState().setAccessToken(newAT);

      pending.forEach((cb) => cb(newAT));
      pending = [];

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newAT}`;
      return axiosInstance(original);
    } catch (e) {
      pending.forEach((cb) => cb(null));
      pending = [];
      useAuthStore.getState().logout();
      return Promise.reject(e);
    } finally {
      ifRefreshing = false;
    }
  },
);
export async function bootstrapAccessToken() {
  const { isLogin, setAccessToken } = useAuthStore.getState();
  if (!isLogin) return null;
  try {
    const r = await axiosInstance.post('/api/auth/refresh', {});
    const newAT = r.data?.accessToken;
    if (newAT) {
      setAccessToken(newAT);
      return newAT;
    }
  } catch (e) {
    // eslint-disable-next-line no-empty
  }
  return null;
}

export default axiosInstance;
