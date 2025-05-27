import {HttpClient, RequestConfig} from "@/dal/network/HttpClient";
import {TypeOf, z} from "zod";
import {Result} from "@/shared/Result";
import {QueryParams} from "@/shared/PagedRequest";

export class ZodHttpClient extends HttpClient {
    async requestWithValidation<
        TRequest extends z.ZodSchema,
        TResponse extends z.ZodSchema
    >(
        config: RequestConfig & {
            readonly requestSchema?: TRequest;
            readonly responseSchema?: TResponse;
        }
    ): Promise<Result<z.infer<TResponse>>> {
        const { requestSchema, responseSchema, ...requestConfig } = config;

        // Validate request body
        if (requestSchema && config.body !== undefined) {
            const validation = requestSchema.safeParse(config.body);
            if (!validation.success) {
                return {
                    success: false,
                    error: new Error(`Request validation failed: ${validation.error.message}`)
                };
            }
            requestConfig.body = validation.data;
        }

        // Make request
        const result = await this.request<{id : string}>(requestConfig);
        if (!result.success) return result;

        // Validate response
        if (responseSchema) {
            const validation = responseSchema.safeParse(result.data);
            if (!validation.success) {
                return {
                    success: false,
                    error: new Error(`Response validation failed: ${validation.error.message}`)
                };
            }
            return { success: true, data: validation.data };
        }

        return result as Result<z.infer<TResponse>>;
    }

    // Schema-aware convenience methods
    async postValidated<
        TRequest extends z.ZodTypeAny,
        TResponse extends z.ZodTypeAny
    >(
        url: string,
        body: z.infer<TRequest>,
        requestSchema: TRequest,
        responseSchema: TResponse,
        headers?: Readonly<Record<string, string>>
    ): Promise<Result<z.infer<TResponse>>> {
        return this.requestWithValidation({
            method: 'POST',
            url,
            body,
            requestSchema,
            responseSchema,
            headers
        });
    }

    async getValidated<TResponse extends z.ZodTypeAny>(
        url: string,
        responseSchema: TResponse,
        headers?: Readonly<Record<string, string>>,
        params?: QueryParams
    ): Promise<Result<TypeOf<TResponse>>> {
        return this.requestWithValidation({
            method: 'GET',
            url,
            responseSchema,
            headers
        });
    }

    async putValidated<
        TRequest extends z.ZodTypeAny,
        TResponse extends z.ZodTypeAny
    >(
        url: string,
        body: z.infer<TRequest>,
        requestSchema: TRequest,
        responseSchema: TResponse,
        headers?: Readonly<Record<string, string>>
    ): Promise<Result<z.infer<TResponse>>> {
        return this.requestWithValidation({
            method: 'PUT',
            url,
            body,
            requestSchema,
            responseSchema,
            headers
        });
    }
}