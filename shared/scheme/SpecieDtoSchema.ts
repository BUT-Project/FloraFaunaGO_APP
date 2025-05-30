import { z } from 'zod'
import { LocationDtoSchema } from './LocationDtoSchema';
import { Climate, Diet, Family } from '@/model/domain';


export const SpecieDtoSchema = z.object({
    id: z.string(),
    nom: z.string(),
    nom_scientifique: z.string(),
    description: z.string(),
    image: z.string(),
    image3D: z.string(),
    famille: z.nativeEnum(Family).default(Family.Unknown),
    zone:  z.string(),
    climat: z.nativeEnum(Climate),
    regime: z.nativeEnum(Diet),
    locationNormalDtos: z.array(LocationDtoSchema)
})

export type SpecieDto = z.infer<typeof SpecieDtoSchema>;