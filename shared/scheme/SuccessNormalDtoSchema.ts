import { z } from "zod";

/**
 * Enumération des types de succès (SuccessType)
 */
export const SuccessTypeEnum = z.enum(["CAPTURE", "DISTANCE", "LIEUX", "PHOTO"], {
  required_error: "Le type est requis",
  invalid_type_error: "Le type de succès est invalide"
});
export type SuccessTypeNormal = z.infer<typeof SuccessTypeEnum>;

/**
 * Schéma pour la classe Success
 * Utilisé pour représenter un succès d'utilisateur
 */
export const SuccessNormalDtoSchema = z.object({
  id: z.string().uuid("L'ID doit être un UUID valide"),
  nom: z.string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),

  image: z.string()
    .min(1, "L'image est obligatoire"),

   //actualVal: z.number(),
  //   .int("La valeur actuelle doit être un entier")
  //   .nonnegative("La valeur actuelle ne peut pas être négative")
  //   .optional(),

  objectif: z.number()
    .int("L'objectif doit être un entier")
    .positive("L'objectif doit être supérieur à 0"),

  description: z.string()
    .min(1, "La description est obligatoire")
    .max(500, "La description ne peut pas dépasser 500 caractères"),

  //type: SuccessTypeEnum,
  type: z.string(),
  evenement: z.string()
    .min(1, "L'événement est obligatoire")
    .max(100, "L'événement ne peut pas dépasser 100 caractères")
});

/**
 * Réponse standardisée pour un succès unique
 */
export const SuccessApiResponseSchema = z.object({
  success: z.boolean(),
  data: SuccessNormalDtoSchema.optional().nullable(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional()
});

/**
 * Réponse standardisée pour une liste de succès
 */
export const SuccessListApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SuccessNormalDtoSchema).optional().nullable(),
  total: z.number().int().nonnegative().optional(),
  page: z.number().int().nonnegative().optional(),
  limit: z.number().int().min(1).optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional()
});


export type SuccessNormalDto = z.infer<typeof SuccessNormalDtoSchema>;
export type SuccessApiResponse = z.infer<typeof SuccessApiResponseSchema>;
export type SuccessListApiResponse = z.infer<typeof SuccessListApiResponseSchema>;
