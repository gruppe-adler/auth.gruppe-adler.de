import { Router, Request, Response } from 'express'
import { matchedData } from 'express-validator/filter';
import { validationResult } from 'express-validator/check';

import { User } from '../models/user.model'
import { AuthRules } from '../rules/auth.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { JwtService } from '../utils/JwtService';
import { UserRules } from '../rules/user.rules';

// @ts-ignore
import { config } from 'config';

export const AuthRouter = Router()

// POST login
AuthRouter.post('/login', AuthRules['login'], wrapAsync(async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors.array());
    const payload = matchedData(req);

    let user: User = await User.findOne({ where: payload });

    if (user === null) return res.status(401).end();

    const token = JwtService.sign(user); 

    res.cookie(config.cookie.name, token, { 
        domain: config.cookie.domain,
        httpOnly: true,
        secure: false,
        maxAge: 36000000
    })
    
    const resPayload = {};

    resPayload[config.cookie.name] = token;

    res.status(200).json(resPayload);
}));

// POST authenticate (= check received token and return the payload if valid)
AuthRouter.post('/authenticate', AuthRules['authenticate'], wrapAsync(async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(401).end();
    const payload = matchedData(req);

    const token = payload[config.cookie.name] || payload.Authorization.replace(/^Bearer\s+/i, '');

    let user;
    try {
        user = JwtService.verify(token)
    } catch (err) {
        return res.status(401).end();
    }

    res.status(200).json(user);
}));

// POST create a new user
AuthRouter.post('/register', AuthRules['register'], wrapAsync(async(req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors.array());
    const payload = matchedData(req);
    
    let user: User = new User(payload);
    await user.save();

    res.status(201).json(user);
}));

// POST logout
AuthRouter.post('/logout', wrapAsync(async(req: Request, res: Response) => {
    res.clearCookie(config.cookie.name);

    res.status(200).end();
}));

AuthRouter.use(globalErrorHandler);
