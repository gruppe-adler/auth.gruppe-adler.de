import * as jwt from 'jsonwebtoken';

const config = require('../../config/config.json');

import { User } from '../models/user.model';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { GradRequest, TokenPayload } from '../@types/GradRequest';
import { oneOf, check, header, validationResult } from 'express-validator';
import { matchedData } from 'express-validator';

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
            id: user.id,
            username: user.username,
            admin: user.admin,
            avatar: user.avatar,
            groups: user.groups
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
        ])(req, res, async () => {

            // make sure token was given
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(401).end();

            // extract token
            const payload = matchedData(req);
            const token = payload[config.cookie.name] || payload.Authorization.replace(/^Bearer\s+/i, '');

            let tokenUser;
            try {
                tokenUser = JwtService.verify(token);
            } catch (err) {
                console.error(err);
                return res.status(401).end();
            }

            // get user from db to make sure he doesn't have an token where he is admin
            // although he was demoted / deleted in the mean time
            const user = await User.findByPk(tokenUser.id);

            if (user === null) return res.status(401).end();;

            (req as GradRequest).gradUser = user;

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

    /**
     * @description Express middleware which checks if requester is authenticated and a verified user
     * @author DerZade
     * @returns The ExpressJS Middleware
     */
    public static checkSelfOrAdmin(req: GradRequest, res: Response, next: NextFunction) {
        // call checkAuthenticated middleware directly to extract user from auth token
        JwtService.checkAuthenticated(req, res, () => {
            if (res.finished) return;
        
            const payload = matchedData(req);
            const isAdmin = req.gradUser.admin;
            const isSelf = req.gradUser.id === payload.id;
            
            if (!isAdmin && !isSelf) return res.status(403).end();            

            next();
        });
    }
}
