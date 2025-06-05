import {Result} from "@/shared/Result";
import {QueryParams} from "@/shared/PagedRequest";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
    readonly method: HttpMethod;
    readonly url: string;
    body?: unknown;
    readonly headers?: Readonly<Record<string, string>>;
    readonly timeout?: number;
    readonly params?: QueryParams;
    readonly signal?: AbortSignal;
}

export interface HttpClientConfig {
    readonly baseUrl?: string;
    readonly headers?: Readonly<Record<string, string>>;
    readonly timeout?: number;
}

export class HttpClient {
    protected readonly baseUrl: string;
    protected readonly defaultHeaders: Readonly<Record<string, string>>;
    protected readonly defaultTimeout: number;

    constructor(protected readonly config: HttpClientConfig = {}) {
        this.baseUrl = config.baseUrl ?? '';
        this.defaultHeaders = Object.freeze({
            'Content-Type': 'application/json',
            ...config.headers,
        });
        this.defaultTimeout = config.timeout ?? 10000;
    }

    protected getConfig(): HttpClientConfig {
        return this.config;
    }

    private buildUrl(url: string, params?: QueryParams): string {
        const baseUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

        if (!params) return baseUrl;

        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) return;

            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item !== null && item !== undefined) {
                        searchParams.append(key, String(item));
                    }
                });
            } else {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }

    private buildHeaders(headers: Readonly<Record<string, string>> = {}): Record<string, string> {
        return {
            ...this.defaultHeaders,
            ...headers,
        };
    }

    async request<T>(config: RequestConfig): Promise<Result<T>> {
        const { method, url, body, headers, timeout = this.defaultTimeout, params, signal } = config;

        try {

            const response = await fetch(this.buildUrl(url,params), {
                method,
                headers: this.buildHeaders(headers),
                body: body != null ? JSON.stringify(body) : null,
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
                };
            }

            const contentType = response.headers.get('content-type');
            const data = contentType?.includes('application/json')
                ? await response.json()
                : undefined;

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error
                    : new Error('Unknown request error')
            };
        }
    }

    // HTTP method convenience methods with explicit request/response types
    async get<R>(url: string,    params?: QueryParams,
                 headers?: Readonly<Record<string, string>>): Promise<Result<R>> {
        return this.request<R>({ method: 'GET',params, url, headers });
    }

    async post<T = unknown, R = T>(url: string, body: T, headers?: Readonly<Record<string, string>>): Promise<Result<R>> {
        return this.request<R>({ method: 'POST', url, body, headers });
    }

    async put<T = unknown, R = T>(url: string, body: T, headers?: Readonly<Record<string, string>>): Promise<Result<R>> {
        return this.request<R>({ method: 'PUT', url, body, headers });
    }

    async patch<T = unknown, R = T>(url: string, body: T, headers?: Readonly<Record<string, string>>): Promise<Result<R>> {
        return this.request<R>({ method: 'PATCH', url, body, headers });
    }

    async delete(url: string,    params?: QueryParams,
                 headers?: Readonly<Record<string, string>>): Promise<Result<void>> {
        return this.request<void>({ method: 'DELETE', url, params,headers });
    }
}