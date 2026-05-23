import axios from 'axios';

const api = axios.create({
  baseURL: 'http://rwymo8fzm2o2eoet81n3bb7x.176.112.158.15.sslip.io',
});

// Автоматически добавляем JWT токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;