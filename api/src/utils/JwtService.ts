import * as jwt from 'jsonwebtoken';

// @ts-ignore
import { config } from 'config';

import { User } from '../models/user.model';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { GradRequest, TokenPayload } from '../@types/GradRequest';
import { oneOf, check, header, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

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
            avatar: user.avatar,
            admin: user.admin,
            group: user.group
        };

        return jwt.sign(payload, PRIVATE_KEY, { ...SIGN_OPTIONS, subject: payload.username });
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
     * @description ExpressJS middleware which checks wether the requester is authenticated
     * @author DerZade
     * @returns The ExpressJS Middleware
     */
    public static checkAuthenticated(req: Request, res: Response, next?: NextFunction) {

        // call validation middleware directly to extract token
        oneOf([
            check(config.cookie.name)
                .exists(),
            header('Authorization')
                .exists()
                .custom((h => h.match(/^bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i) !== null))
        ])(req, res, () => {

            // make sure token was given
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(401).end();

            // extract token
            const payload = matchedData(req);
            const token = payload[config.cookie.name] || payload.Authorization.replace(/^Bearer\s+/i, '');

            try {
                (req as GradRequest).gradUser = JwtService.verify(token);
            } catch (err) {
                console.error(err);
                return res.status(401).end();
            }

            if (next) next();
        });

    }

    /**
     * @description Express middleware which checks if requester is authenticated and a verified user
     * @author DerZade
     * @returns The ExpressJS Middleware
     */
    public static checkAdmin(req: GradRequest, res: Response, next: NextFunction) {
        // call checkAuthenticated middleware directly to extract user from auth token
        JwtService.checkAuthenticated(req, res, () => {
            if (res.finished) return;

            if (! req.gradUser.admin) return res.status(403).end();

            next();
        });
    }
}
