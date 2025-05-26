

// Core HTTP client

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpClientConfig {
    baseUrl?: string;
    headers?: Record<string, string>;
    timeout?: number;
}

export interface HttpRequestOptions<T = unknown> {
    method: HttpMethod;
    url: string;
    body?: T;
    headers?: Record<string, string>;
    timeout?: number;
}

export class HttpClient {
    private readonly config: Required<HttpClientConfig>;

    constructor(config: HttpClientConfig = {}) {
        this.config = {
            baseUrl: config.baseUrl ?? '',
            headers: { 'Content-Type': 'application/json', ...config.headers },
            timeout: config.timeout ?? 10000,
        };
    }

    private buildUrl(url: string): string {
        return url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;
    }

    private buildHeaders(headers: Record<string, string> = {}): Record<string, string> {
        return { ...this.config.headers, ...headers };
    }

    async request<T = unknown, R = unknown>(options: HttpRequestOptions<T>): Promise<R> {
        const { method, url, body, headers, timeout = this.config.timeout } = options;

        const requestInit: RequestInit = {
            method,
            headers: this.buildHeaders(headers),
            signal: AbortSignal.timeout(timeout),
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestInit.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(this.buildUrl(url), requestInit);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                return undefined as R;
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                throw new Error(`Request timeout: ${url}`);
            }
            throw error;
        }
    }

    async get<R = unknown>(url: string, headers?: Record<string, string>): Promise<R> {
        return this.request<never, R>({ method: 'GET', url, headers });
    }

    async post<T = unknown, R = unknown>(url: string, body: T, headers?: Record<string, string>): Promise<R> {
        return this.request<T, R>({ method: 'POST', url, body, headers });
    }

    async put<T = unknown, R = unknown>(url: string, body: T, headers?: Record<string, string>): Promise<R> {
        return this.request<T, R>({ method: 'PUT', url, body, headers });
    }

    async patch<T = unknown, R = unknown>(url: string, body: T, headers?: Record<string, string>): Promise<R> {
        return this.request<T, R>({ method: 'PATCH', url, body, headers });
    }

    async delete(url: string, headers?: Record<string, string>): Promise<void> {
        await this.request<never, void>({ method: 'DELETE', url, headers });
    }

    // Resource operations
    resource<TCreate = unknown, TUpdate = unknown, TResource = unknown>(path: string) {
        return new Resource<TCreate, TUpdate, TResource>(this, path);
    }
}

// Resource operations for CRUD patterns
export class Resource<TCreate, TUpdate, TResource> {
    constructor(
        private readonly http: HttpClient,
        private readonly path: string
    ) {}

    async find(id: string | number): Promise<TResource | null> {
        try {
            return await this.http.get<TResource>(`${this.path}/${id}`);
        } catch {
            return null;
        }
    }

    async findAll(): Promise<TResource[]> {
        try {
            return await this.http.get<TResource[]>(this.path);
        } catch {
            return [];
        }
    }

    async create(data: TCreate): Promise<TResource> {
        return this.http.post<TCreate, TResource>(this.path, data);
    }

    async update(id: string | number, data: TUpdate): Promise<TResource> {
        return this.http.put<TUpdate, TResource>(`${this.path}/${id}`, data);
    }

    async patch(id: string | number, data: Partial<TUpdate>): Promise<TResource> {
        return this.http.patch<Partial<TUpdate>, TResource>(`${this.path}/${id}`, data);
    }

    async remove(id: string | number): Promise<void> {
        return this.http.delete(`${this.path}/${id}`);
    }
}
