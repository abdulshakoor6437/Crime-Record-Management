import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getCases = async () => {
  const response = await api.get('/cases');
  return response.data;
};

export const getOfficers = async () => {
  const response = await api.get('/officers');
  return response.data;
};

export const getCriminals = async () => {
  const response = await api.get('/criminals');
  return response.data;
};

export const createCase = async (caseData) => {
  const response = await api.post('/cases', caseData);
  return response.data;
};

export const getVictims = async () => {
  const response = await api.get('/victims');
  return response.data;
};

export const createOfficer = async (officerData) => {
  const response = await api.post('/officers', officerData);
  return response.data;
};

export const createCriminal = async (criminalData) => {
  const response = await api.post('/criminals', criminalData);
  return response.data;
};

export const createVictim = async (victimData) => {
  const response = await api.post('/victims', victimData);
  return response.data;
};
