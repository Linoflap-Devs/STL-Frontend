import axiosInstance from "../axiosInstance";
import axios from "axios";

export const loginUser = async (
  payload: { email: string; password: string },
  router: any
) => {
  try {
    await axiosInstance.post("/auth/login", payload, {
    });

    router.push("/dashboard");
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
      throw new Error("An unexpected error occurred.");
    }
  }
};
