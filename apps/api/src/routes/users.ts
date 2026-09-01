import { userInputSchema, type UserInput } from "../schemas/user";

export type ApiError = {
  code: string;
  message: string;
};

export function createUserHandler(body: unknown): UserInput | ApiError {
  const parsed = userInputSchema.safeParse(body);
  if (!parsed.success) {
    return { code: "INVALID_BODY", message: parsed.error.message };
  }
  return parsed.data;
}
