import axiosInstance from "~/utils/axiosInstance";

export const fetchUsers = async () => {
  const response = await axiosInstance.get('/users/getUsers');
  return response.data;
};