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
  user: {
    id: number;
    username: string;
  };
}

interface DecodedToken {
  user: string;
  id: number;
  role: number;
  iat: number;
  exp: number;
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

    // Decode JWT token to extract user info
    const decoded: DecodedToken = jwtDecode(apiData.token);
    console.log("Decoded Token Data:", decoded);

    const user = {
      id: decoded.id,
      username: decoded.user,
      role: decoded.role
    };

    console.log("Extracted User:", user);

    // Store tokens and user in localStorage
    localStorage.setItem('accessToken', apiData.token);
    localStorage.setItem('refreshToken', apiData.refresh);
    localStorage.setItem('user', JSON.stringify(user));

    document.cookie = `refreshToken=${apiData.refresh}; Path=/; SameSite=None; Max-Age=86400;`;

    console.log("Stored User in localStorage:", localStorage.getItem('user'));

    // Redirect to dashboard page
    router.push("/dashboard");

    return {
      token: apiData.token,
      refreshToken: apiData.refresh,
      user
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