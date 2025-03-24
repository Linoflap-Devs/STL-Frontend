import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';

// Pass query parameters to get desired data.
const fetchCollectorDashboardSummary = async (queryParams: Record<string, any>) => {
    try {

        // Retirieving authToken but not using it in the request, add it to the request headers if required.
        const token = localStorage.getItem("authToken");

        const response = await axiosInstance.get("/transactions/collectorDashboardSummary", {
            params: queryParams,
            headers: {  
                Authorization: `Bearer ${token}`
            },
            // unnecessary because a default header is already set in axiosInstance.ts
            // withCredentials: true,
        });
        
        console.log(`Response Data (fetchCollectorDashboardSummary): ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error fetching CollectorDashboardSummary:", error.response?.data?.message || error.message);

            return {success: false, message: error.response?.data?.message || error.message, data: []};
        }
        console.error("Unexepected error:", error);
        return {success: false, message: "An unexpected eeror occured", data: []}
    }
};

export default fetchCollectorDashboardSummary;

