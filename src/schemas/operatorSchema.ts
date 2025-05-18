import { z } from 'zod';

export const operatorSchema = z.object({
  name: z
    .string({ required_error: "Given Name is required" })
    .min(1, "Given Name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),
  contactNumber: z
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
  // RegionId: z
  //   .array(z.string({ required_error: "Area of regional operations is required" }))
  //   .min(1, "At least one regional operation area is required"),
  // ProvinceId: z
  //   .array(z.string({ required_error: "Area of provincial operations is required" }))
  //   .min(1, "At least one provincial operation area is required"),
  // CityId: z
  //   .array(z.string({ required_error: "Area of city operations is required" }))
  //   .min(1, "At least one city operation area is required"),
  dateOfOperation: z
    .string({ required_error: "Date of operations is required" })
    .min(1, "Date of operations is required"),
  address: z
    .string({ required_error: "Operator address is required" })
    .min(1, "Operator address is required"),
  // GameCategoryId: z
  //   .array(z.string({ required_error: "Games Provided is required" }))
  //   .min(1, "At least one game type is required"),
  STLAreaOfOperations: z
    .string({ required_error: "Area of operations is required" })
    .min(1, "At least one area of operation is required"),
  // isExcludedCITY: z
  //   .boolean({ required_error: "Is Excluded City is required" }),
});