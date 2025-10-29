import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
});

// request interceptor
// 로컬 스토리지에 accsssToken이 있다면 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor
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
