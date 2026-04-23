import { z } from "zod";

export const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must contain at least 8 characters."),
    newPassword: z
      .string()
      .min(8, "New password must contain at least 8 characters.")
      .max(72, "Password is too long."),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });

export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;
