import { body, oneOf, check, header } from 'express-validator/check';


// @ts-ignore
import { JwtService } from '../utils/JwtService';

export const AuthRules = {
    authenticate: [
        JwtService.checkAuthenticated
    ],
    login: [
        body('url').exists()
    ]
};
