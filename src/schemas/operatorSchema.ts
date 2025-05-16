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

export const updateOperatorSchema = z.object({
  status: z.string(),
  companyName: z.string().min(1, 'Company Name is required'),
  email: z.string()
  .email('Please enter a valid email address. e.g. xxx@email.com')
  .min(1, 'Email is required'),
  phone: z.string()
    .min(1, 'Phone Number is required')
    .regex(/^09\d{2}[ -]?\d{3}[ -]?\d{4}$/, 'Please enter a valid phone number. e.g. 09xx xxx xxxx'),
  dateOfOperations: z.string().min(1, 'Date of Operations is required'),
  areaOfOperations: z.string().min(1, 'Area of Operations is required'),
  gameTypes: z.object({
    stlPares: z.boolean(),
    stlSwer2: z.boolean(),
    stlSwer3: z.boolean(),
    stlSwer4: z.boolean(),
    allGames: z.boolean(),
  }),
  // History
  createdBy: z.string().min(1, 'Complete name is required'),
  latestUpdateBy: z.string().min(1, 'Complete name is required'),
  creationDate: z.string().refine((val) => {
    const regex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(val);
  }, {
    message: "Invalid datetime format (expected YYYY/MM/DD HH:mm:ss)",
  }),
  latestUpdateDate:  z.string().refine((val) => {
    const regex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(val);
  }, {
    message: "Invalid datetime format (expected YYYY/MM/DD HH:mm:ss)",
  }),
  remarks: z.string()
  .min(1, 'Remarks is required'),
})