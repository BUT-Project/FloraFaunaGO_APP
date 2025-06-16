import { z } from 'zod'
import { LocationDtoSchema } from './LocationDtoSchema';
import { ClassSchema, ClimateSchema, DietSchema, FamilySchema, KingdomSchema } from './EnumsDtoSchema';

export const SpecieDtoSchema = z.object({
  id: z.string(),
  nom: z.string(),
  nom_Scientifique: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  image3D: z.string().nullable().optional(),
  class: ClassSchema,
  kingdom: KingdomSchema,
  famille: FamilySchema,
  zone: z.string(),
  climat: ClimateSchema,
  regime: DietSchema,
  localisations: z.array(LocationDtoSchema).optional(),
});

export const SpecieListDtoSchema = z.object({
  id: z.string(),
  nom: z.string(),
  image: z.string().nullable(),
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