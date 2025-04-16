// utils/zodToJsonErrors.ts

import { ZodError } from "zod";

export const zodToJsonErrors = (error: unknown) => {
  if (!(error instanceof ZodError)) return {};
  const formatted: Record<string, string> = {};
  for (const err of error.errors) {
    const key = err.path[0] as string;
    if (!formatted[key]) {
      formatted[key] = err.message; // keep only the first error per field
    }
  }
  return formatted;
};
