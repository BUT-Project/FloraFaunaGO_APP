import { z } from 'zod'
import { LocationDtoSchema } from './LocationDtoSchema';
import { Class, Climate, Diet, Family, Kingdom } from '@/model/domain';

export const SpecieDtoSchema = z.object({
    id: z.string(),
    nom: z.string(),
    nom_scientifique: z.string(),
    description: z.string(),
    image: z.string(),
    image3D: z.string(),
    class: z.nativeEnum(Class).default(Class.UNKNOWN),
    kingdom: z.nativeEnum(Kingdom),
    famille: z.nativeEnum(Family).default(Family.UNKNOWN),
    zone:  z.string(),
    climat: z.nativeEnum(Climate).default(Climate.UNKNOWN),
    regime: z.nativeEnum(Diet),
    locationNormalDtos: z.array(LocationDtoSchema)
})

export type SpecieDto = z.infer<typeof SpecieDtoSchema>;