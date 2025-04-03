import axiosInstance from '../axiosInstance';

const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

export const fetchOperators = async () => {
    try {
        const url = validateRelativeUrl("/operators/getOperators");
        const response = await axiosInstance.get(url, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

export const fetchOperator = async () => {
    try {
        const url = validateRelativeUrl("/operators/getOperator");
        const response = await axiosInstance.get(url, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

export default { fetchOperators, fetchOperator };


