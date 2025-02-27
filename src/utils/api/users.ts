import axiosInstance from "../axiosInstance";
import axios from "axios";

// Fetch users function
const fetchUsers = async (queryParams: Record<string, any>) => {
    try {
        const response = await axiosInstance.get("/users/getUsers", {
            params: queryParams,
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching users:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: [] };
    }
};

// Add user function
const addUser = async (userData: Record<string, any>) => {
    try {
        const response = await axiosInstance.post("/users/addUser", userData, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error adding user:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

export { fetchUsers, addUser };