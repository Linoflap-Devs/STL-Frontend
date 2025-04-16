import z from 'zod';

// forms validation
export const userSchema = z.object({
  firstName: z
    .string()
    .nonempty("First Name is required")
    .refine((val) => val.trim() === "" || /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),
  lastName: z
    .string()
    .nonempty("Last Name is required")
    .refine((val) => val.trim() === "" || /^[A-Za-z\s]+$/.test(val), {
      message: "Last Name can only contain letters and spaces.",
    }),
  phoneNumber: z
    .string()
    .nonempty("Phone Number is required")
    .refine((val) => val.trim() === "" || /^09\d{2}[\s-]?\d{3}[\s-]?\d{4}$/.test(val), {
      message: "Please enter a valid phone number. e.g. 09xx xxx xxxx",
    }),
    email: z
    .string()
    .refine((val) => val.trim() !== "", {
      message: "Email is required",
    })
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),  
  operatorId: z
    .string()
    .nonempty("Assigned Company is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .refine((val) => val.trim() === "" || val.length >= 8, {
      message: "Password must be at least 8 characters long.",
    })
    .refine((val) => val.trim() === "" || /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((val) => val.trim() === "" || /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((val) => val.trim() === "" || /\d/.test(val), {
      message: "Password must include at least one number.",
    })
    .refine((val) => val.trim() === "" || /[!@#$%^&*]/.test(val), {
      message: "Password must include at least one special character (!@#$%^&*).",
    })
    .optional(),

  middleName: z.string().optional(),
  suffix: z.string().optional(),
  street: z.string().optional(),
  remarks: z.string().optional(),
  CreatedBy: z.number().optional(),
});


