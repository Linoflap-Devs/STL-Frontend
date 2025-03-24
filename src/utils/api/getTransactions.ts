import axiosInstance from '../axiosInstance';
import axios from "axios";

interface Transaction {
    TransactionId: number;
    TransactionNumber: string;
    Name: string;
    CombinationOne: number;
    CombinationTwo: number;
    BetAmount: number;
    GameTypeId: number;
    GameType: string;
    BetTypeId: number;
    BetType: string;
    RegionId: number;
    Region: string;
    ProvinceId: number;
    Province: string;
    City: string;
    DateOfTransaction: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Transaction[];
}

const fetchTransactions = async (queryParams: Record<string, any>):Promise<ApiResponse> => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await axiosInstance.get("/transactions/getTransactions" , {
            params: queryParams,
            withCredentials: true,
        })

        console.log('Response Data (fetchTransactions):' + response.data)
        return response.data;
    } catch (error){
        if (axios.isAxiosError(error)) {
            console.log('Axios error fetching transactions (fetchTransactions):', error.response?.data || error.message);
            return {success: false, message: error.response?.data?.message || error.message, data: []};
        } else {    
            console.error("Unexpected error fetching transactions", (error as Error).message);  
            return{ success: false, message: (error as Error).message, data: [] };
        }
    }
}

export default fetchTransactions;