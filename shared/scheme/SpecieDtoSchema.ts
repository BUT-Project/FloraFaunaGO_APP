import { z } from 'zod'
import { LocationDtoSchema } from './LocationDtoSchema';
import { Class, Climate, Diet, Family, Kingdom } from '@/model/domain';

export const SpecieDtoSchema = z.object({
  id: z.string(),
  nom: z.string(),
  nom_Scientifique: z.string(),
  description: z.string(),
  image: z.string(),
  image3D: z.string().nullable().optional(),
  class: z.nativeEnum(Class),
  kingdom: z.nativeEnum(Kingdom),
  famille: z.nativeEnum(Family).default(Family.UNKNOWN),
  zone: z.string(),
  climat: z.nativeEnum(Climate),
  regime: z.nativeEnum(Diet),
  localisations: z.array(LocationDtoSchema).optional(),
});

export const SpecieListDtoSchema = z.object({
  id: z.string(),
  nom: z.string(),
  image: z.string(),
  image3D: z.string().nullable().optional(),
});

export const PagingResultSpecieSchema = z.object({
  count: z.number(),
  index: z.number(),
  total: z.number(),
  items: z.array(SpecieListDtoSchema),
});

export type SpecieDto = z.infer<typeof SpecieDtoSchema>; 
export type SpecieListDto = z.infer<typeof SpecieListDtoSchema>;
export type SpecieDtos = z.infer<typeof PagingResultSpecieSchema>;