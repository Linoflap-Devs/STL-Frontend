import axiosInstance from '../axiosInstance';
import { AxiosError } from 'axios';

const fetchHistoricalRegion = async (queryParams: Record<string, any>) => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await axiosInstance.get("/transactions/getHistoricalRegion" , {
            params: queryParams,
            withCredentials: true,
        })

        console.log('Response Data (GetHistorialRegion):' + response.data)
        return response.data;
    } catch (error){
        if (error instanceof AxiosError) {
                    console.error("Error fetching CollectorDashboardSummary:", error.response?.data?.message || error.message);
        
                    return {success: false, message: error.response?.data?.message || error.message, data: []};
                }
                console.error("Unexepected error:", error);
                return {success: false, message: "An unexpected eeror occured", data: []}
            }
        };
        
export default fetchHistoricalRegion;