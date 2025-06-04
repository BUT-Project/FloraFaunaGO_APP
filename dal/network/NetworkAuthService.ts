import User from "@/model/domain/User";
import IAuthService from "@/model/service/IAuthService";
import { AuthJWTMapper } from "./AuthJWTMapper";
import { IUserRepository } from "@/dal/repository/IUserRepository";
import {RegisterRequestDto, RegisterRequestSchema} from "@/shared/scheme/RegisterRequestSchema";
import {LoginRequestDto, LoginRequestSchema} from "@/shared/scheme/LoginRequestSchema";
import {RefreshRequestDto, RefreshRequestSchema} from "@/shared/scheme/RefreshRequestSchema";
import {AccessTokenResponseDto, AccessTokenResponseSchema} from "@/shared/scheme/AccessTokenResponseSchema";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";
import TokenManager from "@/service/keyManager/TokenManager";
import {SecureLocalStorageAdapter} from "@/libs/LocalStorageAdapter";
import {ITokenManager} from "@/service/keyManager/ITokenManager";

export default class NetworkAuthService implements IAuthService {
    private currentUser: User | null = null;

    constructor(
       private readonly authClient: ZodHttpClient,
       private readonly userRepository: IUserRepository,
       private keyManager: ITokenManager<AccessTokenResponseDto> = new TokenManager(new SecureLocalStorageAdapter())
) {}
    resetPassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async login(email: string, password: string, twoFactorCode?: string, twoFactorRecoveryCode?: string): Promise<User> {
        try {
            const credentials : LoginRequestDto = {
                email: email.toLowerCase().trim(),
                password,
                twoFactorCode: twoFactorCode || null,
                twoFactorRecoveryCode: twoFactorRecoveryCode || null
            }
            const tokenResponse = await this.authClient.postValidated('/login', credentials, LoginRequestSchema, AccessTokenResponseSchema);
            // Store tokens
            if (tokenResponse.success) {
                await this.keyManager.putToken(tokenResponse.data);

                // Extract user ID from token and fetch user from repository
                const userId = AuthJWTMapper.getUserIdFromToken(tokenResponse.data.accessToken);
                this.currentUser = await this.userRepository.getById(userId);

                return this.currentUser;
            }else {
                throw new Error(tokenResponse.error?.message || "Échec de la connexion");
            }

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Échec de la connexion");
        }
    }

    async register(email: string, password: string, username?: string): Promise<User> {
        try {
            const registerRequest : RegisterRequestDto = {
                email: email.toLowerCase().trim(),
                password
            }

            const tokenResponse = await this.authClient.postValidated('/auth/register', registerRequest, RegisterRequestSchema, AccessTokenResponseSchema);
            if (tokenResponse.success) {
                // Store tokens
                await this.keyManager.putToken(tokenResponse.data);

                // Extract user ID from token and fetch user from repository
                const userId = AuthJWTMapper.getUserIdFromToken(tokenResponse.data.accessToken);
                this.currentUser = await this.userRepository.getById(userId);

                return this.currentUser;
            }
            else {
                throw new Error(tokenResponse.error?.message || "Échec de l'inscription INTERNAL ERROR");
            }
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Échec de l'inscription");
        }
    }

    async logout(): Promise<void> {
        try {
            await this.authClient.post('/logout', {});
        } catch (error) {
            console.warn('Server logout failed, proceeding with local cleanup:', error);
        } finally {
            // Always clear local tokens regardless of server response
            this.keyManager.clearTokens();
            this.currentUser = null;
        }
    }

    async getUser(): Promise<User | null> {
        // If we have a current user, return it
        if (this.currentUser) {
            return this.currentUser;
        }

        // Get a valid token (will refresh if needed)
        const token = await this.getValidToken();
        if (!token) {
            return null;
        }

        try {
            // Extract user ID from a token and fetch from repository
            const userId = AuthJWTMapper.getUserIdFromToken(token);
            this.currentUser = await this.userRepository.getById(userId);
            return this.currentUser;
        } catch (error) {
            // Token is invalid, or user not found, clear token
            this.keyManager.clearTokens();
            return null;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getValidToken();
        return token !== null;
    }

    /**
     * Refresh the access token using the refresh token
     */
    private async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = await this.keyManager.getRefreshToken();
            if (!refreshToken) {
                return false;
            }

            const refreshRequest: RefreshRequestDto = {
                refreshToken
            }
            const tokenResponse = await this.authClient.postValidated('/auth/refresh', refreshRequest, RefreshRequestSchema, AccessTokenResponseSchema);

            if (tokenResponse.success) {
                // Store new tokens
                await this.keyManager.putToken(tokenResponse.data);
                return true;
            } else {
                throw new Error(tokenResponse.error?.message || "Échec du rafraîchissement du token");
            }
        } catch (error) {
            // Refresh failed, clear tokens
            this.keyManager.clearTokens();
            this.currentUser = null;
            return false;
        }
    }

    /**
     * Get the current access token, refreshing if necessary
     */
    private async getValidToken(): Promise<string | null> {
        let token = await this.keyManager.getToken();

        if (!token) {
            // Try to refresh
            const refreshed = await this.refreshToken();
            if (refreshed) {
                token = await this.keyManager.getToken();
            }
        }

        return token;
    }
}