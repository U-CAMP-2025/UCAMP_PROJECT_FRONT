import { axiosInstance } from './axios';

/**
 * POST: 녹음 파일 업로드 (STT 변환용)
 * @param {Blob|File} file - 업로드할 오디오 Blob (RecordRTC 결과)
 * @param {number} simulation_id - 세션 ID
 * @param {number} qa_id - 질문 ID
 * @returns {Promise<Object>} response
 */
export const postRecordFile = async (file, simulation_id, qa_id) => {
  const formData = new FormData();
  formData.append('file', file, `q${qa_id}.webm`);
  formData.append('simulation_id', simulation_id);
  formData.append('qa_id', qa_id);

  const { data } = await axiosInstance.post(
    `/simulations/${simulation_id}/stt/${qa_id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
};
