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

const fetchUserById = async (userId: string | number) => {
    try {
        const response = await axiosInstance.get("/users/getUsers", {
            params: { userId },
            withCredentials: true,
        });

        console.log("API Response:", response.data);

        // If API returns an array, filter it on the frontend
        if (Array.isArray(response.data.data)) {
            const user = response.data.data.find((u: any) => u.UserId == userId);
            return { success: !!user, message: user ? "User found" : "User not found", data: user || {} };
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Update user function
const updateUser = async (userData: Record<string, any>) => {
    try {
        const response = await axiosInstance.post("/users/edituser", userData, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error updating user:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

export { fetchUsers, addUser, updateUser, fetchUserById };