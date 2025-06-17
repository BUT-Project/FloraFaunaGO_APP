import {Result} from "@/shared/Result";
import {QueryParams} from "@/shared/PagedRequest";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
    readonly method: HttpMethod;
    readonly url: string;
    body?: unknown;
    readonly headers?: Readonly<Record<string, string>>;
    readonly params?: QueryParams;
}

export interface HttpClientConfig {
    readonly baseUrl?: string;
    readonly headers?: Readonly<Record<string, string>>;
}

export class HttpClient {
    protected readonly baseUrl: string;
    protected readonly defaultHeaders: Readonly<Record<string, string>>;

    constructor(protected readonly config: HttpClientConfig = {}) {
        this.baseUrl = config.baseUrl ?? '';
        this.defaultHeaders = Object.freeze({
            'Content-Type': 'application/json',
            ...config.headers,
        });
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

    async request<TResponse>(config: RequestConfig): Promise<Result<TResponse>> {
        const { method, url, body, headers, params } = config;

        try {
            const requestDate = new Date().toISOString();
            console.log('Request Date:', requestDate, this.buildUrl(url, params));
            console.log("LOLOALOALAO");
            console.log('Request Body:', this.buildHeaders(headers));
            const response = await fetch(this.buildUrl(url, params), {
                method,
                headers: this.buildHeaders(headers),
                body: body != null ? JSON.stringify(body) : null,
            });

            const responseDate = new Date().toISOString();

            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                let errorData = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (parseErr) {
                    console.error('Error parsing JSON from API response:', parseErr);
                }

                console.error('API Error Details:', {
                    requestDate,
                    responseDate,
                    status: response.status,
                    statusText: response.statusText,
                    url: this.buildUrl(url, params),
                    errorBody: errorText,
                    parsedError: errorData
                });

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
            // Handle different types of errors with specific messages
            if (error instanceof Error) {
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    return {
                        success: false,
                        error: new Error('Network error - check your connection')
                    };
                }
                return {
                    success: false,
                    error: error
                };
            }
            return {
                success: false,
                error: new Error('Unknown request error')
            };
        }
    }

    // HTTP method convenience methods with explicit request/response types
    async get<TResponse>(url: string, params?: QueryParams,
                         headers?: Readonly<Record<string, string>>): Promise<Result<TResponse>> {
        return this.request<TResponse>({ method: 'GET',params, url, headers });
    }

    async post<TRequest = unknown, TResponse = TRequest>(url: string, body: TRequest, headers?: Readonly<Record<string, string>>): Promise<Result<TResponse>> {
        return this.request<TResponse>({ method: 'POST', url, body, headers });
    }

    async put<TRequest = unknown, TResponse = TRequest>(url: string, body: TRequest, headers?: Readonly<Record<string, string>>): Promise<Result<TResponse>> {
        return this.request<TResponse>({ method: 'PUT', url, body, headers });
    }

    async patch<TRequest = unknown, TResponse = TRequest>(url: string, body: TRequest, headers?: Readonly<Record<string, string>>): Promise<Result<TResponse>> {
        return this.request<TResponse>({ method: 'PATCH', url, body, headers });
    }

    async delete(url: string,    params?: QueryParams,
                 headers?: Readonly<Record<string, string>>): Promise<Result<void>> {
        return this.request<void>({ method: 'DELETE', url, params,headers });
    }
}