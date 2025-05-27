import { z } from "zod";
import { ZodHttpClient } from "@/dal/network/ZodHttpClient";
import { PagingResult } from "@/shared/PagingResult";
import { PagedRequest, QueryParams } from "@/shared/PagedRequest";
import { GenericRepository } from "@/dal/repository/IGenericRepository";
import { FilterPredicate } from "@/shared/FilterPredicate";
import {IUserRepository} from "@/dal/repository/IUserRepository";

type RepositoryOperation = keyof GenericRepository<any>

export interface HttpZodRepositoryConfig<TResponse, TCreate = Partial<TResponse>, TUpdate = Partial<TResponse>> {
    /**
     * Schema for the response
     */
    responceSchema: z.ZodSchema<TResponse>;

    /**
     * Schema for create operations (optional if different from partial response schema)
     */
    createSchema?: z.ZodSchema<TCreate>;

    /**
     * Schema for update operations (optional if different from partial response schema)
     */
    updateSchema?: z.ZodSchema<TUpdate>;

    /**
     * Schema for the paginated response
     */
    pagedResponseSchema?: z.ZodSchema<PagingResult<TResponse>>;

    /**
     * Custom endpoint paths (optional)
     */
    endpoints?: {
        getAll?: string;
        create?: string;
        getById?: (id: any) => string;
        update?: (id: any) => string;
        delete?: (id: any) => string;
        count?: string;
    };

    /**
     * Custom success response schemas for different operations
     */
    responseSchemas?: {
        create?: z.ZodSchema<any>;
        update?: z.ZodSchema<any>;
        delete?: z.ZodSchema<any>;
    };
}

/**
 * Abstract base repository implementation using HTTP requests with Zod validation
 * Provides common HTTP operations that can be extended by concrete repository implementations
 */
export abstract class HttpZodRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> {

    private readonly defaultPagedResponseSchema: z.ZodSchema<PagingResult<T>>;
    private readonly defaultSuccessSchema = z.object({ success: z.boolean() });

    constructor(
        protected readonly httpClient: ZodHttpClient,
        protected readonly baseUrl: string,
        protected readonly config: HttpZodRepositoryConfig<T, TCreate, TUpdate>
    ) {
        // Create the default paged response schema to match PagingResult<T> interface exactly
        this.defaultPagedResponseSchema = z.object({
            count: z.number(),
            index: z.number(),
            total: z.number(),
            items: z.array(this.config.responceSchema)
        }) as z.ZodSchema<PagingResult<T>>;
    }

    async create(item: TCreate): Promise<void> {
        const url = this.getEndpoint('create');
        const requestSchema = this.config.createSchema ?? this.config.responceSchema;
        const responseSchema = this.config.responseSchemas?.create ??
            this.defaultSuccessSchema.or(this.config.responceSchema);

        const result = await this.httpClient.postValidated(
            url,
            item,
            requestSchema,
            responseSchema
        );

        if (!result.success) {
            throw result.error;
        }
    }

    async update(id: any, item: TUpdate): Promise<void> {
        const url = this.getEndpoint('update', id);
        const requestSchema = this.config.updateSchema ?? this.config.responceSchema;
        const responseSchema = this.config.responseSchemas?.update ??
            this.defaultSuccessSchema.or(this.config.responceSchema);

        const result = await this.httpClient.putValidated(
            url,
            item,
            requestSchema,
            responseSchema
        );

        if (!result.success) {
            throw result.error;
        }
    }

    async delete(id: any): Promise<void> {
        const url = this.getEndpoint('delete', id);
        const responseSchema = this.config.responseSchemas?.delete ?? this.defaultSuccessSchema;

        const result = await this.httpClient.requestWithValidation({
            method: 'DELETE',
            url,
            responseSchema
        });

        if (!result.success) {
            throw result.error;
        }
    }

    async getById(id: any): Promise<T> {
        const url = this.getEndpoint('getById', id);

        const result = await this.httpClient.getValidated(
            url,
            this.config.responceSchema
        );

        if (!result.success) {
            throw result.error;
        }

        return result.data;
    }

    async getAll(request: PagedRequest): Promise<PagingResult<T>> {
        const url = this.getEndpoint('getAll');
        const responseSchema = this.config.pagedResponseSchema ?? this.defaultPagedResponseSchema;

        const result = await this.httpClient.getValidated(
            url,
            responseSchema,
            undefined,
            this.buildQueryParams(request)
        );

        if (!result.success) {
            throw result.error;
        }

        return result.data;
    }

    async count(filter: FilterPredicate<T>): Promise<number> {
        throw new Error("Not implemented");
    }

    /**
     * Get endpoint URL for a specific operation
     */
    protected getEndpoint(operation: RepositoryOperation, id?: any): string {
        const customEndpoint = this.config.endpoints?.[operation as keyof typeof this.config.endpoints];

        switch (operation) {
            case 'getAll':
            case 'create':
                return (customEndpoint as string) ?? this.baseUrl;
            case 'getById':
            case 'update':
            case 'delete':
                if (typeof customEndpoint === 'function') {
                    return customEndpoint(id);
                }
                return customEndpoint ?? `${this.baseUrl}/${id}`;
            case 'count':
                return (customEndpoint as string) ?? `${this.baseUrl}/count`;
            default:
                return this.baseUrl;
        }
    }

    /**
     * Build query parameters from PagedRequest
     */
    protected buildQueryParams(request: PagedRequest): QueryParams {
        const params: QueryParams = {
            index: request.index,
            count: request.count
        };

        if (request.orderingPropertyName) {
            params.orderingPropertyName = request.orderingPropertyName;
        }

        if (request.descending !== null && request.descending !== undefined) {
            params.descending = request.descending;
        }

        if (request.filter) {
            // Merge the filter params with pagination params
            Object.assign(params, request.filter);
        }

        return params;
    }

    /**
     * Static factory method for creating repository instances
     */
    static create<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
        httpClient: ZodHttpClient,
        baseUrl: string,
        entitySchema: z.ZodSchema<T>,
        options?: Partial<HttpZodRepositoryConfig<T, TCreate, TUpdate>>
    ): HttpZodRepository<T, TCreate, TUpdate> {
        const config: HttpZodRepositoryConfig<T, TCreate, TUpdate> = {
            responceSchema: entitySchema,
            ...options
        };

        // Return a concrete implementation using anonymous class
        return new (class extends HttpZodRepository<T, TCreate, TUpdate> {
            constructor() {
                super(httpClient, baseUrl, config);
            }
        })();
    }
}