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
    * Add type gradually as our API respose become clearer:

    Early usage (no type specified):
    const response = await fetchTransactionsData('/some/endpoint');

    Later usage (with type):
    interface MyResponseType {
        items: Array<{id: string, value: number}>;
        total: number;
    }
    const typedResponse = await fetchTransactionsData<MyResponseType>('/typed/endpoint');
*/

const getTransactionsData = async <T = unknown>(
    endpoint: string,
    queryParams: Record<string, unknown> = {}
): Promise <{
    success: boolean;
    message?: string;
    data: T | null; // Changed from empty array to null for more flexibility
}> => {
    const token = localStorage.getItem('authToken');

    if(!token) {
        const errorMsg = "No authentication token found";
        console.error(errorMsg);
        return {success: false, message: errorMsg, data: null}
    }

    try {
        const response = await axiosInstance.get<T>(endpoint, {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        let errorMessage = "An unexpected error occured";

        if(error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || errorMessage;
            console.error(`API Error (${endpoint}):`, errorMessage)
        }else if (error instanceof Error) {
            errorMessage = error.message;
            console.error("Unexpected error:", error);
        }

        return {
            success: false,
            message: errorMessage,
            data: null, // More flexible than always returning an empty array
        }
    }
};

export default getTransactionsData;
