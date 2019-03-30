import { Router, Request, Response } from 'express';
import { matchedData } from 'express-validator/filter';

import { User } from '../models/user.model';
import { Verification } from '../models/verification.model';
import { AuthRules } from '../rules/auth.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';
import { JwtService } from '../utils/JwtService';
import { EmailService } from '../utils/EmailService';

// @ts-ignore
import { config } from 'config';
import { GradRequest } from '../@types/GradRequest';

export const AuthRouter = Router();

// POST register
AuthRouter.post('/register', AuthRules.register, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    const user: User = new User(payload);
    await user.save();

    // send verification mail
    const verification: Verification = new Verification({ userId: user.id });
    await verification.save();
    EmailService.sendVerificationMail(user.email, verification.code);

    res.status(201).json(user);
}));

// POST login
AuthRouter.post('/login', AuthRules.login, wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    const user: User = await User.findOne({ where: payload });

    if (user === null) return res.status(401).end();

    const token = JwtService.sign(user);

    res.cookie(config.cookie.name, token, {
        domain: config.cookie.domain,
        httpOnly: true,
        secure: false,
        maxAge: 36000000
    });

    const resPayload = {};

    resPayload[config.cookie.name] = token;

    res.status(200).json(resPayload);
}));

// POST authenticate (= check received token and return the payload if valid)
AuthRouter.post('/authenticate', AuthRules.authenticate, wrapAsync(async (req: GradRequest, res: Response) => {
    res.status(200).json(req.gradUser);
}));

// POST logout
AuthRouter.post('/logout', wrapAsync(async (req: Request, res: Response) => {
    res.clearCookie(config.cookie.name);

    res.status(200).end();
}));

AuthRouter.use(globalErrorHandler);
