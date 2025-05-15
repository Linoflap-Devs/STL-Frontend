import { z } from 'zod';

export const operatorSchema = z.object({

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