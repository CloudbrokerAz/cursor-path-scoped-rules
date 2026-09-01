import { z } from "zod";

export const userInputSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
});

export type UserInput = z.infer<typeof userInputSchema>;
