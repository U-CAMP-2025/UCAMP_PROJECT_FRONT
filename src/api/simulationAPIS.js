import { axiosInstance } from './axios';

export const fetchSimulationRecords = async () => {
  const { data } = await axiosInstance.get('/simulation/records');
  return data;
};

export const fetchSimulationResult = async (simulationId) => {
  const { data } = await axiosInstance.get(`/simulation/${simulationId}/result`);
  return data;
};

export const putSimulationFinalize = async (simulationId, body) => {
  await axiosInstance.put(`/simulation/${simulationId}/finalize`, body);
  return;
};

export const transCheckSimulation = async (simulationId) => {
  const res = await axiosInstance.get(`/simulation/${simulationId}/transCheck`);
  return res?.data?.data === true;
};

export const createSimulation = async (body) => {
  const { data } = await axiosInstance.post('/simulation', body);
  return data;
};
