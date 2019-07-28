import { Router, Request, Response } from 'express';
import * as rp from 'request-promise-native';
import { Response as RpResponse } from 'request';

import { wrapAsync } from '../utils/wrapAsync';
import { globalErrorHandler } from '../utils/globalErrorHandler';

const config = require('../../config/config.json');
import { GradRequest } from '../@types/GradRequest';
import { User } from '../models';

import Steam, { getUserInfo } from '../utils/Steam';
import { JwtService } from '../utils/JwtService';
import { AvatarService } from '../utils/AvatarService';
import CookieService from '../utils/CookieService';

export const AuthRouter = Router();

// GET get steam login url 
AuthRouter.get('/login/steam', wrapAsync(async (req: Request, res: Response) => {
    Steam.authenticate('https://steamcommunity.com/openid', false, (err, url) => {
        if (err) return res.status(503);
        
        res.json({ url });
    });
}));

// POST validate assertion
AuthRouter.post('/login/steam',  wrapAsync(async (req: Request, res: Response) => {

    const url = req.body.url;
    if (!url) return res.status(422).end();

    type t = { authenticated: boolean, claimedIdentifier?: string };

    let result: t;
    try {
        result = await new Promise<t>((resolve, reject) => {
            Steam.verifyAssertion(url, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                };
            });
        });
    } catch (err) {
        throw { status: 401, message: 'Negative Assertion' };
    }

    if (!result.authenticated || !result.claimedIdentifier) throw { status: 401, message: 'Negative Assertion' };

    const steamId = result.claimedIdentifier.substr('https://steamcommunity.com/openid/id/'.length);

    // find the corresponding user
    let user: User|null = await User.findOne({ where: { steamId }});
    
    // no user with given steam id exists -> create a new one
    if (!user) {
        const steamUser = await getUserInfo(steamId);

        // fetch avatar
        const steamAvatarPromise = rp.get({ url: steamUser.avatarfull, encoding: null, resolveWithFullResponse: true });
        
        // make sure no user with same username exists
        let username = steamUser.personaname;
        let counter = 1;
        let userWithUserName: User|null = null;
        while (userWithUserName) {
            userWithUserName = await User.findOne({ where: { username }});
            username = `${steamUser.personaname}${counter++}`;
        }

        // set first user automatically as admin
        const usersCount = await User.count();

        // wait on avatar request
        let steamAvatar: RpResponse; 
        try {
            steamAvatar = await steamAvatarPromise;
        } catch(err) { /* TODO: Catch error */ }

        const avatar = AvatarService.saveImage(steamAvatar.body, steamAvatar.headers['content-type']);

        user = await User.create({ steamId, username, avatar, admin: usersCount === 0 });
    }

    const token = JwtService.sign(user);

    // renew cookie
    CookieService.attachCookie(res, token);

    res.status(200).json({ [config.cookie.name]: token });
}));


// POST authenticate (= check received token and return the payload if valid)
AuthRouter.post('/authenticate', JwtService.checkAuthenticated, wrapAsync(async (req: GradRequest, res: Response) => {
    const token = JwtService.sign(req.gradUser);

    // renew cookie
    CookieService.attachCookie(res, token);

    res.status(200).json(req.gradUser);
}));

// POST logout
AuthRouter.post('/logout', wrapAsync(async (req: Request, res: Response) => {

    CookieService.clearCookie(res);

    res.status(204).end();
}));

AuthRouter.use(globalErrorHandler);
