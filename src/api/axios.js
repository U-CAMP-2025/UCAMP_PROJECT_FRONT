import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

// request interceptor
// 로컬 스토리지에 accsssToken이 있다면 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const at = localStorage.getItem('accessToken');
  if (at) config.headers.Authorization = `Bearer ${at}`;
  return config;
});

let refreshing = null;

// response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) {
          const rt = localStorage.getItem('refreshToken');
          refreshing = axiosInstance.post('/auth/refresh', { refreshToken: rt });
        }
        const { data } = await refreshing;
        refreshing = null;

        localStorage.setItem('isLogin', true);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(original); // 원래 요청 재시도
      } catch (e) {
        refreshing = null;
        // 토큰 만료 → 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.setItem('isLogin', false);
        window.location.replace('/');
      }
    }
    throw err;
  },
);

export default axiosInstance;
