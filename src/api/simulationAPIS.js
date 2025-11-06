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

export const transCheckimulation = async (simulationId) => {
  const { data } = await axiosInstance.get(`/simulation/${simulationId}/transCheck`);
  return data;
};
