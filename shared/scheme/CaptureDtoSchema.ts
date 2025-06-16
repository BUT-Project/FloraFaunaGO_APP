import { z } from 'zod';
import { LocationDtoSchema } from './LocationDtoSchema';
import { SpecieDtoSchema } from './SpecieDtoSchema';

const CaptureDetailDtoSchema = z.object({
    id: z.string(),
    date: z.string(), // ISO dateTime string
    shiny: z.boolean(),
});

export const CaptureDetailWithLocationDtoSchema = z.object({
    captureDetail: CaptureDetailDtoSchema,
    localisationNormalDtos: LocationDtoSchema,
});

export const CaptureDtoSchema = z.object({
    id: z.string(),
    idEspece: z.string(),
    photo: z.string(),
    localisationNormalDto: LocationDtoSchema.nullable().optional(), // #TODO this props should be removed as the should remove it
    shiny: z.boolean().nullable().optional(),
});

export const CaptureCompleteDtoSchema = z.object({
    capture: CaptureDtoSchema,
    captureDetails: z.array(CaptureDetailWithLocationDtoSchema),
    idUtilisateur: z.string(),
    specie: SpecieDtoSchema.optional(), // Full specie data when available
});

export const PagingResultCaptureSchema = z.object({
    total: z.number(),
    index: z.number(),
    count: z.number(),
    items: z.array(CaptureCompleteDtoSchema),
});

export type CaptureDto = z.infer<typeof CaptureDtoSchema>;
export type CaptureCompleteDto = z.infer<typeof CaptureCompleteDtoSchema>;
export type PagingResultCaptureDto = z.infer<typeof PagingResultCaptureSchema>;