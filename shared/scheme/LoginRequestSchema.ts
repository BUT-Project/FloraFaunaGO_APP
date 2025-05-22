import {z} from "zod";

/**
 * - `email`: User's registered email.
 * - `password`: User's password.
 * - `twoFactorCode`: Optional. Code for two-factor authentication.
 * - `twoFactorRecoveryCode`: Optional. Recovery code for two-factor authentication.
 */
export const LoginRequestSchema = z.object({
    email: z.string()
        .email("L'adresse e-mail n'est pas valide.")
        .max(100, "L'adresse e-mail ne peut pas être plus grand que 100 caractères."),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
        .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
    twoFactorCode: z.string().nullable().optional(),
    twoFactorRecoveryCode: z.string().nullable().optional(),
});
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;
