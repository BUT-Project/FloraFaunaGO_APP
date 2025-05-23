import {z} from "zod";
import {RegisterRequestSchema} from "@/shared/scheme/RegisterRequestSchema";

export const registerFormSchema = RegisterRequestSchema.extend({
    confirmPassword: z.string().min(1, {message: "Veuillez confirmer le mot passe"})
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    }
);