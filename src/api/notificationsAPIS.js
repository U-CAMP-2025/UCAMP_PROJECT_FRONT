import axiosInstance from './axios';

/**
 * GET: 전체 알람 조회
 * @returns {Promise<Object>} response
 */
export const getNoti = async () => {
  const { data } = await axiosInstance.get('/notifications');
  return data;
};

/**
 * Put: 단일 알람 읽기
 * @param {long} notiId - 알람ID
 * @returns {Promise<Object>} response
 */
export const notiRead = async (notiId) => {
  const { data } = await axiosInstance.put(`/notifications/${notiId}`);
  return data;
};

/**
 * Put: 전체 알람 읽기
 * @param {long} notiId - 알람ID
 * @returns {Promise<Object>} response
 */
export const notiReadAll = async () => {
  const { data } = await axiosInstance.put(`/notifications`);
  return data;
};

/**
 * DELETE: 단일 알람 삭제
 * @param {long} notiId - 알람ID
 * @returns {Promise<Object>} response
 */
export const notiDel = async (notiId) => {
  const { data } = await axiosInstance.delete(`/notifications/${notiId}`);
  return data;
};

/**
 * DELETE: 전체 알람 삭제
 * @returns {Promise<Object>} response
 */
export const notiDelAll = async () => {
  const { data } = await axiosInstance.delete(`/notifications`);
  return data;
};
