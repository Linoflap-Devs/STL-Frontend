import axiosInstance from "../../axiosInstance";
import { AxiosError } from "axios";

/**
 * A service function to delete resources via DELETE request
 * 
 * @template T - Expected response type (defaults to unknown)
 * @param endpoint - API endpoint URL (should include resource ID)
 * @param queryParams - Optional query parameters
 * @returns Promise with success/error response
 */

/*
    // Basic user with ID 123
    const result = await deleteUserData<{ deletedCount: number }>("/api/users/123");

    if (result.success) {
    console.log(`Deleted ${result.data?.deletedCount} records`);
    } else {
    console.error(result.message);
    }

    // With Query Parameters
    // soft delet with reason
    await deleteUserData(
    "api/posts/456",
    { reason: "spam", softDelete: "true"}
    )

    // With Type Safety
    interface DeletionResponse {
        id: string;
        deletedAt: string;
    }

    const response = await deleteResource<DeletionResponse>("/api/comments/789");
    if (response.success) {
    console.log("Deleted at:", response.data?.deletedAt);
    }
*/

const deleteUserData = async <T = unknown> (
    endpoint: string, 
    queryParams:  Record<string, unknown> = {}
): Promise< {
    success: boolean;
    message?: string;
    data: T | null;
}> => {
    const token = localStorage.getItem("authToken");

    if(!token) {
        const errorMsg = "No authentication token found";
        console.error(errorMsg);
        return { success: false, message: errorMsg, data: null};
    }

    try {
        const response = await axiosInstance.delete<T>(
            endpoint,
            {
                params: queryParams,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                message: "Delete Request on Users Data Succeeded",
                data: response.data
            }
    } catch(error) {
        let errorMessage = "Failed to delete resource";

        if (error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || error.message;
            console.error(`DELETE Error (${endpoint}):`, errorMessage);
        } else if (error instanceof Error) {
            errorMessage = error.message;
            console.error("Unexpected error:", error);
        }

        return {
            success: false,
            message: errorMessage,
            data: null,
        }
    }
}