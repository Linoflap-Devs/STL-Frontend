// src\utils\api\login.ts

import axios from 'axios';
import axiosInstance from '../axiosInstance';

interface LoginPayload {
    username: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post<LoginResponse>('/api/login', payload);

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            throw new Error(errorMessage);
        } else {
            // Handling other unknown errors
            throw new Error('An unexpected error occurred during login.');
        }
    }
};
