import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string({ required_error: "Given Name is required" })
    .min(1, "Given Name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),

  lastName: z
    .string({ required_error: "Last Name is required" })
    .min(1, "Last Name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Last Name can only contain letters and spaces.",
    }),

  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .min(1, "Phone Number is required")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),

  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .refine((val) => val.length >= 8, {
      message: "Password must be at least 8 characters long.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number.",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must include at least one special character (!@#$%^&*).",
    }),

  middleName: z.string().optional(),
  suffix: z.string().optional(),
  street: z.string().optional(),
  CreatedBy: z.string().optional(),

  operatorId: z
    .number({
      required_error: "Operator Name is required",
    })
    .refine((val) => !isNaN(val), {
      message: "Operator Name is required",
    }),
});

export const getInputClassName = (hasError: boolean) => {
  return `w-full border rounded px-3 py-2 text-sm ${hasError ? 'border-[#CE1126]' : 'border-gray-300'}`;
};

export const generateValidPassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;

  const getRandom = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Ensure required characters
  let password = [
    getRandom(uppercase),
    getRandom(lowercase),
    getRandom(numbers),
    getRandom(special),
  ];

  // Fill remaining with random characters
  for (let i = 4; i < 10; i++) {
    password.push(getRandom(allChars));
  }

  // Shuffle array to avoid predictable order
  password = password.sort(() => 0.5 - Math.random());

  return password.join('');
};

