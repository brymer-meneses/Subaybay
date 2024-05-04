import { message } from "sveltekit-superforms";
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
  // FIXME: this is a band-aid solution since we're not checking for valid `requestTypeId`
  requestTypeId: z.string(),
});

export type FormSchema = typeof formSchema;
