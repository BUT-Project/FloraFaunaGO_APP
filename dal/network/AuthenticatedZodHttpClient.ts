import {ZodHttpClient} from './ZodHttpClient';
import {HttpClientConfig, RequestConfig} from './HttpClient';
import {ITokenManager} from '@/services/keyManager/ITokenManager';
import {Result} from '@/shared/Result';

export class AuthenticatedZodHttpClient extends ZodHttpClient {
    private isRefreshing = false;
    
    constructor(
        config: HttpClientConfig,
        private readonly tokenManager: ITokenManager<any>,
        private readonly refreshTokenCallback?: () => Promise<boolean>
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

    override async request<TResponse>(config: RequestConfig): Promise<Result<TResponse>> {
        const authHeaders = await this.getAuthHeaders();
        const configWithAuth = {
            ...config,
            headers: {
                ...config.headers,
                ...authHeaders
            }
        };
        const result = await super.request<TResponse>(configWithAuth);
        
        // If we get a 401 error, try to refresh token and retry once
        if (!result.success && (result.error.message?.includes('401') )) {
            console.warn('Token expired, attempting refresh');
            
            // Prevent multiple simultaneous refresh attempts
            if (this.isRefreshing) {
                console.warn('Refresh already in progress, skipping');
                return result;
            }
            
            if (this.refreshTokenCallback) {
                this.isRefreshing = true;
                try {
                    const refreshed = await this.refreshTokenCallback();
                    if (refreshed) {
                        const newAuthHeaders = await this.getAuthHeaders();
                        const retryConfig = {
                            ...config,
                            headers: {
                                ...config.headers,
                                ...newAuthHeaders
                            }
                        };
                        return await super.request<TResponse>(retryConfig);
                    }
                } catch (error) {
                    console.warn('Token refresh failed:', error);
                } finally {
                    this.isRefreshing = false;
                }
            }
            this.tokenManager.clearTokens();
        }
        
        return result;
    }

}