import axiosInstance from '../axiosInstance';
import axios from "axios";

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
        console.error("Error fetching historical region:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export default fetchHistoricalRegion;