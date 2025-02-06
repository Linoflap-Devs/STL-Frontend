import axios from 'axios';

export const verifyCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post('/api/verify-login', { username, password });

    return response.data.isValid;
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return false;
  }
};

export const loginValidate = async (credentials: {
  username?: string;
  password?: string;
  newpassword?: string;
  setpassword?: string;
}) => {
  const newErrors: {
    username?: string;
    password?: string;
    newpassword?: string;
    setpassword?: string;
  } = {};

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (credentials.username === undefined || credentials.password === undefined) {
    newErrors.username = "Username and Password are required.";
    return newErrors;
  }

  if (!credentials.username) {
    newErrors.username = "Username is required";
  } else if (!emailRegex.test(credentials.username)) {
    newErrors.username = "Please enter a valid email address.";
  }

  if (!credentials.password) {
    newErrors.password = "Password is required";
  } else if (!passwordRegex.test(credentials.password)) {
    newErrors.password = "Password must be at least 8 characters, including an uppercase letter, number, and special character.";
  }

  if (Object.keys(newErrors).length === 0) {
    const isValid = await verifyCredentials(credentials.username, credentials.password);
    if (!isValid) {
      newErrors.password = "Invalid username or password.";
    }
  }

  return newErrors;
};
