
// =====================================================
// ZOD EXTENSION - Direct instantiation with validation
// =====================================================

import { z, ZodSchema } from 'zod';
import {HttpClient, HttpRequestOptions} from "@/dal/network/HttpClient";

export interface ValidatedRequestOptions<T = unknown> extends HttpRequestOptions<T> {
    requestSchema?: ZodSchema<T>;
    responseSchema?: ZodSchema<unknown>;
}

export class ZodHttpClient extends HttpClient {
    async requestValidated<T = unknown, R = unknown>(options: ValidatedRequestOptions<T>): Promise<R> {
        const { requestSchema, responseSchema, ...requestOptions } = options;

        // Validate request body
        if (requestSchema && options.body !== undefined) {
            requestOptions.body = requestSchema.parse(options.body);
        }

        // Make request
        const response = await this.request<T, R>(requestOptions);

        // Validate response
        if (responseSchema && response !== undefined) {
            return responseSchema.parse(response);
        }

        return response;
    }

    async postValidated<T = unknown, R = unknown>(
        url: string,
        body: T,
        requestSchema?: ZodSchema<T>,
        responseSchema?: ZodSchema<R>,
        headers?: Record<string, string>
    ): Promise<R> {
        return this.requestValidated<T, R>({
            method: 'POST',
            url,
            body,
            requestSchema,
            responseSchema,
            headers,
        });
    }

    async putValidated<T = unknown, R = unknown>(
        url: string,
        body: T,
        requestSchema?: ZodSchema<T>,
        responseSchema?: ZodSchema<R>,
        headers?: Record<string, string>
    ): Promise<R> {
        return this.requestValidated<T, R>({
            method: 'PUT',
            url,
            body,
            requestSchema,
            responseSchema,
            headers,
        });
    }

    // Validated resource operations
    validatedResource<
        TCreateSchema extends ZodSchema,
        TUpdateSchema extends ZodSchema,
        TResourceSchema extends ZodSchema
    >(
        path: string,
        schemas: {
            create: TCreateSchema;
            update: TUpdateSchema;
            resource: TResourceSchema;
        }
    ) {
        return new ValidatedResource(this, path, schemas);
    }
}

export class ValidatedResource<
    TCreateSchema extends ZodSchema,
    TUpdateSchema extends ZodSchema,
    TResourceSchema extends ZodSchema
> {
    constructor(
        private readonly http: ZodHttpClient,
        private readonly path: string,
        private readonly schemas: {
            create: TCreateSchema;
            update: TUpdateSchema;
            resource: TResourceSchema;
        }
    ) {}

    async find(id: string | number): Promise<z.infer<TResourceSchema> | null> {
        try {
            return await this.http.requestValidated({
                method: 'GET',
                url: `${this.path}/${id}`,
                responseSchema: this.schemas.resource,
            });
        } catch {
            return null;
        }
    }

    async findAll(): Promise<z.infer<TResourceSchema>[]> {
        try {
            return await this.http.requestValidated({
                method: 'GET',
                url: this.path,
                responseSchema: z.array(this.schemas.resource),
            });
        } catch {
            return [];
        }
    }

    async create(data: z.infer<TCreateSchema>): Promise<z.infer<TResourceSchema>> {
        return this.http.requestValidated({
            method: 'POST',
            url: this.path,
            body: data,
            requestSchema: this.schemas.create,
            responseSchema: this.schemas.resource,
        });
    }

    async update(id: string | number, data: z.infer<TUpdateSchema>): Promise<z.infer<TResourceSchema>> {
        return this.http.requestValidated({
            method: 'PUT',
            url: `${this.path}/${id}`,
            body: data,
            requestSchema: this.schemas.update,
            responseSchema: this.schemas.resource,
        });
    }

    async patch(id: string | number, data: Partial<z.infer<TUpdateSchema>>): Promise<z.infer<TResourceSchema>> {
        return this.http.requestValidated({
            method: 'PATCH',
            url: `${this.path}/${id}`,
            body: data,
            requestSchema: this.schemas.update.partial(),
            responseSchema: this.schemas.resource,
        });
    }

    async remove(id: string | number): Promise<void> {
        return this.http.requestValidated({
            method: 'DELETE',
            url: `${this.path}/${id}`,
        });
    }
}