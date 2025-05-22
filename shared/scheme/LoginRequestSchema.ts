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
    password: z.string("Le mot de passe est requis."),
    twoFactorCode: z.string().nullable().optional(),
    twoFactorRecoveryCode: z.string().nullable().optional(),
});
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;
