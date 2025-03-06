//   src\utils\locationTypes.ts
// for fetching of locations 
  
import axios from "axios";
import axiosInstance from "../axiosInstance";

const fetchRegions = async (queryParams: Record<string, any>) => {
  try {
      const response = await axiosInstance.get("/location/getRegions/ ", {
          params: queryParams,
          withCredentials: true,
      });

      return response.data;
  } catch (error) {
      console.error("Error fetching users:", (error as Error).message);
      return { success: false, message: (error as Error).message, data: [] };
  }
};

const fetchProvinces = async (queryParams: Record<string, any>) => {
  try {
      const response = await axiosInstance.get("/location/getProvinces/ ", {
          params: queryParams,
          withCredentials: true,
      });

      return response.data;
  } catch (error) {
      console.error("Error fetching users:", (error as Error).message);
      return { success: false, message: (error as Error).message, data: [] };
  }
};

export { fetchRegions, fetchProvinces, };