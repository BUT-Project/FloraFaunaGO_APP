import JWT from 'expo-jwt';
import { AuthJWTMapper, JwtPayload } from "@/dal/network/AuthJWTMapper";

const createTestToken = (payload: object): string => {
    return JWT.encode(payload, 'dummysecret');
};

describe('AuthJWTMapper', () => {
    describe('decodeJwtPayload', () => {
        it('test_decodeJwtPayload_withValidToken_returnsPayload', () => {
            const payload: Omit<JwtPayload, 'username'> = { // Omit username as it's optional for this test
                nameid: '123',
                email: 'test@example.com',
                exp: Math.floor(Date.now() / 1000) + 3600,
                iat: Math.floor(Date.now() / 1000),
            };
            const token = createTestToken(payload);
            const decoded = AuthJWTMapper.decodeJwtPayload(token);
            expect(decoded).toEqual(payload);
        });

        it('test_decodeJwtPayload_withOptionalUsername_includesUsernameInPayload', () => {
            const payload: JwtPayload = {
                nameid: '456',
                email: 'user@example.com',
                username: 'testuser',
                exp: Math.floor(Date.now() / 1000) + 3600,
                iat: Math.floor(Date.now() / 1000),
            };
            const token = createTestToken(payload);
            const decoded = AuthJWTMapper.decodeJwtPayload(token);
            expect(decoded).toEqual(payload);
            expect(decoded.username).toBe('testuser');
        });

        it('test_decodeJwtPayload_withInvalidTokenStructure_throwsError', () => {
            // Case: Token does not have three parts, or payload part is missing/undefined
            const invalidTokens = [
                'invalidtoken', // Not enough parts, token.split('.')[1] is undefined
                'headeronly',   // Same as above
                'header..signature', // Payload part is an empty string, JSON.parse("") throws
            ];

            invalidTokens.forEach(token => {
                expect(() => AuthJWTMapper.decodeJwtPayload(token))
                    .toThrow('Invalid JWT token format');
            });
        });

        it('test_decodeJwtPayload_withInvalidPayloadEncodingOrNonJson_throwsError', () => {
            // Case 1: Payload part contains characters not valid for Base64 decoding by atob
            // '!' is not a valid Base64 character. atob will throw.
            const tokenWithInvalidBase64Chars = 'header.payload!with!invalid!chars.signature';
            expect(() => AuthJWTMapper.decodeJwtPayload(tokenWithInvalidBase64Chars))
                .toThrow('Invalid JWT token format');

            // Case 2: Payload part is valid Base64Url, but decodes to a non-JSON string
            const nonJsonString = "this is not a valid JSON string";
            // Manually create the payload part to ensure it's valid base64url of non-JSON
            const base64EncodedNonJson = Buffer.from(nonJsonString, 'utf-8').toString('base64');
            const base64UrlNonJson = base64EncodedNonJson
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
            const tokenWithNonJsonPayload = `header.${base64UrlNonJson}.signature`;
            expect(() => AuthJWTMapper.decodeJwtPayload(tokenWithNonJsonPayload))
                .toThrow('Invalid JWT token format'); // Error from JSON.parse
        });
    });

    describe('getUserIdFromToken', () => {
        it('test_getUserIdFromToken_withValidToken_returnsUserId', () => {
            const payload = {
                nameid: '789',
                email: 'another@example.com',
                exp: Math.floor(Date.now() / 1000) + 3600,
                iat: Math.floor(Date.now() / 1000),
            };
            const token = createTestToken(payload);
            const userId = AuthJWTMapper.getUserIdFromToken(token);
            expect(userId).toBe("789");
        });
    });
});
