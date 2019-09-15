import { Response } from 'express';

/* tslint:disable-next-line */
const config = require('../../config/config.json');


export default class CookieService {

    private static maxAge = 5.184e+9; // 60 days
    private static httpOnly = true;
    private static secure = true;

    /**
     * @description Attaches cookie to response
     * @author DerZade
     * @param {Response} res Response to attach cookie to
     * @param {string} token Generated token
     */
    public static attachCookie(res: Response, token: string) {
        res.cookie(config.cookie.name, token, {
            domain: config.cookie.domain,
            httpOnly: this.httpOnly,
            secure: this.secure,
            maxAge: this.maxAge
        });
    }

    /**
     * @description Clears cookie from response
     * @author DerZade
     * @param {Response} res Response to clear cookie from
     */
    public static clearCookie(res: Response) {
        res.clearCookie(config.cookie.name, { domain: config.cookie.domain });
    }
}
