import axios from "axios";
import { refreshAccessToken } from "../hooks/useRefreshToken";

// axios interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Retry the failed request with the new access token
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(error.config);
      } else {
        console.error("Token refresh failed, logging out.");
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
