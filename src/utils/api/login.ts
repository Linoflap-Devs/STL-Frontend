import axiosInstance from '../axiosInstance';
import axios from 'axios';

interface LoginPayload {
  email: string; // Matches 'user' in backend
  password: string;
  id: number; // Matches 'id' (UserId) in backend
  role: number; // Matches 'role' (UserTypeId) in backend
}

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export const loginUser = async (payload: { email: string; password: string }, router: any) => {
  try {
    const response = await axiosInstance.post('/auth/login', payload, { withCredentials: true });

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
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    } else if (error instanceof Error) {
      throw new Error(error.message || "An unexpected error occurred during login.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
  
};



