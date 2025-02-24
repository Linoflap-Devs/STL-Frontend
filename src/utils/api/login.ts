import { jwtDecode } from "jwt-decode";
import axiosInstance from '../axiosInstance';
import axios from 'axios';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export const loginUser = async (payload: LoginPayload, router: any): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', payload, {
      withCredentials: true,
    });

    const apiData = response.data.data;
    const token = apiData?.token;

    if (!token) {
      throw new Error("Access token is missing from response!");
    }

    router.push("/dashboard");

    return {
      token,
      refreshToken: apiData.refresh,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      console.error("Axios Error:", error.response);
      throw new Error(errorMessage);
    } else if (error instanceof Error) {
      console.error("General Error:", error.message);
      throw new Error(error.message || 'An unexpected error occurred during login.');
    } else {
      console.error("Unknown Error occurred during login.");
      throw new Error('An unexpected error occurred during login.');
    }
  }
};


