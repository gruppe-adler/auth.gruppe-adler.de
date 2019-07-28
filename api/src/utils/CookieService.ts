import { Response } from "express";
const config = require('../../config/config.json');


export default class CookieService {
    public static attachCookie(res: Response, token: string) {
        
    }

    public static clearCookie(res: Response) {
        res.clearCookie(config.cookie.name, { domain: config.cookie.domain });
    }
}