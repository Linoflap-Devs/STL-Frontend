import axiosInstance from "../axiosInstance";

// Helper to validate URL paths
const validateRelativeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        throw new Error('Absolute URLs are not allowed.');
    }
    return url;
};

// Fetch users function
const fetchUsers = async (queryParams: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/users/getUsers");
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

// Add user function
const addUser = async (userData: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/users/addUser");
        const response = await axiosInstance.post(url, userData, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error adding user:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Fetch user by ID function
const fetchUserById = async (userId: string | number) => {
    try {
        const url = validateRelativeUrl("/users/getUsers");
        const response = await axiosInstance.get(url, {
            params: { userId },
            withCredentials: true,
        });

        if (Array.isArray(response.data.data)) {
            const user = response.data.data.find((u: any) => u.UserId == userId);

            if (user) {
                // Compute status if missing
                user.Status = user.IsActive ? "Active" : "Inactive";

                // Format date in "YYYY/MM/DD" format
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
        console.error("Error fetching user by ID:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Update user function
const updateUser = async (userId: number, userData: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/users/edituser");
        const response = await axiosInstance.patch(
            url,
            { userId, ...userData },
            { withCredentials: true }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating user:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// Get user edit log function
const editLogUser = async (userId: number, p0: {}) => {
    try {
        const url = validateRelativeUrl("/users/getEditLog");
        const response = await axiosInstance.get(url, {
            params: { userId },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching edit log:", (error as Error).message);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

// hindi na valid. gamitin nalang yung editUser for user suspension
const suspendUser = async (userId: number, userData: Record<string, any>) => {
    try {
        const url = validateRelativeUrl("/auth/disableUser");
        const payload = { userId, ...userData };
        const response = await axiosInstance.post(url, payload, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: (error as Error).message, data: {} };
    }
};

export { fetchUsers, addUser, updateUser, fetchUserById, editLogUser, suspendUser };