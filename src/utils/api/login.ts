// src\utils\api\login.ts

import axios from "axios";
import axiosInstance from "../axiosInstance";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", payload, {
      withCredentials: true,  // This will send the JWT token as cookie automatically
    });

    const { user, token, refresh_token } = response.data;

    // Store the access token in localStorage
    localStorage.setItem("access_token", token);
    
    // No need to store the refresh token in localStorage; it's handled by the browser in cookies.
    // The refresh token will be automatically sent with requests if it's stored in an HTTP-only cookie.
    
    // Store user data in localStorage if needed
    localStorage.setItem("user", JSON.stringify(user));
    
    // Handle the response, which might not include token in the frontend 
    // since it's stored in a cookie
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    } else if (error instanceof Error) {
      throw new Error(
        error.message || "An unexpected error occurred during login."
      );
    } else {
      throw new Error("An unexpected error occurred during login.");
    }
  }
};
