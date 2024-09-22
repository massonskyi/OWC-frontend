import axios, { AxiosError, AxiosResponse } from 'axios';

// Создаем экземпляр Axios
const axiosInstance = axios.create({
  baseURL: '/api_version_1', // Замените на ваш базовый URL
});

// Добавляем интерцептор для обработки ошибок
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 404) {
      // Перенаправляем на страницу 404
      window.location.href = '/404';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
