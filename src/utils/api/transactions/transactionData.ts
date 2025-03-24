import axiosInstance from '../../axiosInstance';
import { AxiosError } from 'axios';

/**
 * A generic function to fetch data from the transactions API.
 * 
 * @param endpoint - The API endpoint to fetch data from (e.g., "/transactions/getHistoricalRegion").
 * @param queryParams - An object containing query parameters to filter or customize the request.
 * @returns A promise that resolves to the response data or an error object.
 * 
 * @example
 * // Fetch historical summary region data
 * const historicalSummaryRegionData = await fetchTransactionsData("/transactions/getHistoricalRegion", { startDate: "2023-01-01", endDate: "2023-12-31" });
 * 
 * @example
 * // Fetch compare historical date data
 * const compareHistoricalDateData = await fetchTransactionsData("/transactions/compareHistoricalDate", { startDate: "2023-01-01", endDate: "2023-12-31" });
 */



interface HistoricalSummaryRegionParams {
    startDate: string;
    endDate: string;
    region?: string; // Optional parameter
}

interface CompareHistoricalDateParams {
    startDate: string;
    endDate: string;
    comparisonType?: string; // Optional parameter
}

const fetchTransactionsData = async (endpoint: string, queryParams: Record<string, any>) => {
    try {
        // Retrieve the authentication token from localStorage
        const token = localStorage.getItem("authToken");

        // Make the GET request to the specified endpoint with query parameters and authorization header
        const response = await axiosInstance.get(endpoint, {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Log the response data for debugging purposes
        console.log(`Response Data (${endpoint}): ${JSON.stringify(response.data)}`);

        // Return the response data
        return response.data;
    } catch (error) {
        // Handle Axios errors (e.g., network errors, server errors)
        if (error instanceof AxiosError) {
            console.error(`Error fetching data from ${endpoint}:`, error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || error.message, data: [] };
        }

        // Handle unexpected errors
        console.error("Unexpected error:", error);
        return { success: false, message: "An unexpected error occurred", data: [] };
    }
};

export default fetchTransactionsData;