import { z } from 'zod'

export const LocationDtoSchema = z.object({
    id: z.string(),
    latitude : z.number(),
    longitude: z.number(),
    altitude: z.number(),
    rayon: z.number()
    .positive("Le rayon doit être un entier positif.")

});

export type LocationDto = z.infer<typeof LocationDtoSchema>;