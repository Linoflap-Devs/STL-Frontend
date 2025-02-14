import axios from 'axios';
import { getCookie, setCookie } from '../utils/cookieUtils'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Request Interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refresh_token');
        if (!refreshToken) {
          throw new Error('Refresh token is missing');
        }

        const response = await axios.post('/tokenRefresh', {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        setCookie('access_token', access_token, 1);
        setCookie('refresh_token', refresh_token, 7);

        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {

        console.error('Refresh token failed', refreshError);
        // Redirect to login or show error message
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;