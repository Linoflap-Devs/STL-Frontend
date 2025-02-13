import axios from 'axios';
import axiosInstance from '../axiosInstance';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  refreshToken: any;
  UserTypeId(UserTypeId: any): unknown;
  data: any;
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);

    localStorage.setItem('accessToken', response.data.token);

    document.cookie = `refreshToken=${response.data.refreshToken}; path=/; secure; HttpOnly; SameSite=Strict`;

    console.log("Stored Access Token in Memory:", localStorage.getItem("accessToken"));
    console.log("Stored Refresh Token in Cookie:", document.cookie);

    // Return the login response data
    return response.data;
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

