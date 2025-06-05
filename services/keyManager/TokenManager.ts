import {AccessTokenResponseDto} from "@/shared/scheme/AccessTokenResponseSchema";
import {IKVStorage} from "@/services/IKVStorage";
import {ITokenManager} from "@/services/keyManager/ITokenManager";

export default class TokenManager<T extends AccessTokenResponseDto>
    implements ITokenManager<T> {

    readonly ACCESS_TOKEN_KEY: string;
    readonly REFRESH_TOKEN_KEY: string;
    readonly TOKEN_EXPIRY_KEY: string;

    constructor(
        private readonly storage: IKVStorage,
        keyPrefix: string = ''
    ) {
        this.ACCESS_TOKEN_KEY = keyPrefix ? `${keyPrefix}_access_token` : 'access_token';
        this.REFRESH_TOKEN_KEY = keyPrefix ? `${keyPrefix}_refresh_token` : 'refresh_token';
        this.TOKEN_EXPIRY_KEY = keyPrefix ? `${keyPrefix}_token_expiry` : 'token_expiry';
    }
    async putToken(tokenResponse: T): Promise<void> {
        const expiryTime = Date.now() + (tokenResponse.expiresIn * 1000);

        await this.storage.setItem(this.ACCESS_TOKEN_KEY, tokenResponse.accessToken);
        await this.storage.setItem(this.REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
        await this.storage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    async getToken(): Promise<string | null> {
        const token = await this.storage.getItem(this.ACCESS_TOKEN_KEY);

        if (!token || !this.isTokenValid()) {
            return null;
        }

        return token;
    }

    async getRefreshToken(): Promise<string | null> {
        return await this.storage.getItem(this.REFRESH_TOKEN_KEY);
    }

    clearTokens(): void {
        this.storage.removeItem(this.ACCESS_TOKEN_KEY);
        this.storage.removeItem(this.REFRESH_TOKEN_KEY);
        this.storage.removeItem(this.TOKEN_EXPIRY_KEY);
    }

    async isTokenValid(): Promise<boolean> {
        const expiryTime = await this.storage.getItem(this.TOKEN_EXPIRY_KEY);

        if (!expiryTime) {
            return false;
        }

        const expiryTimestamp = parseInt(expiryTime);
        const currentTime = Date.now();

        // Consider token invalid if it expires in less than 1 minute
        return currentTime < (expiryTimestamp - 60000);
    }
}