import ManagerTable, { User } from "~/components/user/UserTable";
import { formatKey } from "../utils/format";

// forms validation
export const validateUser = (user: User, selectState: Record<string, any>) => {
  const newErrors: { [key: string]: string } = {};
  const nameRegex = /^[A-Za-z\s]+$/;
  //const phoneRegex = /^09\d{2} \d{3} \d{4}$/;
  const phoneRegex = /^09\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mergedUser = { ...user, ...selectState };

  Object.entries(mergedUser).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      if (key !== "suffix" && key !== "password" && key !== "street" && key !== "remarks" && key !== "CreatedBy") {
        newErrors[key] = `${formatKey(key)} is required`;
      }
      return;
    }

    switch (key) {
      case "firstName":
      case "lastName":
        if (!nameRegex.test(value.trim())) {
          newErrors[key] = `${formatKey(key)} can only contain letters and spaces.`;
        }
        break;
      case "phoneNumber":
        if (!phoneRegex.test(value.trim())) {
          newErrors[key] = "Please enter a valid phone number. e.g. 09xx xxx xxxx";
        }
        break;
      case "email":
        if (!emailRegex.test(value.trim())) {
          newErrors[key] = "Please enter a valid email address.";
        }
        break;
      case "password":
        if (value.length < 8) {
          newErrors[key] = "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(value)) {
          newErrors[key] = "Password must include at least one uppercase letter.";
        }
        if (!/[a-z]/.test(value)) {
          newErrors[key] = "Password must include at least one lowercase letter.";
        }
        if (!/\d/.test(value)) {
          newErrors[key] = "Password must include at least one number.";
        }
        if (!/[!@#$%^&*]/.test(value)) {
          newErrors[key] = "Password must include at least one special character (!@#$%^&*).";
        }
        break;
    }
  });

  return newErrors;
};

