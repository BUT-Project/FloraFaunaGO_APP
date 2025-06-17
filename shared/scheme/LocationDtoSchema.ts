import { z } from 'zod'

export const LocationDtoSchema = z.object({
    id: z.string(),
    latitude : z.number(),
    longitude: z.number(),
    altitude: z.number(),
    exactitude: z.number().min(0,"L'exactitude doit être un entier positif."),
    rayon: z.number().min(0, "Le rayon doit être un entier positif ou nul."),
});

export type LocationDto = z.infer<typeof LocationDtoSchema>;