import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email({ message: "Must be a valid email" }),
});

export type FormSchema = typeof formSchema;
