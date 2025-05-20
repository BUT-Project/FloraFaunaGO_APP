import {z} from "zod";

export const loginSchema = z.object({
    email: z.string()
        .email("L'adresse e-mail n'est pas valide.")
        .max(100, "L'adresse e-mail ne peut pas être plus grand que 100 caractères."),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
        .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial.")
});