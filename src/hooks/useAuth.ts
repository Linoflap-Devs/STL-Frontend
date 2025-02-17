// checking of users

import axiosInstance from "../utils/axiosInstance";

// Function to check if the user is authenticated
export const checkUserAuth = async () => {
  try {
    const response = await axiosInstance.get("/users/getCurrentUser", {
      withCredentials: true, // Send the JWT token automatically with the request
    });

    return response.data;
  } catch (error) {
    console.warn("User is not authenticated.");
    return null;
  }
};