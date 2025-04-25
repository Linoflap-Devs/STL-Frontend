import axiosInstance from '../../axiosInstance';
import { AxiosError } from 'axios';

/**
 * A service function to fetch data from the Transactions API endpoint.

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

// <T> generic type parameter, placeholder for the actual type that will be provided when the function is called, unknown = default
const getTransactionsData = async <T = unknown>(
    endpoint: string,
    queryParams: Record<string, unknown> = {}
): Promise <T | null> => {
    // const token = localStorage.getItem('authToken');

    // if(!token) {
    //     const errorMsg = "No authentication token found";
    //     console.error(errorMsg);
    //     return {success: false, message: errorMsg, data: null}
    // }

    try {
        const response = await axiosInstance.get<{
            success: boolean;
            message: string;
            data: T;
        }>(endpoint, {
            params: queryParams,
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        })

        if(response.data.success) {
            return response.data.data;
        } else {
            console.error(`API Error (${endpoint}):`, response.data.message);
            return null;
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

        return null
    }
};

export default getTransactionsData;
