import axiosInstance from "~/utils/axiosInstance";
import { AxiosError } from "axios";


/**
 * A service function to fetch data from the Winners API endpoint.
 *
 * @template T - Expected response type.
 * @param baseEndpoint - Base endpoint (e.g. '/winnners').
 * @param pathParams - Optional array of path segments to append (e.g. ['1', '2']).
 * @param queryParams - Optional query parameters (as an object).
 * @returns Promise<T | null>
 */

const getCompareHistoricalWinners = async <T = unknown>(
	baseEndpoint: string,
	urlParam?: string | number,
	queryParams: Record<string, unknown> = {}
): Promise<T | null> => {
	try {
		const fullPath = urlParam
  ? `${baseEndpoint.replace(/\/$/, "")}/${urlParam}` 
  : baseEndpoint.replace(/\/+$/, "");

		const response = await axiosInstance.get<{
			success: boolean;
			message: string;
			data: T;
		}>(fullPath, {
			params: queryParams,
		});
		console.log("Making API request to:", fullPath);
    console.log("With query parameters:", queryParams); // This will show all params including gameCategory

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

export default getCompareHistoricalWinners;