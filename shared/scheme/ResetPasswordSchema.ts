import {z} from "zod";

export const ResetPasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
        .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
    newPassword: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
        .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial.")
});

export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
