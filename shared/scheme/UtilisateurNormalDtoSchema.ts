
import { z } from 'zod';

// ===== SCHÉMAS POUR UtilisateurControlleur =====

/**
 * Schéma pour UtilisateurNormalDto
 * Utilisé pour créer et modifier un utilisateur
 */
export const UtilisateurNormalDtoSchema = z.object({
    id: z.string()
        .uuid("L'identifiant doit être un UUID valide")
        .optional()
        .nullable(),

    pseudo: z.string()
        .min(1, "Le pseudo est obligatoire")
        .max(50, "Le pseudo ne peut pas dépasser 50 caractères")
        .regex(/^[a-zA-Z0-9_-]+$/, "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores")
        .optional()
        .nullable(),

    mail: z.string()
        .email("L'adresse email n'est pas valide")
        .min(1, "L'adresse email est obligatoire")
        .max(254, "L'adresse email ne peut pas dépasser 254 caractères")
        .optional()
        .nullable(),

    hash_mdp: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
        .optional()
        .nullable(),

    dateInscription: z.string()
        .datetime("La date d'inscription doit être au format ISO 8601")
        .or(z.date())
        .optional()
});

/**
 * Critères d'ordonnancement pour la liste des utilisateurs
 */
export const UserOrderingCriteriaSchema = z.union([
    z.literal(0), // Par ID
    z.literal(1), // Par pseudo
    z.literal(2)  // Par date d'inscription
]).or(z.enum(['0', '1', '2']));

/**
 * Paramètres de requête pour GET /FloraFaunaGo_API/utilisateur
 */
export const UtilisateurListQuerySchema = z.object({
    criterium: UserOrderingCriteriaSchema
        .optional()
        .describe("Critère d'ordonnancement (0: ID, 1: Pseudo, 2: Date d'inscription)"),

    index: z.number()
        .int("L'index doit être un nombre entier")
        .min(0, "L'index ne peut pas être négatif")
        .default(0)
        .or(z.string().regex(/^\d+$/, "L'index doit être un nombre").transform(Number)),

    count: z.number()
        .int("Le nombre d'éléments doit être un nombre entier")
        .min(1, "Le nombre d'éléments doit être au moins 1")
        .max(100, "Le nombre d'éléments ne peut pas dépasser 100")
        .default(10)
        .or(z.string().regex(/^\d+$/, "Le count doit être un nombre").transform(Number))
});

/**
 * Schéma pour la modification d'un utilisateur (PUT)
 */
export const UpdateUtilisateurSchema = z.object({
    pseudo: z.string()
        .min(1, "Le pseudo est obligatoire")
        .max(50, "Le pseudo ne peut pas dépasser 50 caractères")
        .regex(/^[a-zA-Z0-9_-]+$/, "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores")
        .optional()
        .nullable(),

    mail: z.string()
        .email("L'adresse email n'est pas valide")
        .max(254, "L'adresse email ne peut pas dépasser 254 caractères")
        .optional()
        .nullable(),

    hash_mdp: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre")
        .optional()
        .nullable(),

    dateInscription: z.string()
        .datetime("La date d'inscription doit être au format ISO 8601")
        .or(z.date())
        .optional()
});

/**
 * Schéma pour les détails de problème (erreurs 400/404)
 */
export const ProblemDetailsSchema = z.object({
    type: z.string()
        .optional()
        .nullable()
        .describe("Type du problème"),

    title: z.string()
        .optional()
        .nullable()
        .describe("Titre du problème"),

    status: z.number()
        .int("Le statut doit être un nombre entier")
        .optional()
        .nullable()
        .describe("Code de statut HTTP"),

    detail: z.string()
        .optional()
        .nullable()
        .describe("Description détaillée du problème"),

    instance: z.string()
        .optional()
        .nullable()
        .describe("Instance du problème")
});

/**
 * Réponse d'API standardisée pour un utilisateur
 */
export const UtilisateurApiResponseSchema = z.object({
    success: z.boolean()
        .describe("Indique si la requête a réussi"),

    data: UtilisateurNormalDtoSchema
        .optional()
        .nullable()
        .describe("Données de l'utilisateur"),

    message: z.string()
        .optional()
        .describe("Message de réponse"),

    errors: z.array(z.string())
        .optional()
        .describe("Liste des erreurs")
});

/**
 * Réponse d'API standardisée pour une liste d'utilisateurs
 */
export const UtilisateurListApiResponseSchema = z.object({
    success: z.boolean()
        .describe("Indique si la requête a réussi"),

    data: z.array(UtilisateurNormalDtoSchema)
        .optional()
        .nullable()
        .describe("Liste des utilisateurs"),

    total: z.number()
        .int("Le total doit être un nombre entier")
        .min(0, "Le total ne peut pas être négatif")
        .optional()
        .describe("Nombre total d'utilisateurs"),

    page: z.number()
        .int("La page doit être un nombre entier")
        .min(0, "La page ne peut pas être négative")
        .optional()
        .describe("Numéro de page actuel"),

    limit: z.number()
        .int("La limite doit être un nombre entier")
        .min(1, "La limite doit être au moins 1")
        .optional()
        .describe("Nombre d'éléments par page"),

    message: z.string()
        .optional()
        .describe("Message de réponse"),

    errors: z.array(z.string())
        .optional()
        .describe("Liste des erreurs")
});

// ===== TYPES TYPESCRIPT =====

export type UtilisateurNormalDto = z.infer<typeof UtilisateurNormalDtoSchema>;
export type UserOrderingCriteria = z.infer<typeof UserOrderingCriteriaSchema>;
export type UtilisateurListQuery = z.infer<typeof UtilisateurListQuerySchema>;
export type UpdateUtilisateur = z.infer<typeof UpdateUtilisateurSchema>;
export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;
export type UtilisateurApiResponse = z.infer<typeof UtilisateurApiResponseSchema>;
export type UtilisateurListApiResponse = z.infer<typeof UtilisateurListApiResponseSchema>;
