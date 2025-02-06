// src\utils\validation.ts

import ManagerTable, { User } from "~/components/manager/ManagerTable";
import { formatKey } from "../utils/format";

// forms validation
export const validateUser = (user: User) => {
  const newErrors: { [key: string]: string } = {};
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^09\d{2} \d{3} \d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const restrictedCharsRegex = /[@!#s$%^&*()_+=<>]/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  Object.entries(user).forEach(([key, value]) => {
    if (!value && key !== "regisdate") {
      newErrors[key] = `${formatKey(key)} is required`;
      return;
    }

    switch (key) {
      case "firstname":
      case "lastname":
        if (!nameRegex.test(value)) {
          newErrors[key] = `${formatKey(key)} can only contain letters.`;
        }
        break;
      case "phonenumber":
        if (!phoneRegex.test(value)) {
          newErrors[key] =
            "Please enter a valid phone number. e.g. 09xx xxx xxxx";
        }
        break;
      case "username":
        if (!emailRegex.test(value)) {
          newErrors[key] = "Please enter a valid email address."
          break;
        }
        break;
      case "password":
        if (!passwordRegex.test(value)) {
          newErrors[key] =
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        break;
      default:
        break;
    }
  });

  return newErrors;
};