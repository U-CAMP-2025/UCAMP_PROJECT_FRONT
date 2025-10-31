import axiosInstance from './axios';

/**
 * GET: 내 질문셋 가져오기
 * @returns {Promise<Object>} response
 */
export const myPostAll = async () => {
  const { data } = await axiosInstance.get('/posts/my');
  return data;
};
