import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  service: z.string().min(1, { message: "Please select a service." }),
  budget: z.string().min(1, { message: "Please select a budget range." }),
  timeline: z.string().min(1, { message: "Please select a timeline." }),
  message: z.string().optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;
