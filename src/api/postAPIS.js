import { axiosInstance } from './axios';

/**
 * GET: 내 질문셋 가져오기
 * @returns {Promise<Object>} response
 */
export const myPostAll = async () => {
  const { data } = await axiosInstance.get('/posts/my');
  return data;
};

/**
 * POST: 질문세트 생성
 * @param {Object} form 데이터
 * @returns {Promise<Object>} response
 */
export const createPost = async (form) => {
  const { data } = await axiosInstance.post('/posts', form);
  return data;
};

/**
 * GET: 질문세트 상세조회
 * @param {Long} postId 데이터
 * @returns {Promise<Object>} response
 */
export const getPost = async (postId) => {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
  return data;
};

/**
 * PUT: 질문세트 수정
 * @param {Long} postId 데이터
 * @param {Object} form 데이터
 * @returns {Promise<Object>} response
 */
export const editPost = async (postId, form) => {
  const { data } = await axiosInstance.put(`/posts/${postId}`, form);
  return data;
};

/**
 * DELETE: 질문세트 삭제
 * @param {Long} postId 데이터
 * @returns {Promise<Object>} response
 */
export const delPost = async (postId) => {
  const { data } = await axiosInstance.delete(`/posts/${postId}`);
  return data;
};

/**
 * 공유질문셋 조회
 * @param {Object} form
 * @param {number} form.page 페이지 번호
 * @param {number} form.limit 한 페이지 아이템 수
 * @param {string} form.sort 정렬 기준
 * @param {Array<number>} form.jobs 선택된 직무 ID 배열
 * @returns {Promise<Object>} response
 */
export const scrollQaSet = async (form) => {
  const { data } = await axiosInstance.post('/posts/search', form);
  return data;
};

/**
 * POST: 질문세트 복제
 * @param {Long} postId 데이터
 * @returns {Promise<Object>} response
 */
export const copyPost = async (postId) => {
  const { data } = await axiosInstance.post(`/posts/${postId}`);
  return data;
};
