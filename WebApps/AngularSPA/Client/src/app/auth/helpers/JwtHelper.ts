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
        const utcMsExp = jwt_decode<{exp: number}>(jwt).exp;
        const expires = new Date(0);
        expires.setUTCMilliseconds(utcMsExp);
        return expires;
    }
}