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
export const patchUserJob = async (userId, jobId) => {
  const { data } = await axiosInstance.put('/users/pathJob', { userId, jobId });
  return data;
};

/**
 * POST: 유저 합격자 신청
 * @param {number} userId - 유저 아이디
 * @returns {Promise<Object>} response
 */
export const postUserPathPass = async (fileName) => {
  const { data } = await axiosInstance.post('/users/apply', { fileName });
  return data;
};

// 이미지 업로드 요청 API
export const uploadCertificateImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post('/files/cert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // 서버 응답: { fileName: "user1_cert_20251031.png" }
  return data;
};

/**
 * DELETE: 회원 탈퇴
 * TODO: 인증 - userId를 어디서 받아오는지?
 * @param {number} userId
 * @returns {Promise<Object>} response
 */
export const postUserDelete = async (userId) => {
  const { data } = await axiosInstance.put('/users/userDel', { userId: userId });
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
