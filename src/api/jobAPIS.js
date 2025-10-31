import axiosInstance from './axios';

/**
 * GET: 직무 목록 조회
 * @returns {Promise<Array>} response
 */
export const fetchJobList = async () => {
  const { data } = await axiosInstance.get('/jobs');
};
