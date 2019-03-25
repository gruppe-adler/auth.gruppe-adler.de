import { Router, Request, Response } from 'express'
import { matchedData } from 'express-validator/filter';
import { validationResult } from 'express-validator/check';
import * as bodyParser from 'body-parser';

import { User } from '../models/user.model'
import { AuthRules } from '../rules/auth.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { TokenService } from '../utils/tokenService';

export const AuthRouter = Router()

const bp = bodyParser.json();
AuthRouter.use(bp);

AuthRouter.post('/login', AuthRules['login'], wrapAsync(async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors.array());
    const payload = matchedData(req);

    let user: User = await User.findOne({ where: payload });

    if (user === null) return res.status(401).end();

    const token = TokenService.sign(user); 

    res.cookie('token', token, { 
        domain: 'gruppe-adler.de',
        httpOnly: true,
        secure: true,
        maxAge: 3600000
    }).status(200).json({ token });
}));

AuthRouter.post('/authenticate', AuthRules['authenticate'], wrapAsync(async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors.array());
    const payload = matchedData(req);

    const token = payload.token || payload.Authorization.replace(/^Bearer\s+/i, '');

    let user;
    try {
        user = TokenService.verify(token)
    } catch (err) {
        return res.status(401).end();
    }

    res.status(200).json(user);
}));

AuthRouter.use(globalErrorHandler);
