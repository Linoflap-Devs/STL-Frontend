// src\utils\loginValidate.ts

import axios from 'axios';
import { loginUser } from './api/login';

export const verifyCredentials = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser({ username, password });
      return response.token ? true : false;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
  
          if (status === 401) {
            // unauthorized - invalid credentials
            throw new Error('Invalid username or password.');
          } else if (status === 404) {
            // endpoint not found
            throw new Error('Login service unavailable. Please try again later.');
          } else if (status >= 500) {
            // server error
            throw new Error('Server error. Please try again later.');
          }
        } else if (error.request) {
          // no response received
          throw new Error('Network error. Please check your connection.');
        }
      }
      
      throw new Error('An unexpected error occurred.');
    }
  };

// export const loginValidate = async (credentials: {
//   username?: string;
//   password?: string;
//   newpassword?: string;
//   setpassword?: string;
// }) => {
//   const newErrors: {
//     username?: string;
//     password?: string;
//     newpassword?: string;
//     setpassword?: string;
//   } = {};

//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

//   if (!credentials.username) {
//     newErrors.username = "Username is required";
//   }

//   if (!credentials.password) {
//     newErrors.password = "Password is required";
//   }

//   if (Object.keys(newErrors).length === 0) {
//     try {
//       const isValid = await verifyCredentials(credentials.username!, credentials.password!);
//       if (!isValid) {
//         newErrors.password = "Invalid username or password.";
//       }
//     } catch (error: any) {
//       newErrors.password = error.message || "ssssss";
//     }
//   }

//   return newErrors;
// };
