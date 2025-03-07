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

            if (user) {
                // Compute the status if missing
                user.Status = user.IsActive ? "Active" : "Inactive";

                // Compute formattedDate in "YYYY/MM/DD" format
                if (user.DateOfRegistration) {
                    const date = new Date(user.DateOfRegistration);
                    user.formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
                } else {
                    user.formattedDate = "N/A";
                }
            }

            return { success: !!user, message: user ? "User found" : "User not found", data: user || {} };
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Update user function
const updateUser = async (userId: number, userData: Record<string, any>) => {
    try {
      const response = await axiosInstance.patch(
        "/users/edituser",
        { userId, ...userData }, // Ensure userId is included in the request payload
        {
          withCredentials: true,
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, message: (error as Error).message, data: {} };
    }
  };
  
  
  

export { fetchUsers, addUser, updateUser, fetchUserById };