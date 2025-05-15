import axiosInstance from "../../axiosInstance";
import axios, { AxiosError } from 'axios';

/**
 * A service function to send data via POST to an API endpoint.
 *
 * @template T - Expected response type (defaults to unknown).
 * @param endpoint - API endpoint URL.
 * @param requestBody - Data to send in the request body (optional).
 * @param queryParams - Optional query parameters for URL.
 * @returns Promise with success/error response.
 */

export const postUsersData = async <T = unknown>(
  endpoint: string,
  body: Record<string, unknown> = {}
): Promise<{
  success: boolean;
  message?: string;
  data: T | null;
}> => {
  try {
    const response = await axiosInstance.post<T>(endpoint, body);
    return {
      success: true,
      message: 'POST Request on Users Data Succeeded',
      data: response.data,
    };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
      console.error(`API Error (${endpoint}):`, errorMessage);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Unexpected error:', error);
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};


