import axiosInstance from "../axiosInstance";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

const getCurrentUser = async (queryParams: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/users/getCurrentUser");
        const response = await axiosInstance.get(url, {
            params: queryParams,
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

const logoutUser = async (queryParams: Record<string, any> = {}) => {
    try {
        const url = validateRelativeUrl("/auth/logout");
        const response = await axiosInstance.delete(url, {
            params: queryParams,
            withCredentials: true,
        });

        return { success: true, message: "Logout successful", data: response.data };
    } catch (error) {
        console.error("Error logging out:", (error as Error).message);
        return { success: false, message: (error as Error).message };
    }
};

const verifyPass = async (password: string) => {
    try {
        const url = validateRelativeUrl("/auth/verifyPass");
        const response = await axiosInstance.post(url, { password }, { withCredentials: true });

        return response.data;
    } catch (error) {
        console.error("Error verifying password:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

export { getCurrentUser, verifyPass, logoutUser };