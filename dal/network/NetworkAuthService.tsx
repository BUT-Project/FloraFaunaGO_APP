import User from "@/model/domain/User";
import IAuthService from "@/model/service/IAuthService";
import AuthClient from "./AuthClient";
import { AuthJWTMapper } from "./AuthJWTMapper";
import { IUserRepository } from "@/dal/repository/IUserRepository";
import KeyManager from "@/service/KeyManager";
import {RegisterRequestDto, RegisterRequestSchema} from "@/shared/scheme/RegisterRequestSchema";
import {LoginRequestDto, LoginRequestSchema} from "@/shared/scheme/LoginRequestSchema";
import {RefreshRequestDto} from "@/shared/scheme/RefreshRequestSchema";
import {z} from "zod";
import {AccessTokenResponseSchema} from "@/shared/scheme/AccessTokenResponseSchema";
import {ZodHttpClient} from "@/dal/network/ZodHttpClient";

const validatedApi = new ZodHttpClient({ baseUrl: 'https://api.example.com' });

export default class NetworkAuthService implements IAuthService {
    private currentUser: User | null = null;
    private authClient: AuthClient; // Can be abstract
    private keyManager: KeyManager; // Can be abstract
    private userRepository: IUserRepository;

    constructor(
        baseUrl: string,
        userRepository: IUserRepository
    ) {
        this.authClient = new AuthClient(baseUrl);
        this.keyManager = new KeyManager();
        this.userRepository = userRepository;
    }

    async login(email: string, password: string, twoFactorCode?: string, twoFactorRecoveryCode?: string): Promise<User> {
        try {
            const loginRequest : LoginRequestDto = {
                email: email.toLowerCase().trim(),
                password,
                twoFactorCode: twoFactorCode || null,
                twoFactorRecoveryCode: twoFactorRecoveryCode || null
            }
            const tokenResponse = await this.authClient.login(loginRequest);

            // Store tokens
            this.keyManager.putToken(tokenResponse);

            // Extract user ID from token and fetch user from repository
            const userId = AuthJWTMapper.getUserIdFromToken(tokenResponse.accessToken);
            this.currentUser = await this.userRepository.getById(userId);

            return this.currentUser;
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
            const tokenResponse = await this.authClient.register(registerRequest);

            // Store tokens
            this.keyManager.putToken(tokenResponse);

            // Extract user ID from token and fetch user from repository
            const userId = AuthJWTMapper.getUserIdFromToken(tokenResponse.accessToken);
            this.currentUser = await this.userRepository.getById(userId);

            return this.currentUser;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "Échec de l'inscription");
        }
    }

    async logout(): Promise<void> {
        this.keyManager.clearTokens();
        this.currentUser = null;
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
            // Extract user ID from token and fetch from repository
            const userId = AuthJWTMapper.getUserIdFromToken(token);
            this.currentUser = await this.userRepository.getById(userId);
            return this.currentUser;
        } catch (error) {
            // Token is invalid or user not found, clear token
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
            const refreshToken = this.keyManager.getRefreshToken();
            if (!refreshToken) {
                return false;
            }

            const refreshRequest: RefreshRequestDto = {
                refreshToken
            }
            const tokenResponse = await this.authClient.refresh(refreshRequest);

            // Store new tokens
            this.keyManager.putToken(tokenResponse);

            return true;
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
        let token = this.keyManager.getToken();

        if (!token) {
            // Try to refresh
            const refreshed = await this.refreshToken();
            if (refreshed) {
                token = this.keyManager.getToken();
            }
        }

        return token;
    }
}