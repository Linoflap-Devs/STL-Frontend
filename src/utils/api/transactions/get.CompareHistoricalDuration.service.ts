import axiosInstance from "../../axiosInstance";
import { AxiosError } from "axios";

/**
 * A service function to fetch comparison data from the Transactions API endpoint.
 *
 * @template T - Expected response type.
 * @param baseEndpoint - Base endpoint (e.g. '/api/transactions').
 * @param urlParam - Optional path param (e.g. 'chart').
 * @param queryParams - Optional query parameters (e.g. { firstStart, firstEnd, secondStart?, secondEnd? }).
 * @returns Promise<T | null>
 */
const getCompareHistoricalDuration = async <T = unknown>(
  endpoint: string,
  urlParam: string | number,
  queryParams: {
    firstStart: string,
    firstEnd: string;
    secondStart: string,
    secondEnd: string,
  }
): Promise<T | null> => {
  try {
    const fullPath = urlParam
      ? `${endpoint}/${urlParam}`.replace(/\/+/g, "/")
      : endpoint.replace(/\/+/g, "/");

    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: T;
    }>(fullPath, {
      params: queryParams,
    });
		console.log("Making API request to:", fullPath);
    console.log("With query parameters:", queryParams);

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error(`API Error (${fullPath}):`, response.data.message);
      return null;
    }
  } catch (error) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
      console.error(`API Error:`, errorMessage);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Unexpected error:", error);
    }

    return null;
  }
};

export default getCompareHistoricalDuration;
