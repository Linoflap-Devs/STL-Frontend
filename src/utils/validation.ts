import ManagerTable, { User } from "~/components/manager/ManagerTable";
import { formatKey } from "../utils/format";

export const validateUser = (user: User) => {
  const newErrors: { [key: string]: string } = {};
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^09\d{2} \d{3} \d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const restrictedCharsRegex = /[@!#$%^&*()_+=<>]/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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
        if (emailRegex.test(value)) {
          break;
        }
        if (restrictedCharsRegex.test(value)) {
          newErrors[key] = "Username cannot contain special characters.";
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

// Login validation function
export const loginValidate = (credentials: {
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
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const setPassword = "pass123";

  Object.entries(credentials).forEach(([key, value]) => {
    switch (key) {
      case "username":
        if (!value) {
          newErrors.username = "Username is required";
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value !== setPassword) {
          newErrors.password =
            "Invalid credentials. Please verify your details.";
        }
        break;

        case "newpassword": // for setting a new password
        if (!value) {
          newErrors.newpassword = "Password is required";
        } else if (!passwordRegex.test(value)) {
          newErrors.newpassword =
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        break;

        case "setpassword": // for confirming the new password
        if (!value) {
          newErrors.setpassword = "Password is required";
        } else if (value !== credentials.newpassword) {
          newErrors.setpassword = "Password does not match.";
        } else if (!passwordRegex.test(value)) {
          newErrors.setpassword =
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        break;

      default:
        break;
    }
  });

  return newErrors;
};
