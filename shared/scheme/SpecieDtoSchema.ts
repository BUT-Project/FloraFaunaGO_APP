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
  class: z.nativeEnum(Class),
  kingdom: z.nativeEnum(Kingdom),
  famille: z.nativeEnum(Family),
  zone: z.string(),
  climat: z.nativeEnum(Climate),
  regime: z.nativeEnum(Diet),
  locationNormalDtos: z.array(LocationDtoSchema),
});

export const PagingResultSpecieSchema = z.object({
  count: z.number(),
  index: z.number(),
  total: z.number(),
  items: z.array(SpecieDtoSchema),
});


export type SpecieDto = z.infer<typeof SpecieDtoSchema>;

export type PagingResultSpecie = z.infer<typeof PagingResultSpecieSchema>;