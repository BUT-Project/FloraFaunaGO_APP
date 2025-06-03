export interface JwtPayload {
    nameid: string;
    email: string;
    username?: string;
    exp: number;
    iat: number;
}

export class AuthJWTMapper {
    /**
     * Decode JWT token payload (simplified version)
     * In production, use a proper JWT library like jsonwebtoken
     */
    static decodeJwtPayload(token: string): JwtPayload {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid JWT token format');
        }
    }

    /**
     * Extract user ID from JWT token
     */
    static getUserIdFromToken(token: string): number {
        const payload = this.decodeJwtPayload(token);
        return parseInt(payload.nameid);
    }
}