import axiosInstance from "../../axiosInstance";
import { AxiosError } from "axios";

/**
 * A service function to send partial updates via PATCH to an API endpoint.
 * 
 * @template T - Expected response type (defaults to unknown).
 * @param endpoint - API endpoint URL.
 * @param patchData - Partial data to update (request body).
 * @param queryParams - Optional query parameters for URL.
 * @returns Promise with success/error response.
 */

/*
 * Basic Usage
  const result = await patchUsersData<{ updated: boolean}> (
    "api/users/123",
    { name: "New Name", email: "new@email.com" } // Partial update data
  );
  if (result.success) {
  console.log("Updated status", result.data?.updated);
  }

  * With Query Parameters
  await patchUsersData(
  "/api/users/123",
  {status: "active"},
  {notifyAdmin: "true"} // QueryParams
  );

  * With Type Safety
  interface UserResponse {
    id: string;
    name: string;
    lastUpdated: string;
  }

  const response = await patchUsersData<UserResponse>(
  "/api/users/123",
  { name: "Updated Name"}
  )

  if(response.success) {
    console.log("Updated at:", response.data?.lastUpdated)
    // TypeScript knows response.data is UserResponse
  }
*/

const patchUserData = async <T = unknown>(
    endpoint: string,
    patchData: Record<string, unknown> = {},
    queryParams: Record<string, unknown> = {},
): Promise<{
    success: boolean;
    message?: string;
    data: T | null;
}> => {

    try {
        const response = await axiosInstance.patch<T>(
            endpoint, 
            patchData, 
            {
            params: queryParams,
        });

        return {
            success: true,
            message: "Patch Request on Users Data Succeeded",
            data: response.data,
        }
    } catch (error) {
        let errorMessage = "An unexpected error occured";

        if(error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || error.message;
            console.error(`API Error (${endpoint}): `, errorMessage)
        }else if (error instanceof Error) {
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