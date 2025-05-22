import {z} from "zod";

export const RefreshRequestSchema = z.object({
    refreshToken: z.string({ required_error: "Le refresh token est requis." })
});
export type RefreshRequestDto = z.infer<typeof RefreshRequestSchema>;