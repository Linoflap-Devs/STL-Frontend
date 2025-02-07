// src\utils\loginValidate.ts

import axios from 'axios';

// validation
export const verifyCredentials = (username: string, password: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!username.trim()) {
    errors.username = 'Username is required.';
  }
  if (!password.trim()) {
    errors.password = 'Password is required.';
  }

  return errors;
};