import { axiosInstance } from './axios';

// 북마크 수
export const bookmark = async () => {
  const { data } = await axiosInstance.get('/rank/bookmark');
  return data;
};
// 주간/월간 연습횟수
export const practice = async (params) => {
  const { data } = await axiosInstance.get('/rank/practice', { params });
  return data;
};
