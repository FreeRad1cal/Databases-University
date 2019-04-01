import * as jwt_decode from "jwt-decode";


export class JwtHelper {
    static validateJwt(jwt: string): boolean {
        try {
            return jwt != null && jwt_decode<{exp: number}>(jwt).exp < new Date().getTime();
        }
        catch {
            return false;
        }
    }

    static getExpiration(jwt: string): Date {
        const exp = jwt_decode<{exp: number}>(jwt).exp;
        const expires = new Date(0);
        expires.setUTCSeconds(exp);
        return expires;
    }

    static getRoles(jwt: string) : string[] {
        // Returns an array when no rol claims are present or when only one rol claim is present
        return [].concat(jwt_decode<any>(jwt).rol)
    }

    static getPermissions(jwt: string): string[] {
        return [].concat(jwt_decode<any>(jwt).perm);
    }
}