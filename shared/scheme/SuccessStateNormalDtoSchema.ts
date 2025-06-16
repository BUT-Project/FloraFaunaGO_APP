import { z } from "zod";

// Schéma pour l'objet 'user' (inchangé)
const UserSchema = z.object({
  id: z.string().uuid(),
  pseudo: z.string(),
  image: z.string().nullable(),
  mail: z.string(),
  hash_mdp: z.string(),
  dateInscription: z.string()
}).nullable();

// Schéma pour l'objet 'state' dans la réponse API
export const StateSchema = z.object({
  id: z.string().uuid(),
  percentSucces: z.number().int().nonnegative(),
  isSucces: z.boolean()
});

// Schéma pour l'objet 'success' dans la réponse API (correspond à votre SuccessNormalDto)
const SuccessInStateSchema = z.object({
  id: z.string().uuid(),
  nom: z.string(),
  type: z.string(),
  image: z.string(),
  description: z.string(),
  objectif: z.number().int().nonnegative(),
  evenement: z.string()
});

// Schéma pour la réponse complète de l'API SuccessState
export const SuccessStateCompleteItemSchema = z.object({
  state: StateSchema,
  success: SuccessInStateSchema,
  user: UserSchema
});

// Schéma pour la réponse Success simple (de l'API Success)
export const SuccessNormalDtoSchema = z.object({
  id: z.string().uuid(),
  nom: z.string()
    .min(1, "Le nom est obligatoire")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  image: z.string()
    .min(1, "L'image est obligatoire"),
  objectif: z.number()
    .int("L'objectif doit être un entier")
    .positive("L'objectif doit être supérieur à 0"),
  description: z.string()
    .min(1, "La description est obligatoire")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  type: z.string(),
  evenement: z.string()
    .min(1, "L'événement est obligatoire")
    .max(100, "L'événement ne peut pas dépasser 100 caractères")
});

// Schéma pour Success avec actualVal (pour votre logique métier)
export const SuccessWithProgressSchema = SuccessNormalDtoSchema.extend({
  actualVal: z.number().nonnegative().default(0)
});

// Réponse pour une liste d'états de succès (API SuccessState)
export const SuccessStateListApiResponseSchema = z.object({
  success: z.boolean(),
  total: z.number().int().nonnegative(),
  index: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  items: z.array(SuccessStateCompleteItemSchema)
});

// Réponse pour une liste de succès simples (API Success)
export const SuccessListApiResponseSchema = z.object({
  success: z.boolean(),
  total: z.number().int().nonnegative().optional(),
  index: z.number().int().nonnegative().optional(),
  count: z.number().int().nonnegative().optional(),
  items: z.array(SuccessNormalDtoSchema)
});

// Types TypeScript
export type SuccessStateCompleteItem = z.infer<typeof SuccessStateCompleteItemSchema>;
export type SuccessNormalDto = z.infer<typeof SuccessNormalDtoSchema>;
export type SuccessWithProgress = z.infer<typeof SuccessWithProgressSchema>;
export type SuccessStateListApiResponse = z.infer<typeof SuccessStateListApiResponseSchema>;
export type SuccessListApiResponse = z.infer<typeof SuccessListApiResponseSchema>;