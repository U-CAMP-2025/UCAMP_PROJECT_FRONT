import axiosInstance from './axios';

/**
 * POST: 회원가입
 */
export const postSignUp = async (nickname, jobId) => {
  const { data } = await axiosInstance.post('/auth/signup', {
    nickname,
    jobId,
  });
  return data;
};

/**
 * POST: 토큰 리프레쉬
 */
export const postTokenRefresh = async () => {
  const { data } = await axiosInstance.post('/auth/refresh', {});
  return data;
};

/**
 * POST: 로그아웃
 */
export const postLogout = async () => {
  await axiosInstance.post('/auth/logout', {});
};
