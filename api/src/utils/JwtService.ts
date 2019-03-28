import * as jwt from 'jsonwebtoken';
import * as jwtExpress from 'express-jwt';

// @ts-ignore
import { config } from 'config';

import { User } from '../models/user.model';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';

export interface TokenPayload {
    username: string;
    email: string;
    avatar: string;
    admin: boolean;
    group: object;
}
const PRIVATE_KEY = fs.readFileSync('config/keys/private.key', 'utf8');
const PUBLIC_KEY = fs.readFileSync('config/keys/public.key', 'utf8');
const SIGN_OPTIONS = {
    expiresIn: '12h',
    ...config.jwt,
    algorithm: 'RS256'
};

const VERIFY_OPTIONS = {
    expiresIn: '12h',
    ...config.jwt,
    algorithm: ['RS256']
};

export class JwtService {

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

        return jwt.sign(payload, PRIVATE_KEY, { ...SIGN_OPTIONS, subject: payload.email });
    }

    /**
     * @description Verify given token
     * @author DerZade
     * @param token JSON Web Token
     * @returns ?
     */
    public static verify(token: string): TokenPayload {
        return jwt.verify(token, PUBLIC_KEY, VERIFY_OPTIONS) as TokenPayload;
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

    /**
     * @description Returns correctly configured Express-Jwt middleware
     * @author DerZade
     * @returns The ExpressJS Middleware
     */
    public static middleware(req: Request, res: Response, next: NextFunction) {
        jwtExpress({ ...VERIFY_OPTIONS, cookie: 'sso-token', secret: PUBLIC_KEY})(req, res, next);
    }
}
