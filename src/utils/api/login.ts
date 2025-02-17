import axiosInstance from '../axiosInstance';
import { setCookie } from "../../utils/cookieUtils";
import axios from 'axios';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
  };
}

export const loginUser = async (payload: LoginPayload, router: any): Promise<LoginResponse> => {
  try {
    console.log("Executing loginUser function...");
    const response = await axiosInstance.post('/auth/login', payload);

    console.log("Full API Response:", response);
    console.log("Extracted Data Object:", response.data.data);

    const apiData = response.data.data;

    console.log("Token from Response:", apiData?.token);
    console.log("Refresh Token from Response:", apiData?.refresh);

    if (!apiData?.token) {
      throw new Error("Access token is missing from response!");
    }

    // Store access and refresh tokens in localStorage
    localStorage.setItem('accessToken', apiData.token);
    localStorage.setItem('refreshToken', apiData.refresh);

    document.cookie = `refreshToken=${apiData.refresh}; Path=/; SameSite=None; Max-Age=86400;`;

    // Store refresh token in cookie as well (with expiration)
    setCookie('refreshToken', apiData.refresh, 1, '/');
    console.log("Stored Refresh Token in Cookie:", document.cookie);

    // Redirect to dashboard page
    router.push("/dashboard");

    return {
      token: apiData.token,
      refreshToken: apiData.refresh,
      user: response.data.user ?? { id: 0, username: "Unknown" }
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    } else if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred during login.');
    } else {
      throw new Error('An unexpected error occurred during login.');
    }
  }
};
