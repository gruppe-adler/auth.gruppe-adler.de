import { Router, Request, Response } from 'express';
import * as rp from 'request-promise';

import { AuthRules } from '../rules/auth.rules';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';

const config = require('../../config/config.json');
import { GradRequest } from '../@types/GradRequest';
import { User } from '../models/user.model';

import Steam, { getUserInfo } from '../openid/Steam';
import { JwtService } from '../utils/JwtService';
import { matchedData } from 'express-validator/filter';

export const AuthRouter = Router();

// GET get steam login url 
AuthRouter.get('/login/steam', wrapAsync(async (req: Request, res: Response) => {
    Steam.authenticate('https://steamcommunity.com/openid', false, (err, url) => {
        if (err) return res.status(503);
        
        res.json({ url });
    });
}));

// POST validate assertion
AuthRouter.post('/login/steam', AuthRules.login,  wrapAsync(async (req: Request, res: Response) => {
    const payload = matchedData(req);

    type t = { authenticated: boolean, claimedIdentifier?: string };

    let result: t;
    try {
        result = await new Promise<t>((resolve, reject) => {
            Steam.verifyAssertion(payload.url, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                };
            });
        })
    } catch (err) {
        throw { status: 401, message: 'Negative Assertion' };
    }

    if (!result.authenticated || !result.claimedIdentifier) throw { status: 401, message: 'Negative Assertion' };

    const steamId = result.claimedIdentifier.substr('https://steamcommunity.com/openid/id/'.length);

    // find the corresponding user
    let user: User|null = await User.findOne({ where: { steamId }});
    
    if (!user) {
        // no user with given steam id exists -> create a new one
        const steamUser = await getUserInfo(steamId);

        // fetch avatar
        const avatarPromise = rp.get({ url: steamUser.avatarfull, encoding: null });
        
        // make sure no user with same username exists
        let username = steamUser.personaname;
        let counter = 1;
        let userWithUserName: User|null = null;
        while (userWithUserName) {
            userWithUserName = await User.findOne({ where: { username }});
            username = `${steamUser.personaname}${counter++}`;
        }

        // set first user automatically  as admin
        const allUsers = await User.findAll();

        user = await User.create({ steamId, username, avatar: await avatarPromise, admin: allUsers.length === 0 });
    }

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
    const user = await User.findByPk(req.gradUser.id);

    if (user === null) {
        console.log('no user found');
        res.clearCookie(config.cookie.name);
        throw { status: 401 };
    } else {
        const token = JwtService.sign(user);

        res.cookie(config.cookie.name, token, {
            domain: config.cookie.domain,
            httpOnly: true,
            secure: false,
            maxAge: 36000000
        });
    }

    res.status(200).json(user);
}));

// POST logout
AuthRouter.post('/logout', wrapAsync(async (req: Request, res: Response) => {
    res.clearCookie(config.cookie.name, { domain: config.cookie.domain });

    res.status(204).end();
}));

AuthRouter.use(globalErrorHandler);
