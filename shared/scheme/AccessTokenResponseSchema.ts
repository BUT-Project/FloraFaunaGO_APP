import {z} from "zod";

/**
 * @description Schema for the response received after successful login or token refresh.
 * - `tokenType`: Type of token (e.g., "Bearer"). readOnly in OpenAPI.
 * - `accessToken`: The JWT access token.
 * - `expiresIn`: Duration in seconds for which the access token is valid.
 * - `refreshToken`: Token used to get a new access token.
 */
export const AccessTokenResponseSchema = z.object({
    tokenType: z.string().nullable().optional(),
    accessToken: z.string().nonempty(),
    expiresIn: z.number().int(),
    refreshToken: z.string().nonempty(),
});
export type AccessTokenResponseDto = z.infer<typeof AccessTokenResponseSchema>;
