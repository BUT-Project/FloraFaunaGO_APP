import NetworkAuthService from "@/dal/network/NetworkAuthService";
import { ZodHttpClient } from "@/dal/network/ZodHttpClient";
import { IUserRepository } from "@/dal/repository/IUserRepository";
import { LoginRequestSchema, LoginRequestDto } from "@/shared/scheme/LoginRequestSchema";
import { RegisterRequestSchema, RegisterRequestDto } from "@/shared/scheme/RegisterRequestSchema";
import { RefreshRequestSchema, RefreshRequestDto } from "@/shared/scheme/RefreshRequestSchema";
import { AccessTokenResponseSchema, AccessTokenResponseDto } from "@/shared/scheme/AccessTokenResponseSchema";
import User from "@/model/domain/User";
import JWT from "expo-jwt";

// --- Mock Definitions ---

// Mock KeyManager
const mockPutToken = jest.fn();
const mockKeyManagerClearTokens = jest.fn();
const mockKeyManagerGetToken = jest.fn();
const mockKeyManagerGetRefreshToken = jest.fn();

jest.mock('@/services/keyManager/TokenManager', () => {
    return jest.fn().mockImplementation(() => {
        // This mock constructor is called when `new KeyManager()` is used in NetworkAuthService
        return {
            putToken: mockPutToken,
            clearTokens: mockKeyManagerClearTokens,
            getToken: mockKeyManagerGetToken,
            getRefreshToken: mockKeyManagerGetRefreshToken,
        };
    });
});

// ZodHttpClient instance is mocked
const mockPostValidated = jest.fn();
const mockPost = jest.fn();
const mockAuthClientInstance = {
    postValidated: mockPostValidated,
    post: mockPost,
} as unknown as jest.Mocked<ZodHttpClient>;


// Mock IUserRepository
const mockUserRepository: jest.Mocked<IUserRepository> = {
    getById: jest.fn(),
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count : jest.fn(),
};

// --- Shared Mock Data ---
const MOCK_USER_ID = "1";
const MOCK_EMAIL = "test@example.com";
const MOCK_PASSWORD = "password123";
const MOCK_JWT_SECRET = "test-secret-key"; // Secret for JWT encoding

// Generate a JWT-like string for access token
// const MOCK_ACCESS_TOKEN_JWT = createMockJwt({ id: MOCK_USER_ID, user: MOCK_EMAIL });
const MOCK_ACCESS_TOKEN_JWT = JWT.encode(
    { nameid: MOCK_USER_ID.toString(), user: MOCK_EMAIL },
    MOCK_JWT_SECRET
);
const MOCK_REFRESH_TOKEN_STRING = "fakeRefreshTokenString";

const MOCK_TOKEN_RESPONSE_DATA: AccessTokenResponseDto = {
    accessToken: MOCK_ACCESS_TOKEN_JWT,
    refreshToken: MOCK_REFRESH_TOKEN_STRING,
    expiresIn: 3600,
    tokenType: "Bearer"
};

const MOCK_USER: User = {
    id: MOCK_USER_ID,
    email: MOCK_EMAIL,
} as User;


// --- Test Suite ---
describe('NetworkAuthService', () => {
    let authService: NetworkAuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        // NetworkAuthService will instantiate its own KeyManager, which will be the mocked version.
        authService = new NetworkAuthService(mockAuthClientInstance, mockUserRepository);
    });

    describe('login', () => {
        const loginCredentials: LoginRequestDto = {
            email: MOCK_EMAIL.toLowerCase().trim(),
            password: MOCK_PASSWORD,
            twoFactorCode: null,
            twoFactorRecoveryCode: null
        };

        it('should successfully login, call KeyManager.putToken with API response, and return user', async () => {
            mockPostValidated.mockResolvedValue({ success: true, data: MOCK_TOKEN_RESPONSE_DATA });
            mockUserRepository.getById.mockResolvedValue(MOCK_USER); // Mocking repo response

            const user = await authService.login(MOCK_EMAIL, MOCK_PASSWORD);

            expect(mockPostValidated).toHaveBeenCalledWith(
                '/login',
                loginCredentials,
                LoginRequestSchema,
                AccessTokenResponseSchema
            );
            // Verify KeyManager.putToken was called with the exact token data from the API
            expect(mockPutToken).toHaveBeenCalledWith(MOCK_TOKEN_RESPONSE_DATA);
            // AuthJWTMapper.getUserIdFromToken is called internally. We verify its effect:
            expect(mockUserRepository.getById).toHaveBeenCalledWith(MOCK_USER_ID); // ID extracted by real mapper
            expect(user).toEqual(MOCK_USER);
            // @ts-ignore // Accessing private member for test verification
            expect(authService.currentUser).toEqual(MOCK_USER);
        });

        it('should throw an error if login API call fails, and not call KeyManager.putToken', async () => {
            const errorMessage = "Invalid credentials";
            mockPostValidated.mockResolvedValue({ success: false, error: new Error(errorMessage) });

            await expect(authService.login(MOCK_EMAIL, MOCK_PASSWORD)).rejects.toThrow(errorMessage);

            expect(mockPostValidated).toHaveBeenCalledWith(
                '/login',
                loginCredentials,
                LoginRequestSchema,
                AccessTokenResponseSchema
            );
            expect(mockPutToken).not.toHaveBeenCalled();
            expect(mockUserRepository.getById).not.toHaveBeenCalled();
        });

        it('should throw error if getUserIdFromToken fails (e.g. malformed token from API), after calling KeyManager.putToken', async () => {
            const malformedTokenResponse: AccessTokenResponseDto = {
                ...MOCK_TOKEN_RESPONSE_DATA,
                accessToken: "malformed.token.string" // This should cause real AuthJWTMapper to fail
            };
            mockPostValidated.mockResolvedValue({ success: true, data: malformedTokenResponse });
            // Real AuthJWTMapper will throw, error will propagate

            await expect(authService.login(MOCK_EMAIL, MOCK_PASSWORD)).rejects.toThrow(); // Specific error depends on AuthJWTMapper's implementation

            expect(mockPutToken).toHaveBeenCalledWith(malformedTokenResponse); // Token is stored before mapper tries to use it
            expect(mockUserRepository.getById).not.toHaveBeenCalled();
        });
    });

    describe('register', () => {
        const registerPayload: RegisterRequestDto = {
            email: MOCK_EMAIL.toLowerCase().trim(),
            password: MOCK_PASSWORD
        };

        it('should successfully register, call KeyManager.putToken with API response, and return user', async () => {
            mockPostValidated.mockResolvedValue({ success: true, data: MOCK_TOKEN_RESPONSE_DATA });
            mockUserRepository.getById.mockResolvedValue(MOCK_USER);

            const user = await authService.register(MOCK_EMAIL, MOCK_PASSWORD);

            expect(mockPostValidated).toHaveBeenCalledWith(
                '/auth/register',
                registerPayload,
                RegisterRequestSchema,
                AccessTokenResponseSchema
            );
            expect(mockPutToken).toHaveBeenCalledWith(MOCK_TOKEN_RESPONSE_DATA);
            expect(mockUserRepository.getById).toHaveBeenCalledWith(MOCK_USER_ID); // ID from real mapper
            expect(user).toEqual(MOCK_USER);
        });

        it('should throw an error if register API call fails, and not call KeyManager.putToken', async () => {
            const errorMessage = "Email already exists";
            mockPostValidated.mockResolvedValue({ success: false, error: new Error(errorMessage) });

            await expect(authService.register(MOCK_EMAIL, MOCK_PASSWORD)).rejects.toThrow(errorMessage);
            expect(mockPutToken).not.toHaveBeenCalled();
            expect(mockUserRepository.getById).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should call the logout endpoint; KeyManager.clearTokens is NOT called by SUT', async () => {
            mockPost.mockResolvedValue({});
            await authService.logout();
            expect(mockPost).toHaveBeenCalledWith('/logout', {});
            expect(mockKeyManagerClearTokens).toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('should return cached currentUser without calling KeyManager if available', async () => {
            // @ts-ignore
            authService.currentUser = MOCK_USER;

            const user = await authService.getUser();

            expect(user).toEqual(MOCK_USER);
            expect(mockKeyManagerGetToken).not.toHaveBeenCalled();
            expect(mockKeyManagerGetRefreshToken).not.toHaveBeenCalled();
        });

        it('should use KeyManager.getToken and fetch user if valid token exists', async () => {
            mockKeyManagerGetToken.mockReturnValue(MOCK_ACCESS_TOKEN_JWT); // KeyManager has a valid token
            mockUserRepository.getById.mockResolvedValue(MOCK_USER);

            const user = await authService.getUser();

            expect(user).toEqual(MOCK_USER);
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.getById).toHaveBeenCalledWith(MOCK_USER_ID); // ID from real mapper
            expect(mockKeyManagerGetRefreshToken).not.toHaveBeenCalled(); // No refresh attempt
            expect(mockPutToken).not.toHaveBeenCalled(); // No new token to put
        });

        it('should use KeyManager.refreshToken, then KeyManager.putToken on success, and fetch user', async () => {
            const refreshedUserId = MOCK_USER_ID + 1; // Different ID for refreshed token
            const refreshedAccessTokenJwt = JWT.encode(
                { nameid: refreshedUserId.toString(), user: "refreshed@user.com" },
                MOCK_JWT_SECRET
            );
            const refreshedTokenResponseData: AccessTokenResponseDto = {
                accessToken: refreshedAccessTokenJwt,
                refreshToken: "newFakeRefreshTokenString",
                expiresIn: 3600,
                tokenType: "Bearer"
            };
            const refreshedUser = { ...MOCK_USER, id: refreshedUserId, email: "refreshed@user.com" } as User;

            mockKeyManagerGetToken.mockReturnValueOnce(null); // Initial getToken returns no access token
            mockKeyManagerGetRefreshToken.mockReturnValue(MOCK_REFRESH_TOKEN_STRING); // KeyManager has a refresh token
            mockPostValidated.mockResolvedValueOnce({ success: true, data: refreshedTokenResponseData }); // Refresh API call is successful
            mockKeyManagerGetToken.mockReturnValueOnce(refreshedAccessTokenJwt); // Subsequent getToken returns the new token
            mockUserRepository.getById.mockResolvedValue(refreshedUser);

            const user = await authService.getUser();

            expect(user).toEqual(refreshedUser);
            // KeyManager interactions:
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(2); // Once for initial check, once after refresh
            expect(mockKeyManagerGetRefreshToken).toHaveBeenCalledTimes(1); // To get the refresh token
            expect(mockPostValidated).toHaveBeenCalledWith( // Verify refresh API call
                '/auth/refresh',
                { refreshToken: MOCK_REFRESH_TOKEN_STRING } as RefreshRequestDto,
                RefreshRequestSchema,
                AccessTokenResponseSchema
            );
            expect(mockPutToken).toHaveBeenCalledWith(refreshedTokenResponseData); // New tokens stored
            // Verification of user fetch with new token:
            expect(mockUserRepository.getById).toHaveBeenCalledWith(refreshedUserId); // ID from new token
            // @ts-ignore
            expect(authService.currentUser).toEqual(refreshedUser);
        });

        it('should return null and call KeyManager.clearTokens if token refresh API call fails', async () => {
            mockKeyManagerGetToken.mockReturnValueOnce(null);
            mockKeyManagerGetRefreshToken.mockReturnValue(MOCK_REFRESH_TOKEN_STRING);
            mockPostValidated.mockResolvedValueOnce({ success: false, error: new Error("Refresh API failed") }); // Refresh fails

            const user = await authService.getUser();

            expect(user).toBeNull();
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(1);
            expect(mockKeyManagerGetRefreshToken).toHaveBeenCalledTimes(1);
            expect(mockPostValidated).toHaveBeenCalledWith( // Verify refresh API call attempt
                '/auth/refresh',
                { refreshToken: MOCK_REFRESH_TOKEN_STRING },
                RefreshRequestSchema,
                AccessTokenResponseSchema
            );
            expect(mockPutToken).not.toHaveBeenCalled(); // No new tokens to put
            expect(mockKeyManagerClearTokens).toHaveBeenCalledTimes(1); // Tokens should be cleared on refresh failure
            // @ts-ignore
            expect(authService.currentUser).toBeNull();
        });

        it('should return null if no access token and KeyManager.getRefreshToken returns null (no refresh possible)', async () => {
            mockKeyManagerGetToken.mockReturnValue(null); // No access token
            mockKeyManagerGetRefreshToken.mockReturnValue(null); // No refresh token

            const user = await authService.getUser();

            expect(user).toBeNull();
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(1);
            expect(mockKeyManagerGetRefreshToken).toHaveBeenCalledTimes(1);
            expect(mockPostValidated).not.toHaveBeenCalled(); // Refresh API not called
            // KeyManager.clearTokens is NOT called in this specific path by the SUT's refreshToken method.
            // It's only called if the API refresh itself fails.
            expect(mockKeyManagerClearTokens).not.toHaveBeenCalled();
        });

        it('should return null and call KeyManager.clearTokens if getUserIdFromToken (real mapper) fails for existing token', async () => {
            const invalidJwt = "this.is.notvalid"; // Will cause real AuthJWTMapper to throw
            mockKeyManagerGetToken.mockReturnValue(invalidJwt);

            const user = await authService.getUser();

            expect(user).toBeNull();
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(1);
            expect(mockKeyManagerClearTokens).toHaveBeenCalledTimes(1); // Tokens cleared due to mapper error
            expect(mockUserRepository.getById).not.toHaveBeenCalled();
        });

        it('should return null and call KeyManager.clearTokens if userRepository.getById fails', async () => {
            mockKeyManagerGetToken.mockReturnValue(MOCK_ACCESS_TOKEN_JWT); // Valid token
            mockUserRepository.getById.mockRejectedValue(new Error("User not found in repo")); // Repo fails

            const user = await authService.getUser();

            expect(user).toBeNull();
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(1);
            expect(mockKeyManagerClearTokens).toHaveBeenCalledTimes(1); // Tokens cleared due to repo error
            expect(mockUserRepository.getById).toHaveBeenCalledWith(MOCK_USER_ID);
            // This test highlights the potential SUT bug discussed before:
            // If `authService.currentUser` was set before this `getUser` call (e.g., by login),
            // it would NOT be cleared by this specific failure path in SUT's `getUser` catch block.
            // The test `POTENTIAL SUT BUG...` below focuses on this.
        });
    });

    describe('isAuthenticated', () => {
        it('should return true if KeyManager.getToken returns a valid token string', async () => {
            mockKeyManagerGetToken.mockReturnValue(MOCK_ACCESS_TOKEN_JWT);

            const authenticated = await authService.isAuthenticated();

            expect(authenticated).toBe(true);
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(1);
            expect(mockKeyManagerGetRefreshToken).not.toHaveBeenCalled();
        });

        it('should return true if token is refreshed successfully (KeyManager interaction)', async () => {
            const refreshedAccessTokenJwt = JWT.encode(
                { nameid: (MOCK_USER_ID + 2).toString() },
                MOCK_JWT_SECRET
            );

            const refreshedTokenResponseData: AccessTokenResponseDto = {
                ...MOCK_TOKEN_RESPONSE_DATA,
                accessToken: refreshedAccessTokenJwt
            };

            mockKeyManagerGetToken.mockReturnValueOnce(null); // No initial token
            mockKeyManagerGetRefreshToken.mockReturnValue(MOCK_REFRESH_TOKEN_STRING); // Has refresh token
            mockPostValidated.mockResolvedValueOnce({ success: true, data: refreshedTokenResponseData }); // Refresh success
            mockKeyManagerGetToken.mockReturnValueOnce(refreshedAccessTokenJwt); // getToken after refresh

            const authenticated = await authService.isAuthenticated();

            expect(authenticated).toBe(true);
            expect(mockKeyManagerGetToken).toHaveBeenCalledTimes(2);
            expect(mockKeyManagerGetRefreshToken).toHaveBeenCalledTimes(1);
            expect(mockPutToken).toHaveBeenCalledWith(refreshedTokenResponseData); // Verify new token stored
            expect(mockKeyManagerClearTokens).not.toHaveBeenCalled();
        });

        it('should return false and call KeyManager.clearTokens if refresh API call fails', async () => {
            mockKeyManagerGetToken.mockReturnValueOnce(null);
            mockKeyManagerGetRefreshToken.mockReturnValue(MOCK_REFRESH_TOKEN_STRING);
            mockPostValidated.mockResolvedValueOnce({ success: false, error: new Error("Refresh failed") });

            const authenticated = await authService.isAuthenticated();

            expect(authenticated).toBe(false);
            expect(mockKeyManagerClearTokens).toHaveBeenCalledTimes(1);
            expect(mockPutToken).not.toHaveBeenCalled();
        });

        it('should return false if KeyManager.getToken and KeyManager.getRefreshToken return null', async () => {
            mockKeyManagerGetToken.mockReturnValue(null);
            mockKeyManagerGetRefreshToken.mockReturnValue(null);

            const authenticated = await authService.isAuthenticated();

            expect(authenticated).toBe(false);
            expect(mockPostValidated).not.toHaveBeenCalled(); // No refresh attempt
            expect(mockKeyManagerClearTokens).not.toHaveBeenCalled();
        });
    });
});
