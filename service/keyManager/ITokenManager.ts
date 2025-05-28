export interface ITokenManager<T> {
    putToken(tokenResponse: T): Promise<void>;
    getToken(): Promise<string | null>;
    getRefreshToken(): Promise<string | null>;
    clearTokens(): void;
    isTokenValid(): Promise<boolean>;
}