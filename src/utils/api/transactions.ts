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

export const fetchTransactions = async (p0?: { date: string; }) => {
    try {
        const url = validateRelativeUrl("/transactions/getTransactions");
        const response = await axiosInstance.get(url, {
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

export default { fetchHistoricalSummary, fetchHistoricalRegion, fetchTransactions, fetchDrawSummary };


