import { axiosInstance } from './axios';

/**
 * GET: 유저의 최근 결제 내역 조회
 */
export const fetchUserPayment = async () => {
  const { data } = await axiosInstance.get('/payment');
  return data;
};
