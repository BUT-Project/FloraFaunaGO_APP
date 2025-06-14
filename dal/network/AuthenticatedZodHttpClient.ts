import { ZodHttpClient } from './ZodHttpClient';
import { HttpClientConfig, RequestConfig } from './HttpClient';
import { ITokenManager } from '@/services/keyManager/ITokenManager';
import { z } from 'zod';
import { Result } from '@/shared/Result';

export class AuthenticatedZodHttpClient extends ZodHttpClient {
    constructor(
        config: HttpClientConfig,
        private readonly tokenManager: ITokenManager<any>
    ) {
        super(config);
    }

    private async getAuthHeaders(): Promise<Record<string, string>> {
        try {
            const token = await this.tokenManager.getToken();
            return token ? { 'Authorization': `Bearer ${token}` } : {};
        } catch (error) {
            console.warn('Failed to get auth token:', error);
            return {};
        }
    }

    override async requestWithValidation<
        TRequest extends z.ZodSchema,
        TResponse extends z.ZodSchema
    >(
        config: RequestConfig & {
            readonly requestSchema?: TRequest;
            readonly responseSchema?: TResponse;
        }
    ): Promise<Result<z.infer<TResponse>>> {
        const authHeaders = await this.getAuthHeaders();
        const configWithAuth = {
            ...config,
            headers: {
                ...config.headers,
                ...authHeaders
            }
        };
        
        return super.requestWithValidation(configWithAuth);
    }
}