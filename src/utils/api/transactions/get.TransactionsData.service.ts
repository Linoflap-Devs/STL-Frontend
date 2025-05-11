import axiosInstance from "../../axiosInstance";
import { AxiosError } from "axios";

/**
 * A service function to fetch data from the Transactions API endpoint.
 *
 * @template T - Expected response type.
 * @param baseEndpoint - Base endpoint (e.g. '/api/transactions').
 * @param pathParams - Optional array of path segments to append (e.g. ['chart1', 'chart2']).
 * @param queryParams - Optional query parameters (as an object).
 * @returns Promise<T | null>
 */

const getTransactionsData = async <T = unknown>(
  baseEndpoint: string,
  urlParam: string | number,
  queryParams: Record<string, unknown> = {}
): Promise<T | null> => {
  try {
    const fullPath = urlParam
      ? `${baseEndpoint}/${urlParam}`.replace(/\/+/g, "/")
      : baseEndpoint.replace(/\/+/g, "/");

    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: T;
    }>(fullPath, {
      params: queryParams,
    });
    console.log(
      `Full Path: ${fullPath} ${queryParams.first}  ${queryParams.second}`
    );
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

export default getTransactionsData;

/*
// Simple request (no path or query params)
await getTransactionsData('/api/transactions');

// With one optional path param
await getTransactionsData('/api/transactions', "1");


// With query params
await getTransactionsData('/api/transactions', ['1'], {
  first: 'USD',
  second: 'EUR',
});

*/
