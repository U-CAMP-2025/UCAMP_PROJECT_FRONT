import axiosInstance from './axios';

/**
 * GET: 유저 단일 조회
 * @param {string} nickname - 유저 닉네임
 * @returns {Promise<Object>} response
 */
export const fetchGetUser = async (nickname) => {
  const { data } = await axiosInstance.get(`/admin/users/${nickname}`);
  return data;
};

/**
 * GET: 관리자 유저 전체 조회
 * @returns {Promise<Array>} response
 */
export const fetchGetAllUser = async () => {
  const { data } = await axiosInstance.get('/admin/users');
  return data;
};

/**
 * PATCH: 관리자 유저 합격 여부 변경
 *
 * @param {Object} payload - 요청 바디
 * @param {string} payload.userId - 유저 아이디
 * @param {string} payload.passStatus - 합격 여부 ("PASS" | "FAIL" 등)
 * @returns {Promise<Object>} response
 */
export const patchUserPass = async (payload) => {
  const { data } = await axiosInstance.put('/admin/pathPass', payload);
  return data;
};

/**
 * GET: 관리자 음성 변환 데이터 조회
 * @returns {Promise<Array>} response
 */
export const fetchTranscriptions = async () => {
  const { data } = await axiosInstance.get('/admin/transcription');
  return data; // [{ title, nickname, email, completedAt, status }, ...]
};
