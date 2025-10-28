import axiosInstance from './axios';

/**
 * GET: 유저 마이페이지 조회
 * @returns {Promise<Object>} response
 */
export const fetchUserMypage = async () => {
  const { data } = await axiosInstance.get('/users/mypage');
  return data;
};

/**
 * PATCH: 유저 직무 수정
 * @param {string} job_id - 직무 ID
 */
export const patchUserJob = async (job_id) => {
  const { data } = await axiosInstance.patch('/users/job', { job_id });
  return data;
};

/**
 * POST: 유저 합격자 신청
 * @param {string} kakao_id - 카카오 아이디
 * @returns {Promise<Object>} response
 */
export const postUserPathPass = async (kakao_id) => {
  const { data } = await axiosInstance.post('/users/apply', { kakao_id });
  return data;
};

/**
 * POST: 회원 탈퇴
 * @returns {Promise<Object>} response
 */
export const postUserDelete = async () => {
  const { data } = await axiosInstance.post('/users/userDel');
  return data;
};

/**
 * GET: 로그아웃
 * @returns {Promise<Object>} response
 */
export const fetchUserLogout = async () => {
  const { data } = await axiosInstance.get('/users/logout');
  return data;
};
