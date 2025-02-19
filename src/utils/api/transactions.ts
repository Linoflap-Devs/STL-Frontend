import axiosInstance from '../axiosInstance';
import axios from "axios";

const fetchHistoricalSummary = async (queryParams: Record<string, any>) => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await axiosInstance.get("/transactions/getHistorical", {
            params: queryParams,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        
        return response.data;
    } catch (error) {
        console.error("Error fetching historical summary:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

export default fetchHistoricalSummary;

