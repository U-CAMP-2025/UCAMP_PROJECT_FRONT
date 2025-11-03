import { axiosInstance, axiosRefreshInstance } from './axios';

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
  const { data } = await axiosRefreshInstance.post('/auth/refresh', {});
  return data;
};

/**
 * POST: 로그아웃
 */
export const postLogout = async () => {
  await axiosInstance.post('/auth/logout', {});
};

/**
 * GET: 닉네임 중복 체크
 */
export const getCheckNickname = async (nickname, excludeUserId) => {
  const params = new URLSearchParams();
  params.set('nickname', nickname);
  if (excludeUserId !== undefined && excludeUserId !== null) {
    params.set('excludeUserId', String(excludeUserId));
  }
  const { data } = await axiosInstance.get(`/auth/nickname/check?${params.toString()}`);
  return data;
};
