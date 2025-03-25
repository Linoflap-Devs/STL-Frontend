import axiosInstance from '../../axiosInstance';
import { AxiosError } from 'axios';

/**
 * A service function to fetch data from the Transactions API endpoint.
 * 
 * @template T - the expected response data type (defaults to unknown if not provided).
 * @param endpoint - The API endpoint to fetch data from.
 * @param queryParams - Optional query parameters (remain loosely typed for now)
 * @returns Promise containing either properly typed response or erro object.

 */


/*
    * Enable this code block if you want to use TypeScript interfaces for query parameters
    * Define the interfaces for query parameters to provide type checking and documentation.

    interface SampleInterface {
        sampleParam: string;
        sampleParam: string;
        sampleParam: string;
    }
*/

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