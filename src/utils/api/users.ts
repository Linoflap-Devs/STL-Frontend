// src\utils\api\users.ts

import axiosInstance from '../axiosInstance';

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export const editUser = async (userId: number, userData: any) => {
  try {
    const response = await axiosInstance.put('/api/users/edit', { userId, ...userData });
    return response.data;
  } catch (error) {
    throw new Error('Error updating user');
  }
};