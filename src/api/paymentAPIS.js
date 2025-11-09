import { axiosInstance } from './axios';

/**
 * GET: 유저의 최근 결제 내역 조회
 */
export const fetchUserPayment = async () => {
  const { data } = axiosInstance.get('/payment');
  return data;
};

/**
 * POST: 우리 서버에 결제 요청
 */
export const postPaymentConfirm = async (payment) => {
  const { data } = axiosInstance.post('/payment/confirm', payment);
  return data;
};
