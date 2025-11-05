import { axiosInstance } from './axios';

export const bookmark = async () => {
  const { data } = await axiosInstance.get('/rank/bookmark');
  return data;
};

export const practice = async (params) => {
  const { data } = await axiosInstance.get('/rank/practice', { params });
  return data;
};
