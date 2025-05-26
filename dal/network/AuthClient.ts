import {AccessTokenResponseDto, AccessTokenResponseSchema} from "@/shared/scheme/AccessTokenResponseSchema";
import {LoginRequestDto, LoginRequestSchema} from "@/shared/scheme/LoginRequestSchema";
import {RegisterRequestDto, RegisterRequestSchema} from "@/shared/scheme/RegisterRequestSchema";
import {RefreshRequestDto, RefreshRequestSchema} from "@/shared/scheme/RefreshRequestSchema";


export default class AuthClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async login(request: LoginRequestDto): Promise<AccessTokenResponseDto> {
        // Validate request data
        const validatedRequest = LoginRequestSchema.parse(request);

        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedRequest),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Login failed with status ${response.status}`);
        }

        const data = await response.json();

        // Validate response data
        return AccessTokenResponseSchema.parse(data);
    }

    async register(request: RegisterRequestDto): Promise<AccessTokenResponseDto> {
        // Validate request data
        const validatedRequest = RegisterRequestSchema.parse(request);

        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedRequest),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Registration failed with status ${response.status}`);
        }

        const data = await response.json();

        // Validate response data
        return AccessTokenResponseSchema.parse(data);
    }

    async refresh(request: RefreshRequestDto): Promise<AccessTokenResponseDto> {
        // Validate request data
        const validatedRequest = RefreshRequestSchema.parse(request);

        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedRequest),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Token refresh failed with status ${response.status}`);
        }

        const data = await response.json();

        // Validate response data
        return AccessTokenResponseSchema.parse(data);
    }
}