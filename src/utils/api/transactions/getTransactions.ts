import axiosInstance from '../../axiosInstance';
import { AxiosError } from 'axios';

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
        // Retirieving authToken but not using it in the request, add it to the request headers if required.
        const token = localStorage.getItem("authToken");

        const response = await axiosInstance.get("/transactions/getTransactions" , {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`
            },
            // unnecessary because a default header is already set in axiosInstance.ts
            // withCredentials: true,
        })

        console.log(`Response Data (fetchTransactions): ${JSON.stringify(response.data)}`)
        return response.data;
    } catch (error){
        if (error instanceof AxiosError) {
            console.error("Error fetching transactions:", error.response?.data?.message || error.message);

            return {success: false, message: error.response?.data?.message || error.message, data: []};
        }
        console.error("Unexepected error:", error);
        return {success: false, message: "An unexpected eeror occured", data: []}
    }
}

export default fetchTransactions;