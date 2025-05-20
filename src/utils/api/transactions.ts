import axios from 'axios';
import axiosInstance from '../axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchHistoricalSummary = async (filters?: { from?: string; to?: string;}) => {
    try {
        const url = validateRelativeUrl("/transactions/getHistorical");
        const response = await axiosInstance.get(url, {
            params: filters
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

export const fetchHistoricalRegion = async (p0?: { date: string; }) => {
    try {
        const url = validateRelativeUrl("/transactions/getHistoricalRegion");
        const response = await axiosInstance.get(url, {
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

export const fetchTransactions = async (filters?: { from?: string, to?: string }) => {
    try {
        const url = validateRelativeUrl("/transactions/getTransactions");
        const response = await axiosInstance.get(url, {
            params: filters
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

export const fetchDrawSummary = async(provinceId: number, gameCategoryId: number, month: number) => {
    try {
        const url = validateRelativeUrl("/transactions/getDrawSummary");
        const response = await axiosInstance.get(url, {
            params: {
                provinceId: provinceId,
                gameCategoryId: gameCategoryId,
                month: month
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching draw summary:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
}

export const fetchRetailReceipts = async (year: number, month: number) => {
  try {
    const urlTemplate = "/transactions/getRetailReceipts/metrics/:year/:month";
    const url = urlTemplate
      .replace(":year", year.toString())
      .replace(":month", month.toString());

    console.log("[fetchRetailReceipts] Constructed URL:", url);

    const response = await axiosInstance.get(url);

    console.log("[fetchRetailReceipts] Response status:", response.status);
    console.log("[fetchRetailReceipts] Response data:", response.data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // error is narrowed to AxiosError here
      console.error("[fetchRetailReceipts] Axios error message:", error.message);
      if (error.response) {
        console.error("[fetchRetailReceipts] Axios error response status:", error.response.status);
        console.error("[fetchRetailReceipts] Axios error response data:", error.response.data);
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: [],
      };
    } else {
      console.error("[fetchRetailReceipts] Unknown error:", error);
      return {
        success: false,
        message: "Unknown error occurred",
        data: [],
      };
    }
  }
};


export default { fetchHistoricalSummary, fetchHistoricalRegion, fetchTransactions, fetchDrawSummary };


