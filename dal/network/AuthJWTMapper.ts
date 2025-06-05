import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
    nameid: string;
    email: string;
    username?: string;
    exp: number;
    iat: number;
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
        return payload.nameid;
    }
}