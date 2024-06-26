import { z } from "zod";

export const formSchema = z.object({
  studentNumber: z.string().refine((value) => /^\d{4}-\d{5}$/.test(value), {
    message: "Invalid student number format must be in the form XXXX-XXXXX",
  }),
  studentName: z.string().min(1, {
    message: "Must be a non-empty",
  }),
  studentEmail: z.string().email({ message: "Must be a valid email" }),
  purpose: z.string(),
  remarks: z.string(),
  copies: z.number().min(1, "Must be a number greater than 0"),
});

export type FormSchema = typeof formSchema;
