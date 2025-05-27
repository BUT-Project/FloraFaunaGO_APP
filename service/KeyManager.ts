import {AccessTokenResponseDto} from "@/shared/scheme/AccessTokenResponseSchema";
export default class KeyManager {
    private static readonly ACCESS_TOKEN_KEY = 'access_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';
    putToken(tokenResponse: AccessTokenResponseDto): void {
        const expiryTime = Date.now() + (tokenResponse.expiresIn * 1000);

        localStorage.setItem(KeyManager.ACCESS_TOKEN_KEY, tokenResponse.accessToken);
        localStorage.setItem(KeyManager.REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
        localStorage.setItem(KeyManager.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    getToken(): string | null {
        const token = localStorage.getItem(KeyManager.ACCESS_TOKEN_KEY);

        if (!token || !this.isTokenValid()) {
            return null;
        }

        return token;
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(KeyManager.REFRESH_TOKEN_KEY);
    }

    clearTokens(): void {
        localStorage.removeItem(KeyManager.ACCESS_TOKEN_KEY);
        localStorage.removeItem(KeyManager.REFRESH_TOKEN_KEY);
        localStorage.removeItem(KeyManager.TOKEN_EXPIRY_KEY);
    }

    isTokenValid(): boolean {
        const expiryTime = localStorage.getItem(KeyManager.TOKEN_EXPIRY_KEY);

        if (!expiryTime) {
            return false;
        }

        const expiryTimestamp = parseInt(expiryTime);
        const currentTime = Date.now();

        // Consider token invalid if it expires in less than 1 minute to allow for refresh
        return currentTime < (expiryTimestamp - 60000);
    }
}