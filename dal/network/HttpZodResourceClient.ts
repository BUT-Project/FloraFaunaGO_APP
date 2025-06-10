import { z } from "zod";
import { ZodHttpClient } from "@/dal/network/ZodHttpClient";
import { PagingResult } from "@/shared/PagingResult";
import { PagedRequest, QueryParams } from "@/shared/PagedRequest";
import { GenericRepository } from "@/dal/repository/IGenericRepository";
import { FilterPredicate } from "@/shared/FilterPredicate";

type RepositoryOperation = keyof GenericRepository<unknown>

export interface HttpZodResourceConfig<TResponse,TList = TResponse, TCreate = Partial<TResponse>, TUpdate = Partial<TResponse>> {
    /**
     * Schema for the response
     */
    resourceSchema: z.ZodSchema<TResponse>;

    listItemSchema?: z.ZodSchema<TList>;

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
    pagedResponseSchema?: z.ZodSchema<PagingResult<TList>>;

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
}

/**
 * Abstract base repository implementation using HTTP requests with Zod validation
 * Provides common HTTP operations that can be extended by concrete repository implementations
 */
export abstract class HttpZodResourceClient<T,TList=T, TCreate = Partial<T>, TUpdate = Partial<T>> {

    private readonly defaultPagedResponseSchema: z.ZodSchema<PagingResult<TList | T>>;
    private readonly defaultSuccessSchema = z.object({ success: z.boolean() });

    constructor(
        protected readonly httpClient: ZodHttpClient,
        protected readonly baseUrl: string,
        protected readonly config: HttpZodResourceConfig<T,TList, TCreate, TUpdate>
    ) {
        // Create the default paged response schema to match PagingResult<T> interface exactly
        this.defaultPagedResponseSchema = z.object({
            count: z.number(),
            index: z.number(),
            total: z.number(),
            items: z.array(this.config.listItemSchema ?? this.config.resourceSchema)
        })
    }

    async create(item: TCreate): Promise<void> {
        const url = this.getEndpoint('create');
        const requestSchema = this.config.createSchema ?? this.config.resourceSchema;
        const responseSchema =
            this.defaultSuccessSchema.or(this.config.resourceSchema);

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

    async update(id: string, item: TUpdate): Promise<void> {
        const url = this.getEndpoint('update', id);
        const requestSchema = this.config.updateSchema ?? this.config.resourceSchema;
        const responseSchema =
            this.defaultSuccessSchema.or(this.config.resourceSchema);

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

    async delete(id: string | number): Promise<void> {
        const url = this.getEndpoint('delete', id);
        const responseSchema = this.defaultSuccessSchema;

        const result = await this.httpClient.requestWithValidation({
            method: 'DELETE',
            url,
            responseSchema
        });

        if (!result.success) {
            throw result.error;
        }
    }

    async getById(id: string | number): Promise<T> {
        const url = this.getEndpoint('getById', id);

        const result = await this.httpClient.getValidated(
            url,
            this.config.resourceSchema
        );

        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }

    async getAll(request: PagedRequest): Promise<PagingResult<TList | T>> {
        const url = this.getEndpoint('getAll');
        const responseSchema = this.config.pagedResponseSchema ?? this.defaultPagedResponseSchema;
        console.log("getAll URL", url);
        const result = await this.httpClient.getValidated(
            url,
            responseSchema,
            undefined,
            this.buildQueryParams(request)
        );
        console.log("getAll result", result);

        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }

    async count(): Promise<number> {
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
    static create<T,TList=T, TCreate = Partial<T>, TUpdate = Partial<T>>(
        httpClient: ZodHttpClient,
        baseUrl: string,
        resourceSchema: z.ZodSchema<T>,
        options?: Partial<HttpZodResourceConfig<T,TList, TCreate, TUpdate>>
    ): HttpZodResourceClient<T,TList, TCreate, TUpdate> {
        const config: HttpZodResourceConfig<T,TList, TCreate, TUpdate> = {
            resourceSchema,
            ...options
        };

        // Return a concrete implementation using anonymous class
        return new (class extends HttpZodResourceClient<T,TList, TCreate, TUpdate> {
            constructor() {
                super(httpClient, baseUrl, config);
            }
        })();
    }
}