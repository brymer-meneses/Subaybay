import { z } from "zod";
 
export const formSchema = z.object({
  email: z.string().min(1, {message: "Thise field has to be filled."}).email({message: "Invalid Email Address."}),
});
 
export type FormSchema = typeof formSchema;