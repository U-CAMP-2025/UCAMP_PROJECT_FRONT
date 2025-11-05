import { axiosInstance } from './axios';

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
 * returns {Promise<Array>} response
 * @param {Object} params
 * @param {number} [params.page=0] - 페이지 번호 (0-based)
 * @param {number} [params.size=20] - 페이지 크기
 * @param {string} [params.sort='createdAt,desc'] - 정렬 기준
 * @returns {Promise<Object>} Page<UserResponse>
 */
export const fetchGetAllUser = async ({ page = 0, size = 20, sort = 'createdAt,desc' } = {}) => {
  const { data } = await axiosInstance.get('/admin/users', {
    params: { page, size, sort },
  });
  return data; // Page 구조: { content, totalElements, totalPages, size, number, ... }
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
//  * returns {Promise<Array>} response
 * @param {number} page  0-base
 * @param {number} size  페이지 크기
 * @param {string} sort  예) 'completed_at,desc'
 */
export const fetchTranscriptions = async ({
  page = 0,
  size = 20,
  sort = 'completed_at,desc',
} = {}) => {
  const { data } = await axiosInstance.get('/admin/transcription', {
    params: { page, size, sort },
  });
  return data; // [{ title, nickname, email, completedAt, status }, ...]
};
