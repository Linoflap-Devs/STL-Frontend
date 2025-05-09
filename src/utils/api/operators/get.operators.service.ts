import axiosInstance from '../../axiosInstance';
import axios, { AxiosError } from 'axios';

/**
 * A service function to fetch data from the Users API endpoint.
 *
 * @template T - The expected response data type (defaults to unknown).
 * @param endpoint - The API endpoint to fetch data from.
 * @param queryParams - Optional query parameters.
 * @returns Promise containing either a properly typed response or error object.
 */

export const getOperatorsData = async <T = unknown>(
    endpoint: string,
    queryParams: Record<string, unknown> = {}
  ): Promise<{
    success: boolean;
    message?: string;
    data: T | null;
  }> => {
    try {
      const response = await axiosInstance.get<T>(endpoint, {
        params: queryParams,
      });
  
      return {
        success: true,
        message: 'GET Request on Operators Data Succeeded',
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
  
