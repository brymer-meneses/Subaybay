import { z } from "zod";

export const formSchema = z.object({
  studentNumber: z.string().refine((value) => /^\d{4}-\d{5}$/.test(value), {
    message: "Invalid student number format must be in the form XXXX-XXXXX",
  }),
  studentName: z.string().min(1).refine((value) => value.trim(), {
    message: "Must be a non-empty",
  }),
  studentEmail: z.string().email({ message: "Must be a valid email" }),
  purpose: z.string(),
  remarks: z.string(),
  // FIXME: this is a band-aid solution since we're not checking for valid `requestTypeId`
  selectedReqTypeIds: z
    .string()
    //checks for json string array with more than 1 element
    .refine((value) => /^\[.+\]$/.test(value), {
      message: "Must select atleast one request type",
    }),
});

export type FormSchema = typeof formSchema;
