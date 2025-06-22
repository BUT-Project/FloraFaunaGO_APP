import {RegisterRequestSchema} from "@/shared/scheme/RegisterRequestSchema";

export const registerFormSchema = RegisterRequestSchema.refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    }
);