import {z} from "zod";

export const registerSchema = z.object({
    name: z.string()
        .min(1, "Le nom d'utilisateur ne peut pas être vide.")
        .max(30, "Le nom d'utilisateur ne peut pas être plus grand que 30 caractères.")
        .regex(/^\w+$/, "Le nom d'utilisateur ne peut pas posséder de caractères spéciaux."),
    email: z.string()
        .email("L'adresse e-mail n'est pas valide.")
        .max(100, "L'adresse e-mail ne peut pas être plus grand que 100 caractères."),
    password: z.string()
        .min(6, "Le mot de passe doit avoir au moins 6 caractères")
});