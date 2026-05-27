import axios from 'axios';

const API_URL = 'https://passport-scraper.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

export const fetchPosts = async (filters = {}, page = 0, size = 50) => {
  const params = { page, size, ...filters };
  const { data } = await api.get('/posts', { params });
  return data;
};

export const searchPosts = async (keyword, page = 0) => {
  const { data } = await api.get('/search', { params: { keyword, page } });
  return data;
};

export const fetchStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};

export const translatePost = async (postId, targetLanguage) => {
  const { data } = await api.post(`/translate/${postId}`, null, { params: { targetLanguage } });
  return data;
};

export const fetchClusters = async () => {
  const { data } = await api.get('/clusters');
  return data;
};

export const fetchLanguages = async () => {
  const { data } = await api.get('/languages');
  return data;
};

export const downloadCSV = async (filters = {}) => {
  const { data } = await api.get('/export/csv', { params: filters, responseType: 'blob' });
  return data;
};

export default api;