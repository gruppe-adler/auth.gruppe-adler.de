import * as jwt from 'jsonwebtoken';

// @ts-ignore
import { config } from 'config';

import { User } from "../models/user.model";
import * as fs from 'fs';

export interface TokenPayload {
    username: string;
    email: string;
    avatar: string;
    admin: boolean;
    group: object;
}

export class TokenService {
    private static readonly _privateKey = fs.readFileSync('config/keys/private.key', 'utf8');
    private static readonly _publicKey = fs.readFileSync('config/keys/public.key', 'utf8');
    private static readonly _signOptions = {
        expiresIn: '12h',
        ...config.jwt,
        algorithm: 'RS256'
    }

    private static readonly _verifyOptions = {
        expiresIn: '12h',
        ...config.jwt,
        algorithm: ['RS256']
    }

    
    /**
     * @description Sign given payload
     * @author DerZade
     * @param {User} user User as payload
     * @returns {string} token JSON Web Token
     */
    public static sign(user: User): string {
        
        const payload: TokenPayload = { 
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            admin: user.admin,
            group: user.group
        };

        return jwt.sign(payload, this._privateKey, { ...this._signOptions, subject: payload.email });
    }

    /**
     * @description Verify given token
     * @author DerZade
     * @param token JSON Web Token
     * @returns ?
     */
    public static verify(token: string): TokenPayload {
        return jwt.verify(token, this._publicKey, this._verifyOptions) as TokenPayload;
    }

    /**
     * @description Decode given token
     * @author DerZade
     * @param token JSON Web Token
     * @returns {TokenPayload|null} Token payload
     */
    public static decode(token: string): TokenPayload|null {
        const decoded = jwt.decode(token, { complete: true});

        if (!decoded) return null;

        return decoded as TokenPayload;
    }

}