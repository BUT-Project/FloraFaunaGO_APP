import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
    sub: string;
    email: string;
    uid: string;
    exp: number;
    iss: string;
    aud: string;
}

export class AuthJWTMapper {
    /**
     * Decode JWT token payload
     * In production, use a proper JWT library like jsonwebtoken
     */
    static decodeJwtPayload(token: string): JwtPayload {
        try {
            return jwtDecode(token);
        } catch (error) {
            throw new Error('Invalid JWT token format');
        }
    }

    /**
     * Extract user ID from JWT token
     */
    static getUserIdFromToken(token: string): string {
        const payload = this.decodeJwtPayload(token);
        return payload.uid;
    }
}