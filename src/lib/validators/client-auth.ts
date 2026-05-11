import { z } from "zod";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export function validateLoginInput(input: { email: string; password: string }): string | null {
  const result = loginSchema.safeParse(input);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Invalid input.";
}

const registerPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.");

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, "Display name must be 120 characters or fewer.")
    .optional(),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  password: registerPasswordSchema,
  accept: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms." }),
  }),
});

export function validateRegisterInput(input: {
  name: string;
  email: string;
  password: string;
  accept: boolean;
}): string | null {
  const result = registerSchema.safeParse({
    name: input.name.trim() || undefined,
    email: input.email,
    password: input.password,
    accept: input.accept,
  });
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Invalid input.";
}
