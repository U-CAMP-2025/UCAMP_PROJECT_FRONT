import axiosInstance from './axios';

/**
 * GET: 리뷰 리스트 조회
 * @param {long} postId - 포스트 ID
 * @returns {Promise<Object>} response
 */
export const fetchReviewList = async (postId) => {
  const { data } = await axiosInstance.get(`/posts/${postId}/reviews`);
  return data;
};

/**
 * POST: 리뷰 작성
 * @param {long} postId - 포스트 ID
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise<Object>} response
 */
export const postReview = async (postId, reviewData) => {
  const { data } = await axiosInstance.post(`/posts/${postId}/reviews`, reviewData);
  return data;
};

/**
 * DELETE: 리뷰 삭제
 * @param {long} reviewId - 리뷰 ID
 * @param {long} postId - 포스트 ID
 * @returns {Promise<Object>} response
 */
export const deleteReview = async (postId, reviewId) => {
  const { data } = await axiosInstance.delete(`/posts/${postId}/reviews/${reviewId}`);
  return data;
};
