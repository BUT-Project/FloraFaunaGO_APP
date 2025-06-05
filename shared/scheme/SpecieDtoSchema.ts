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
});

export const FullSpecieDtoSchema = z.object({
  espece: SpecieDtoSchema,
  localisationNormalDtos: z.array(LocationDtoSchema),
});

export const PagingResultSpecieSchema = z.object({
  count: z.number(),
  index: z.number(),
  total: z.number(),
  items: z.array(SpecieDtoSchema),
});

export type SpecieDto = z.infer<typeof SpecieDtoSchema>;
export type FullSpecieDto = z.infer<typeof FullSpecieDtoSchema>;
export type SpecieDtos = z.infer<typeof PagingResultSpecieSchema>;