import axiosInstance from "../../axiosInstance";
import { AxiosError } from "axios";

/**
 * A service function to send data via POST to an API endpoint.
 *
 * @template T - Expected response type (defaults to unknown).
 * @param endpoint - API endpoint URL.
 * @param requestBody - Data to send in the request body (optional).
 * @param queryParams - Optional query parameters for URL.
 * @returns Promise with success/error response.
 */

/*
 * Basic Usage
  const result = await postWinningCombinationsData<{ id: string }>(
    "/api/bets",
    { amount: 100, currency: "USD" }, // requestBody
    { ref: "promo2023" }              // queryParams
  );

  if (result.success) {
      console.log("New bet ID:", result.data?.id);
  } else {
      console.error("Failed:", result.message);
  }

  * Type Safety
  interface BetResponse {
    id: string;
    status: 'pending' | 'won' | 'lost';
  }

  const response = await postWinningCombinationsData<BetResponse>(
      "/api/bets",
      { amount: 50, game: "roulette" }
  );

  if (response.success) {
      // TypeScript knows response.data is BetResponse
      console.log(response.data.status); 
  }
*/

const postWinningCombinationsData = async <T = unknown>(
  endpoint: string,
  requestBody: Record<string, unknown> = {},
  queryParams: Record<string, unknown> = {}
): Promise<{
  success: boolean;
  message?: string;
  data: T | null; // on success: T which is generic, on error: null
}> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    const errorMsg = "No authentication token found";
    console.error(errorMsg);
    return { success: false, message: errorMsg, data: null };
  }

  try {
    const response = await axiosInstance.post<T>(endpoint, requestBody, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/json'
      },
    });

    return {
      success: true,
      message: "POST Request on Winnings Combinations Data Succeeded",
      data: response.data,
    };
  } catch (error) {
    let errorMessage = "An unexpected error occured";

    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
      console.error(`API Error (${endpoint}):`, errorMessage);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Unexpected error:", error);
    }

    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};
